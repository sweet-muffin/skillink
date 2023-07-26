import json
import os
import pickle
import time
from contextlib import contextmanager
from typing import List, Optional, Tuple, Union

import faiss
import numpy as np
import pandas as pd
from datasets import Dataset, concatenate_datasets, load_from_disk
from transformers import AutoTokenizer

# from sklearn.feature_extraction.text import TfidfVectorizer
from tqdm.auto import tqdm
import wandb
import datetime
from pytz import timezone
from rank_bm25 import BM25Plus
import os


@contextmanager
def timer(name):
    t0 = time.time()
    yield
    print(f"[{name}] done in {time.time() - t0:.3f} s")


class BM25PlusRetriever:
    def __init__(
        self,
        model_name_or_path: Optional[str] = "klue/bert-base",
        data_path: Optional[str] = "data",
        context_name: Optional[str] = "lesson_info.csv",
        retrieval_split=False,
    ) -> None:
        """
        Arguments:

            data_path:
                데이터가 보관되어 있는 경로입니다.

            context_name:
                Passage들이 묶여있는 파일명입니다.

            data_path/context_name가 존재해야합니다.

        Summary:
            Passage 파일을 불러오고 BM25Plus를 선언하는 기능을 합니다.
        """
        BASE_PATH = os.path.dirname(os.path.abspath(__file__))
        self.data_path = data_path
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_name_or_path
        )  # default fast tokenizer if available
        self.contexts = None
        self.ids = None
        self.tokenized_contexts = None
        self.bm25plus = None
        self.retrieval_split = retrieval_split
        context_path = os.path.join(BASE_PATH, data_path, context_name)

        context_name = context_name.split(".")[0]
        tokenized_summary_path = os.path.join(
            BASE_PATH, data_path, context_name + "_tokenized.bin"
        )
        # print(
        #     f"context path:{context_path}, tokenized context path: {tokenized_summary_path}"
        # )

        # contexts load
        summary_data = pd.read_csv(context_path)
        self.contexts = [
            f"<{title}> {summary}"
            for title, summary in zip(
                list(summary_data["title"]), list(summary_data["summary"])
            )
        ]
        # self.contexts = list(summary_data["summary"])

        # print(f"Lengths of unique contexts : {len(self.contexts)}")
        self.ids = list(range(len(self.contexts)))

        # context 미리 토큰화
        # tokenized_summary_path = {context_name}_tokenized.bin
        if os.path.isfile(tokenized_summary_path):
            # 토큰화 된 context 파일 이미 존재
            with open(tokenized_summary_path, "rb") as file:
                self.tokenized_contexts = pickle.load(file)
            # print("Contexts pickle loaded.")
        else:
            # 토큰화 된 context 파일 없으면 생성
            self.tokenized_contexts = []
            for doc in tqdm(self.contexts, desc="Tokenizing context"):
                self.tokenized_contexts.append(self.tokenizer(doc)["input_ids"][1:-1])
                # 앞 [CLS], 뒤  [SEP] 토큰 제외
            with open(tokenized_summary_path, "wb") as f:
                pickle.dump(self.tokenized_contexts, f)
            # print("Tokenized contexts pickle saved.")

        # Fit tokenized_contexts to BM25Plus
        self.bm25plus = BM25Plus(self.tokenized_contexts)
        # print("Tokenized contexts fitted to BM25Plus.")

    def retrieve(
        self,
        query_or_dataset: Union[str, Dataset],
        topk: Optional[int] = 1,
        retrieval_result_save=False,
        output_dir="./outputs",
    ) -> Union[Tuple[List, List], pd.DataFrame]:
        """
        Arguments:
            query_or_dataset (Union[str, Dataset]):
                str이나 Dataset으로 이루어진 Query를 받습니다.
                각 query에 대해 `get_relevant_doc`을 통해 유사도를 구합니다.
            topk (Optional[int], optional): Defaults to 1.
                상위 몇 개의 passage를 사용할 것인지 지정합니다.

        Returns:
            1개의 Query를 받는 경우  -> Tuple(List, List)
            다수의 Query를 받는 경우 -> pd.DataFrame: [description]

        Note:
            다수의 Query를 받는 경우,
                Ground Truth가 있는 Query (train/valid) -> 기존 Ground Truth Passage를 같이 반환합니다.\n
                Ground Truth가 없는 Query (test) -> Retrieval한 Passage만 반환합니다.
        """

        if isinstance(query_or_dataset, str):
            doc_scores, doc_indices = self.get_relevant_doc(query_or_dataset, k=topk)
            # print("[Search query]\n", query_or_dataset, "\n")
            # with timer("BM25+ retrieval"):
            # for i in range(topk):
            #     print(f"Top-{i+1} passage with score {doc_scores[i]:4f}")
            #     print(self.contexts[doc_indices[i]])

            return (
                doc_scores,
                [self.contexts[doc_indices[i]] for i in range(topk)],
            )

        elif isinstance(query_or_dataset, Dataset):
            # Retrieve한 Passage를 pd.DataFrame으로 반환합니다.
            total = []
            with timer("BM25+ retrieval"):
                doc_scores = []
                doc_indices = []
                for query in tqdm(
                    query_or_dataset["question"],
                    desc="Retrieving documents for all questions",
                ):
                    scores, indices = self.get_relevant_doc(query, k=topk)
                    doc_scores.append(scores)
                    doc_indices.append(indices)

            for idx, example in enumerate(
                tqdm(query_or_dataset, desc="Building result DataFrame")
            ):
                tmp = {
                    # Query와 해당 id를 반환합니다.
                    "question": example["question"],
                    "id": example["id"],
                    # Retrieve한 Passage의 id, context를 반환합니다.
                    "context": [self.contexts[pid] for pid in doc_indices[idx]]
                    if self.retrieval_split
                    else " ".join([self.contexts[pid] for pid in doc_indices[idx]]),
                }
                if "context" in example.keys() and "answers" in example.keys():
                    # validation 데이터를 사용하면 ground_truth context와 answer도 반환합니다.
                    tmp["original_context"] = example["context"]
                    tmp["answers"] = example["answers"]

                # 평가를 위한 df column 만들어주기
                for i in range(topk):
                    tmp["context" + str(i + 1)] = self.contexts[doc_indices[idx][i]]
                tmp["score"] = doc_scores[idx][:]

                total.append(tmp)

            cqas = pd.DataFrame(total)
            if retrieval_result_save:
                save_df = cqas[["id", "question", "context"]]
                os.makedirs(output_dir, exist_ok=True)
                save_path = os.path.join(output_dir, "retrieval_result.csv")
                save_df.to_csv(save_path, index=False)
                print(f"Retrieval result saved at {save_path}")
            return cqas

    def get_relevant_doc(self, query: str, k: Optional[int] = 1) -> Tuple[List, List]:
        """
        Arguments:
            query (str):
                하나의 Query를 받습니다.
            k (Optional[int]): 1
                상위 몇 개의 Passage를 반환할지 정합니다.
        """

        tokenized_query = self.tokenizer(query)["input_ids"][1:-1]

        scores = [
            (val, idx)
            for idx, val in enumerate(self.bm25plus.get_scores(tokenized_query))
        ]
        scores.sort(reverse=True)
        scores = scores[:k]

        doc_scores = [val for val, _ in scores]
        doc_indices = [idx for _, idx in scores]

        return doc_scores, doc_indices


if __name__ == "__main__":
    retriever = BM25PlusRetriever()
    text = """
    {
    "to_do": [
    "HTML",
    "CSS",
    "JavaScript",
    "웹 디자인 기초",
    "반응형 웹 디자인",
    "웹 접근성",
    "웹 호스팅",
    "버전 관리 시스템(Git)",
    "프론트엔드 프레임워크(예: React, Vue.js)",
    "백엔드 기초(예: Node.js, Django, Ruby on Rails)"
    ]
    }
    """
    res = retriever.retrieve(text, topk=5)
    documents = res[1]
    titles = [document.split(">")[0][1:] for document in documents]
    print(titles)

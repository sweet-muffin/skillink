import os
import pickle
import time
from contextlib import contextmanager
from typing import List, Optional, Tuple
import pymysql
from transformers import AutoTokenizer
import time
from tqdm.auto import tqdm
from rank_bm25 import BM25Plus
import os
from dotenv import load_dotenv

load_dotenv()


@contextmanager
def timer(name):
    t0 = time.time()
    yield
    print(f"[{name}] done in {time.time() - t0:.3f} s")


def create_conn():
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        db=os.getenv("MYSQL_DB"),
        charset=os.getenv("MYSQL_CHARSET"),
    )


def get_all_lessons():
    conn = create_conn()
    curs = conn.cursor()
    curs.execute("SELECT title, summary FROM lessons")
    results = curs.fetchall()
    conn.close()

    lessons = []
    for row in results:
        lessons.append(f"{row[0]}<@>{row[1]}")

    return lessons


def get_all_lesson_info():
    conn = create_conn()
    curs = conn.cursor()
    curs.execute("SELECT descriptions, url, image_url FROM lessons")
    results = curs.fetchall()
    conn.close()

    info = []
    for row in results:
        info.append({"descriptions": row[0], "url": row[1], "image_url": row[2]})

    return info


class BM25PlusRetriever:
    def __init__(
        self,
        model_name_or_path: Optional[str] = "klue/bert-base",
    ) -> None:
        BASE_PATH = os.path.dirname(os.path.abspath(__file__))

        self.tokenizer = AutoTokenizer.from_pretrained(model_name_or_path)
        self.contexts = None
        self.ids = None
        self.tokenized_contexts = None
        self.bm25plus = None

        context_path = os.path.join(BASE_PATH + "/context.bin")
        info_path = os.path.join(BASE_PATH + "/info.bin")

        # context 미리 토큰화
        if os.path.isfile(context_path) and os.path.isfile(info_path):
            with open(context_path, "rb") as file:
                self.contexts = pickle.load(file)
            with open(info_path, "rb") as file:
                self.infos = pickle.load(file)
        else:
            self.contexts = get_all_lessons()
            self.infos = get_all_lesson_info()
            with open(context_path, "wb") as f:
                pickle.dump(self.contexts, f)
            with open(info_path, "wb") as f:
                pickle.dump(self.infos, f)

        self.tokenized_contexts = []
        for doc in tqdm(self.contexts, desc="Tokenizing context"):
            self.tokenized_contexts.append(self.tokenizer(doc)["input_ids"][1:-1])

        self.bm25plus = BM25Plus(self.tokenized_contexts)

    def retrieve(
        self,
        query_or_dataset: str,
        topk: Optional[int] = 1,
    ) -> Tuple[List, List]:
        doc_scores, doc_indices = self.get_relevant_doc(query_or_dataset, k=topk)

        return (
            doc_scores,
            [self.contexts[doc_indices[i]] for i in range(topk)],
            [self.infos[doc_indices[i]] for i in range(topk)],
        )

    def get_relevant_doc(self, query: str, k: Optional[int] = 1) -> Tuple[List, List]:
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
    text = "예시 텍스트"
    res = retriever.retrieve(text, topk=5)
    documents = res[1]
    titles = [document.split("<@>")[0] for document in documents]
    print(titles)

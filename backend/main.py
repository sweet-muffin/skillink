from fastapi import FastAPI, HTTPException
from typing import Dict
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import pymysql
import os
import uvicorn
from utils.bm25plus_retrieval import BM25PlusRetriever
import openai
from collections import defaultdict
from model import *
import requests
import ast


load_dotenv()
openai.organization = os.getenv("OPENAI_API_ORG")
openai.api_key = os.getenv("OPENAI_API_KEY")
os.environ["TOKENIZERS_PARALLELISM"] = "false"

app = FastAPI()
retriever = BM25PlusRetriever()
origins = ["*"]

# CORS 이슈 해결
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# MySQL 연결 설정
def create_conn():
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        db=os.getenv("MYSQL_DB"),
        charset=os.getenv("MYSQL_CHARSET"),
    )


# 우선 순위 구하기
def get_priority(string: str) -> int:
    keywords = [
        ["쉬운", "기초", "입문", "처음", "모든 수준"],
        ["실습", "실용", "심화", "알고리즘"],
        [],
        ["프로젝트", "자격증", "시험", "인공지능"],
        ["실무", "실제", "전문가", "AI", " 전문"],
    ]
    total = 0
    for score, keyword in enumerate(keywords):
        total += sum([string.count(k) for k in keyword]) * (score - 2)
    return total


# 강의 제목으로 강의 정보 불러오기
def lesson_retrieve(to_do: str) -> str:
    res = retriever.retrieve(to_do, topk=5)
    documents = res[1]
    titles = [document.split("<@>")[0] for document in documents]
    string_list = "[" + ",".join(titles) + "]"
    return string_list


# 강의 제목으로 강의 정보 불러오기
def lesson_retrieve_with_sort(to_do: str) -> str:
    res = retriever.retrieve(to_do, topk=5)
    title_summary_list: List[str] = res[1]
    info_list: List[dict] = res[2]
    retrieved_list: List[List[str, dict]] = [
        [title, info] for title, info in zip(title_summary_list, info_list)
    ]
    retrieved_list.sort(key=lambda x: get_priority(x[0]))
    titles: List[str] = [
        title_summary[0].split("<@>")[0] for title_summary in retrieved_list
    ]
    result_dict = {}
    for idx, title in enumerate(titles):
        result_dict[f"lesson{idx+1}"] = {"title": title}
        result_dict[f"lesson{idx+1}"].update(retrieved_list[idx][1])

    return result_dict


def get_lesson_info(title_list: str):
    mod_titles = []
    for idx, title in enumerate(title_list):
        mod_titles.append(f"'{title}'")
    title_text = ", ".join(mod_titles)

    conn = create_conn()
    curs = conn.cursor()
    curs.execute(
        f"SELECT title, descriptions, url, image_url FROM lessons WHERE title IN ({title_text})"
    )
    results = curs.fetchall()
    conn.close()

    results = list(results)
    results.sort(key=lambda x: title_list.index(x[0]))

    return_data = {}
    for idx, row in enumerate(results):
        return_data[f"lesson{idx+1}"] = {
            "title": row[0],
            "descriptions": row[1],
            "url": row[2],
            "image_url": row[3],
        }
    return return_data


# 딕셔너리 위치 찾아서 딕셔너리로 바꾸기
def get_dict_from_string(string: str) -> Dict:
    dict_start = string.index("{")
    dict_end = len(string) - string[::-1].index("}")
    response_dict = eval(string[dict_start:dict_end])
    return response_dict


@app.get("/api/lesson/all")
async def get_all_lessons() -> ReturnItem:
    conn = create_conn()
    curs = conn.cursor()
    curs.execute("SELECT * FROM lessons")
    results = curs.fetchall()
    conn.close()
    if len(results) == 0:
        raise HTTPException(status_code=500, detail="There's no item")

    lessons = []
    for row in results:
        lessons.append(
            {
                "lesson_id": row[0],
                "title": row[1],
                "tags": row[2],
                "descriptions": row[3],
                "lesson_for_what": row[4],
                "lesson_for_who": row[5],
                "url": row[6],
                "image_url": row[7],
            }
        )

    return {"lessons": lessons}


# chatGPT에 필요한 기술스택과 지식 질문
@app.post("/api/chat/stack")
def get_stack_completion(prompt: UserInputItem, model="gpt-3.5-turbo"):
    messages = [
        {
            "role": "system",
            "content": "넌 사용자의 수준을 파악해주고 필요한 것을 알려주는 보조 역할을 해야해. 부연 설명 없이 출력 예시처럼 딕셔너리만 반환해야해. 사용자가 하고자 하는 것에 필요한 지식과 스택을 정리해서 예시처럼 딕셔너리 형태로 알려줘. 그 외에는 아무 말도 하지마.",
        },
        {"role": "user", "content": prompt.user_input + "어떤 스택과 어떤 지식이 필요하지?"},
        {"role": "assistant", "content": "{to_do:[스택1, 스택2, 스택3, 지식1, 지식2, 지식3]}"},
    ]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0.7,
    )

    # 딕셔너리 형태로 변환
    response_dict = get_dict_from_string(response.choices[0].message.content)
    to_do_list = response_dict["to_do"]

    return " ".join(to_do_list)


def get_order_completion(prompt, model="gpt-3.5-turbo"):
    messages = [
        {
            "role": "system",
            "content": "정보의 강의 제목으로 난이도 순서대로 커리큘럼을 수립해. 부연 설명은 출력하지 말고 출력 형식을 꼭 지켜. 오직 딕셔너리 하나만 출력해.",
        },
        {"role": "user", "content": "강의 목록 - " + prompt},
        {
            "role": "assistant",
            "content": "{lectures:['강의1', '강의2', '강의3', '강의4', '강의5']}",
        },
    ]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0.7,
    )
    return response.choices[0].message.content


# @app.post("/api/chat/curriculum")
# def get_curriulum(input: CurriculumInputItem, model="gpt-3.5-turbo"):
#     # 강의 제목 Retrieve
#     response_dict = lesson_retrieve_with_sort(input.user_want)

#     return response_dict


# @app.post("/api/chat/curriculum_old")
# def get_curriulum_old(input: CurriculumInputItem, model="gpt-3.5-turbo"):
#     # 강의 제목 Retrieve
#     lesson_title_list_string = lesson_retrieve(input.user_want[:100])

#     # 강의 순서 구하기
#     response_string = get_order_completion(lesson_title_list_string, model)

#     # 딕셔너리 형태로 변환
#     response_dict = get_dict_from_string(response_string)
#     lectures_list = response_dict["lectures"]

#     # 제목으로 강의 정보 불러오기
#     response_dict = get_lesson_info(lectures_list)
#     return response_dict


@app.get("/api/wanted/categories")
def get_categories():
    return requests.get(
        f'{os.getenv("WANTED_ENDPOINT")}/v1/tags/categories',
        headers={
            "Accept": "*/*",
            "wanted-client-id": os.getenv("WANTED_ID"),
            "wanted-client-secret": os.getenv("WANTED_SECRET"),
        },
    ).json()


@app.get("/api/wanted/positions")
def get_positions(curJobID, curOffset):
    return requests.get(
        f'{os.getenv("WANTED_ENDPOINT")}/v1/jobs?category_tags={curJobID}&sort=job.popularity_order&offset={curOffset}&limit=48',
        headers={
            "Accept": "*/*",
            "wanted-client-id": os.getenv("WANTED_ID"),
            "wanted-client-secret": os.getenv("WANTED_SECRET"),
        },
    ).json()


@app.get("/api/wanted/job/{positionID}")
def get_jobs(positionID):
    return requests.get(
        f'{os.getenv("WANTED_ENDPOINT")}/v1/jobs/{positionID}',
        headers={
            "Accept": "*/*",
            "wanted-client-id": os.getenv("WANTED_ID"),
            "wanted-client-secret": os.getenv("WANTED_SECRET"),
        },
    ).json()


class UserWantIn(BaseModel):
    user_want: str
    source: str


@app.post("/api/user_want")
async def post_user_want(userwant: UserWantIn):
    conn = None
    cursor = None
    try:
        conn = create_conn()
        cursor = conn.cursor()
        cursor.execute(
            "insert into UserWants(user_want, source) values(%s, %s)",
            (userwant.user_want, userwant.source),
        )

        conn.commit()
        last_row_id = cursor.lastrowid
    except Exception as e:
        if conn is not None:
            conn.rollback()  # rollback to previous state
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.close()

    return {"want_id": last_row_id}


@app.get("/api/chat/curriculum")
def get_curriulum_with_id(want_id: int = 0):
    # 강의 제목 Retrieve
    conn = create_conn()
    curs = conn.cursor()
    curs.execute(f"SELECT user_want, source FROM UserWants WHERE id = {want_id}")
    result = curs.fetchone()
    conn.close()
    user_want = result[0]
    response_dict = lesson_retrieve_with_sort(user_want)

    return {"source": result[1], "lesson": response_dict}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)

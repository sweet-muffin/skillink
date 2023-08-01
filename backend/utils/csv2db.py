import csv
import pymysql
import os
import configparser
from tqdm import tqdm
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


def check_table(cursor):
    cursor.execute(
        f"""
            CREATE TABLE IF NOT EXISTS lessons (
                `lesson_id`       varchar(100) NOT NULL COMMENT '강의 ID',
                `title`         varchar(255) NOT NULL COMMENT '강의명',
                `tags`       varchar(255) NOT NULL COMMENT '강의 태그',
                `descriptions`          varchar(1000) NOT NULL COMMENT '강의 설명',
                `lesson_for_what`           varchar(1000) NOT NULL COMMENT '강의 내용',
                `lesson_for_who`         varchar(255) NOT NULL COMMENT '강의 타겟',
                `summary`          varchar(1000) NOT NULL COMMENT '강의 요약',
                `url`          varchar(255) NOT NULL COMMENT '강의 URL',
                `image_url`      varchar(255) NOT NULL COMMENT '썸네일 URL',
                PRIMARY KEY (`lesson_id`)
            ) COMMENT = '강의 정보 테이블'
        """
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


def insert_data(csv_file, conn, cursor):
    print("insert_data")
    with open(csv_file, "r", encoding="utf-8") as f_reviews:
        csvReader = csv.reader(f_reviews)
        next(csvReader)  # 헤더 건너뛰기
        for row in tqdm(csvReader):
            (
                lesson_id,
                title,
                tags,
                descriptions,
                lesson_for_what,
                lesson_for_who,
                summary,
                url,
                image_url,
            ) = (row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8])

            sql = f"""
                    INSERT INTO lessons
                    (lesson_id, title, tags, descriptions, lesson_for_what, lesson_for_who, summary, url, image_url)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
            cursor.execute(
                sql,
                (
                    lesson_id,
                    title,
                    tags,
                    descriptions,
                    lesson_for_what,
                    lesson_for_who,
                    summary,
                    url,
                    image_url,
                ),
            )
            conn.commit()


def run_pipeline(DATA_PATH):
    # MySQL 연결 설정
    conn = create_conn()
    curs = conn.cursor()

    # 테이블 생성
    print("Creating tables...")
    check_table(curs)

    insert_data(DATA_PATH, conn, curs)

    # 연결 종료
    conn.close()
    print("All Done!")


if __name__ == "__main__":
    BASE_PATH = os.path.dirname(os.path.abspath(__file__))
    DATA_PATH = os.path.join(BASE_PATH, "lessons_db_data.csv")

    run_pipeline(DATA_PATH)

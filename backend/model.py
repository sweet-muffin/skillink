from pydantic import BaseModel
from typing import List, Dict


class LessonItem(BaseModel):
    lesson_id: str
    title: str
    tags: str
    descriptions: str
    lesson_for_what: str
    lesson_for_who: str
    url: str
    image_url: str


class LessonPartialItem(BaseModel):
    title: str
    descriptions: str
    url: str
    image_url: str


class ReturnItem(BaseModel):
    lessons: List[LessonItem]


class CurriculumInputItem(BaseModel):
    user_want: str


class CurriculumOutputputItem(BaseModel):
    lesson1: LessonPartialItem
    lesson2: LessonPartialItem
    lesson3: LessonPartialItem
    lesson4: LessonPartialItem
    lesson5: LessonPartialItem

class UserInputItem(BaseModel):
    user_input: str
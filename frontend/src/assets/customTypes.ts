export type JobType = {
    id: number;
    parent_id: number;
    title: string;
    image_url: string;
};

export type PositionType = {
    id: number;
    status: number;
    due_time: null | string;
    name: string;
    company: {
        id: number;
        name: string;
    };
    reward: {
        total: number;
        recommender: number;
        recommendee: number;
    };
    address: {
        country: string;
        location: string;
    };
    title_img: {
        origin: string;
        thumb: string;
    };
    logo_img: {
        origin: string;
        thumb: string;
    };
};

export type LessonType = {
    title: string;
    descriptions: string;
    url: string;
    image_url: string;
};

export type ResponseType = {
    lesson1: LessonType;
    lesson2: LessonType;
    lesson3: LessonType;
    lesson4: LessonType;
    lesson5: LessonType;
};

export type IntroType = {
    detailURL: string;
    positionName: string;
    companyName: string;
    companyLocation: string;
    intro: string;
    companyURL: string;
};

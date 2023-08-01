import * as CT from "@assets/customTypes";
import styled from "styled-components";
import { isMobile } from "@assets/mobile";
import button_back from "@assets/images/button.svg";

const JobModal = (props: {
    jobList: CT.JobType[] | null;
    curJobID: number;
    JobSelectHander: (jobID: number) => void;
    JobNextHandler: () => void;
}) => {
    return (
        <ModalBackground>
            <JobModalWrapper>
                <JobModalText>원하는 직무를 선택해 주세요.</JobModalText>
                <JobItemWrapper>
                    {props.jobList!.map((job) => (
                        <JobItem
                            key={job.id}
                            selected={props.curJobID === job.id}
                            onClick={() => props.JobSelectHander(job.id)}
                        >
                            {job.title}
                        </JobItem>
                    ))}
                </JobItemWrapper>
                <JobNextButton src={button_back} onClick={props.JobNextHandler}>
                    포지션 보러가기
                </JobNextButton>
            </JobModalWrapper>
        </ModalBackground>
    );
};

export default JobModal;

const ModalBackground = styled.div`
    position: fixed;
    background: rgba(184, 184, 184, 0.47);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

const JobModalWrapper = styled.div`
    width: ${isMobile() ? "350rem" : "800rem"};
    height: 700rem;
    flex-shrink: 0;
    border-radius: 20rem;
    background: #fff;
    box-shadow: 5rem 5rem 5rem 0rem rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
`;

const JobModalText = styled.div`
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: ${isMobile() ? "24rem" : "35rem"};
    font-style: normal;
    font-weight: 600;
    line-height: normal;

    margin-top: 72rem;
    margin-bottom: 50rem;
`;

const JobItemWrapper = styled.div`
    flex-wrap: wrap;
    width: ${isMobile() ? "300rem" : "700rem"};
    display: flex;
    justify-content: center;
    height: 400rem;
    overflow: scroll;
`;

interface ItemType {
    selected: boolean;
}

const JobItem = styled.div<ItemType>`
    border-radius: 20rem;
    background: ${(props) => (props.selected ? "white" : "#f2f4f7")};
    border: ${(props) =>
        props.selected ? "2rem solid var(--udemy-sub-1, #5027C8)" : "0px"};

    height: ${(props) => (props.selected ? "41rem" : "45rem")};
    padding: 0
        ${(props) =>
            props.selected
                ? isMobile()
                    ? "28rem"
                    : "38rem"
                : isMobile()
                ? "30rem"
                : "40rem"};

    flex-shrink: 0;
    color: ${(props) =>
        props.selected ? "var(--udemy-sub-1, #5027C8)" : "#000"};
    text-align: center;
    font-family: Pretendard;
    font-size: ${isMobile() ? "17rem" : "20rem"};
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin-right: 15rem;
    margin-bottom: 15rem;
    cursor: pointer;
`;

interface CardType {
    src: string;
}

const JobNextButton = styled.button<CardType>`
    font-size: ${isMobile() ? "22rem" : "28rem"};
    font-family: "Pretendard-semibold";
    align-items: center;
    border-radius: 20rem;
    background-color: transparent;
    border: transparent;
    color: white;
    width: ${isMobile() ? "310rem" : "360rem"};
    height: ${isMobile() ? "50rem" : "70rem"};
    background-image: url(${(props) => props.src});
    margin-top: 32rem;
    cursor: pointer;
`;

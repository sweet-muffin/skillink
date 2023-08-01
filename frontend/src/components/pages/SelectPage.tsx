import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import project_background from "@assets/images/project_back.svg";
import job_background from "@assets/images/job_back.svg";
import project_icon from "@assets/images/project.svg";
import job_icon from "@assets/images/job_icon.png";
import enter from "@assets/images/enter.svg";
import HeaderBlock from "@blocks/HeaderBlock";
import * as KF from "@styles/keyframes";
import { isMobile } from "@assets/mobile";

const SelectPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <HeaderBlock />
            <Wrapper>
                <CenterWrapper>
                    <CardWrapper
                        svgurl={project_background}
                        onClick={() => navigate("/project")}
                    >
                        <CardLogoIMG src={project_icon} />
                        <CardTextWrapper>
                            <CardTextTitle>프로젝트</CardTextTitle>
                            <CardTextDesc>
                                진행하고자 하는 프로젝트가 있는데 무슨 스택이
                                필요한 지 모르겠다면?
                            </CardTextDesc>
                        </CardTextWrapper>
                        <NextIMGWrapper>
                            <NextButton src={enter} />
                        </NextIMGWrapper>
                    </CardWrapper>
                    <CardWrapper
                        svgurl={job_background}
                        onClick={() => navigate("/job")}
                    >
                        <CardLogoIMG src={job_icon} />
                        <CardTextWrapper>
                            <CardTextTitle>취업</CardTextTitle>
                            <CardTextDesc>
                                현재 채용 중인 포지션과 기업을 확인하고 요구
                                사항에 맞는 강의를 알아보고 싶다면?
                            </CardTextDesc>
                        </CardTextWrapper>
                        <NextIMGWrapper>
                            <NextButton src={enter} />
                        </NextIMGWrapper>
                    </CardWrapper>
                </CenterWrapper>
            </Wrapper>
        </>
    );
};

export default SelectPage;

const Wrapper = styled.div`
    width: 100%;
    /* height: 90vh; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rem;
    @media screen and (max-width: 800px) {
        padding-top: ${isMobile() ? "20rem" : "50rem"};
    }
`;

const CenterWrapper = styled.div`
    display: flex;
    /* width: 836rem; */
    flex-direction: row;
    @media screen and (max-width: 800px) {
        flex-direction: column;
        align-items: center;
    }
    /* margin-top: 170rem; */
    ${css`
        animation: ${KF.start} 0.8s 0.4s 1 both;
    `}
`;

interface SVGType {
    svgurl: string;
}

const CardWrapper = styled.div<SVGType>`
    width: 368rem;
    height: 528rem;
    display: flex;
    border-radius: 30rem;
    background-image: url(${(props) => props.svgurl});
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    background-size: cover;
    background-repeat: no-repeat;
    margin: 0 50rem;
    @media screen and (max-width: 800px) {
        margin: 0 0;
        margin-bottom: 30rem;
        width: ${isMobile() ? "350rem" : "400rem"};
        height: ${isMobile() ? "340rem" : "400rem"};
        padding: ${isMobile() ? "0rem" : "10rem"};
    }
`;

const CardLogoIMG = styled.img`
    margin-top: 90rem;
    height: ${isMobile() ? "128rem" : "160rem"};
    margin-bottom: 41rem;
    @media screen and (max-width: 800px) {
        margin-bottom: 21rem;
        margin-top: 30rem;
    }
`;

const CardTextWrapper = styled.div`
    width: ${isMobile() ? "280rem" : "322rem"};
    height: ${isMobile() ? "110rem" : "170rem"};
    text-align: left;
`;

const NextIMGWrapper = styled.div`
    width: 322rem;
    text-align: right;
`;

const NextButton = styled.img`
    width: 49rem;
`;

const CardTextTitle = styled.div`
    color: #fff;
    text-align: left;
    font-family: Pretendard;
    font-size: ${isMobile() ? "30rem" : "50rem"};
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-bottom: 5rem;
`;
const CardTextDesc = styled.div`
    color: #fff;
    font-family: Pretendard;
    font-size: ${isMobile() ? "18rem" : "23rem"};
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    word-break: keep-all;
`;

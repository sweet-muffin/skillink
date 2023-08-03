import styled from "styled-components";
import { isMobile } from "@assets/mobile";
import button_back from "@assets/images/button.svg";
import * as CT from "@assets/customTypes";

const IntroModal = (props: {
    ModalOffHander: () => void;
    ModalBackHander: () => void;
    introInfo: CT.IntroType;
    NextPageHandler: () => void;
}) => {
    const URLHandler = (url: string) => {
        if (!url.includes("http")) {
            window.open(`https://${url}`);
        } else {
            window.open(url);
        }
    };
    return (
        <ModalBackground onClick={props.ModalOffHander}>
            <ModalDiv>
                <CloseButton onClick={props.ModalBackHander}>X</CloseButton>
                <ModalIMG src={props.introInfo.detailURL} alt="" />
                <ModalTextWrapper>
                    <PositionName>{props.introInfo.positionName}</PositionName>
                    <HeightBox height="7rem" />
                    <RowText>
                        <CompanyName>{props.introInfo.companyName}</CompanyName>
                        <WidthBox width="12rem" />
                        <LocationText>
                            {props.introInfo.companyLocation}
                        </LocationText>
                    </RowText>
                    <HeightBox height="28rem" />
                    <IntroText>{props.introInfo.intro}</IntroText>
                </ModalTextWrapper>
                <CompanyPageButton
                    onClick={() => URLHandler(props.introInfo.companyURL!)}
                >
                    회사 홈페이지로 이동하기
                </CompanyPageButton>
                <ResultPageButton
                    svgurl={button_back}
                    onClick={props.NextPageHandler}
                >
                    커리큘럼 추천 받으러 가기
                </ResultPageButton>
            </ModalDiv>
        </ModalBackground>
    );
};

export default IntroModal;

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

const ModalDiv = styled.div`
    width: ${isMobile() ? "350rem" : "700rem"};
    /* height: ${isMobile() ? "80vh" : "90vh"}; */
    padding-bottom: 20rem;
    border-radius: 20rem;
    background: #fff;
    box-shadow: 5rem 5rem 5rem 0rem rgba(0, 0, 0, 0.1);
    margin: 0 auto;
`;

const ModalIMG = styled.img`
    width: 100%;
    height: ${isMobile() ? "28vh" : "350rem"};
    flex-shrink: 0;
    border-radius: 20rem 20rem 0 0;
    margin-bottom: 15.5rem;
    object-fit: cover;
`;

const ModalTextWrapper = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    text-align: left;
`;

const IntroText = styled.span`
    color: #000;
    font-family: Pretendard;
    font-size: ${isMobile() ? "16rem" : "20rem"};
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    word-break: keep-all;
    overflow: scroll;
    height: ${isMobile() ? "20vh" : "320rem"};
`;

const RowText = styled.div`
    display: flex;
    flex-direction: row;
`;

interface HeightType {
    height: string;
}

const HeightBox = styled.div<HeightType>`
    height: ${(props) => props.height};
`;

interface WidthType {
    width: string;
}

const WidthBox = styled.div<WidthType>`
    width: ${(props) => props.width};
`;

const CompanyPageButton = styled.button`
    width: ${isMobile() ? "310rem" : "352rem"};
    height: ${isMobile() ? "45rem" : "50rem"};
    flex-shrink: 0;
    border-radius: 15rem;
    border: 1rem solid var(--udemy, #983de7);
    color: var(--udemy, #983de7);
    text-align: center;
    font-family: Pretendard;
    font-size: ${isMobile() ? "20rem" : "23rem"};
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    background: white;
    margin-top: 32rem;
    cursor: pointer;
`;

interface SVGType {
    svgurl: string;
}

const ResultPageButton = styled.button<SVGType>`
    width: ${isMobile() ? "310rem" : "352rem"};
    height: ${isMobile() ? "45rem" : "50rem"};
    flex-shrink: 0;
    color: #fff;
    text-align: center;
    font-family: Pretendard;
    font-size: ${isMobile() ? "20rem" : "23rem"};
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    background-image: url(${(props) => props.svgurl});
    border-radius: 15rem;
    border: 0px;
    margin-top: 9rem;
    cursor: pointer;
`;

const PositionName = styled.span`
    color: #000;
    font-family: Pretendard;
    font-size: ${isMobile() ? "17rem" : "25rem"};
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-align: left;
`;

const CompanyName = styled.span`
    color: #000;
    font-family: Pretendard;
    text-align: left;
    font-size: ${isMobile() ? "13rem" : "20rem"};
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const LocationText = styled.span`
    color: var(--text-sub, #989898);
    font-family: Pretendard;
    font-size: ${isMobile() ? "13rem" : "20rem"};
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const CloseButton = styled.div`
    position: fixed;
    font-size: ${isMobile() ? "18rem" : "20rem"};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: ${isMobile() ? "350rem" : "700rem"};
    transform: translate(-40rem, 10rem);
    /* background: ${(props) => props.theme.colors.udemy}; */
    background: ${(props) => props.theme.colors.udemy_sub2};
    color: white;
    color: black;
    width: 30rem;
    height: 30rem;
    border-radius: 20rem;
    cursor: pointer;
    font-family: "UbuntuCondensed";
`;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BackgroundSvg from "@assets/images/end_back_pc.svg";
import MobileBackgroundSvg from "@assets/images/end_back_mo.svg";
import { Text } from "@nextui-org/react";
import ItemBox from "@blocks/CurriculumBlock";
import FooterBlock from "@blocks/FooterBlock";
// import resultDummy from "@apis/result_response.json";
import axios from "axios";
import ColorButtonBlock from "@blocks/ColorButtonBlock";
import HeaderBlock from "@blocks/HeaderBlock";
import * as CT from "@assets/customTypes";
import { isMobile } from "@assets/mobile";
import Spinner from "@blocks/Spinner";

const ResultPage = () => {
	const [curriculumList, setCurriculumList] =
		useState<CT.ResponseType | null>(null);
	const requirements = window.localStorage.getItem("requirements");
	const title = window.localStorage.getItem("title");

	useEffect(() => {
		const FetchData = async () => {
			await axios({
				method: "post",
				url: "/api/chat/curriculum",
				headers: {
					accept: "application/json",
				},
				data: {
					user_want: window.localStorage.getItem("requirements"),
				},
			})
				.then((response) => {
					setCurriculumList(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		window.localStorage.getItem("requirements") && FetchData();
	}, []);

	return (
		<>
			{curriculumList ? (
				<>
					<HeaderBlock />
					<Wrapper
						src={isMobile() ? MobileBackgroundSvg : BackgroundSvg}
					>
						<TitleWrapper>
							<TextWrapper>
								<TitleText>목표에 맞는&nbsp;</TitleText>
								<Text
									css={{
										textGradient:
											"45deg, $pink600 0%, $purple600 120%",
										fontFamily: "Pretendard-semibold",

										fontSize: isMobile()
											? "24rem"
											: "60rem",
										margin: "0",
										flexShrink: "0",
									}}
								>
									커리큘럼
								</Text>
								<TitleText>으로</TitleText>
							</TextWrapper>
							<TitleText>
								흥미진진한 학습을 시작해보세요!
							</TitleText>
							<ContentTitle>
								{title
									? title
									: "해당 포지션에서 요구하는 사항은 다음과 같습니다."}
							</ContentTitle>
							<ContentBox>
								<ContentText>{requirements}</ContentText>
							</ContentBox>
						</TitleWrapper>
						<CurriculumBox>
							<GradientLine />
							<ImtemsWrapper id="lessonContainer">
								{[
									curriculumList!.lesson1,
									curriculumList!.lesson2,
									curriculumList!.lesson3,
									curriculumList!.lesson4,
									curriculumList!.lesson5,
								].map((lesson, index) => (
									<ItemBox
										key={index}
										step={index + 1}
										title={lesson.title}
										desc1={
											lesson.descriptions.split("\n")[0]
										}
										desc2={
											lesson.descriptions.split("\n")[1]
										}
										desc3={
											lesson.descriptions.split("\n")[2]
										}
										image={lesson.image_url}
										lessonURL={lesson.url}
									/>
								))}
							</ImtemsWrapper>
						</CurriculumBox>
						<ButtonBox>
							<ColorButtonBlock
								navigation=""
								comment="메인페이지로 돌아가기"
							/>
						</ButtonBox>
					</Wrapper>
					<FooterBlock />
				</>
			) : (
				<Spinner />
			)}
		</>
	);
};

export default ResultPage;

interface CardType {
	src: string;
}

const Wrapper = styled.div<CardType>`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-image: url(${(props) => props.src});
	background-repeat: no-repeat;
	background-size: contain;
`;

const TitleWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: ${isMobile() ? "100rem 0" : "160rem 0"};
	/* min-width: 120rem; */
	flex-shrink: 0;
	word-break: keep-all;
`;

const CurriculumBox = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: start;
`;

const GradientLine = styled.div`
	width: 5rem;
	// flex-grow: 1;
	height: ${isMobile() ? "2300rem" : "3500rem;"};
	display: flex;
	background: linear-gradient(
		to bottom,
		${(props) => props.theme.colors.wanted_sub1} 0%,
		${(props) => props.theme.colors.wanted} 25%,
		${(props) => props.theme.colors.udemy_sub3} 50%,
		${(props) => props.theme.colors.udemy} 75%,
		${(props) => props.theme.colors.udemy_sub1} 100%
	);
`;

const ImtemsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: start;
	padding-left: ${isMobile() ? "26rem" : "50rem"};
`;

const TitleText = styled.span`
	font-size: ${isMobile() ? "24rem" : "60rem"};
	font-family: "Pretendard-semibold";
`;

const ContentTitle = styled.span`
	font-size: ${isMobile() ? "18rem" : "40rem"};
	font-family: "Pretendard-midium";
	margin-top: 100rem;
`;

const ContentText = styled.span`
	font-size: ${isMobile() ? "18rem" : "40rem"};
	font-family: "Pretendard-regular";
	text-align: start;
	background-color: transparent;
`;

const ContentBox = styled.div`
	width: ${isMobile() ? "310rem" : "912rem;"};
	height: ${isMobile() ? "120rem" : "314rem;"};
	padding: 20rem;
	border: solid 2rem ${(props) => props.theme.colors.udemy};
	/* background-color: white; */
	border-radius: 20rem;
	overflow-y: scroll;
	margin: ${isMobile() ? "40rem 0" : "50rem 0"};
	/* box-shadow: 5rem 5rem 5rem 0rem rgba(0, 0, 0, 0.1); */
	display: flex;
	justify-content: center;
	align-items: center;
`;

const TextWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;

const ButtonBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: ${isMobile() ? "150rem" : "300rem;"};
`;

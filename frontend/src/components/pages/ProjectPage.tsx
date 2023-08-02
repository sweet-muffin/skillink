import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import axios from "axios";
import HeaderBlock from "@blocks/HeaderBlock";
import { isMobile } from "@assets/mobile";
import Spinner from "@blocks/Spinner";
import ButtonBackground from "@assets/images/button.svg";
import * as KF from "@styles/keyframes";
import AlertModal from "@blocks/AlertModal";
import { resourceUsage } from "process";

const ProjectPage = () => {
	const navigate = useNavigate();
	const [inputText, setInputText] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [alertModal, setAlertModal] = useState(false);

	const InputTextHandler = (e: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setInputText(e.target.value);
	};

	const NextPageHandler = () => {
		const FetchStackListData = async () => {
			await axios({
				method: "post",
				url: "/api/chat/stack",
				headers: {
					Accept: "*/*",
					"Content-Type": "application/json",
				},
				data: {
					user_input: inputText,
				},
			})
				.then((response) => {
					window.localStorage.setItem("requirements", response.data);
					window.localStorage.setItem(
						"title",
						"프로젝트를 위해 필요한 스택과 지식은 다음과 같습니다."
					);
					navigate("/result");
				})
				.catch((error) => {
					console.log(error);
				});
		};
		if (inputText.length === 0) {
			setAlertModal(true);
		} else {
			setLoading(true);
			FetchStackListData();
		}
	};

	const EnterHandler = (e: { key: string }) => {
		if (e.key === "Enter") {
			NextPageHandler();
		}
	};

	const ModalOffHander = () => {
		setAlertModal(false);
	};

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<Wrapper>
					{alertModal && (
						<>
							<AlertModal ModalOffHander={ModalOffHander} />
						</>
					)}
					<HeaderBlock />
					<MainBox>
						<CenterTextWrapper>
							<TextWrapper>
								<SubTitle>
									현재 자신이 가지고 있는&nbsp;
								</SubTitle>
								<SubTitleColor>기술 스택</SubTitleColor>
								<SubTitle>과 수준, </SubTitle>
							</TextWrapper>
							<TextWrapper>
								<SubTitle>그리고 원하는&nbsp;</SubTitle>
								<SubTitleColor>프로젝트</SubTitleColor>
								<SubTitle>를 알려주세요.</SubTitle>
							</TextWrapper>
						</CenterTextWrapper>
						<InputBox
							onKeyPress={EnterHandler}
							maxLength={100}
							onChange={InputTextHandler}
							placeholder="난 자바스크립트만 조금 할 줄 아는 초보 개발자인데, 내 웹사이트를 제작하고 싶어."
						/>

						<ColorButton
							userinput={inputText}
							src={ButtonBackground}
							onClick={NextPageHandler}
						>
							커리큘럼 추천 받으러 가기
						</ColorButton>
					</MainBox>
				</Wrapper>
			)}
		</>
	);
};

export default ProjectPage;

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const MainBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: ${isMobile() ? "160rem" : "272rem"};
`;

const SubTitle = styled.span`
	font-size: ${isMobile() ? "21rem" : "40rem"};
	font-family: "Pretendard-semibold";
`;

const SubTitleColor = styled.span`
	font-size: ${isMobile() ? "21rem" : "40rem"};
	font-family: "Pretendard-semibold";
	color: ${(props) => props.theme.colors.udemy_sub1};
`;

const CenterTextWrapper = styled.div`
	${css`
		animation: ${KF.start} 0.8s 0.4s 1 both;
	`}
`;

const TextWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
`;

const InputBox = styled.textarea`
	width: ${isMobile() ? "350rem" : "1000rem"};
	height: ${isMobile() ? "67rem" : "100rem"};
	border: solid 3rem ${(props) => props.theme.colors.udemy};
	border-radius: 20rem;
	margin: 50rem;
	padding: 20rem;
	font-size: ${isMobile() ? "15rem" : "25rem"};
	font-family: "Pretendard-regural";
	@media screen and (max-width: 920px) {
		width: 75%;
	}
	word-break: keep-all;
	&:focus {
		outline: none;
	}
	${css`
		animation: ${KF.start} 0.8s 0.6s 1 both;
	`}
`;

interface ButtonType {
	src: string;
	userinput: string;
}

const ColorButton = styled.button<ButtonType>`
	font-size: ${isMobile() ? "22rem" : "30rem"};
	font-family: "Pretendard-semibold";
	align-items: center;
	border-radius: 20rem;
	background-color: transparent;
	border: transparent;
	color: white;
	width: ${isMobile() ? "350rem" : "510rem"};
	height: ${isMobile() ? "55rem" : "77rem"};
	background-image: url(${(props) => props.src});
	opacity: 0;
	${css`
		animation: ${KF.buttonstart} 0.8s 0.8s backwards;
	`}
	opacity: ${(props) => (props.userinput.length === 0 ? "0.3" : "1.0")};
	${(props) => props.userinput.length !== 0 && "cursor: pointer;"}
`;

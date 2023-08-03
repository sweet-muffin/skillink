import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import Background from "@assets/images/main_back_pc.svg";
import mobile_main_back from "@assets/images/main_back_mo.svg";
import Stack from "@assets/images/stack.svg";
import JD from "@assets/images/JD.svg";
import Lectures from "@assets/images/lecture.svg";
import Dot from "@assets/images/dot.svg";
import Objective from "@assets/images/objective.svg";
import Position from "@assets/images/position.svg";
import Curriculum from "@assets/images/curr.svg";
import FooterBlock from "@blocks/FooterBlock";
import HeaderBlock from "@blocks/HeaderBlock";
import ColorButton from "@blocks/ColorButtonBlock";
import { useEffect } from "react";
import { isMobile } from "@assets/mobile";
import * as KF from "@styles/keyframes";
import Fade from "react-reveal/Fade";
import Zoom from "react-reveal/Zoom";

const MainPage = () => {
	const navigate = useNavigate();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<Wrapper>
			<HeaderBlock />
			<FirstBox src={isMobile() ? mobile_main_back : Background}>
				<TitleBox>
					<TitleSub>
						{" "}
						&#123; 나에게 딱 맞는 커리큘럼 추천 서비스 &#125;
					</TitleSub>
					<Title>
						당신의 꿈을 향한 완벽한 시작,
						<br />
						목표를 달성하는 지름길!
					</Title>
				</TitleBox>
				<Button
					onClick={() => {
						navigate("/select");
					}}
				>
					커리큘럼 추천 받으러 가기
				</Button>
			</FirstBox>
			<Container>
				<SubTitle>이런 고민 해본 적 있으신가요?</SubTitle>
				<ItemsWrapper>
					<Fade bottom>
						<ItemWrapper>
							<img src={Stack} alt="" />
							<ItemTitle>프로젝트 스택 선정</ItemTitle>
							<ItmeDesc>
								수많은 기술 스택들 중<br />
								어떤 스택을 써야 할지 모르겠을 때
							</ItmeDesc>
						</ItemWrapper>
						<ItemWrapper>
							<img src={JD} alt="" />
							<ItemTitle>어려운 자격요건</ItemTitle>
							<ItmeDesc>
								채용 공고의 자격요건들을 채우기 위해서
								<br />
								어떻게 준비해야 할지 막막할 때
							</ItmeDesc>
						</ItemWrapper>
						<ItemWrapper>
							<img src={Lectures} alt="" />
							<ItemTitle>너무 많은 강의</ItemTitle>
							<ItmeDesc>
								강의가 너무 많아서 뭐부터 들어야
								<br />
								할지 감이 잡히지 않을 때
							</ItmeDesc>
						</ItemWrapper>
					</Fade>
				</ItemsWrapper>
			</Container>
			<GrayContainer>
				<SubTitle>더 이상의 커리큘럼 고민은 그만!</SubTitle>
				<ItemsWrapper>
					<Fade bottom>
						<ItemBox>
							<img src={Dot} alt="" />
							<ItemText>
								원하시는 목적에 따라 적절한
								<br />
								커리큘럼을 추천해드릴게요
							</ItemText>
						</ItemBox>
						<ItemBox>
							<img src={Dot} alt="" />
							<ItemText>
								488개의 강의 목록 중 필요한
								<br />
								강의를 찾아드릴게요
							</ItemText>
						</ItemBox>
						<ItemBox>
							<img src={Dot} alt="" />
							<ItemText>
								커리큘럼을 따라 강의들을
								<br />한 눈에 볼 수 있어요
							</ItemText>
						</ItemBox>
					</Fade>
				</ItemsWrapper>
			</GrayContainer>
			<Container>
				<SubTitle>오직 두 단계면 충분해요</SubTitle>
				<ItemsWrapper>
					<Fade bottom>
						<ItemWrapper>
							<ImageBox>
								<img src={Objective} width="200rem" alt="" />
							</ImageBox>
							<ItemTitle>원하시는 목표를 말씀해주세요</ItemTitle>
						</ItemWrapper>
						<ItemWrapper>
							<ImageBox>
								<img src={Position} width="200rem" alt="" />
							</ImageBox>
							<ItemTitle>
								원하시는 직무에 대한
								<br />
								채용 공고를 선택해주세요
							</ItemTitle>
						</ItemWrapper>
						<ItemWrapper>
							<ImageBox>
								<img src={Curriculum} height="200rem" alt="" />
							</ImageBox>
							<ItemTitle>
								적절한 커리큘럼을
								<br />
								추천해드립니다
							</ItemTitle>
						</ItemWrapper>
					</Fade>
				</ItemsWrapper>
			</Container>
			<Zoom>
				<ButtonBox>
					<ColorButton
						navigation={"select"}
						comment={"커리큘럼 추천받으러 가기"}
					/>
				</ButtonBox>
			</Zoom>
			<FooterBlock />
		</Wrapper>
	);
};

export default MainPage;

interface CardType {
	src: string;
}

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	min-width: 710px;
	${isMobile() && "min-width:0px;"}
`;

const Title = styled.span`
	font-size: 70rem;
	font-family: "Pretendard-semibold";
	align-self: center;
	color: white;
	margin-bottom: 20rem;
	${isMobile() && "font-size: 28rem;"}
	${isMobile() && "margin-bottom: 0rem;"}
`;

const TitleSub = styled.span`
	font-size: 30rem;
	font-family: "Pretendard-regular";
	align-self: center;
	margin-bottom: 20rem;
	color: white;
	${isMobile() && "font-size: 18rem; margin-top: 79rem; margin-bottom: 8rem;"}
`;

const TitleBox = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 80rem;
	${isMobile() && "margin-bottom: 57rem;"}
`;

const SubTitle = styled.span`
	font-size: ${isMobile() ? "25rem" : "50rem"};
	font-family: "Pretendard-semibold";
	align-self: center;
	margin: ${isMobile() ? "66rem 0" : "150rem"};
`;

const FirstBox = styled.div<CardType>`
	height: 600rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-image: url(${(props) => props.src});
	background-size: cover;
	// background-size: contain;
	background-repeat: no-repeat;
	${isMobile() && "height: 360rem; justify-content: flex-start;"}
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	${!isMobile() && "padding-bottom: 200rem;"}
`;

const GrayContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.theme.colors.box};
	padding-bottom: ${isMobile() ? "50rem" : "200rem"};
`;

const ItemBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: white;
	border-radius: 20rem;
	width: ${isMobile() ? "350rem" : "450rem"};
	height: ${isMobile() ? "109rem" : "230rem"};

	${isMobile() ? "margin-bottom:30rem;" : "margin: 15rem;"}
`;

const ItemText = styled.span`
	font-size: ${isMobile() ? "17rem" : "28rem"};
	font-family: "Pretendard-regular";
	align-self: center;
	margin-top: ${isMobile() ? "10rem" : "30rem"};
`;

const ItemsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	@media screen and (max-width: 1000px) {
		flex-direction: column;
	}
	${isMobile() && "width:250rem;"}
`;

const ItemWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: ${isMobile() ? "300rem" : "400rem"};
	margin: ${isMobile() ? "0" : "40rem"};
	${isMobile() && "margin-bottom: 60rem;"}
`;

const ItemTitle = styled.div`
	font-size: ${isMobile() ? "24rem" : "33rem"};
	font-family: "Pretendard-midium";
	align-self: center;
	margin-top: ${isMobile() ? "30rem" : "40rem"};
	margin-bottom: 20rem;
`;

const ItmeDesc = styled.div`
	font-size: ${isMobile() ? "18rem" : "23rem"};
	font-family: "Pretendard-regular";
	align-self: center;
	color: ${(props) => props.theme.colors.text_sub};
`;

const Button = styled.button`
	font-size: 30rem;
	font-family: "Pretendard-semibold";
	align-items: center;
	border-radius: 20rem;
	border: solid;
	border-width: 3rem;
	background-color: transparent;
	width: 510rem;
	height: 77rem;
	color: white;
	cursor: pointer;
	${isMobile() && "width:270rem; font-size:19rem; height:65rem;"}
`;

const ImageBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: ${isMobile() ? "100rem" : "200rem"};
	margin: 20rem;
`;

const ButtonBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: ${isMobile() ? "100rem" : "300rem"};
`;

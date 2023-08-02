import styled from "styled-components";
import { isMobile } from "@assets/mobile";
import Skillink from "@assets/images/logo.svg";

const ErrorModal = (props: { ModalOffHander: () => void }) => {
	return (
		<ModalDiv>
			<LogoImage src={Skillink} />
			<ModalText>오류가 발생했습니다.</ModalText>
			<OKButton onClick={props.ModalOffHander}>새로고침</OKButton>
		</ModalDiv>
	);
};

export default ErrorModal;
interface ImageSrc {
	src: string;
}

const LogoImage = styled.img<ImageSrc>`
	src: ${(props) => props.src};
	width: ${isMobile() ? "30rem" : "40rem"};
	margin-bottom: 20rem;
`;

const ModalDiv = styled.div`
	width: ${isMobile() ? "300rem" : "600rem"};
	padding: 30rem;
	border-radius: 20rem;
	background: #fff;
	box-shadow: 5rem 5rem 5rem 0rem rgba(0, 0, 0, 0.1);
	margin: 0 auto;
`;

const ModalText = styled.div`
	color: #000;
	text-align: center;
	font-family: "Pretendard-midum";
	font-size: ${isMobile() ? "18rem" : "24rem"};
`;

const OKButton = styled.button`
	font-size: 20rem;
	font-family: "Pretendard-semibold";
	align-items: center;
	border-radius: 10rem;
	border: solid;
	margin-top: 20rem;
	width: 120rem;
	padding: 5rem;
	border-width: 2rem;
	background-color: transparent;
	color: ${(props) => props.theme.colors.udemy};
	cursor: pointer;
`;

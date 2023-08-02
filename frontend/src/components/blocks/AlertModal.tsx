import styled from "styled-components";
import { isMobile } from "@assets/mobile";

const AlertModal = (props: { ModalOffHander: () => void }) => {
	return (
		<ModalBackground>
			<ModalDiv>
				<ModalText>
					현재 자신이 가지고 있는 기술스택과 수준,
					<br />
					그리고 원하는 프로젝트를 작성해주세요.
				</ModalText>
				<OKButton onClick={props.ModalOffHander}>확인</OKButton>
			</ModalDiv>
		</ModalBackground>
	);
};

export default AlertModal;

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
	width: ${isMobile() ? "60rem" : "100rem"};
	padding: 5rem;
	border-width: 2rem;
	background-color: transparent;
	color: ${(props) => props.theme.colors.udemy};
	cursor: pointer;
`;

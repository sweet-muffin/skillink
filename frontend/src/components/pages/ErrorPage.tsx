import styled, { css } from "styled-components";
import React, { useState, useEffect } from "react";
import { Text } from "@nextui-org/react";
import ColorButtonBlock from "@blocks/ColorButtonBlock";
import HeaderBlock from "@blocks/HeaderBlock";
import { isMobile } from "@assets/mobile";

const ErrorPage = () => {
	return (
		<>
			<HeaderBlock />
			<Wrapper>
				<Text
					css={{
						textGradient: "45deg, $purple600 10%, $blue600 100%",
						fontFamily: "Pretendard-semibold",
						fontSize: isMobile() ? "60rem" : "120rem",
						margin: "0",
						flexShrink: "0",
					}}
				>
					404
				</Text>
				<ErrorText>잘못된 접근입니다</ErrorText>
				<ColorButtonBlock
					navigation=""
					comment="메인 페이지로 돌아가기"
				/>
			</Wrapper>
		</>
	);
};

export default ErrorPage;

const ErrorText = styled.span`
	font-size: ${isMobile() ? "30rem" : "50rem"};
	font-family: "Pretendard-semibold";
	margin-top: 10rem;
	margin-bottom: 50rem;
`;

const Wrapper = styled.div`
	margin-top: 150rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

import React from "react";
import styled from "styled-components";
import Diamond from "@assets/images/diamond.svg";

const isMobile = function () {
	const match = window.matchMedia("(pointer:coarse)");
	return match && match.matches;
};

const CurriculumBlock = (props: {
	step: number;
	title: string;
	desc1: string;
	desc2: string;
	desc3: string;
	image: string;
	lessonURL: string;
}) => {
	const Colors = ["", "#5689F7", "#385AE9", "#B454F6", "#983DE7", "#5027C8"];
	return (
		<ItemBox>
			<StepText src={Colors[props.step]}>Step {props.step}.</StepText>
			<ImageBox
				src={props.image}
				onClick={() => window.open(props.lessonURL)}
			/>
			<ItemTitle>{props.title}</ItemTitle>
			<DescList>
				<img
					src={Diamond}
					height={isMobile() ? "21.4rem" : "100%"}
					alt=""
				/>
				<DescText>{props.desc1}</DescText>
			</DescList>
			<DescList>
				<img
					src={Diamond}
					height={isMobile() ? "21.4rem" : "100%"}
					alt=""
				/>
				<DescText>{props.desc2}</DescText>
			</DescList>
			<DescList>
				<img
					src={Diamond}
					height={isMobile() ? "21.4rem" : "100%"}
					alt=""
				/>
				<DescText>{props.desc3}</DescText>
			</DescList>
		</ItemBox>
	);
};

export default CurriculumBlock;
interface CardType {
	src: string;
}

const ItemBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: start;
	margin-bottom: 70rem;
	width: ${isMobile() ? "300rem" : "600rem"};
`;

const StepText = styled.span<CardType>`
	font-size: ${isMobile() ? "25rem" : "45rem"};
	font-family: "UbuntuCondensed";
	color: ${(props) => props.src};
	margin-bottom: 30rem;
`;

// const ImageBox = styled.div<CardType>`
//     border-radius: 20rem 20rem 20rem 0rem;
//     width: ${isMobile() ? "280rem" : "500rem"};
//     height: ${isMobile() ? "157rem" : "300rem"};
//     background-image: url(${(props) => props.src});
//     background-size: cover;
//     cursor: pointer;
// `;

const ImageBox = styled.img`
	border-radius: 20rem 20rem 20rem 0rem;
	width: ${isMobile() ? "280rem" : "500rem"};
	/* height: ${isMobile() ? "157rem" : "300rem"}; */
	box-shadow: 5rem 5rem 5rem 0rem rgba(0, 0, 0, 0.1);
	cursor: pointer;
`;

const ItemTitle = styled.span`
	font-size: ${isMobile() ? "20rem" : "30rem"};
	font-family: "Pretendard-midium";
	margin-top: 15rem;
	margin-bottom: 15rem;
	text-align: left;
`;

const DescList = styled.div`
	width: ${isMobile() ? "286rem" : "100%"};
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: center;
	background-color: ${(props) => props.theme.colors.box};
	border-radius: 20rem 20rem 20rem 0rem;
	padding: ${isMobile() ? "15rem" : "25rem"};
	margin-bottom: ${isMobile() ? "10rem" : "20rem"};
`;

const DescText = styled.span`
	font-size: ${isMobile() ? "14rem" : "25rem"};
	font-family: "Pretendard-regular";
	margin-left: ${isMobile() ? "10rem" : "20rem"};
	text-align: left;
`;

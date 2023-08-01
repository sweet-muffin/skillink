import { DefaultTheme } from "styled-components";

const colors = {
	wanted: "#385AE9",
	wanted_sub1: "#5689F7",
	wanted_sub2: "#6BDDAA",
	udemy: "#983DE7",
	udemy_sub1: "#5027C8",
	udemy_sub2: "#F2EEFE",
	udemy_sub3: "#B454F6",
	box: "#F7F9FA",
	stroke: "#B7B7B7",
	text_sub: "#989898",
	title_line: "#C9BDF3",
};

// const fontSize = {
// 	title: 20,
// 	subTitle: 16,
// 	text: 14,
// };

export type ColorsTypes = typeof colors;
// export type FontSizeTypes = typeof fontSize;

const theme: DefaultTheme = {
	colors,
	// fontSize,
};

export default theme;

import React from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import ButtonBackground from "@assets/images/button.svg";

const isMobile = function () {
    const match = window.matchMedia("(pointer:coarse)");
    return match && match.matches;
};

const ColorButtonBlock = (props: { navigation: string; comment: string }) => {
    const navigate = useNavigate();
    return (
        <ClolorButton
            src={ButtonBackground}
            onClick={() => {
                navigate(`/${props.navigation}`);
            }}
        >
            {props.comment}
        </ClolorButton>
    );
};

export default ColorButtonBlock;
interface CardType {
    src: string;
}

const ClolorButton = styled.button<CardType>`
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
    cursor: pointer;
`;

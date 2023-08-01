import React from "react";
import styled from "styled-components";
import Skillink from "@assets/images/logo.svg";
import Muffin from "@assets/images/Muffin.svg";

const isMobile = function () {
    const match = window.matchMedia("(pointer:coarse)");
    return match && match.matches;
};

const FooterBlock = () => {
    return (
        <FooterWrapper>
            <FooterItemWrapper src={"start"}>
                <Logo>SKILLINK</Logo>
                <img src={Skillink} height="18rem" alt="" />
            </FooterItemWrapper>
            <Line />
            <FooterItemWrapper src={"end"}>
                ⓒ 2023- Skillink. All Rights Reserved.
                <br />
                Prod By Muffin.
            </FooterItemWrapper>
            <MuffinBox>
                <img src={Muffin} height="25rem" alt="" />
            </MuffinBox>
        </FooterWrapper>
    );
};

export default FooterBlock;

interface CardType {
    src: string;
}

const Logo = styled.span`
    font-size: ${isMobile() ? "25rem" : "45rem"};
    color: ${(props) => props.theme.colors.udemy};
    font-family: "UbuntuCondensed";
    margin-right: 3rem;
`;

const FooterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 100rem;
    /* margin-bottom: 50rem; */
`;

const Line = styled.div`
    width: 80%;
    height: 1rem;
    background-color: ${(props) => props.theme.colors.stroke};
    margin-top: 5rem;
    margin-bottom: 5rem;
`;

const FooterItemWrapper = styled.div<CardType>`
    display: flex;
    width: 80%;
    flex-direction: row;
    align-items: center;
    justify-content: ${(props) => props.src};
    font-size: ${isMobile() ? "13rem" : "20rem"};
    font-family: "Pretendard-regular";
    color: ${(props) => props.theme.colors.stroke};
    text-align: end;
`;

const MuffinBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100rem;
`;

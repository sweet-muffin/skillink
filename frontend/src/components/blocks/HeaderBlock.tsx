import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const isMobile = function () {
    const match = window.matchMedia("(pointer:coarse)");
    return match && match.matches;
};

const HeaderBlock = () => {
    const navigate = useNavigate();
    return (
        <LogoBox>
            <Logo onClick={() => navigate("/")}>SKILLINK</Logo>
        </LogoBox>
    );
};

export default HeaderBlock;

const LogoBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    padding: 15rem;
    border-bottom: 1rem solid ${(props) => props.theme.colors.title_line};
`;

const Logo = styled.span`
    font-size: ${isMobile() ? "30rem" : "35rem"};

    color: ${(props) => props.theme.colors.udemy};
    font-family: "UbuntuCondensed";
    cursor: pointer;
`;

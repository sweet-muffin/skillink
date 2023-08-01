import React from "react";
import "./Spinner.css";
import styled from "styled-components";

const Spinner = () => {
    return (
        <SpinnerBackground>
            {/* <div className="sk-chase" style={{ marginTop: "20rem" }}>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
            </div> */}
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </SpinnerBackground>
    );
};

export default Spinner;

const SpinnerBackground = styled.div`
    position: fixed;
    background: white;
    width: 100vw;
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

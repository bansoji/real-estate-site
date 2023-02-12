// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../themes/default';

const spin = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    opacity: ${({ show }) => (show ? '100%' : 0)};
    transition: opacity 500ms ease-in-out;
    pointer-events: none;
    background-color: ${theme.colors.background};
`;

const Spinner = styled.div`
    border: 7px solid #f3f3f3; /* Light grey */
    border-top: 7px solid ${(props) => props.theme.colors.accent};
    border-radius: 50%;
    width: 70px;
    height: 70px;
    animation: ${spin} 1s linear infinite;
    pointer-events: none;
`;

const ldsEllipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
  `;

const ldsEllipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
  `;

const ldsEllipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
  `;

const Dots = styled.div`
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;

    div {
        position: absolute;
        top: 33px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: ${theme.colors.accent};
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    div:nth-child(1) {
        left: 8px;
        animation: ${ldsEllipsis1} 0.6s infinite;
    }

    div:nth-child(2) {
        left: 8px;
        animation: ${ldsEllipsis2} 0.6s infinite;
    }

    div:nth-child(3) {
        left: 32px;
        animation: ${ldsEllipsis2} 0.6s infinite;
    }

    div:nth-child(4) {
        left: 56px;
        animation: ${ldsEllipsis3} 0.6s infinite;
    }
`;

function Loader({ show, style, dots = true }) {
    return (
        <LoaderContainer show={show} style={style}>
            {dots ? (
                <Dots>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </Dots>
            ) : (
                <Spinner />
            )}
        </LoaderContainer>
    );
}

export default Loader;

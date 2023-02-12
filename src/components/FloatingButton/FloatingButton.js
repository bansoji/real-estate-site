// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

const accentColor = (props) => props.theme.colors.darkGrey;
const accentHoverColor = (props) => props.theme.colors.accentHover;

const StyledButton = styled.button`
    min-height: 50px;
    min-width: 50px;
    background: ${accentColor};
    border-radius: 40px;
    border: 0;
    font-family: ${(props) => props.theme.fonts.header};
    font-size: 25px;
    color: white;
    outline: 0;
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 0;
    transition: background-color 200ms ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0 3px 0;
    z-index: 6;
    cursor: pointer;

    &:hover {
        background: ${accentHoverColor};
    }
`;

const TooltipText = styled.p`
    font-family: ${({ theme }) => theme.fonts.default};
    margin: 0;
`;

function Button({ clickHandler, popupShowing, children, tooltip }) {
    return (
        <React.Fragment>
            <StyledButton
                data-tip
                data-for="historyBtn"
                onClick={clickHandler}
                popupShowing={popupShowing}
            >
                {children}
            </StyledButton>
            <ReactTooltip id="historyBtn" place="left" effect="solid" type="dark">
                {' '}
                <TooltipText>{tooltip}</TooltipText>{' '}
            </ReactTooltip>
        </React.Fragment>
    );
}

export default Button;

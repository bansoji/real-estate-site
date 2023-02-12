// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';

const StyledButton = styled.button`
    position: relative;
    min-width: ${(props) => (props.width ? props.width : '100px')};
    width: auto;
    height: 2.7rem;
    background-color: white;
    border: solid 1px ${theme.colors.darkGrey};
    // box-shadow: 0px 2px ${theme.colors.darkGrey};
    border-radius: 5px;
    text-align: left;
    padding: 5px 10px;

    color: ${theme.colors.textGrey};
    font-size: 0.9rem;
    font-weight: bold;

    cursor: pointer;

    transition: all 200ms;

    &:active {
        background-color: ${theme.colors.grey};
    }

    @media only screen and (min-width: 1000px) {
        &:hover {
            background-color: ${theme.colors.grey};
        }
    }
`;

function StyledButton1({ width, children, onClick, style, justifyContent = 'center' }) {
    return (
        <StyledButton width={width} onClick={() => onClick()} style={style}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: justifyContent,
                }}
            >
                {children}
            </div>
        </StyledButton>
    );
}

export default StyledButton1;

// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';

const StyledLink = styled.a`
    height: 45px;
    width: auto;
    margin: 0 5px;
    border-radius: 5px;
    border: none;
    background: none;
    font-family: ${theme.fonts.default};
    font-size: 0.9rem;
    font-weight: bold;
    background-color: ${theme.colors.accent};
    // box-shadow: 0px 3px ${theme.colors.accentDark};
    color: white;
    white-space: nowrap;
    padding: 0 10px 0 10px;
    transition: background-color 200ms ease-in-out;
    line-height: 45px;

    &:hover {
        background-color: ${theme.colors.accentHover};
    }

    @media only screen and (max-width: 500px) {
        font-size: 0.9rem;
    }
`;

const Button = styled.button`
    min-height: 45px;
    height: 45px;
    width: auto;
    margin: 0 5px;
    border-radius: 5px;
    border: none;
    background: none;
    font-family: ${theme.fonts.default};
    font-size: 0.9rem;
    font-weight: bold;
    background-color: ${theme.colors.accent};
    // box-shadow: 0px 3px ${theme.colors.accentDark};
    color: white;
    white-space: nowrap;
    padding: 0 10px 0 10px;
    transition: background-color 200ms ease-in-out;
    cursor: pointer;

    &:hover {
        background-color: ${theme.colors.accentHover};
    }

    @media only screen and (max-width: 500px) {
        font-size: 0.9rem;
    }

    div {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

function StyledButton(props) {
    return (
        <>
            {props.buttonType ? (
                <Button onClick={props.onClick} style={props.style} id={props.id}>
                    {props.children}
                </Button>
            ) : (
                <StyledLink
                    target={props.target}
                    rel={props.rel}
                    style={props.style}
                    href={props.href}
                    useDark={props.useDark}
                >
                    {props.children}
                </StyledLink>
            )}
        </>
    );
}

export default StyledButton;

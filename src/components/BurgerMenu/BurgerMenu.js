// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled from 'styled-components';
import Navigation from '../Navigation/Navigation';
import theme from '../../themes/default';

const StyledBurger = styled.div`
    display: none;
    width: 1.5rem;
    height: 1.5rem;
    padding-right: 20px;
    z-index: 20;

    @media (max-width: 1000px) {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
    }

    div {
        width: 1.5rem;
        height: 0.2rem;
        background-color: ${({ isOpen }) => (isOpen ? 'grey' : theme.colors.textGrey)};
        border-radius: 5px;
        transform-origin: 1px;
        transition: all 100ms linear;
        &:nth-child(1) {
            transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg)' : 'rotate(0)')};
        }
        &:nth-child(2) {
            opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
        }
        &:nth-child(3) {
            transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
        }
    }
`;

const BurgerMenu = ({ windowWidth, setBurgerMenuOpen, isOpen }) => {
    return (
        <React.Fragment>
            <StyledBurger
                isOpen={isOpen}
                onClick={() => {
                    setBurgerMenuOpen(!isOpen);
                }}
            >
                <div />
                <div />
                <div />
            </StyledBurger>
            <Navigation
                show={isOpen}
                windowWidth={windowWidth}
                onItemSelected={() => {
                    setBurgerMenuOpen(false);
                }}
            />
        </React.Fragment>
    );
};
export default BurgerMenu;

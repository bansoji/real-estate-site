// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import theme from '../../themes/default';
import { MdHistory, MdHelpOutline } from 'react-icons/md';

const NavigationBar = styled.div`
    display: flex;
    flex-direction: row;
    height: 40px;
    background-color: white;
    justify-items: center;
    justify-content: center;
    align-items: center;
    padding-right: 25px;

    @media only screen and (max-width: 1000px) {
        padding-right: 10px;
    }
`;

const NavigationBarItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.5rem;
    width: 50px;
    cursor: pointer;
    border: none;
    color: ${theme.colors.textGrey};
    font-family: ${theme.fonts.header};
    border-bottom: ${({ selected }) => (selected ? 'solid 3px red' : 0)};
    white-space: nowrap;
    margin: 0 7px;

    span {
        font-size: 0.7rem;
        font-weight: bold;
        font-family: ${theme.fonts.header};
    }

    @media only screen and (min-width: 1000px) {
        &:hover {
            border-bottom: solid 2px ${theme.colors.textGrey};
            padding-top: 2px;
        }

        &:active {
            background-color: ${theme.colors.grey};
        }
    }

    @media only screen and (max-width: 1000px) {
        // border-bottom: 2px solid ${theme.colors.grey};
        // width: 100%;
        font-size: 1rem;
        font-weight: bold;
        height: 3rem;
    }
`;

const Items = ({ onItemSelected }) => {
    return (
        <React.Fragment>
            <Link to="/history" style={{ width: '100%' }} onClick={() => onItemSelected()}>
                <NavigationBarItem>
                    <MdHistory size="24" />
                    <span>検索履歴</span>
                </NavigationBarItem>
            </Link>
            <Link to="/about" style={{ width: '100%' }} onClick={() => onItemSelected()}>
                <NavigationBarItem>
                    <MdHelpOutline size="24" />
                    <span>xxxxとは</span>
                </NavigationBarItem>
            </Link>
        </React.Fragment>
    );
};

function Navigation({ onItemSelected }) {
    return (
        <React.Fragment>
            <NavigationBar>
                <Items onItemSelected={onItemSelected} />
            </NavigationBar>
        </React.Fragment>
    );
}

export default Navigation;

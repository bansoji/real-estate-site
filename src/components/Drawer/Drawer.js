// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled from 'styled-components';

const SideDrawer = styled.div`
    width: 50%;
    min-width: 300px;
    max-width: 100%;
    position: fixed;
    height: 100%;
    right: 0;
    background-color: white;
    transform: translateX(${({ show }) => (show ? 0 : '100%')});
    transition: transform 0.3s ease-out;
    z-index: 5;

    @media only screen and (max-width: 1000px) {
        width: 100%;
    }
`;

function Drawer(props) {
    return <SideDrawer show={props.show}>{props.children}</SideDrawer>;
}

export default Drawer;

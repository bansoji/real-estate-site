// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    pointer-events: ${({ catchEvents }) => (catchEvents ? 'auto' : 'none')};
    background-color: black;
    opacity: ${({ catchEvents }) => (catchEvents ? '0.2' : 0)};
    z-index: ${({ zIndex }) => zIndex};
`;

function Backdrop({ show, backdropHandler, zIndex }) {
    return <Container catchEvents={show} onClick={() => backdropHandler()} zIndex={zIndex} />;
}

export default Backdrop;

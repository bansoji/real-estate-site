// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled from 'styled-components';

const SlideInWrapper = styled.div`
    // overflow: ${props => props.show ? 'auto' : 'hidden'};
    // visibility: ${props => props.show ? 'visible' : 'hidden'};
    // opacity: ${props => props.show ? '1' : '0'};
    transform: ${props => props.show ? 'translateY(0)' : 'translateY(100%)'};
    width: 100%;
    height: 100%;
    z-index: ${props => props.zIndex ? props.zIndex : 'auto'};
    position: absolute;

    transition: all 400ms ease-in-out;
`;

function SlideIn({show, children, zIndex}) {
    return <SlideInWrapper show={show} zIndex={zIndex}>{children}</SlideInWrapper>;
}

export default SlideIn;

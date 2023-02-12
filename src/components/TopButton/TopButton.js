// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import { FaArrowUp } from 'react-icons/fa';
import { animateScroll as scroll } from 'react-scroll';

const backToTop = () => {
    scroll.scrollToTop({ behavior: 'smooth' });
};

function TopButton() {
    return (
        <FloatingButton clickHandler={backToTop} tooltip="トップ">
            <FaArrowUp />
        </FloatingButton>
    );
}

export default TopButton;

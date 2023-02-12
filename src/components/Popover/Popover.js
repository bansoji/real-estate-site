// Copyright 2021, Banson Tong, All rights reserved

import React, { useRef } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';
import { Link } from 'react-router-dom';

import { FaHammer } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsArrowRight } from 'react-icons/bs';

import { ServiceHeader, ServiceTextTop, ServiceTextBottom } from '../../strings/Service';
import { TrainLinesHeader, TrainLinesText } from '../../strings/TrainLines';
import { TermsAndConditionsHeader, TermsAndConditionsText } from '../../strings/TermsAndConditions';
import { InstructionsHeader, InstructionsText } from '../../strings/Instructions';
import { PrivatePolicyHeader, PrivatePolicyText } from '../../strings/PrivatePolicy';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    z-index: 20;
`;

const StyledPopover = styled.div`
    background-color: white;
    width: 50vw;
    min-width: 350px;
    max-height: ${({ halfSize }) => (halfSize ? '25vh' : '70vh')};
    opacity: ${({ showPopup }) => (showPopup ? 100 : 0)};
    transition: opacity 200ms ease-in-out;
    pointer-events: ${({ showPopup }) => (showPopup ? 'auto' : 'none')};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 3vh 0;
    border-radius: 10px;
    flex-stretch: 0;
`;

const StyledContent = styled.pre`
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: pre-line;
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */

    margin: 5% 0;
    overflow-y: scroll;
    height: 70%;
    width: 85%;
    min-width: 300px;

    font-family: ${theme.fonts.default}
    font-size: 20px;
`;

const StyledText = styled.p`
    font-family: ${theme.fonts.default};
    font-weight: normal;
    font-size: 20px;
    margin: 0;
`;

const StyledHeader = styled.p`
    font-family: ${theme.fonts.default};
    font-size: 24px;
    font-weight: bold;

    margin-top: 0px;
    margin-bottom: 0px;
`;

const StyledButton = styled.button`
    height: 50px;
    min-height: 50px;
    width: 50px;
    appearance: none;
    border: 0;
    background: none;
`;

const StyledSubheader = styled.p`
    font-size: 16px;
`;

function Popover({ show, type, setShowPopover }) {
    const contentRef = useRef(null);
    if (show) {
        if (contentRef.current !== null) contentRef.current.scrollTop = 0; // scroll back to top
    }

    return (
        <Container catchEvents={show}>
            {type === 'construction' ? (
                <StyledPopover showPopup={show} halfSize={true}>
                    <FaHammer size="40" style={{ marginBottom: '20px' }} />
                    <StyledText>このページはまだ準備中です。</StyledText>
                    <Link to="/about">
                        <div
                            onClick={() => setShowPopover(false)}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                color: theme.colors.accent,
                            }}
                        >
                            <StyledText style={{ fontSize: '16px' }}>詳細</StyledText>
                            <BsArrowRight size="30" />
                        </div>
                    </Link>
                </StyledPopover>
            ) : (
                <StyledPopover showPopup={show} halfSize={false}>
                    <StyledHeader>
                        {type === 'service' ? ServiceHeader : ''}
                        {type === 'trainLines' ? TrainLinesHeader : ''}
                        {type === 'tnc' ? TermsAndConditionsHeader : ''}
                        {type === 'instructions' ? InstructionsHeader : ''}
                        {type === 'privacy' ? PrivatePolicyHeader : ''}
                    </StyledHeader>
                    <StyledContent ref={contentRef}>
                        {type === 'service' ? (
                            <React.Fragment>
                                <StyledSubheader>サービス概要</StyledSubheader>
                                <p>･　xxxxは？</p>
                                {ServiceTextTop}
                                <br></br>
                                <hr></hr>
                                <StyledSubheader>利用方法</StyledSubheader>
                                <p>･　利用するには？</p>
                                {ServiceTextBottom}
                            </React.Fragment>
                        ) : (
                            ''
                        )}
                        {type === 'trainLines' ? TrainLinesText : ''}
                        {type === 'tnc' ? TermsAndConditionsText : ''}
                        {type === 'instructions' ? InstructionsText : ''}
                        {type === 'privacy' ? PrivatePolicyText : ''}
                    </StyledContent>
                    <StyledButton>
                        <AiOutlineCloseCircle
                            size="40"
                            color="grey"
                            onClick={() => setShowPopover(false)}
                        />
                    </StyledButton>
                </StyledPopover>
            )}
        </Container>
    );
}

export default Popover;

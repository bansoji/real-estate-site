// Copyright 2021, Banson Tong, All rights reserved

import React, { useLayoutEffect, useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import theme from './themes/default';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { BsTools } from 'react-icons/bs';
import { FaTwitter } from 'react-icons/fa';
import Popover from './components/Popover/Popover';
import Backdrop from './components/Drawer/Backdrop';
import Navigation from './components/Navigation/Navigation';

import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import AssessPage from './pages/AssessPage/AssessPage';
import MapSearchPage from './pages/MapSearchPage/MapSearchPage';

import logo from './images/Logo.svg';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import PropertyPage from './pages/PropertyPage/PropertyPage';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        min-width: 320px;
        background-color: ${theme.colors.background};
        overflow-x: hidden;
        overflow-y: ${({ lockScroll }) => (lockScroll ? 'hidden' : 'auto')};
        -webkit-tap-highlight-color:transparent;
    }
    a {
        text-decoration: none;
    }
`;

const Container = styled.main`
    height: 100%;
    width: 100%;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: center;
    top: 0;
    background-color: white;
    height: 60px;
    width: 100%;
    z-index: 20;
`;

const Subtitle = styled.p`
    color: ${theme.colors.textGrey};
    font-family: ${theme.fonts.header};
    font-size: 0.9rem;
    line-height: 0.9rem;
    margin: 0;

    visibility: ${({ show }) => (show ? 'visible' : 'hidden')};

    @media only screen and (max-width: 1000px) {
        font-size: 0.8rem;
    }
`;

const Logo = styled.img.attrs({
    src: logo,
})`
    height: 3vh;
    min-height: 40px;
    max-height: 50px;
    width: auto;
    margin-left: 20px;
    margin-right: 20px;

    @media only screen and (max-width: 500px) {
        height: 5vh;
        margin-left: 10px;
    }
`;

const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Footer = styled.footer`
    display: flex;
    flex-direction: column;
    padding: 50px;
    align-content: center;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.background};
    color: grey;
    font-family: ${theme.fonts.header};
    font-size: 0.8rem;
    font-weight: 300;
    justify-items: center;
    overflow: hidden;

    @media only screen and (max-width: 1000px) {
        height: auto;
        flex-direction: column;
        padding: 10px;
    }

    a {
        color: grey;
        margin: 5px 10px;
    }

    button {
        font-size: 0.8rem;
        color: grey;
        margin: 5px 10px;
    }

    span {
        margin: 5px 10px;
    }
`;

const Links = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 20px 15px;

    button {
        cursor: pointer;
        border: 0;
        background-color: transparent;
        font-family: ${theme.fonts.header};
        font-weight: 300;
    }

    @media only screen and (max-width: 1000px) {
        grid-template-columns: 1fr 1fr;
    }
`;

const FooterEnd = styled.div`
    display: flex;
    margin: 10px 0;
`;

const StyledUnderlineOnHover = styled.div`
    text-align: center;

    @media only screen and (min-width: 1000px) {
        display: flex;
        align-items: center;
        font-weight: normal;
        justify-content: center;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const onMaintenance = false;

const Maintenance = styled.div`
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 10%;
    color: ${theme.colors.textGrey};
`;

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

function App() {
    const [showPopover, setShowPopover] = useState(false);
    const [popoverType, setPopoverType] = useState('');
    const width = useWindowSize()[0];
    const height = useWindowSize()[1];
    const [lockScroll, setLockScroll] = useState(false);
    const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [showFooter, setShowFooter] = useState(true);

    useEffect(() => setLockScroll(burgerMenuOpen), [burgerMenuOpen]);

    useEffect(() => {
        if (width > 1000 && burgerMenuOpen) {
            setBurgerMenuOpen(false);
        }
    }, [width, burgerMenuOpen]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle lockScroll={lockScroll} />
            <Router>
                <Backdrop
                    show={showPopover}
                    zIndex={11}
                    backdropHandler={() => {
                        setShowPopover(false);
                    }}
                />
                <Popover
                    show={showPopover}
                    type={popoverType}
                    setShowPopover={(t) => setShowPopover(t)}
                />
                {showHeader && (
                    <Header>
                        <LogoWrapper>
                            <Link to="/" onClick={() => setBurgerMenuOpen(false)}>
                                <Logo />
                            </Link>
                            {width > 500 ? (
                                <Subtitle show={true}>借りて得する物件探し！</Subtitle>
                            ) : (
                                ''
                            )}
                        </LogoWrapper>
                        <Navigation
                            onItemSelected={() => {
                                setBurgerMenuOpen(false);
                            }}
                        />
                    </Header>
                )}

                <Container showHeader={showHeader}>
                    {!onMaintenance ? (
                        <Switch>
                            <Route
                                path="/"
                                exact
                                children={<HomePage width={width} height={height} />}
                            />
                            <Route path="/about" children={<AboutPage />} />
                            <Route
                                path="/map"
                                children={
                                    <MapSearchPage
                                        width={width}
                                        height={height - 60}
                                        showHeader={(t) => setShowHeader(t)}
                                        showFooter={(t) => setShowFooter(t)}
                                    />
                                }
                            />
                            <Route path="/assess" children={<AssessPage width={width} />} />
                            <Route path="/history" children={<HistoryPage width={width} />} />
                            <Route path="/bukken" children={<PropertyPage width={width} />} />
                        </Switch>
                    ) : (
                        <Switch>
                            <Route path="/about" children={<AboutPage />} />
                            <Route
                                path="/"
                                children={
                                    <Maintenance>
                                        <BsTools size="100" color={theme.colors.darkGrey} />
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '1.3rem',
                                                margin: '1rem 0',
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            ただいまメンテナンス中です。
                                        </span>
                                        <span>
                                            ただいまメンテナンスのため一時サービスを停止しております。
                                            <br />
                                            大変ご不便をおかけいたしますが、今しばらくお待ちください。
                                        </span>
                                    </Maintenance>
                                }
                            />
                        </Switch>
                    )}

                    {showFooter && (
                        <Footer>
                            <Links>
                                <button
                                    onClick={() => {
                                        setShowPopover(true);
                                        setPopoverType('privacy');
                                    }}
                                >
                                    <StyledUnderlineOnHover>
                                        プライバシーポリシー
                                    </StyledUnderlineOnHover>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPopover(true);
                                        setPopoverType('tnc');
                                    }}
                                >
                                    <StyledUnderlineOnHover>利用規約</StyledUnderlineOnHover>
                                </button>
                                <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
                                    <StyledUnderlineOnHover>xxxxとは</StyledUnderlineOnHover>
                                </Link>
                                <a href="mailto:karitokuhouse@gmail.com">
                                    <StyledUnderlineOnHover>お問い合わせ</StyledUnderlineOnHover>
                                </a>
                            </Links>
                            <FooterEnd>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href=""
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: '100%',
                                        }}
                                    >
                                        <FaTwitter size="20" />
                                    </div>
                                </a>
                                <span>©xxxx</span>
                                <a
                                    style={{}}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href=""
                                >
                                    <StyledUnderlineOnHover>
                                        Powered by xxxx
                                    </StyledUnderlineOnHover>
                                </a>
                            </FooterEnd>
                        </Footer>
                    )}
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;

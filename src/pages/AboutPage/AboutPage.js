// Copyright 2021, Banson Tong, All rights reserved

import React, { useLayoutEffect } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';

import TopButton from '../../components/TopButton/TopButton';
import cityImg from '../../images/about/city.jpg';
import bulletpoint from '../../images/CheckMark.svg';

const Wrapper = styled.div`
    min-height: 100vh;
    width: 100vw;
    display: flex;

    justify-content: center;

    @media only screen and (max-width: 1000px) {
        flex-direction: column;
    }
`;

const Panel = styled.div`
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    justify-content: space-evenly;
    padding: 20px;

    @media only screen and (max-width: 1000px) {
        flex-direction: ${({ reverse }) => (reverse ? 'column-reverse' : 'column')};
        padding: 10px 20px;
    }
`;

const AboutText = styled.div`
    font-family: ${theme.fonts.header};
    font-weight: 300;
    padding: 0;
    min-width: 650px;
    max-width: 650px;
    flex-basis: 0;

    @media only screen and (max-width: 1000px) {
        min-width: 300px;
        padding: 0;
        margin-left: 0;
        margin-right: 0;
    }
`;

const Header = styled.div`
    color: black;
    font-weight: bold;
    font-size: 2rem;
    margin-bottom: 20px;

    @media only screen and (max-width: 500px) {
        font-size: 1.4rem;
    }
`;

const List = styled.ul`
    list-style: outside;
    margin: 10px 0;
`;

const ListItem = styled.li`
    list-style-image: url(${bulletpoint});
    padding: 10px 10px;
`;

const Spacer = styled.div`
    height: 50px;
    width: 100%;

    @media only screen and (max-width: 500px) {
        height: 10px;
    }
`;

const Image = styled.img`
    width: 450px;
    height: 100%;
    margin: auto 20px;
    object-fit: cover;

    @media only screen and (max-width: 1000px) {
        width: 100%;
        height: 500px;
        margin: 0;
    }
`;

const TextContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

function AboutPage({ popoverCallback }) {
    useLayoutEffect(() => {
        window.scroll({ top: 0, left: 0 });
    }, []);
    return (
        <React.Fragment>
            <TopButton />
            <Wrapper>
                <Image src={cityImg} alt="city" />
                <TextContent>
                    <Panel>
                        <AboutText>
                            <Spacer />
                            <Header></Header>
                            <div>
                                <p>
                                </p>
                            </div>
                        </AboutText>
                    </Panel>
                    <Panel>
                        <AboutText>
                            <Header></Header>
                            <div>
                                <p></p>
                            </div>
                            <List>
                                <ListItem>
                                </ListItem>
                                <ListItem>
                                </ListItem>
                                <ListItem>
                                </ListItem>
                            </List>
                            <div>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                            </div>
                        </AboutText>
                    </Panel>

                    <Panel>
                        <AboutText>
                            <Header></Header>
                            <div>
                                <p>
                                </p>
                                <p>
                                </p>
                                <p>
                                </p>
                            </div>
                        </AboutText>
                    </Panel>

                    <Panel>
                        <AboutText>
                            <i>
                            </i>
                        </AboutText>
                    </Panel>
                </TextContent>
            </Wrapper>
        </React.Fragment>
    );
}

export default AboutPage;

// Copyright 2021, Banson Tong, All rights reserved

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import './Recommendations.css';
import StyledButton from '../../components/StyledButton/StyledButton';

const Container = styled.div`
    position: relative;
    width: 50vw;
    max-width: 50%;
    min-width: 300px;
    height: 500px;
    // border: solid 3px ${(props) => props.theme.colors.darkGrey};
    border-radius: 10px;
    padding: 10px;
    margin-top: 20px;
    background-color: white;
`;

const Item = styled.div`
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
`;

const ItemImage = styled.img`
    height: 250px;
    width: auto;
    max-width: 75%;
    // object-fit: contain;
    object-fit: cover;
    margin: 0 0 10px 0;
`;

const HeaderCell = styled.p`
    margin: 0;
    font-size: 16px;
    border-right: solid 1px ${(props) => props.theme.colors.darkGrey};
`;

const Cell = styled.p`
    margin: 0;
    font-size: 14px;
`;

const CarouselContainer = styled.div`
    opacity: ${({ show }) => (show ? '100%' : 0)};
    transition: opacity 500ms ease-in-out;
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    opacity: ${({ show }) => (show ? '100%' : 0)};
    transition: opacity 500ms ease-in-out;
    pointer-events: none;
`;

const Loader = styled.div`
    border: 10px solid #f3f3f3; /* Light grey */
    border-top: 10px solid ${(props) => props.theme.colors.accent};
    border-radius: 50%;
    width: 100px;
    height: 100px;
    animation: ${spin} 1s linear infinite;
    pointer-events: none;
`;

const DetailTable = styled.div`
    display: grid;
    grid-auto-flow: row;
    width: 75%;
    margin-bottom: 5px;
`;

const DetailTableRow = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 3fr;
    border-bottom: solid 1px ${(props) => props.theme.colors.darkGrey};
    align-items: center;
`;

function Recommendations({ recList, parser, isFetching, station }) {
    return (
        <Container>
            <CarouselContainer show={!isFetching}>
                <Carousel showThumbs={false} showStatus={false} infiniteLoop={true}>
                    {recList.length > 0 ? (
                        recList.map((item) => (
                            <Item key={item.name}>
                                <ItemImage src={item.image} />
                                <DetailTable>
                                    <DetailTableRow>
                                        <HeaderCell>家賃</HeaderCell>
                                        <Cell>¥{Math.round(item.set_rent).toLocaleString()}</Cell>
                                    </DetailTableRow>
                                    <DetailTableRow>
                                        <HeaderCell>差額</HeaderCell>
                                        <Cell>
                                            <font
                                                color={
                                                    item.est_rent - item.set_rent > 0
                                                        ? 'green'
                                                        : 'red'
                                                }
                                            >
                                                {item.est_rent - item.set_rent > 0 ? '-' : '+'}
                                                {Math.abs(
                                                    Math.round(item.set_rent - item.est_rent)
                                                ).toLocaleString()}
                                            </font>
                                        </Cell>
                                    </DetailTableRow>
                                    <DetailTableRow>
                                        <HeaderCell>駅名</HeaderCell>
                                        <Cell>{station}</Cell>
                                    </DetailTableRow>
                                    <DetailTableRow>
                                        <HeaderCell>距離</HeaderCell>
                                        <Cell>{item.minute}分</Cell>
                                    </DetailTableRow>
                                    <DetailTableRow style={{ borderBottom: 0 }}>
                                        <HeaderCell>広さ</HeaderCell>
                                        <Cell>{item.area} m²</Cell>
                                    </DetailTableRow>
                                </DetailTable>
                                <StyledButton
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={item.suumoLink}
                                >
                                    SUUMOで詳細を見る
                                </StyledButton>
                            </Item>
                        ))
                    ) : (
                        <Item>
                            <font color="grey">
                                <br />
                                <br />
                            </font>
                        </Item>
                    )}
                </Carousel>
            </CarouselContainer>
            <LoaderContainer show={isFetching}>
                <Loader />
            </LoaderContainer>
        </Container>
    );
}

export default Recommendations;

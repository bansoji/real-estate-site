// Copyright 2021, Banson Tong, All rights reserved

import React, { useState, useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';

import PropertyCard from '../../components/PropertyCard/PropertyCard';

import Placeholder from '../../images/home/255x200.png';
import StyledButton1 from '../../components/StyledButton/StyledButton1';
import Select from '../../components/Select/Select';
import { FaSortAmountDown } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useHistory } from 'react-router';

const Wrapper = styled.div`
    width: 100%;
    min-width: 300px;
    min-height: 100vh;
    font-family: ${theme.fonts.default};
`;

const Flex = styled.div`
    max-width: 700px;
    display: flex;
    flex-direction: column;
    margin: 0 calc((100% - 700px) / 2);

    @media only screen and (max-width: 1000px) {
        margin: 0 calc((100% - 500px) / 2);
    }

    @media only screen and (max-width: 500px) {
        margin: 0;
        max-width: auto;
    }
`;

const HistoryList = styled.div`
    display: flex;
    flex-direction: column;

    justify-items: center;
    justify-content: center;
    align-items: start;
    padding-bottom: 30px;

    a {
        color: ${theme.colors.textGrey};
    }
`;

const StyledFeatureHeader = styled.div`
    height: 50px;
    font-family: ${theme.fonts.default};
    font-weight: bold;
    font-size: 1.75rem;
    color: ${theme.colors.textGrey};
    display: flex;
    flex-direction: row;
    flex-stretch: 0;
    align-items: center;
    justify-content: ${({ spaceBetween }) => (spaceBetween ? 'space-between' : 'flex-start')};
    margin: 10px 0;

    @media only screen and (max-width: 500px) {
        width: 500px;
        flex-direction: ${({ rotateOn }) => (rotateOn ? 'column' : 'row')};
        align-items: ${({ rotateOn }) => (rotateOn ? 'flex-start' : 'center')};
        height: ${({ rotateOn }) => (rotateOn ? 'auto' : '50px')};
        margin: 10px auto 20px auto;
    }

    @media only screen and (max-width: 500px) {
        width: 95vw;
        font-size: 1.5rem;
    }
`;

const DeleteButton = styled.div`
    position: absolute;
    height: 2rem;
    width: 2rem;
    top: 0.5rem;
    right: 0.5rem;
    border-radius: 50%;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (min-width: 500px) {
        transition: all 500ms ease-in-out;
        &:hover {
            background-color: ${theme.colors.hoverGrey};
        }
    }
`;

const NoHistoryMsg = styled.span`
    margin: 50px auto;
    color: ${theme.colors.textGrey};

    @media only screen and (max-width: 1000px) {
        margin: 30vh auto;
    }
`;

const PropertyCardWrapper = styled.div`
    width: 100%;
    position: relative;
`;

//#region Sort constants

const SortOrder = {
    VIEWED: '閲覧順',
    PRICEDIFF: '割安順(円)',
    WORTH: '割安順(%)',
    PRICE: '安い順',
    AGE: '築年が新しい順',
    AREA: '面積の広い順',
    DISTANCE: '駅が近い順',
};

//#endregion

function HistoryPage({ width }) {
    const [viewedHistory, setViewedHistory] = useState([]);
    const history = useHistory();
    const historyKey = 'history';

    useLayoutEffect(() => {
        window.scroll({ top: 0, left: 0 });
    }, []);

    useEffect(() => {
        if (localStorage.getItem(historyKey) === null) {
            localStorage.setItem(historyKey, JSON.stringify([]));
        } else {
            setViewedHistory(
                JSON.parse(localStorage.getItem(historyKey))
                    .slice(0)
                    .sort((a, b) => b.id - a.id)
            );
        }
    }, []);

    const clearHistory = () => {
        localStorage.setItem(historyKey, JSON.stringify([]));
        setViewedHistory([]);
    };

    const deleteItem = (index) => {
        viewedHistory.splice(index, 1);
        setViewedHistory(viewedHistory.slice(0));
        localStorage.setItem(historyKey, JSON.stringify(viewedHistory));
    };

    //#region Sort

    const [sortOrder, setSortOrder] = useState(SortOrder.VIEWED);

    const handleSort = (i) => {
        switch (i) {
            case SortOrder.VIEWED:
                setViewedHistory(viewedHistory.slice(0).sort((a, b) => b.id - a.id));
                break;
            case SortOrder.PRICEDIFF:
                setViewedHistory(
                    viewedHistory
                        .slice(0)
                        .sort(
                            (a, b) =>
                                parseFloat(b.item.est_rent) -
                                parseFloat(b.item.set_rent) -
                                (parseFloat(a.item.est_rent) - parseFloat(a.item.set_rent))
                        )
                );
                break;
            case SortOrder.WORTH:
                setViewedHistory(
                    viewedHistory
                        .slice(0)
                        .sort(
                            (a, b) =>
                                parseFloat(b.item.cheap_ratio) - parseFloat(a.item.cheap_ratio)
                        )
                );
                break;
            case SortOrder.PRICE:
                setViewedHistory(
                    viewedHistory
                        .slice(0)
                        .sort((a, b) => parseFloat(a.item.set_rent) - parseFloat(b.item.set_rent))
                );
                break;
            case SortOrder.AGE:
                setViewedHistory(
                    viewedHistory
                        .slice(0)
                        .sort((a, b) => parseFloat(a.item.age) - parseFloat(b.item.age))
                );
                break;
            case SortOrder.AREA:
                setViewedHistory(
                    viewedHistory
                        .slice(0)
                        .sort((a, b) => parseFloat(b.item.area) - parseFloat(a.item.area))
                );
                break;
            case SortOrder.DISTANCE:
                setViewedHistory(
                    viewedHistory
                        .slice(0)
                        .sort((a, b) => parseFloat(a.item.minute) - parseFloat(b.item.minute))
                );
                break;
            default:
                break;
        }
        setSortOrder(i);
    };

    //#endregion

    return (
        <Wrapper>
            <Flex>
                <StyledFeatureHeader rotateOn spaceBetween>
                    <span style={{ lineHeight: '50px' }}>検索履歴</span>
                    <div style={{ display: 'flex', fontSize: '1rem' }}>
                        <Select
                            width="180px"
                            icon={
                                <FaSortAmountDown
                                    style={{
                                        marginRight: '10px',
                                        marginBottom: '2px',
                                        minWidth: '16px',
                                    }}
                                    color={theme.colors.accent}
                                />
                            }
                            label={'閲覧順'}
                            options={[
                                SortOrder.VIEWED,
                                SortOrder.PRICEDIFF,
                                SortOrder.WORTH,
                                SortOrder.PRICE,
                                SortOrder.AGE,
                                SortOrder.AREA,
                                SortOrder.DISTANCE,
                            ]}
                            onSelected={(i) => handleSort(i)}
                            selected={sortOrder}
                            borderOn
                            bold
                        />
                        <span style={{ width: '5px' }} />
                        <StyledButton1 onClick={() => clearHistory()}>履歴全削除</StyledButton1>
                    </div>
                </StyledFeatureHeader>
                <HistoryList rowLayout={true}>
                    {viewedHistory.length > 0 ? (
                        viewedHistory.map(({ item }, index) => (
                            <PropertyCardWrapper key={index}>
                                <DeleteButton onClick={() => deleteItem(index)}>
                                    <MdClose size="1.5rem" color="grey" />
                                </DeleteButton>
                                <PropertyCard
                                    onClick={() => {
                                        history.push('/bukken?id=' + item.bid);
                                    }}
                                    rowLayout={true}
                                    image={item.image === '' ? Placeholder : item.image}
                                    name={item.name}
                                    bid={item.bid}
                                    address={item.address}
                                    price={item.set_rent}
                                    estimatedPrice={item.est_rent}
                                    area={item.area}
                                    distance={item.minute}
                                    floor={item.floor}
                                    age={item.age}
                                    layout={item.layout}
                                    url={item.suumoLink}
                                    windowWidth={width}
                                    hideArrow
                                    onInvalidImage={() => deleteItem(index)}
                                />
                            </PropertyCardWrapper>
                        ))
                    ) : (
                        <NoHistoryMsg>現在履歴はありません</NoHistoryMsg>
                    )}
                </HistoryList>
            </Flex>
        </Wrapper>
    );
}

export default HistoryPage;

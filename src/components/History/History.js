// Copyright 2021, Banson Tong, All rights reserved

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import ReactTooltip from 'react-tooltip';

const Header = styled.header`
    position: sticky;
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-template-columns: repeat(3, 1fr);
    align-items: center;
    font-family: ${({ theme }) => theme.fonts.header};
    font-style: normal;
    font-weight: bold;
    font-size: 1.8rem;
    justify-content: space-between;
`;

const List = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: repeat(${({ size }) => size}, 50px);
    height: 85%;
    overflow: auto;
    font-family: ${({ theme }) => theme.fonts.default};
    font-style: normal;
    font-weight: normal;

    @media only screen and (max-height: 800px) {
        height 75%;
    }
`;

const HistoryItem = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: ${({ editMode }) => (editMode ? '5% 95%' : '0 100%')};
    align-items: center;

    a {
        color: ${theme.colors.textGrey};
    }
`;

const HistoryItemCells = styled.div`
    display: grid;
    grid-auto-flow: column;
    height: 100%;
    width: 100%;
    align-items: center;
    grid-template-columns: repeat(6, 1fr);
    transition: background-color 200ms ease-in-out;

    &:hover {
        background-color: ${({ header = false }) => (!header ? 'rgba(155,155,155,0.1)' : '')};
    }
`;

const EmptyHistoryItem = styled.div`
    display: flex;
    height: 70px;
    justify-content: center;
    align-items: center;
    color: grey;
`;

const HeaderCell = styled.div`
    text-align: center;
    padding: 10px 0 10px 0;
`;

const Cell = styled.div`
    text-align: center;
`;

const HistoryItemTitles = styled.div`
    font-family: ${({ theme }) => theme.fonts.default};
    font-style: normal;
    font-weight: 500;
    padding: 7px 0;
`;

const SideButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 40px;

    transition: background-color 200ms ease-in-out;

    &:hover {
        background-color: rgba(155, 155, 155, 0.1);
    }
`;

const Space = styled.div`
    width: 50px;
    height: 50px;
`;

const TooltipText = styled.p`
    font-family: ${({ theme }) => theme.fonts.default};
    margin: 0;
`;

const Checkbox = styled.input`
    visibility: ${({ editMode }) => (editMode ? 'visible' : 'hidden')};
`;

export const getClosestStation = (traffics) => {
    let lowest = Number.POSITIVE_INFINITY;
    let station;
    if (traffics) {
        for (let i = 0; i < traffics.length; i++) {
            if (traffics[i].minute < lowest) {
                lowest = traffics[i].minute;
                station = traffics[i].station;
            }
        }
    }
    return { station, lowest };
};

function History({ historyList, onDeleteClicked, parseDeviation }) {
    const [editMode, setEditMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [checkedStates, setCheckedStates] = useState(new Map());

    const handleChange = (event) => {
        let states = selectedItems.splice(0);
        if (event.target.checked) {
            if (!states.includes(event.target.value)) {
                states.push(event.target.value);
            }
        } else {
            if (states.includes(event.target.value)) {
                states.splice(selectedItems.indexOf(event.target.value), 1);
            }
        }
        setSelectedItems(states);
        setCheckedStates(checkedStates.set(event.target.value.toString(), event.target.checked));
    };

    const deleteSelected = () => {
        let remaindingList = historyList.filter((e) => !selectedItems.includes(e.id + ''));
        onDeleteClicked(remaindingList);
        setEditMode(false);
    };

    const selectAllCheckboxes = (e) => {
        let states = checkedStates;
        let selected = selectedItems.splice(0);
        for (let key of states.keys()) {
            states.set(key.toString(), e.target.checked);
            if (e.target.checked) {
                if (!selected.includes(key)) {
                    selected.push(key);
                }
            } else {
                if (selected.includes(key)) {
                    selected.splice(selectedItems.indexOf(key), 1);
                }
            }
        }
        setSelectedItems(selected);
        setCheckedStates(states);
    };

    useEffect(() => {
        let states = new Map();
        for (let i = 0; i < historyList.length; i++) {
            states.set(historyList[i].id.toString(), false);
        }
        setCheckedStates(states);
    }, [historyList, checkedStates.size]);

    return (
        <div style={{ padding: '0 10px 0 10px', height: '100%', color: theme.colors.textGrey }}>
            <Header>
                <Title>
                    <Space />
                    査定履歴
                    <SideButton
                        data-tip
                        data-for="deleteBtn"
                        onClick={() => (editMode ? deleteSelected() : setEditMode(true))}
                    >
                        {editMode ? <MdDelete size="25" /> : <MdModeEdit size="25" />}
                    </SideButton>
                    <ReactTooltip id="deleteBtn" place="left" effect="solid" type="dark">
                        {' '}
                        <TooltipText>{editMode ? '削除' : '編集'}</TooltipText>{' '}
                    </ReactTooltip>
                </Title>
                <HistoryItemTitles>
                    <HistoryItem
                        editMode={editMode}
                        style={{
                            backgroundColor: theme.colors.grey,
                            borderBottom: '1px solid black',
                        }}
                    >
                        <Checkbox
                            data-tip
                            data-for="selectAllBtn"
                            type="checkbox"
                            onChange={selectAllCheckboxes}
                            editMode={editMode}
                        />
                        <ReactTooltip id="selectAllBtn" place="left" effect="solid" type="dark">
                            {' '}
                            <TooltipText>すべてを選択</TooltipText>{' '}
                        </ReactTooltip>
                        <HistoryItemCells header={true}>
                            <HeaderCell>評価</HeaderCell>
                            <HeaderCell>家賃</HeaderCell>
                            <HeaderCell>差額</HeaderCell>
                            <HeaderCell>駅名</HeaderCell>
                            <HeaderCell>距離</HeaderCell>
                            <HeaderCell>広さ</HeaderCell>
                        </HistoryItemCells>
                    </HistoryItem>
                </HistoryItemTitles>
            </Header>
            <List size={historyList.length}>
                {historyList.length > 0 ? (
                    historyList
                        .slice(0)
                        .reverse()
                        .map(({ id, item }, index) => (
                            <HistoryItem key={index} editMode={editMode}>
                                <Checkbox
                                    type="checkbox"
                                    value={id}
                                    onChange={handleChange}
                                    editMode={editMode}
                                    checked={checkedStates.get(id.toString()) || false}
                                />
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={item.suumo_link}
                                    style={{ display: 'block', height: '100%' }}
                                >
                                    <HistoryItemCells>
                                        <Cell>{parseDeviation(item.deviation).score} / 5</Cell>
                                        <Cell>¥{Math.round(item.set_rent).toLocaleString()}</Cell>
                                        <Cell
                                            style={{
                                                color:
                                                    item.est_rent - item.set_rent > 0
                                                        ? 'green'
                                                        : 'red',
                                            }}
                                        >
                                            {item.est_rent - item.set_rent > 0 ? '-' : '+'}
                                            {Math.abs(
                                                Math.round(item.set_rent - item.est_rent)
                                            ).toLocaleString()}
                                        </Cell>
                                        <Cell>{getClosestStation(item.traffics).station}</Cell>
                                        <Cell>{getClosestStation(item.traffics).lowest} 分</Cell>
                                        <Cell>{item.area} m²</Cell>
                                    </HistoryItemCells>
                                </a>
                            </HistoryItem>
                        ))
                ) : (
                    <EmptyHistoryItem>分析した物件がありません</EmptyHistoryItem>
                )}
            </List>
        </div>
    );
}

export default History;

// Copyright 2021, Banson Tong, All rights reserved

import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';

import { FiChevronDown } from 'react-icons/fi';

const SelectWrapper = styled.div`
    position: relative;
    width: ${({ width }) => (width ? width : '154px')};
`;

const StyledSelect = styled.select`
    width: ${({ width }) => (width ? width : '154px')};
    height: 2.7rem;
    min-height: 2.7rem;
    background-color: white;
    // border: ${({ borderOff }) => (borderOff ? 'none' : 'solid 1px ' + theme.colors.darkGrey)};
    // box-shadow: ${({ borderOff }) => (borderOff ? 'none' : '0px 2px ' + theme.colors.darkGrey)};
    border-radius: 5px;
    text-align: left;
    padding-left: ${({ icon }) => (icon ? '30px' : '10px')};
    padding-right: 30px;
    outline: 0;
    text-overflow: ellipsis;
    border: solid 1px ${theme.colors.darkGrey};

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    color: ${theme.colors.textGrey};
    font-size: 0.9rem;
    font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};

    @media only screen and (max-width: 1000px) {
        font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
        font-size: 0.9rem;
        border: ${({borderOn}) => borderOn ? 'solid 1px ' + theme.colors.darkGrey : 0};
    }
`;

const SelectButton = styled.button`
    position: relative;
    width: 100%;
    height: 2.7rem;
    background-color: white;
    border: solid 1px ${theme.colors.darkGrey};
    // box-shadow: 0px 2px ${theme.colors.darkGrey};
    border-radius: 5px;
    text-align: left;
    padding: 5px 10px;

    color: ${theme.colors.textGrey};
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 200ms;

    @media only screen and (max-width: 1000px) {
        font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
        font-size: 1rem;
    }

    @media only screen and (min-width: 1000px) {
        &:hover {
            background-color: ${theme.colors.grey};
        }
    }
`;

const SelectDropdown = styled.div`
    position: absolute;
    background-color: white;
    top: 2.9rem;
    height: auto;
    max-height: 300px;
    width: auto;
    display: flex;
    flex-direction: column;
    border: solid 1px ${theme.colors.darkGrey};
    border-radius: 5px;
    overflow-y: ${({ enableScroll }) => (enableScroll ? 'auto' : 'visible')};
    z-index: 5;
`;

const SelectOption = styled.button`
    height: 2.3rem;
    width: ${({ width }) => (width ? width : '150px')};
    border: none;
    background-color: transparent;
    border-radius: 5px;
    text-align: left;
    padding: 5px 10px;

    color: ${theme.colors.textGrey};
    font-size: 0.9rem;

    transition: all 200ms;

    &:hover {
        background-color: ${theme.colors.grey};
    }
`;

const IconPositioner = styled.div`
    position: absolute;
    top: 0.85rem;
    left: 10px;
    color: ${theme.colors.textGrey};
    pointer-events: none;
`;

function Select({
    label,
    options,
    onSelected,
    children,
    width,
    borderOff,
    borderOn,
    selected,
    icon,
    enableScroll,
    bold,
}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [currentOption, setCurrentOption] = useState('');
    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        if (options && currentOption === '') {
            setCurrentOption(options[0]);
        }
        if (options && selected) {
            setCurrentOption(selected);
        }
        if (options && options.length > 0 && currentOption !== options[0]) {
            setTitle(currentOption);
        } else {
            setTitle(label);
        }
    }, [options, label, currentOption, selected]);

    const handleSelected = (option) => {
        setCurrentOption(option);
        setOpen(false);
        onSelected(option);
    };

    if (window.innerWidth <= 10000 && options) {
        return (
            <SelectWrapper width={width}>
                <IconPositioner>{icon && icon}</IconPositioner>
                <StyledSelect
                    onChange={(e) => handleSelected(e.target.value)}
                    icon={icon}
                    width={width}
                    borderOff={borderOff}
                    borderOn={borderOn}
                    value={selected}
                    bold={bold}
                >
                    {options.map((option, index) => (
                        <option
                            key={index}
                            value={option}
                            label={
                                option === '安い順'
                                    ? selected === '安い順'
                                        ? option
                                        : '安い順(賃料+管理費)'
                                    : null
                            }
                        >
                            {option === '安い順' ? '安い順(賃料+管理費)' : option}
                        </option>
                    ))}
                </StyledSelect>
                <FiChevronDown
                    size="22"
                    style={{
                        position: 'absolute',
                        right: '5px',
                        top: '0',
                        bottom: '0',
                        margin: 'auto',
                        backgroundColor: 'white',
                        color: theme.colors.accent,
                        pointerEvents: 'none',
                    }}
                />
            </SelectWrapper>
        );
    } else {
        return (
            <SelectWrapper ref={wrapperRef} width={width}>
                <SelectButton onClick={() => setOpen(!open)} bold={bold}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            paddingRight: '20px',
                        }}
                    >
                        {icon && icon}
                        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{title}</div>
                    </div>
                    <FiChevronDown
                        size="22"
                        style={{
                            position: 'absolute',
                            right: '5px',
                            top: '0',
                            bottom: '0',
                            margin: 'auto',
                            color: theme.colors.accent,
                        }}
                    />
                </SelectButton>
                {open && (
                    <SelectDropdown enableScroll={(options ? true : false) || enableScroll}>
                        {options &&
                            options.map((option, index) => (
                                <SelectOption
                                    width={
                                        width ? parseInt(width.replace('px', '')) - 4 + 'px' : null
                                    }
                                    key={index}
                                    onClick={() => handleSelected(option)}
                                >
                                    {option === '安い順' ? '安い順(賃料+管理費)' : option}
                                </SelectOption>
                            ))}
                        {!options && children}
                    </SelectDropdown>
                )}
            </SelectWrapper>
        );
    }
}

export default Select;

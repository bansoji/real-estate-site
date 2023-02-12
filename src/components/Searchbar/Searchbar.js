// Copyright 2021, Banson Tong, All rights reserved

import React, { useState, useEffect, useRef, useCallback } from 'react';
import theme from '../../themes/default';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { MdClose, MdHistory } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

const suumoUrl = 'https://suumo.jp';

const Wrapper = styled.div`
    text-align: ${({ iconMode }) => (iconMode ? 'right' : 'middle')};
    width: 90%;

    @media only screen and (max-width: 500px) {
        width: 100%;
    }
`;

const Container = styled.form`
    display: flex;
    position: relative;
    width: 100%;
    max-width: 600px;
    min-width: 150px;
    height: 3rem;
    margin-left: auto;
    margin-right: auto;
    visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
    opacity: ${({ show }) => (show ? '1' : '0')};

    transition: opacity 200ms ease-in-out;

    @media only screen and (max-width: 500px) {
        width: ${(props) => (props.supportMobile ? '100%' : '80%')};
    }
`;

const SearchInput = styled.input.attrs({
    type: 'text',
})`
    box-sizing: border-box;
    width: 93%;
    height: 3rem;
    line-height: 30px;
    border-radius: ${({ showUnderline }) => (showUnderline ? '0' : '5px 0 0 5px')};
    margin-right: -2px;
    padding: ${({ showUnderline }) => (showUnderline ? '1% 20px 0px 3px' : '1% 20px')};
    margin-bottom: ${({ showUnderline }) => (showUnderline ? '3px' : '0')};
    font-family: ${theme.fonts.default};
    font-size: 1rem;
    font-weight: 400;
    outline: 0;
    color: black;
    border: none;
    border-bottom: ${({ showUnderline }) =>
        showUnderline ? 'solid 1px ' + theme.colors.hoverGrey : 'none'};
    transition: border-bottom 200ms ease-in-out;

    &:focus {
        border-bottom: ${({ showUnderline }) =>
            showUnderline ? 'solid 1px ' + theme.colors.accent : 'none'};
    }

    ::placeholder {
        color: #adadad;
    }

    @media only screen and (max-width: 500px) {
        padding: ${(props) => (props.supportMobile ? '1% 10px' : '1% 20px')};
    }
`;

const SearchButton = styled.button`
    min-width: 55px;
    height: 3rem;
    border: none;
    border-radius: 0 5px 5px 0;
    background-color: white;
    // border: 2px solid ${theme.colors.accent};
    font-size: 15px;
    color: ${theme.colors.accent};
    cursor: pointer;
    transition: background-color 200ms ease-in-out;
    &:focus {
        outline: 0;
        background-color: ${theme.colors.accent};
        color: white;
    }
`;

const SearchIconWrapper = styled.div`
    margin-top: 2px;
`;

const SearchBarButton = styled.button`
    height: 45px;
    width: 90%;
    text-align: left;
    padding: 0 15px;
    border: solid 2px ${(props) => props.theme.colors.grey};
    background-color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SearchBarIconButton = styled.button`
    border: none;
    background-color: transparent;
    padding: 0;
    width: 50px;

    div {
        display: flex;
        flex-direction: column;
        line-height: 1.5rem;
        align-items: center;
    }

    span {
        font-size: 0.7rem;
        font-weight: bold;
        color: ${theme.colors.textGrey};
        font-family: ${theme.fonts.header};
    }
`;

const StyledSearchBarText = styled.div`
    display: inline;
    padding-left: 20px;
    font-size: 14px;
    font-family: ${(props) => props.theme.fonts.default};
    color: grey;
`;

const SearchOverlay = styled.div`
    position: fixed;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
    background-color: white;
    z-index: 25;
    display: flex;
    flex-direction: column;
`;

const SearchOverlayClose = styled.button`
    height: 3rem;
    width: 3rem;
    outline: 0;
    background-color: white;
    border: 0;
`;

const SearchOverlayBar = styled.div`
    display: flex;
    flex-direction: row;
    height: 3rem;
    border-bottom: 2px solid ${(props) => props.theme.colors.grey};
`;

const ResultsBox = styled.div`
    position: absolute;
    height: auto;
    max-height: 300px;
    width: 100%;
    top: 105%;
    background-color: ${theme.colors.background};
    color: ${theme.colors.textGrey};
    overflow-y: auto;
    transition: max-height 200ms ease-in-out;
    z-index: 5;
    border-radius: 5px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);

    @media only screen and (max-width: 500px) {
        position: ${(props) => (props.supportMobile ? 'static' : 'absolute')};
        border-radius: ${(props) => (props.supportMobile ? '0' : '5px')};
        box-shadow: ${(props) =>
            props.supportMobile ? 'none' : '0px 0px 15px rgba(0, 0, 0, 0.3)'};
    }
`;

const SearchResult = styled.button`
    width: 100%;
    padding: 0 18px;
    border: none;
    height: 3rem;
    text-align: left;
    vertical-align: middle;
    line-height: 3rem;
    font-size: 0.9rem;
    cursor: pointer;
    background-color: ${theme.colors.background};
    &:focus {
        outline: 0;
        background-color: #e0e0e0;
    }
`;

const ClearSearchbarButton = styled.button`
    position: absolute;
    top: 0;
    right: 55px;
    height: 3rem;
    width: 3rem;
    outline: 0;
    background-color: transparent;
    border: none;
    color: grey;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
    opacity: ${({ show }) => (show ? '0.8' : '0')};
    cursor: pointer;

    transition: opacity 400ms ease-in-out;
`;

const sampleResult = { station_name: '新宿', pref: '東京都', station_distinct: '', kcode: 1130208 };

function Searchbar({
    collapseToIcon,
    show,
    width,
    supportMobile,
    searchOverlayOpen,
    setSearchOverlayOpen,
    placeholder,
    searchType,
    showUnderline,
}) {
    const [input, setInput] = useState('');
    const [prefs, setPrefs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [focused, setFocused] = useState(false);
    const [customPlaceholder, setCustomPlaceholder] = useState('');

    const history = useHistory();
    const historyKey = 'searchHistory';
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const historyRef = useRef(null);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => (isMounted.current = false);
    }, []);

    useEffect(() => {
        if (localStorage.getItem(historyKey) !== null) {
            if (isMounted.current) {
                // Clean up old searches
                let restoredHistory = JSON.parse(localStorage.getItem(historyKey));
                let finalHistory = [];
                for (let i = 0; i < restoredHistory.length; i++) {
                    if (restoredHistory[i].kcode !== undefined) {
                        finalHistory.push(restoredHistory[i]);
                    }
                }
                if (finalHistory.length !== restoredHistory.length) {
                    localStorage.setItem(historyKey, JSON.stringify(finalHistory));
                }
                setSearchHistory(finalHistory.reverse());
            }
        } else {
            localStorage.setItem(historyKey, JSON.stringify([]));
        }
    }, []);

    const saveToSearchHistory = (searchItem) => {
        let restoredHistory = JSON.parse(localStorage.getItem(historyKey));
        for (let i = 0; i < restoredHistory.length; i++) {
            if (restoredHistory[i].kcode === searchItem.kcode) {
                restoredHistory.splice(i, 1);
                break;
            }
        }
        restoredHistory.push(searchItem);
        if (restoredHistory.length > 4) {
            restoredHistory.splice(0, 1);
        }
        localStorage.setItem(historyKey, JSON.stringify(restoredHistory));
        setSearchHistory(restoredHistory.reverse());
    };

    const removeFromSearchHistory = (searchItem) => {
        let restoredHistory = JSON.parse(localStorage.getItem(historyKey));
        for (let i = 0; i < restoredHistory.length; i++) {
            if (
                restoredHistory[i].station_name === searchItem.station_name &&
                restoredHistory[i].pref === searchItem.pref &&
                restoredHistory[i].station_distinct === searchItem.station_distinct
            ) {
                restoredHistory.splice(i, 1);
                break;
            }
        }
        localStorage.setItem(historyKey, JSON.stringify(restoredHistory));
        setSearchHistory(restoredHistory.reverse());
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target) &&
                ((input !== '' &&
                    resultsRef.current &&
                    !resultsRef.current.contains(event.target)) ||
                    (input === '' &&
                        historyRef.current &&
                        !historyRef.current.contains(event.target)))
            ) {
                if (isMounted.current) {
                    setFocused(false);
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef, resultsRef, historyRef, input]);

    const handleSearch = (input) => {
        if (input.kcode === undefined) {
            if (
                searchType &&
                searchType === 'URL' &&
                input.includes(suumoUrl) &&
                !input.startsWith('suumoUrl')
            ) {
                history.push('/assess?url=' + input);
            } else {
                if (searchResults.length > 0 && searchResults[0].kcode !== undefined) {
                    let query = new URLSearchParams(window.location.search);
                    let filters = window.location.search
                        .replace('?kcode=' + query.get('kcode'), '')
                        .replace('&sort=' + query.get('sort'), '');
                    let sort = query.get('sort');
                    history.push(
                        '/search?kcode=' +
                            searchResults[0].kcode +
                            (sort ? '&sort=' + sort : '') +
                            filters
                    );
                    saveToSearchHistory(searchResults[0]);
                }
            }
        } else {
            let query = new URLSearchParams(window.location.search);
            let filters = window.location.search
                .replace('?kcode=' + query.get('kcode'), '')
                .replace('&sort=' + query.get('sort'), '');
            let sort = query.get('sort');
            history.push(
                '/search?kcode=' + input.kcode + (sort ? '&sort=' + sort : '') + filters
            );
            saveToSearchHistory(input);
        }
    };

    useEffect(() => {
        fetch(``)
            .then((res) => {
                if (res.ok) {
                    res.json().then((res) => {
                        const arr = [];
                        const query = new URLSearchParams(window.location.search);
                        const kcode = query.get('kcode');
                        if (isMounted.current) {
                            res.forEach((row) => {
                                if (kcode !== null && row.kcode === parseInt(kcode)) {
                                    setInput('');
                                    setCustomPlaceholder(
                                        formatText(row.station_name, row.station_distinct, row.pref)
                                    );
                                }
                                arr.push(row);
                            });
                            setPrefs(arr);
                        }
                    });
                }
            })
            .catch((error) => console.log(error));
    }, []);

    const showResults = useCallback(() => {
        const res = [];
        if (input !== '') {
            if (prefs.length > 0) {
                for (const prefData of prefs.entries()) {
                    if (
                        (prefData[1].station_name + '駅').includes(input) ||
                        prefData[1].kana.includes(input)
                    ) {
                        res.push(prefData[1]);
                    }
                }
                res.sort((a, b) => a.station_name.localeCompare(b.station_name));
                res.sort((a, b) =>
                    a.station_name.startsWith(input) || a.kana.startsWith(input)
                        ? b.station_name.startsWith(input)
                            ? 0
                            : -1
                        : 1
                );
            }
        }
        if (isMounted.current) {
            setSearchResults(res);
        }
    }, [input, prefs]);

    const timer = useRef(null);

    useEffect(() => {
        // debounce
        if (timer.current !== null) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        timer.current = setTimeout(showResults, 200);
    }, [input, prefs, showResults]);

    const selectResult = (result) => {
        setInput('');
        setCustomPlaceholder(formatText(result.station_name, result.station_distinct, result.pref));
        setSearchResults([]);
        setFocused(false);
    };

    const searchInputRef = useRef(null);

    useEffect(() => {
        if (searchOverlayOpen) {
            searchInputRef.current.focus();
        }
    }, [searchOverlayOpen]);

    const formatText = (station_name, station_distinct, pref) => {
        return (
            station_name +
            '駅' +
            (station_distinct ? ' (' + station_distinct + ')' : '') +
            ', ' +
            pref
        );
    };

    if (supportMobile && width <= 500) {
        return (
            <Wrapper iconMode={collapseToIcon} supportMobile={supportMobile}>
                <SearchOverlay show={searchOverlayOpen}>
                    <SearchOverlayBar>
                        <SearchOverlayClose onClick={() => setSearchOverlayOpen(false)}>
                            <MdClose size="20" />
                        </SearchOverlayClose>
                        <Container
                            show={searchOverlayOpen}
                            onSubmit={(e) => {
                                handleSearch(input);
                                setInput('');
                                setSearchOverlayOpen(false);
                                e.preventDefault();
                                e.target.reset();
                            }}
                            supportMobile={supportMobile}
                        >
                            <SearchInput
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                                ref={searchInputRef}
                                supportMobile={supportMobile}
                                placeholder={'他の駅も検索する'}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                            />
                            <SearchButton type="submit">
                                <SearchIconWrapper>
                                    <FaSearch />
                                </SearchIconWrapper>
                            </SearchButton>
                        </Container>
                    </SearchOverlayBar>
                    {input === '' ? (
                        <ResultsBox supportMobile={supportMobile}>
                            {searchHistory.map((result, index) => (
                                <SearchResult key={index}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div
                                            onClick={() => {
                                                selectResult(result);
                                                handleSearch(result);
                                                setSearchOverlayOpen(false);
                                            }}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <MdHistory style={{ marginRight: '10px' }} />
                                            {formatText(
                                                result.station_name,
                                                result.station_distinct,
                                                result.pref
                                            )}
                                        </div>
                                        <MdClose onClick={() => removeFromSearchHistory(result)} />
                                    </div>
                                </SearchResult>
                            ))}
                        </ResultsBox>
                    ) : (
                        <ResultsBox supportMobile={supportMobile}>
                            {searchResults.map((result, index) => (
                                <SearchResult
                                    key={index}
                                    onClick={() => {
                                        selectResult(result);
                                        handleSearch(result);
                                        setSearchOverlayOpen(false);
                                    }}
                                >
                                    {formatText(
                                        result.station_name,
                                        result.station_distinct,
                                        result.pref
                                    )}
                                </SearchResult>
                            ))}
                        </ResultsBox>
                    )}
                </SearchOverlay>
                {collapseToIcon ? (
                    <SearchBarIconButton onClick={() => setSearchOverlayOpen(true)}>
                        <div>
                            <FiSearch size="24" color={theme.colors.textGrey} />
                            <span>検索</span>
                        </div>
                    </SearchBarIconButton>
                ) : (
                    <SearchBarButton
                        onClick={() => {
                            setSearchOverlayOpen(true);
                        }}
                    >
                        <FaSearch color="grey" />
                        <StyledSearchBarText>{placeholder}</StyledSearchBarText>
                    </SearchBarButton>
                )}
            </Wrapper>
        );
    } else {
        return (
            <Container
                show={show && (customPlaceholder || placeholder)}
                onSubmit={(e) => {
                    handleSearch(input);
                    e.preventDefault();
                    e.target.reset();
                }}
            >
                <SearchInput
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    placeholder={customPlaceholder !== '' ? customPlaceholder : placeholder}
                    onFocus={() => setFocused(true)}
                    ref={inputRef}
                    showUnderline={showUnderline}
                />
                <SearchButton type="submit">
                    <SearchIconWrapper>
                        <FaSearch />
                    </SearchIconWrapper>
                </SearchButton>
                {focused && input === '' && (!searchType || searchType === 'DEFAULT') && (
                    <ResultsBox ref={historyRef}>
                        {searchHistory.length > 0 ? (
                            searchHistory.map((result, index) => (
                                <SearchResult key={index}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div
                                            onClick={() => {
                                                selectResult(result);
                                                handleSearch(result);
                                            }}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%',
                                            }}
                                        >
                                            <MdHistory style={{ marginRight: '10px' }} />
                                            <span>
                                                {formatText(
                                                    result.station_name,
                                                    result.station_distinct,
                                                    result.pref
                                                )}
                                            </span>
                                        </div>
                                        <MdClose onClick={() => removeFromSearchHistory(result)} />
                                    </div>
                                </SearchResult>
                            ))
                        ) : (
                            <SearchResult
                                onClick={() => {
                                    selectResult(sampleResult);
                                    handleSearch(sampleResult);
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <FiSearch style={{ marginRight: '10px' }} />
                                    <span>
                                        {formatText(
                                            sampleResult.station_name,
                                            sampleResult.station_distinct,
                                            sampleResult.pref
                                        )}
                                    </span>
                                </div>
                            </SearchResult>
                        )}
                    </ResultsBox>
                )}
                {focused && (!searchType || searchType === 'DEFAULT') && (
                    <ResultsBox ref={resultsRef}>
                        {searchResults.map((result, index) => (
                            <SearchResult
                                key={index}
                                onClick={() => {
                                    selectResult(result);
                                    handleSearch(result);
                                }}
                            >
                                {formatText(
                                    result.station_name,
                                    result.station_distinct,
                                    result.pref
                                )}
                            </SearchResult>
                        ))}
                    </ResultsBox>
                )}
                <ClearSearchbarButton
                    show={input !== ''}
                    onClick={(e) => {
                        e.preventDefault();
                        setInput('');
                        setFocused(false);
                    }}
                >
                    <MdClose size="20" />
                </ClearSearchbarButton>
            </Container>
        );
    }
}

export default Searchbar;

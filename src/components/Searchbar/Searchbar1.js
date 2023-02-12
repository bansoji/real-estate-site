// Copyright 2021, Banson Tong, All rights reserved

import React, { useState, useRef, useEffect } from 'react';
import theme from '../../themes/default';
import _ from 'lodash';
import styled from 'styled-components';
import StyledButton1 from '../../components/StyledButton/StyledButton1';
import { FiSearch } from 'react-icons/fi';
import { LoadScript } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';
import GoogleLogo from '../../images/google_logo.png';

const Wrapper = styled.form`
    width: 100%;
    max-width: 600px;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
    color: ${theme.colors.textGrey};
    text-align: left;
    height: 100%;
`;

const Input = styled.input.attrs({
    type: 'text',
})`
    // height: 2.5rem;
    width: 100%;
    font-size: 1rem;
    border: 0;
    background-color: transparent;
    outline: 0;
    padding: 0 5px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ::placeholder {
        color: #adadad;
    }
`;

const SearchResults = styled.div`
    position: absolute;
    width: 100%;
    min-height: 50px;
    max-height: 40vh;
    top: 105%;
    left: 0;
    background-color: ${theme.colors.background};
    border-radius: 5px;
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
    overflow-y: auto;
    z-index: 10;
`;

const SearchResult = styled.div`
    height: 50px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 0.9rem;
    cursor: pointer;

    h3 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        margin-right: 10px;
        flex-shrink: 0;
    }

    p {
        color: grey;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &:hover {
        background-color: ${theme.colors.grey};
    }
`;

const PoweredByGoogle = styled.div`
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    height: 35px;
    background-color: ${theme.colors.background};
    display: flex;
    justify-content: flex-end;
    align-items: center;

    img {
        height: 50%;
        margin-right: 10px;
    }
`;

const HideContent = styled.div`
    height: 0;
    width: 0;
    overflow: hidden;
`;

const libraries = ['places'];

const stationListKey = 'stationList';

function SearchBar1({
    initPlacesService = true,
    mapPlacesService = null,
    onSearch,
    onFocus,
    onBlur,
    onChange,
}) {
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!initPlacesService && mapPlacesService) {
            setAutocompleteService(new window.google.maps.places.AutocompleteService());
            setPlacesService(mapPlacesService);
        }
    }, [mapPlacesService, initPlacesService]);

    // get station list
    const [stationList, setStationList] = useState([]);
    useEffect(() => {
        const _stationList = JSON.parse(localStorage.getItem(stationListKey));
        if (
            !_stationList ||
            (_stationList.time && new Date(_stationList.time).getDate() < new Date().getDate() - 60)
        ) {
            fetch(``)
                .then((res) => {
                    if (res.ok) {
                        res.json().then((res) => {
                            if (isMounted.current) {
                                setStationList(res);
                                localStorage.setItem(
                                    stationListKey,
                                    JSON.stringify({
                                        time: Date.now(),
                                        list: res,
                                    })
                                );
                            }
                        });
                    }
                })
                .catch((error) => console.log(error));
        } else {
            setStationList(_stationList.list);
        }
    }, []);

    const searchBar = useRef(null);

    const [stationResults, setStationResults] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [placesService, setPlacesService] = useState(null);
    const [autocompleteService, setAutocompleteService] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    const history = useHistory();

    const onInputChanged = useRef(
        _.debounce((value, as, stationList, callback) => {
            if (isMounted.current) {
                if (callback) {
                    callback(value);
                }
                if (value !== '') {
                    as.getPlacePredictions(
                        {
                            input: value,
                            location: new window.google.maps.LatLng(
                                35.681702400836386,
                                139.76714638757284
                            ),
                            radius: 100000,
                            types: ['(regions)'],
                        },
                        function callback(e) {
                            if (isMounted.current) {
                                const _results = [];

                                if (e) {
                                    e.forEach((result) => {
                                        _results.push({
                                            main_text: result.structured_formatting.main_text,
                                            sub_text: result.structured_formatting.secondary_text,
                                            kana: '',
                                        });
                                    });
                                }

                                if (stationList.length > 0) {
                                    stationList.forEach((station) => {
                                        if (
                                            (station.station_name + '駅').includes(value) ||
                                            station.kana.includes(value)
                                        ) {
                                            _results.push({
                                                main_text: station.station_name + '駅',
                                                sub_text: station.pref,
                                                kana: station.kana,
                                            });
                                        }
                                    });
                                }
                                _results.sort((a, b) => a.main_text.localeCompare(b.main_text));
                                _results.sort((a, b) =>
                                    a.main_text.startsWith(value) || a.kana.startsWith(value)
                                        ? b.main_text.startsWith(value)
                                            ? 0
                                            : -1
                                        : 1
                                );
                                setSearchResults(_results);
                            }
                            // console.log(e);
                        }
                    );
                    // ps.textSearch({ query: value, language: 'ja' }, function callback(e) {
                    //     if (e && isMounted.current) {
                    //         setSearchResults(e);
                    //     }
                    // });
                } else {
                    setSearchResults([]);
                    setStationResults([]);
                }
            }
        }, 1000)
    );

    const onLoad = () => {
        setPlacesService(
            new window.google.maps.places.PlacesService(document.createElement('div'))
        );
        setAutocompleteService(new window.google.maps.places.AutocompleteService());
    };

    const searchPlace = (i) => {
        placesService.findPlaceFromQuery({ query: i, fields: ['geometry'] }, function callback(e) {
            if (e) {
                const c = { lat: e[0].geometry.location.lat(), lng: e[0].geometry.location.lng() };
                history.push(`/map?center=${c.lat},${c.lng}`);
                if (onSearch) onSearch(c);
            }
        });
        searchBar.current.blur();
    };

    return (
        <Wrapper
            onSubmit={(e) => {
                e.preventDefault();
                searchPlace(searchBar.current.value);
            }}
        >
            <StyledButton1
                onClick={() => {}}
                style={{
                    borderRadius: '1.35rem',
                    border: 0,
                    backgroundColor: 'transparent',
                    padding: '5px',
                    height: '100%',
                }}
                width="40px"
            >
                <FiSearch size="18" color={theme.colors.accent} />
            </StyledButton1>

            <Input
                ref={searchBar}
                onChange={(e) => {
                    onInputChanged.current(
                        e.target.value,
                        autocompleteService,
                        stationList,
                        onChange
                    );
                }}
                onFocus={() => {
                    onInputChanged.current(
                        searchBar.current.value,
                        autocompleteService,
                        stationList
                    );
                    setIsFocused(true);
                    if (onFocus) {
                        onFocus();
                    }
                }}
                onBlur={() => {
                    setTimeout(() => {
                        if (isMounted.current) {
                            setIsFocused(false);
                            if (onBlur) {
                                onBlur();
                            }
                        }
                    }, 250);
                }}
                placeholder="住所、駅、地名を入力"
            />
            {(searchResults.length > 0 || stationResults.length > 0) && isFocused && (
                <SearchResults>
                    {searchResults.map((result, index) => (
                        <SearchResult
                            key={index}
                            onClick={() => {
                                searchPlace(`${result.main_text} ${result.sub_text}`);
                                searchBar.current.value = result.main_text;
                            }}
                        >
                            <FiSearch
                                style={{ minWidth: '15px', maxWidth: '15px', marginRight: '10px' }}
                            />
                            <h3>{result.main_text}</h3>
                            <p>{result.sub_text && result.sub_text.replace(/^(日本、)/, '')}</p>
                        </SearchResult>
                    ))}
                    <PoweredByGoogle>
                        <img alt="attribution" src={GoogleLogo} />
                    </PoweredByGoogle>
                </SearchResults>
            )}
            {initPlacesService && (
                <HideContent>
                    <LoadScript
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                        libraries={libraries}
                        onLoad={onLoad}
                    />
                </HideContent>
            )}
        </Wrapper>
    );
}

export default SearchBar1;

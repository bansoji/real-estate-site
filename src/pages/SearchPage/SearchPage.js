// Copyright 2021, Banson Tong, All rights reserved

import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';
import { useHistory } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import { filterDuplicates, filterMissingImages } from '../../Util';

import PropertyCard from '../../components/PropertyCard/PropertyCard';
import TopButton from '../../components/TopButton/TopButton';
import Select from '../../components/Select/Select';

import { FaSortAmountDown, FaFilter, FaList } from 'react-icons/fa';
import { BsFillGridFill } from 'react-icons/bs';
import { MdMail, MdPhone } from 'react-icons/md';
import Placeholder from '../../images/home/255x200.png';
import Loader from '../../components/Loader/Loader';
import StyledButton1 from '../../components/StyledButton/StyledButton1';
import { FiMapPin } from 'react-icons/fi';
import FilterBox from '../../components/FilterBox/FilterBox';

const Wrapper = styled.div`
    min-width: 990px;
    min-height: 100%;
    font-family: ${theme.fonts.default};
    display: flex;
    flex-direction: column;
    // justify-content: center;
    background-color: white;
    padding: 0 calc((100vw - 1000px) / 2);

    opacity: ${({ show }) => (show ? 1 : 0)};
    transition: opacity 200ms ease-in-out;

    pointer-events: ${({ show }) => (show ? 'auto' : 'none')};

    @media only screen and (max-width: 1000px) {
        min-width: 300px;
        width: 100%;
        padding: 0;
    }
`;

const MainContent = styled.div`
    display: flex;
    justify-content: center;
`;

const SideBar = styled.div`
    margin-right: 20px;

    @media only screen and (max-width: 1000px) {
        margin-right: 0;
    }
`;

const Results = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    // background-color: ${theme.colors.background};
    background-color: white;
    width: 70%;
    margin-top: 10px;

    @media only screen and (max-width: 1000px) {
        padding: 10px 0;
        width: 100%;
        max-width: 500px;
    }
`;

const ResultsGrid = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: ${({ rowLayout }) =>
        rowLayout ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))'};
    grid-gap: 10px;

    justify-items: center;
    justify-content: center;
    align-items: start;
    padding-bottom: 30px;

    @media only screen and (max-width: 1000px) {
        grid-template-columns: 1fr;
        grid-gap: 0px;
    }

    a {
        color: ${theme.colors.textGrey};
    }
`;

const ShowMoreButton = styled.button`
    border: solid 2px ${theme.colors.accent};
    color: ${theme.colors.accent};
    font-weight: bold;
    border-radius: 7px;
    background-color: transparent;
    width: 200px;
    height: 2.5rem;
    font-size: 1rem;
    cursor: pointer;
    margin: 0 auto;
    visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`;

const ListHeaderBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${theme.colors.grey};
    color: ${theme.colors.textGrey};

    @media only screen and (max-width: 1000px) {
        flex-direction: column;
        justify-content: center;
        padding-bottom: 10px;

        h4 {
            margin: 5px 0;
        }

        h2 {
            margin: 5px 0;
        }
    }
`;

const LocationDetails = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    align-items: center;
    box-sizing: border-box;

    @media only screen and (max-width: 1000px) {
        justify-content: center;
        max-width: 500px;
        margin-bottom: 10px;
    }

    @media only screen and (max-width: 500px) {
        padding: 0 20px;
        flex-direction: column-reverse;
        justify-content: flex-start;
        align-items: stretch;
    }
`;

const HeaderButtons = styled.div`
    display: inline-flex;
    align-items: center;
    max-width: 500px;

    @media only screen and (max-width: 1000px) {
        margin-bottom: 10px;
    }
`;

const ListLayoutToggle = ({ children }) => {
    return <StyledListLayoutToggle>{children}</StyledListLayoutToggle>;
};

const StyledListLayoutToggle = styled.div`
    display: flex;
    height: 100%;
    margin-right: 15px;
`;

const StyledListLayoutButton = styled.button`
    width: 2.8rem;
    height: 2.8rem;
    border: 0;
    background-color: transparent;
    vertical-align: middle;
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    // transition: all 200ms ease-in-out;

    @media only screen and (min-width: 1000px) {
        &:hover {
            // background-color: ${theme.colors.hoverGrey};
            border: solid 1px ${theme.colors.darkGrey};
        }
    }
`;

const FilterButton = styled.button`
    position: relative;
    min-width: 140px;
    height: 2.7rem;
    background-color: white;
    border: solid 1px ${theme.colors.darkGrey};
    // box-shadow: 0px 2px ${theme.colors.darkGrey};
    border-radius: 5px;
    text-align: left;
    padding: 5px 10px;

    color: ${theme.colors.textGrey};
    font-size: 1rem;
    font-weight: bold;

    cursor: pointer;

    transition: all 200ms;
`;

//#region Sort constants

const SortOrder = [
    '割安順(円)',
    '割安順(%)',
    '安い順',
    '築年が新しい順',
    '面積の広い順',
    '駅が近い順',
];

//#endregion

const AgentSection = styled.div`
    box-sizing: border-box;
    height: auto;
    width: 100%;
    // margin: 20px 20px 0 0;
    padding: 0 10px 20px 10px;
    // margin-right: 20px;
    font-size: 0.9rem;
    color: ${theme.colors.textGrey};

    // border-radius: 10px;
    // box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);

    border-bottom: 1px solid ${theme.colors.grey};

    display: flex;
    flex-direction: column;

    h3 {
        font-size: 1rem;
        font-weight: bold;
        line-height: 50px;
        height: 50px;
        border-bottom: 1px solid ${theme.colors.grey};
        padding: 0;
        margin: 0 0 20px 0;
        text-align: center;
    }

    img {
        height: 80px;
        width: 80px;
        margin-right: 10px;
        border-radius: 40px;
        background-color: ${theme.colors.grey};
        object-fit: cover;
    }

    button {
        margin: 2px;
        // border: solid 1px grey;
        border: 0;
        background-color: transparent;
        border-radius: 5px;
        padding: 10px;
        color: white;
        cursor: pointer;

        display: flex;
        align-items: center;
    }

    @media only screen and (max-width: 1000px) {
        max-width: 500px;
        border-bottom: 0;
        padding: 20px;
        padding-bottom: 10px;
        margin-right: 0;
    }
`;

const AgentInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const sessionKey = 'session';

function SearchPage({ width, showSearchHeader, setLockScroll }) {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [location, setLocation] = useState([]);
    const [resultLimit, setResultLimit] = useState(0);
    const [previousPageOffset, setPreviousPageOffset] = useState(0);
    const [fetching, setFetching] = useState(true);
    const [listLayoutRows, setListLayoutRows] = useState(true);
    const [searchParams, setSearchParams] = useState('');
    const [invalidImagesCount, setInvalidImagesCount] = useState(0);
    const [agents, setAgents] = useState([]);

    const history = useHistory();
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // show searchbar in header
    useEffect(() => showSearchHeader(true), [showSearchHeader]);

    //#region Infinite scroll

    const autoLoader = useRef(null);
    useEffect(() => {
        if (filteredProperties.length === 0 || resultLimit >= filteredProperties.length) return;
        const showMore = (entities, observer) => {
            const target = entities[0];
            if (target.isIntersecting) {
                setPreviousPageOffset(window.pageYOffset);
                setResultLimit(Math.min(resultLimit + 20, filteredProperties.length));
                observer.unobserve(autoLoader.current);
            }
        };
        let options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        };
        const observer = new IntersectionObserver(showMore, options);
        if (autoLoader.current) {
            observer.observe(autoLoader.current);
        }
    }, [resultLimit, filteredProperties.length]);

    const showMoreResults = () => {
        setPreviousPageOffset(window.pageYOffset);
        setResultLimit(Math.min(resultLimit + 20, properties.length));
    };

    // stop scroll when expanding grid
    useLayoutEffect(() => {
        if (resultLimit > 20) document.documentElement.scrollTop = previousPageOffset;
    }, [resultLimit, previousPageOffset]);

    //#endregion

    //#region Sort

    const [sortOrder, setSortOrder] = useState(0);

    const handleSort = useCallback(
        (p, i) => {
            let sortedProps = p;
            switch (i) {
                case SortOrder[0]:
                    sortedProps.sort(
                        (a, b) =>
                            parseFloat(b.est_rent) -
                            parseFloat(b.set_rent) -
                            (parseFloat(a.est_rent) - parseFloat(a.set_rent))
                    );
                    break;
                case SortOrder[1]:
                    sortedProps.sort(
                        (a, b) => parseFloat(b.cheap_ratio) - parseFloat(a.cheap_ratio)
                    );
                    break;
                case SortOrder[2]:
                    sortedProps.sort((a, b) => parseFloat(a.set_rent) - parseFloat(b.set_rent));
                    break;
                case SortOrder[3]:
                    sortedProps.sort((a, b) => parseFloat(a.age) - parseFloat(b.age));
                    break;
                case SortOrder[4]:
                    sortedProps.sort((a, b) => parseFloat(b.area) - parseFloat(a.area));
                    break;
                case SortOrder[5]:
                    sortedProps.sort((a, b) => parseFloat(a.minute) - parseFloat(b.minute));
                    break;
                default:
                    break;
            }
            history.replace(
                window.location.search.replace(
                    '&sort=' + sortOrder,
                    '&sort=' + SortOrder.indexOf(i)
                )
            );
            setSortOrder(SortOrder.indexOf(i));
            return sortedProps;
        },
        [sortOrder, history]
    );

    //#endregion

    //#region History

    const historyKey = 'history';

    // load history
    useEffect(() => {
        if (localStorage.getItem(historyKey) === null) {
            localStorage.setItem(historyKey, JSON.stringify([]));
        }
    });

    const saveToHistory = (property) => {
        let restoredHistory = JSON.parse(localStorage.getItem(historyKey));
        let isDuplicate = false;
        for (let i = 0; i < restoredHistory.length; i++) {
            if (restoredHistory[i].item.suumoLink === property.suumoLink) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            restoredHistory.push({ id: Date.now(), item: property });
            localStorage.setItem(historyKey, JSON.stringify(restoredHistory));
        }
    };

    //#endregion

    const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);

    useEffect(() => {
        if (width > 1000) {
            setFilterOverlayOpen(false);
        }
    }, [width]);

    useEffect(() => {
        setLockScroll(filterOverlayOpen);
    }, [filterOverlayOpen, setLockScroll]);

    const handleInvalidImage = (index) => {
        filteredProperties.splice(index, 1);
        setFilteredProperties(filteredProperties.slice(0));
        setInvalidImagesCount(invalidImagesCount + 1);
    };

    useEffect(() => {
        if (properties.length === 0) return;
        const query = new URLSearchParams(window.location.search);
        const kcode = query.get('kcode');
        const center = query.get('center');
        sessionStorage.setItem(
            sessionKey,
            JSON.stringify({
                kcode: kcode,
                center: center,
                properties: properties,
                scroll: document.documentElement.scrollTop,
                location: location,
                resultLimit: resultLimit,
            })
        );
    }, [properties, location, resultLimit]);

    const fetchData = useCallback(
        (kcode, sort) => {
            setFetching(true);

            fetch(``, {
                method: 'GET',
            })
                .then((res) => {
                    if (res.ok) {
                        res.json().then((res) => {
                            // console.log(res);
                            if (isMounted.current) {
                                if (res.error_code === 100) {
                                    setProperties(handleSort(filterDuplicates(filterMissingImages(res.bukkens)), SortOrder[sort]));
                                    setResultLimit(Math.min(20, res.bukkens.length));
                                    document.title =
                                        '' + res.location.station_name + '駅の賃貸';
                                } else {
                                    setProperties([]);
                                    setFilteredProperties([]);
                                    setResultLimit(20);
                                }
                                setFilteredPropsInit(false);
                                setFetching(false);
                                setLocation([
                                    res.location.pref,
                                    res.location.station_name,
                                    res.location.station_distinct,
                                ]);
                            }
                        });
                    }
                })
                .catch((error) => console.log(error));
        },
        [handleSort]
    );

    const fetchAgents = (kcode) => {
        setAgents([]);
        fetch(``, {
            method: 'GET',
        }).then((res) => {
            if (res.ok) {
                res.json().then((res) => {
                    if (res.error_code === 100) {
                        setAgents(res.agents);
                        // console.log(res);
                    }
                });
            }
        });
    };

    const fetchDataCenter = useCallback(
        (lat, lng, sort) => {
            setFetching(true);

            fetch(
                ``,
                {
                    method: 'GET',
                }
            )
                .then((res) => {
                    if (res.ok) {
                        res.json().then((res) => {
                            // console.log(res);
                            if (isMounted.current) {
                                if (res.error_code === 100) {
                                    setProperties(handleSort(filterDuplicates(filterMissingImages(res.bukkens)), SortOrder[sort]));
                                    setResultLimit(Math.min(20, res.bukkens.length));
                                } else {
                                    setProperties([]);
                                    setFilteredProperties([]);
                                    setResultLimit(20);
                                }
                                setFilteredPropsInit(false);
                                setFetching(false);
                                setLocation([lat + ',' + lng, undefined, undefined]);
                            }
                        });
                    }
                })
                .catch((error) => console.log(error));
        },
        [handleSort]
    );

    useEffect(() => {
        const prevQuery = new URLSearchParams(searchParams);
        const query = new URLSearchParams(window.location.search);
        const kcode = query.get('kcode');
        const sort =
            query.get('sort') &&
            parseInt(query.get('sort')) >= 0 &&
            parseInt(query.get('sort')) < SortOrder.length
                ? parseInt(query.get('sort'))
                : 0;
        setSortOrder(sort);
        if (kcode !== null) {
            if (prevQuery.get('kcode') !== kcode) {
                // try restore session
                const session = JSON.parse(sessionStorage.getItem(sessionKey));
                if (
                    session &&
                    session.kcode === kcode &&
                    session.location &&
                    session.properties &&
                    session.resultLimit
                ) {
                    setProperties(handleSort(session.properties, SortOrder[sort]));
                    setLocation(session.location);
                    setResultLimit(session.resultLimit);
                    setFetching(false);
                    document.title = '' + session.location[1] + '駅の賃貸';
                } else {
                    fetchData(kcode, sort);
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                    setPreviousPageOffset(0);
                }
                fetchAgents(kcode);
                const sParams = '?kcode=' + kcode;
                setSearchParams(sParams);
                const fParams = window.location.search
                    .replace(sParams, '')
                    .replace('&sort=' + sort, '');
                history.replace(sParams + '&sort=' + sort + fParams);
                setInvalidImagesCount(0);
            }
        }

        const center = query.get('center');
        if (center != null) {
            if (prevQuery.get('center') !== center) {
                const session = JSON.parse(sessionStorage.getItem(sessionKey));
                if (
                    session &&
                    session.center === center &&
                    session.location &&
                    session.properties &&
                    session.resultLimit
                ) {
                    setProperties(handleSort(session.properties, SortOrder[sort]));
                    setLocation(session.location);
                    setResultLimit(session.resultLimit);
                    setFetching(false);
                } else {
                    fetchDataCenter(center.split(',')[0], center.split(',')[1], sort);
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                    setPreviousPageOffset(0);
                }

                const sParams = '?center=' + center;
                setSearchParams(sParams);

                const fParams = window.location.search
                    .replace(sParams, '')
                    .replace('&sort=' + sort, '');
                history.replace(sParams + '&sort=' + sort + fParams);
                setInvalidImagesCount(0);
            }
        }
    }, [history, history.location, searchParams, fetchData, fetchDataCenter, handleSort]);

    const [filteredPropsInit, setFilteredPropsInit] = useState(false);

    const AgentWindow = () => (
        <AgentSection>
            <h3>周辺のおすすめ不動産エージェント</h3>
            <div style={{ display: 'flex', marginBottom: '5px' }}>
                <img src={agents[0].image} alt="" />
                <AgentInfo>
                    <span style={{ fontWeight: 'bold' }}>{agents[0].company_name}</span>
                    <span style={{ fontWeight: 'bold' }}>{agents[0].staff_name}</span>
                    <span>{agents[0].business_hours}</span>
                    <span>{agents[0].address}</span>
                </AgentInfo>
            </div>
            <button style={{ backgroundColor: '#6981c7' }}>
                <MdMail style={{ marginRight: '10px' }} />
                {agents[0].mail}
            </button>
            <button style={{ backgroundColor: '#69c77f' }}>
                <MdPhone style={{ marginRight: '10px' }} />
                {agents[0].tel}
            </button>
        </AgentSection>
    );
    return (
        <React.Fragment>
            <Wrapper show={!fetching}>
                <ListHeaderBar>
                    <LocationDetails>
                        {location && location[0] && !location[1] && (
                            <StyledButton1
                                width="70px"
                                onClick={() => {
                                    const sParams = '?center=' + location[0];
                                    const fParams = window.location.search
                                        .replace(sParams, '')
                                        .replace('&sort=' + sortOrder, '');
                                    history.push('map?center=' + location[0] + fParams);
                                }}
                                style={{
                                    marginRight:
                                        width >= 1000 ? '20px' : width >= 500 ? '10px' : '0',
                                }}
                            >
                                <FiMapPin style={{ marginRight: '5px' }} />
                                <span>地図で見る</span>
                            </StyledButton1>
                        )}
                        {location && location[0] && location[1] && (
                            <h4 style={{ marginRight: '15px' }}>
                                {location[0] + '、' + location[1] + '駅の賃貸'}
                            </h4>
                        )}
                        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {filteredProperties.length !==
                            properties.length - invalidImagesCount ? (
                                <>
                                    <h2>{filteredProperties.length}</h2>
                                    <h4>件/</h4>
                                </>
                            ) : (
                                ''
                            )}
                            <h2 style={{ color: theme.colors.accent }}>
                                {properties.length - invalidImagesCount}
                            </h2>
                            <h4 style={{ color: theme.colors.accent }}>件</h4>
                            <h4 style={{ paddingLeft: '5px' }}>{'が見つかりました。'}</h4>
                        </div>
                    </LocationDetails>

                    <HeaderButtons>
                        {width > 1000 && (
                            <ListLayoutToggle>
                                <StyledListLayoutButton onClick={() => setListLayoutRows(true)}>
                                    <FaList
                                        size="1.4rem"
                                        color={
                                            listLayoutRows
                                                ? theme.colors.accent
                                                : theme.colors.textGrey
                                        }
                                    />
                                </StyledListLayoutButton>
                                <span style={{ width: '5px' }} />
                                <StyledListLayoutButton onClick={() => setListLayoutRows(false)}>
                                    <BsFillGridFill
                                        size="2rem"
                                        color={
                                            !listLayoutRows
                                                ? theme.colors.accent
                                                : theme.colors.textGrey
                                        }
                                    />
                                </StyledListLayoutButton>
                            </ListLayoutToggle>
                        )}
                        {width <= 1000 && (
                            <FilterButton
                                style={{ marginRight: '10px' }}
                                onClick={() => setFilterOverlayOpen(true)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaFilter
                                        size="14"
                                        style={{
                                            marginLeft: '3px',
                                            marginRight: '7px',
                                            marginBottom: '2px',
                                        }}
                                        color={theme.colors.accent}
                                    />
                                    条件を入力
                                </div>
                            </FilterButton>
                        )}
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
                            label={'割安順(円)'}
                            options={SortOrder}
                            onSelected={
                                (i) => setFilteredProperties(handleSort(filteredProperties, i))
                                // filterProperties(handleSort(filteredProperties, i))
                            }
                            selected={SortOrder[sortOrder]}
                            bold
                        />
                    </HeaderButtons>
                    {agents.length > 0 && width <= 1000 && <AgentWindow />}
                </ListHeaderBar>
                <MainContent>
                    <SideBar>
                        {agents.length > 0 && width > 1000 && <AgentWindow />}

                        <FilterBox
                            filterOverlayOpen={filterOverlayOpen || width > 1000}
                            setFilterOverlayOpen={setFilterOverlayOpen}
                            width={width}
                            searchParams={searchParams + '&sort=' + sortOrder}
                            setFilteredProperties={setFilteredProperties}
                            properties={properties}
                            onInit={({ result }) => {
                                setFilteredProperties(handleSort(result, SortOrder[sortOrder]));
                                setFilteredPropsInit(true);
                            }}
                            onFilter={({ result }) => {
                                setFilteredProperties(handleSort(result, SortOrder[sortOrder]));
                                setInvalidImagesCount(0);
                                setResultLimit(Math.min(20, properties.length));
                                scroll.scrollToTop({ behavior: 'smooth' });
                            }}
                            filteredPropsInit={filteredPropsInit}
                            showCloseBtn={filterOverlayOpen}
                            closeOnSubmit
                        />
                    </SideBar>

                    {width > 1000 && <TopButton />}
                    <Results>
                        <ResultsGrid rowLayout={listLayoutRows}>
                            {filteredProperties.slice(0, resultLimit).map((property, index) => (
                                <PropertyCard
                                    onClick={() => {
                                        saveToHistory(property);
                                    }}
                                    key={index}
                                    rowLayout={listLayoutRows}
                                    stretch={true}
                                    image={property.image === '' ? Placeholder : property.image}
                                    name={property.name}
                                    address={property.address}
                                    price={property.set_rent}
                                    estimatedPrice={property.est_rent}
                                    area={property.area}
                                    distance={property.minute}
                                    floor={property.floor}
                                    age={property.age}
                                    bid={property.bid}
                                    layout={property.layout}
                                    url={property.suumoLink}
                                    windowWidth={width}
                                    onInvalidImage={() => handleInvalidImage(index)}
                                />
                            ))}
                        </ResultsGrid>
                        <ShowMoreButton
                            show={resultLimit < filteredProperties.length}
                            onClick={showMoreResults}
                            ref={autoLoader}
                        >
                            {'もっと見る (' + (filteredProperties.length - resultLimit) + ')'}
                        </ShowMoreButton>
                    </Results>
                </MainContent>
            </Wrapper>
            <Loader show={fetching} />
        </React.Fragment>
    );
}

export default SearchPage;

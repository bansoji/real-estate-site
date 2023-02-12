// Copyright 2021, Banson Tong, All rights reserved

import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { useOnScreen, saveToHistory } from '../../Util';
import styled from 'styled-components';
import theme from '../../themes/default';
import { animateScroll as scroll } from 'react-scroll';
import publicIp from 'public-ip';

import Searchbar1 from '../../components/Searchbar/Searchbar1';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import StyledButton from '../../components/StyledButton/StyledButton';
import Loader from '../../components/Loader/Loader';

import { FaChevronDown } from 'react-icons/fa';

import Bg from '../../images/background_optimized.jpg';
import MagnifyingGlass from '../../images/home/magnifying-glass.png';
import Graph from '../../images/home/graph.png';
import Cash from '../../images/home/cash.png';
import Map from '../../images/home/map.png';
import Placeholder from '../../images/home/255x200.png';
import { FiChevronRight } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

const Background = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
    background: url('${Bg}');
    background-position: center;
    background-size: cover;
    opacity: 0.7;
    z-index: -1;
`;

const BackgroundDim = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
    background-position: center;
    background-size: cover;
    z-index: -2;
`;

const Wrapper = styled.div`
    width: 100%;
    min-width: 300px;
    font-family: ${theme.fonts.default};
    a {
        color: ${theme.colors.textGrey};
    }
`;

const Hero = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    background-position: center;
    background-size: cover;

    transition: max-height 500ms ease-in-out;

    @media only screen and (max-width: 500px) {
        height: ${(props) => (props.height ? 'calc(' + props.height + 'px - 60px)' : '100vh')};
        max-height: ${(props) => (props.height ? 'calc(' + props.height + 'px - 60px)' : '100vh')};
    }
`;

const BlankContent = styled.div`
    transition: all 200ms ease-in-out;

    @media only screen and (max-width: 500px) {
        height: ${(props) => props.height};
    }
`;

const StyledHeroHeader = styled.p`
    font-family: ${theme.fonts.header};
    font-weight: bold;
    font-style: normal;
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 0;

    @media only screen and (max-width: 500px) {
        font-size: 1.3rem;
    }
`;

const StyledHeroContent = styled.p`
    font-family: ${theme.fonts.header};
    font-weight: 300;
    font-style: normal;
    font-size: 1.25rem;
    // text-shadow: 0px 0px 10px black;
    line-height: 30px;
    margin: 8px 0;

    @media only screen and (max-width: 500px) {
        font-size: 1rem;
    }
`;

const Cards = styled.div`
    height: auto;
    padding: 40px 0;
    background-color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: ${theme.fonts.header};
`;

const CardsHeader = styled.span`
    font-weight: bold;
    font-size: 1.25rem;
    padding: 0 20px 30px 20px;
    color: ${theme.colors.textGrey};

    @media only screen and (max-width: 1000px) {
        max-width: 500px;
    }

    @media only screen and (max-width: 500px) {
        font-size: 1rem;
    }
`;

const Card = ({ icon, children }) => {
    return (
        <StyledCard>
            <CardContent>
                <StyledCardIcon src={icon} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {children}
                </div>
            </CardContent>
        </StyledCard>
    );
};

const StyledCard = styled.div`
    // background-color: white;
    max-width: 360px;
    height: 320px;
    // box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    // border-radius: 10px;
    // margin: 5px;
    // border: 1px solid ${theme.colors.grey};
    display: flex;

    transition: transform 200ms ease-in-out, box-shadow 200ms ease-in-out, height 200ms ease-in-out;

    // &:hover {
    //     box-shadow: 0 0 15px rgba(0,0,0,0.2);
    //     transform: scale(1.05, 1.05);
    // }

    @media only screen and (max-width: 1000px) {
        min-width: 500px;
        max-width: 700px;
        height: 200px;
        pointer-events: none;
        align-items: center;
    }

    @media only screen and (max-width: 500px) {
        min-width: 100%;
        height: 300px;
        pointer-events: none;
        border-radius: 0px;
    }
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    color: ${theme.colors.textGrey};
    margin: 25px;

    @media only screen and (max-width: 1000px) {
        flex-direction: row;
    }

    @media only screen and (max-width: 500px) {
        flex-direction: column;
    }
`;

const StyledCardIcon = styled.img`
    object-fit: contain;
    width: 40%;
    margin: 0 auto 20px auto;

    @media only screen and (max-width: 1000px) {
        width: 25%;
        margin: 0 20px 0 0;
    }

    @media only screen and (max-width: 500px) {
        width: 35%;
        margin: 0 auto 20px auto;
    }
`;

const StyledCardHeader = styled.span`
    font-weight: bold;
    font-size: 1.1rem;
    padding-bottom: 15px;
`;

const StyledCardText = styled.span`
    font-size: 0.9rem;
`;

const CardList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    margin: 0 auto;
    grid-gap: 20px;

    @media only screen and (max-width: 1000px) {
        grid-template-columns: 1fr;
        width: 100%;
        grid-gap: 0px;
    }
`;

const StyledFeature = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100%;
    background-color: white;
    padding-top: 60px;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 1000px) {
        height: auto;
    }
`;

const FeatureHeader = ({ title, children, spaceBetween, rotateOn, location }) => {
    return (
        <StyledFeatureHeader spaceBetween={spaceBetween} rotateOn={rotateOn}>
            {location && <StyledFeatureSubHeader>{location.station_name}駅</StyledFeatureSubHeader>}
            <div style={{ lineHeight: '50px' }}>{title}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        </StyledFeatureHeader>
    );
};

const StyledFeatureWrapper = styled.div`
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 20%;
    width: 80%;
    max-width: 1200px;
    min-width: 1000px;

    color: ${theme.colors.textGrey};

    @media only screen and (max-width: 1000px) {
        margin: 0;
        width: 100%;
        min-width: 100%;
        max-width: 100%;
    }
`;

const StyledFeatureHeader = styled.div`
    width: 100%;
    height: 50px;
    font-family: ${theme.fonts.default};
    font-weight: bold;
    font-size: 1.75rem;
    display: flex;
    flex-direction: row;
    flex-stretch: 0;
    align-items: center;
    justify-content: ${({ spaceBetween }) => (spaceBetween ? 'space-between' : 'flex-start')};
    margin-bottom: 5px;
    position: relative;

    @media only screen and (max-width: 1000px) {
        width: 500px;
        flex-direction: ${({ rotateOn }) => (rotateOn ? 'column' : 'row')};
        align-items: ${({ rotateOn }) => (rotateOn ? 'flex-start' : 'center')};
        height: ${({ rotateOn }) => (rotateOn ? 'auto' : '50px')};
    }

    @media only screen and (max-width: 500px) {
        width: 95vw;
        font-size: 1.5rem;
    }
`;

const StyledFeatureSubHeader = styled.span`
    font-size: 0.9rem;
    font-weight: bold;
    font-family: ${theme.fonts.header};
    color: ${theme.colors.accent};

    position: absolute;
    top: -1.2rem;
`;

const StyledFeatureList = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    min-height: 380px;
    height: 380px;
    align-items: center;
    margin: 0 auto;

    @media only screen and (max-width: 1000px) {
        flex-direction: column;
        width: 500px;
        height: auto;
    }

    @media only screen and (max-width: 500px) {
        width: 100%;
    }
`;

const StyledFeatureSelector = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0px 20px;
    align-items: center;

    @media only screen and (max-width: 1000px) {
        padding: 0;
        padding-bottom: 10px;
    }
`;

const StyledFeatureSelectorItem = styled.div`
    width: ${({ selected }) => (selected ? 'auto' : '50px')};
    min-width: ${({ selected }) => (selected ? '100px' : '50px')};
    height: 1.8rem;
    border: 0;
    background-color: ${({ selected }) => (selected ? theme.colors.accentBlue : 'transparent')};
    // box-shadow: ${({ selected }) =>
        selected ? '0px 3px ' + theme.colors.accentBlueDark : 'none'};
    border-radius: 5px;
    font-size: 0.9rem;
    font-weight: normal;
    line-height: 1.8rem;
    text-align: center;
    cursor: pointer;
    color: ${({ selected }) => (selected ? 'white' : theme.colors.textGrey)};
    outline: none;
    padding: 0 10px;

    transition: all 200ms ease-in-out;

    @media only screen and (min-width: 1000px) {
        &:hover {
            text-decoration: underline;
        }
        &:active {
            background-color: ${theme.colors.grey};
        }
    }
`;

const StyledUnderlineOnHover = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    line-height: 0.9rem;
    font-weight: normal;
    text-decoration: underline;

    @media only screen and (min-width: 1000px) {
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
`;

const ReturnToSearch = styled.div`
    display: flex;
    height: 100px;
    background-color: white;
    justify-content: center;

    button {
        font-size: 1rem;
    }
`;

const SearchBarContainer = styled.div`
    position: ${(props) => (!props.isVisible ? 'fixed' : 'auto')};
    top: ${(props) => (!props.isVisible ? '10px' : 'auto')};
    left: ${(props) => (!props.isVisible ? '0' : 'auto')};
    right: ${(props) => (!props.isVisible ? '0' : 'auto')};
    margin: 0 auto;
    max-width: 600px;
    z-index: 15;
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
    height: 3rem;

    @media only screen and (max-width: 1000px) {
        top: ${(props) => (!props.isVisible ? '0' : 'auto')};
        background-color: ${(props) => (!props.isVisible ? 'white' : 'transparent')};
        border-bottom: ${(props) => (!props.isVisible ? '1px solid ' + theme.colors.grey : '0')};
    }
`;

const SearchBarContainerBase = styled.div`
    width: 80%;
    max-width: 600px;
`;

const StyledPropertyCount = styled.span`
    font-size: 1.1rem;
    font-weight: bold;
    // color: ${theme.colors.accent};
    margin: 0 3px;
    text-decoration: underline;
`;

const SelectorSeparator = () => {
    return <span style={{ height: '1rem', margin: '0 10px', borderLeft: '1px solid grey' }} />;
};

const getClientIp = async () => await publicIp.v4();

function HomePage({ width, height }) {
    const historyKey = 'history';
    const propertyCountKey = 'propCount';
    const [viewedHistory, setViewedHistory] = useState([]);
    const [properties, setProperties] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState('東京都');
    const [fetching, setFetching] = useState(true);
    const [randomStation, setRandomStation] = useState(null);
    const [invalidImages, setInvalidImages] = useState([]);
    const [propertyCount, setPropertyCount] = useState(0);

    const secondaryContentRef = useRef(null);
    const currentSelectedFeature = useRef(null);
    const history = useHistory();

    const searchBar = useRef(null);
    const isSearchBarVisible = useOnScreen(searchBar);
    const [searchBarText, setSearchBarText] = useState('');

    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        document.title = '';
    }, []);

    useLayoutEffect(() => {
        window.scroll({ top: 0, left: 0 });
    }, []);

    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const url = query.get('url');
        if (url !== null) {
            history.push('/assess?url=' + url);
        }
    }, [history]);

    const fetchPropertyCount = () => {
        fetch(``, {
            method: 'GET',
        })
            .then((res) => {
                if (res.ok) {
                    res.json().then((res) => {
                        if (isMounted.current) {
                            if (res.error_code === 100) {
                                setPropertyCount(res.bukken_num);
                                localStorage.setItem(
                                    propertyCountKey,
                                    JSON.stringify({
                                        time: Date.now(),
                                        num: res.bukken_num,
                                    })
                                );
                            }
                        }
                    });
                }
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        if (localStorage.getItem(historyKey) !== null) {
            setViewedHistory(JSON.parse(localStorage.getItem(historyKey)));
        } else {
            localStorage.setItem(historyKey, JSON.stringify([]));
        }
        const num = JSON.parse(localStorage.getItem(propertyCountKey));
        if (num && num.time && num.num && new Date(num.time).getDate() > new Date().getDate() - 1) {
            setPropertyCount(parseInt(num.num));
        } else {
            if (num && num.num) {
                setPropertyCount(parseInt(num.num));
            }
            fetchPropertyCount();
        }
    }, []);

    const getRandomStationFromPref = useCallback((pref) => {
        switch (pref) {
            case '東京部':
                return tokyoStations[Math.floor(Math.random() * tokyoStations.length)];
            case '大阪府':
                return osakaStations[Math.floor(Math.random() * osakaStations.length)];
            case '愛知県':
                return nagoyaStations[Math.floor(Math.random() * nagoyaStations.length)];
            default:
                return tokyoStations[Math.floor(Math.random() * tokyoStations.length)];
        }
    }, []);

    const fetchData = useCallback(
        (pref, tries) => {
            if (tries >= 5) return;
            setFetching(true);
            setProperties([]);
            let data = getRandomStationFromPref(pref);
            currentSelectedFeature.current = data.station_name;
            setRandomStation(data);
            fetch(
                ``, {
                    method: 'GET',
                }
            )
                .then((res) => {
                    if (res.ok) {
                        res.json().then((res) => {
                            if (isMounted.current) {
                                if (res.error_code === 100) {
                                    if (currentSelectedFeature.current === data.station_name) {
                                        setProperties(res.bukkens);
                                        setFetching(false);
                                    }
                                } else {
                                    // console.log(data.station_name)
                                    fetchData(pref, tries + 1);
                                }
                            }
                        });
                    }
                })
                .catch((error) => console.log(error));
        },
        [getRandomStationFromPref]
    );

    const fetchDataWithIp = useCallback((ip) => {
        setFetching(true);
        setProperties([]);
        fetch(``, {
            method: 'GET',
        })
            .then((res) => {
                if (res.ok) {
                    res.json().then((res) => {
                        if (isMounted.current) {
                            if (res.error_code === 100) {
                                setProperties(res.bukkens);
                                setFetching(false);
                            } else {
                                // console.log(data.station_name)
                            }
                        }
                    });
                }
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        const ipPromise = getClientIp();
        ipPromise.then(
            (r) => {
                if (isMounted.current) fetchDataWithIp(r);
            },
            () => {
                if (isMounted.current) fetchData('東京都', 0);
            }
        );
    }, [fetchData, fetchDataWithIp]);

    const handleInvalidImage = (image) => {
        invalidImages.push(image);
        let copy = invalidImages.slice(0);
        setInvalidImages(copy);
    };

    const handleInvalidHistoryImage = (index) => {
        viewedHistory.splice(index, 1);
        setViewedHistory(viewedHistory.slice(0));
        localStorage.setItem(historyKey, JSON.stringify(viewedHistory));
    };

    return (
        <Wrapper>
            <Hero height={height}>
                <BackgroundDim />
                <Background />
                <StyledHeroHeader>
                    <br />
                </StyledHeroHeader>
                <StyledHeroContent style={{ marginBottom: '25px', lineHeight: '20px' }}>
                    {propertyCount !== 0 && (
                        <>
                            <br />
                            掲載物件数
                            <StyledPropertyCount>
                                {propertyCount.toLocaleString()}
                            </StyledPropertyCount>
                            件
                        </>
                    )}
                </StyledHeroContent>
                <SearchBarContainerBase ref={searchBar}>
                    <SearchBarContainer isVisible={isSearchBarVisible}>
                        <Searchbar1
                            onFocus={() => setIsFocused(searchBarText !== '')}
                            onBlur={() => setIsFocused(false)}
                            onChange={(i) => {
                                setIsFocused(i !== '');
                                setSearchBarText(i);
                            }}
                        />
                    </SearchBarContainer>
                </SearchBarContainerBase>
                <BlankContent height={isFocused ? '50%' : '10%'} />
                {width < 500 && (
                    <FaChevronDown
                        size="25"
                        onClick={() =>
                            scroll.scrollTo(secondaryContentRef.current.offsetTop, {
                                behavior: 'smooth',
                            })
                        }
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '0',
                            right: '0',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '50px',
                        }}
                    />
                )}
            </Hero>
            <div ref={secondaryContentRef} />
            {(properties.length > 0 || fetching) && (
                <StyledFeature>
                    <StyledFeatureWrapper>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                position: 'relative',
                                width: '100%',
                                justifyContent: 'center',
                            }}
                        >
                            <FeatureHeader title="注目の割安物件" rotateOn>
                                {randomStation && (
                                    <StyledFeatureSelector>
                                        <StyledFeatureSelectorItem
                                            onClick={() => {
                                                setSelectedFeature('東京都');
                                                fetchData('東京都', 0);
                                            }}
                                            selected={selectedFeature === '東京都'}
                                        >
                                            {'東京' +
                                                (selectedFeature === '東京都' && !fetching
                                                    ? ' - ' + randomStation.station_name + '駅'
                                                    : '')}
                                        </StyledFeatureSelectorItem>
                                        <SelectorSeparator />
                                        <StyledFeatureSelectorItem
                                            onClick={() => {
                                                setSelectedFeature('大阪府');
                                                fetchData('大阪府', 0);
                                            }}
                                            selected={selectedFeature === '大阪府'}
                                        >
                                            {'大阪' +
                                                (selectedFeature === '大阪府' && !fetching
                                                    ? ' - ' + randomStation.station_name + '駅'
                                                    : '')}
                                        </StyledFeatureSelectorItem>
                                        <SelectorSeparator />
                                        <StyledFeatureSelectorItem
                                            onClick={() => {
                                                setSelectedFeature('愛知県');
                                                fetchData('愛知県', 0);
                                            }}
                                            selected={selectedFeature === '愛知県'}
                                        >
                                            {'名古屋' +
                                                (selectedFeature === '愛知県' && !fetching
                                                    ? ' - ' + randomStation.station_name + '駅'
                                                    : '')}
                                        </StyledFeatureSelectorItem>
                                    </StyledFeatureSelector>
                                )}
                            </FeatureHeader>
                        </div>
                        <StyledFeatureList>
                            <Loader
                                show={fetching}
                                style={{ backgroundColor: 'white', zIndex: '5' }}
                            />
                            {properties
                                .sort(
                                    (a, b) =>
                                        parseFloat(b.est_rent) -
                                        parseFloat(b.set_rent) -
                                        (parseFloat(a.est_rent) - parseFloat(a.set_rent))
                                )
                                .filter((property, index) => {
                                    if (
                                        property.image !== '' &&
                                        property.image !== 'None' &&
                                        property.image !==
                                            'https://maintenance.suumo.jp/maintenance.jpg' &&
                                        !invalidImages.includes(property.image)
                                    ) {
                                        if (index > 0) {
                                            return (
                                                property.address !==
                                                    properties[index - 1].address &&
                                                property.area !== properties[index - 1].area &&
                                                property.minute !== properties[index - 1].minute
                                            );
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return false;
                                    }
                                })
                                .slice(0, 4)
                                .map((property, index) => (
                                    <PropertyCard
                                        onClick={() => {
                                            saveToHistory(property, (r) => setViewedHistory(r));
                                            history.push('/bukken?id=' + property.bid);
                                        }}
                                        key={index}
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
                                        onInvalidImage={() => handleInvalidImage(property.image)}
                                        stretch
                                        rowLayout={width <= 1000}
                                    />
                                ))}
                        </StyledFeatureList>
                    </StyledFeatureWrapper>
                </StyledFeature>
            )}

            {viewedHistory.length > 0 && (
                <StyledFeature>
                    <StyledFeatureWrapper>
                        <FeatureHeader title="検索履歴" spaceBetween>
                            <Link
                                to="/history"
                                style={{ paddingRight: width > 500 ? '10px' : '0' }}
                            >
                                <StyledUnderlineOnHover>
                                    もっと見る
                                    <FiChevronRight />
                                </StyledUnderlineOnHover>
                            </Link>
                        </FeatureHeader>
                        <StyledFeatureList>
                            {viewedHistory
                                .sort((a, b) => b.id - a.id)
                                .slice(0, 4)
                                .map(({ item }, index) => (
                                    <PropertyCard
                                        onClick={() => {
                                            history.push('/bukken?id=' + item.bid);
                                        }}
                                        key={index}
                                        image={item.image === '' ? Placeholder : item.image}
                                        name={item.name}
                                        address={item.address}
                                        price={item.set_rent}
                                        estimatedPrice={item.est_rent}
                                        area={item.area}
                                        distance={item.minute}
                                        floor={item.floor}
                                        age={item.age}
                                        bid={item.bid}
                                        layout={item.layout}
                                        url={item.suumoLink}
                                        windowWidth={width}
                                        onInvalidImage={() => handleInvalidHistoryImage(index)}
                                        stretch
                                        rowLayout={width <= 1000}
                                    />
                                ))}
                        </StyledFeatureList>
                    </StyledFeatureWrapper>
                </StyledFeature>
            )}

            {width > 500 && (
                <div style={{ width: '100%', height: '60px', backgroundColor: 'white' }} />
            )}

            <Cards>
                <CardsHeader>
                </CardsHeader>
                <CardList>
                    <Card icon={MagnifyingGlass}>
                        <StyledCardHeader></StyledCardHeader>
                        <StyledCardText>
                        </StyledCardText>
                    </Card>
                    <Card icon={Graph}>
                        <StyledCardHeader></StyledCardHeader>
                        <StyledCardText>
                        </StyledCardText>
                    </Card>
                    <Card icon={Map}>
                        <StyledCardHeader></StyledCardHeader>
                        <StyledCardText>
                        </StyledCardText>
                    </Card>
                    <Card icon={Cash}>
                        <StyledCardHeader></StyledCardHeader>
                        <StyledCardText>
                        </StyledCardText>
                    </Card>
                </CardList>
            </Cards>

            <ReturnToSearch>
                <StyledButton
                    buttonType={true}
                    onClick={() => scroll.scrollToTop({ behavior: 'smooth' })}
                >
                </StyledButton>
            </ReturnToSearch>
        </Wrapper>
    );
}

export default HomePage;

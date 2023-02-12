// Copyright 2021, Banson Tong, All rights reserved

import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import _ from 'lodash';
import styled, { keyframes } from 'styled-components';
import theme from '../../themes/default';
import { filterMissingImages, saveToHistory } from '../../Util';
import { GoogleMap, LoadScript, Marker, Polygon, InfoWindow } from '@react-google-maps/api';
import { useHistory, withRouter } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import StyledButton1 from '../../components/StyledButton/StyledButton1';
import Placeholder from '../../images/home/255x200.png';
import { FaFilter, FaList, FaSortAmountDown, FaSchool, FaMap, FaChevronLeft } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { MdCheckBoxOutlineBlank, MdCheckBox, MdClose } from 'react-icons/md';
import Slider from 'react-slick';
import FilterBox from '../../components/FilterBox/FilterBox';
import Loader from '../../components/Loader/Loader';
import Select from '../../components/Select/Select';
import Searchbar1 from '../../components/Searchbar/Searchbar1';
import PropertyPage from '../PropertyPage/PropertyPage';
import SlideIn from '../../components/Animation/SlideIn';

const Wrapper = styled.div`
    height: ${(props) => (props.height ? props.height + 'px' : '100vh')};
    font-family: ${theme.fonts.default};
    display: flex;
`;

const disableSurroundingInfo = true;

const propertiesPerPage = 40;

const libraries = ['places'];

const Toolbar = styled.div`
    position: absolute;
    height: 60px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
    z-index: 3;
`;

const SearchbarContainer = styled.div`
    min-width: 250px;
    max-width: 600px;
    width: 100%;
    min-height: 2.7rem;
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
    // margin-left: 5px;
`;

const VerticalToolbar = styled.div`
    display: flex;
    flex-direction: column;
    height: 200px;
    max-width: 100px;
    margin-top: 5px;

    button {
        // border-radius: 1.35rem;
        border: 0;
        box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
        margin-bottom: 7px;
    }
`;

const PropertyWindow = styled.div`
    position: absolute;
    width: 100%;
    height: ${(props) => (props.show ? 'calc(47vh - 60px)' : '0')};
    max-height: ${(props) => (props.show ? '250px' : '0')};
    max-width: ${(props) => (props.show ? '100%' : '0')};
    top: auto;
    bottom: 10px;
    z-index: 7;

    @media only screen and (max-width: 1000px) {
        // border-radius: 8px;
        // box-shadow: 0 0 15px rgb(50, 50, 50);
        position: fixed;
        // height: calc(40% + 20px);
        width: 100%;
        // max-height: ${(props) => (props.show ? '60%' : '0')};
        max-width: ${(props) => (props.show ? '100%' : '0')};
        top: auto;
        bottom: 10px;
        // transition: max-height 300ms ease-in-out;
    }
`;

const Price = styled.span`
    font-size: 1.5rem;
    font-weight: bold;
    color: ${(props) => (props.worth ? '#ff0023' : theme.colors.negativeBlue)};
    width: 55%;
    white-space: nowrap;

    span {
        line-height: 1.5rem;
        font-size: 1.5rem;
        font-weight: bold;
    }

    h3 {
        padding: 0;
        margin: 0;
        font-size: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const EstPrice = styled.span`
    font-size: 1.2rem;
    font-weight: normal;
    color: grey;

    h3 {
        padding: 0;
        margin: 0;
        font-size: 0.8rem;
    }

    span {
        display: flex;
    }
`;

const ExtraPrices = styled.div`
    font-size: 0.9rem;

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    ul li {
        display: inline-block;
        padding: 1% 15px 1% 0;
    }

    div {
        width: 0.8rem;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        padding: 5px;
        margin: 0 15px 0 0;
        border-radius: 50%;
        background-color: grey;
        font-size: 0.8rem;
        color: white;
        display: inline-block;
    }
`;

const PropertiesWindowTitle = styled.div`
    // position: absolute;
    min-height: 75px;
    height: 75px;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: white;
    // border-radius: 5px 5px 0 0;
    z-index: 5;
    font-weight: bold;
    font-size: 1.1rem;
    color: ${theme.colors.textGrey};
    padding: 0 15px;

    span {
        width: 65%;
    }
`;

const PropertiesWindowList1 = styled.div`
    display: flex;
    flex-direction: column;
    // height: calc(100% - 75px);
    height: 100%;
    overflow-y: scroll;
    // margin-top: 75px;
`;

const Properties = styled.div`
    position: relative;
    min-width: 750px;
    box-shadow: -2px 2px 5px 0 rgb(0 0 0 / 40%);
    background-color: white;
    border-top: 1px solid ${theme.colors.grey};

    @media only screen and (max-width: 1350px) {
        min-width: 500px;
    }

    @media only screen and (max-width: 900px) {
        position: absolute;
        min-width: auto;
        top: 60px;
        bottom: 0;
        left: 0;
        right: 0;

        z-index: 5;
    }
`;

const Pager = styled.div`
    display: flex;
    margin: 1rem auto;

    @media only screen and (max-width: 900px) {
        margin-bottom: 150px;
    }
`;

const PageButton = styled.button`
    width: 2.4rem;
    height: 2.4rem;
    padding: 0;
    border-radius: 1.2rem;
    margin: 5px;
    background-color: transparent;
    font-size: 1rem;
    font-weight: bold;
    color: ${(props) => (props.selected ? theme.colors.darkGrey : theme.colors.textGrey)};
    cursor: pointer;
    pointer-events: ${(props) => (props.selected ? 'none' : 'auto')};
    border: ${(props) =>
        props.selected ? '2px solid ' + theme.colors.darkGrey : '2px solid transparent'};
    transition: all 200ms;

    &:hover {
        border: ${(props) =>
            props.selected
                ? '2px solid ' + theme.colors.darkGrey
                : '2px solid' + theme.colors.accent};
    }
`;

const Toggle = styled.div`
    position: fixed;
    display: flex;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
    border-radius: 7px;
    height: 2.9rem;
    background-color: ${(props) => (props.listMode ? theme.colors.textGrey : 'white')};
    color: ${(props) => (props.listMode ? 'white' : theme.colors.textGrey)};
    opacity: ${(props) => (props.listMode ? 0.9 : 1)};
    align-items: center;
    z-index: 6;

    button {
        height: 100%;
        width: 100px;
        font-size: 0.9rem;
        font-weight: bold;
        background-color: transparent;
        border-radius: 7px;
        border: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: ${(props) => (props.listMode ? 'white' : theme.colors.textGrey)};

        &:active {
            // background-color: ${theme.colors.grey};
        }
    }

    span {
        font-size: 0.9rem;
        padding: 0 18px;
        border-left: solid 1px ${theme.colors.darkGrey};
    }
`;

const PropertyCounter = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 18px;
    left: 15px;
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 0.8rem;
    padding: 5px 10px;
    text-align: center;
    max-width: 25%;
    z-index: 2;
`;

const FiltersWindow = styled.div`
    position: relative;
    left: 10px;
    top: 10px;
    bottom: 20%;
    width: 400px;
    z-index: 10;
    background-color: white;
    overflow-y: ${(props) => (props.show ? 'auto' : 'hidden')};
    height: ${(props) => (props.show ? '80%' : '0')};
    border-radius: 5px;
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);

    @media only screen and (max-width: 1000px) {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: ${(props) => (props.show ? '100%' : '0')};
        width: 100%;
        border-radius: 0;
    }
`;

const FiltersWindowHeader = styled.div`
    height: 50px;
    background-color: ${theme.colors.accent};
    color: white;
    font-size: 1rem;
    font-weight: bold;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
`;

const FiltersWindowList = styled.div`
    overflow-y: scroll;
    height: calc(100% - 50px);
    margin-top: 50px;
`;

const CloseFilterSettingsButton = styled.button`
    position: absolute;
    right: 10px;
    top: 10px;
    border: 0;
    width: 25px;
    height: 25px;
    padding: 0;
    background-color: transparent;
    color: white;
    z-index: 6;
    cursor: pointer;
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
    font-size: 0.9rem;
    font-weight: bold;

    cursor: pointer;

    transition: all 200ms;
`;

const StyledCard = styled.div`
    position: relative;
    height: calc(47vh - 60px);
    max-height: 250px;
    width: calc(100% - 10px);
    max-width: 400px;
    margin: 5px auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
    overflow: hidden;
    cursor: pointer;

    img {
        height: 50%;
        width: 100%;
        border-radius: 8px 8px 0 0;
        object-fit: cover;
    }
`;

const StyledCardContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    height: 50%;
    flex-shrink: 0;
`;

const StyledDiscountLabel = styled.div`
    position: absolute;
    right: 5px;
    top: 5px;
    background-color: ${(props) => props.color};
    color: white;
    font-weight: bold;
    font-size: 1rem;
    padding: 3px 6px;
    border-radius: 5px;
`;

const Card = ({ property, width, color, onClick }) => {
    return (
        <StyledCard onClick={() => onClick()}>
            {property.est_rent && property.est_rent > property.set_rent && (
                <StyledDiscountLabel color={color}>
                    -{' '}
                    {parseInt(((property.est_rent - property.set_rent) / property.est_rent) * 100)}%
                </StyledDiscountLabel>
            )}
            <img alt="" src={property.image} />
            <StyledCardContent>
                <div style={{ display: 'flex' }}>
                    <Price worth={property.est_rent && property.set_rent < property.est_rent}>
                        <h3>家賃（管理費・共益費込み）</h3>
                        <span>{property.set_rent.toLocaleString() + '円'}</span>
                    </Price>
                    <EstPrice>
                        <h3>相場家賃</h3>
                        <span>
                            {property.est_rent ? (
                                <s>{parseInt(property.est_rent).toLocaleString() + '円'}</s>
                            ) : (
                                '-'
                            )}
                        </span>
                    </EstPrice>
                </div>
                <ExtraPrices>
                    <ul>
                        <li>
                            <div>敷</div>
                            {property.shikikin === 0 ? '-' : parsePrice(property.shikikin)}
                        </li>
                        <li>
                            <div>礼</div>
                            {property.reikin === 0 ? '-' : parsePrice(property.reikin)}
                        </li>
                    </ul>
                </ExtraPrices>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '0.9rem',
                        color: 'grey',
                    }}
                >
                    <div>
                        {property.layout + ' / ' + property.area + ' m²'}{' '}
                        {property.distance && width <= 500 ? <br /> : ' / '}
                        {(property.distance ? '徒歩' + property.distance + '分 / ' : '') +
                            property.floor +
                            '階 / ' +
                            (parseInt(property.age) === 0
                                ? '新築'
                                : '築' + parseInt(property.age) + '年')}
                    </div>
                </div>
            </StyledCardContent>
        </StyledCard>
    );
};

const mapStyle = [
    {
        featureType: 'landscape',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
    },
];

const containerStyle = {
    width: '100vw',
    height: '100%',
    position: 'relative',
};

const mapOptions = {
    gestureHandling: 'greedy',
    styles: mapStyle,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
};

const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerPadding: '20px',
    responsive: [
        {
            breakpoint: 1100,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 850,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '170px',
            },
        },
        {
            breakpoint: 700,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '140px',
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '80px',
            },
        },
        {
            breakpoint: 500,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '40px',
            },
        },
        {
            breakpoint: 400,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '20px',
            },
        },
    ],
};

const buttonActiveStyle = {
    backgroundColor: theme.colors.accent,
    color: 'white',
};

const SortOrder = [
    '割安順(円)',
    '割安順(%)',
    '安い順',
    '築年が新しい順',
    '面積の広い順',
    '駅が近い順',
];

const spin = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`;

const ButtonLoaderContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: ${({ show }) => (show ? '100%' : 0)};
    transition: opacity 500ms ease-in-out;
    pointer-events: none;
`;

const Spinner = styled.div`
    border: 3px solid #f3f3f3; /* Light grey */
    border-top: 3px solid ${(props) => props.theme.colors.accent};
    border-radius: 50%;
    min-width: ${(props) => props.size};
    min-height: ${(props) => props.size};
    animation: ${spin} 1s linear infinite;
    pointer-events: none;
`;

const PropertyPopup = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: white;
    z-index: 15;
`;

const PopupCloseButton = styled.button`
    height: 45px;
    width: 45px;
    min-width: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    padding-right: 2px;
    border: 3px solid ${theme.colors.cherry};
    border-radius: 3px;
    color: ${theme.colors.cherry};
    background-color: white;
    cursor: pointer;
    margin-right: 15px;

    &:active {
        background-color: ${theme.colors.grey};
    }

    @media only screen and (min-width: 1000px) {
        &:hover {
            background-color: ${theme.colors.cherry};
            color: white;
        }
    }

    @media only screen and (max-width: 500px) {
        height: 40px;
        width: 40px;
        min-width: 40px;
    }
`;

const defaultCenter = {
    lat: 35.681702400836386,
    lng: 139.76714638757284,
};

const parsePrice = (p) => {
    let parsedPrice = parseInt(p);
    if (parsedPrice >= 10000) {
        return parsedPrice / 10000 + '万';
    } else {
        return parsedPrice;
    }
};

const SchoolDetails = styled.div`
    height: 300px;
    width: 300px;

    h2 {
        font-weight: bold;
        font-size: 1.2rem;
        margin-top: 0;
        padding-bottom: 2px;
        margin-bottom: 5px;
        border-bottom: 2px solid ${theme.colors.darkGrey};
        color: ${theme.colors.textGrey};
    }
`;

const SchoolPhotos = styled.div`
    display: flex;
    flex-direction: column;

    img {
        width: 100%;
        border-radius: 5px;
        object-fit: cover;
        margin: 2px 0;
    }
`;

const CustomSchoolMarker = ({ index, position, icon, name, ps }) => {
    const [open, setOpen] = useState(false);
    const [photos, setPhotos] = useState([]);
    return (
        <Marker
            key={index}
            position={position}
            icon={icon}
            onClick={() => {
                setOpen(!open);
                ps.textSearch({ query: name, location: position }, function callback(e) {
                    if (e) {
                        ps.getDetails(
                            { placeId: e[0].place_id, fields: ['photo'] },
                            function callback(r) {
                                if (r) {
                                    setPhotos(r.photos);
                                }
                            }
                        );
                    }
                });
            }}
        >
            {open && (
                <InfoWindow>
                    <SchoolDetails>
                        <h2>{name}</h2>
                        <div style={{ display: 'grid' }}>
                            {photos &&
                                photos.length > 0 &&
                                photos.map((p, i) => (
                                    <SchoolPhotos>
                                        <img
                                            key={i}
                                            alt=""
                                            src={p.getUrl({ maxHeight: 200, maxWidth: 200 })}
                                        />
                                    </SchoolPhotos>
                                ))}
                        </div>
                    </SchoolDetails>
                </InfoWindow>
            )}
        </Marker>
    );
};

const SurroundingInfo = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 30%;
    min-width: 300px;
    z-index: 9;
    background-color: white;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
    padding: 15px;
    transform: translate(-50%, -50%);

    h2 {
        margin-top: 0;
        margin-bottom: 1px;
        padding-bottom: 10px;
        font-size: 1.2rem;
        color: ${theme.colors.textGrey};
        border-bottom: 1px solid ${theme.colors.darkGrey};
    }
`;

const SurroundingInfoItem = styled.div`
    height: 3rem;
    width: 100%;
    border-bottom: 1px solid ${theme.colors.darkGrey};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    transition: all 200ms ease-in-out;
    position: relative;
    color: ${theme.colors.textGrey};

    &:hover {
        background-color: ${theme.colors.grey};
    }

    span {
        font-weight: bold;
        margin: 0 10px;
    }
`;

function MapSearchPage({ width, height, showHeader, showFooter }) {
    // map
    const [map, setMap] = useState(null);
    const [placesService, setPlacesService] = useState(null);
    const [center, setCenter] = useState(null);
    const [zoom, setZoom] = useState(14);
    const [lastFetchedCenter, setLastFetchedCenter] = useState(null);

    // properties
    const [unfilteredProperties, setUnfilteredProperties] = useState([]);
    const [filteredPropsInit, setFilteredPropsInit] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [hoveredProperty, setHoveredProperty] = useState('');

    const [property, setProperty] = useState(null);

    const [fetching, setFetching] = useState(true);

    // schools
    const [schools, setSchools] = useState([]);
    const [showSchools, setShowSchools] = useState(false);
    const [schoolsFetching, setSchoolsFetching] = useState(false);

    // surrounding info
    const [showSurrInfo, setShowSurrInfo] = useState(false);

    const [searchParams, setSearchParams] = useState('');

    const [filtersInit, setFiltersInit] = useState(false);
    const [filters, setFilters] = useState('');
    const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);

    // pager
    const [page, setPage] = useState(0);
    const [totalProps, setTotalProps] = useState(0);

    // property list
    const [listMode, setListMode] = useState(false);
    const list = useRef(null);

    const slider = useRef(null);

    const history = useHistory();

    useLayoutEffect(() => {
        window.scroll({ top: 0, left: 0 });
    }, []);

    useEffect(() => {
        document.title = '';
        showFooter(false);
        return () => {
            showHeader(true);
            showFooter(true);
        };
    }, [showHeader, showFooter]);

    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const debounceFunction = useRef(
        _.debounce((f) => {
            if (isMounted.current) {
                f();
            }
        }, 200)
    );

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

    const fetchSchools = useCallback((location, bounds) => {
        setSchoolsFetching(true);
        fetch(
            ``,
            {
                method: 'GET',
            }
        )
            .then((res) => {
                if (res.ok) {
                    res.json().then((res) => {
                        if (isMounted.current) {
                            if (res.error_code === 100) {
                                // console.log(res);
                                setSchools(res.primary_shools);
                            }
                            setSchoolsFetching(false);
                        }
                    });
                }
            })
            .catch((error) => console.log(error));
    }, []);

    const fetchData = useCallback(
        (location, bounds, zoom, filters = '') => {
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
                                    setUnfilteredProperties(
                                        handleSort(filterMissingImages(res.bukkens), SortOrder[0])
                                    );

                                    setFetching(false);
                                    setFilteredPropsInit(false);
                                    if (res.bukken_num < res.bukkens.length) {
                                        setTotalProps(res.bukkens.length);
                                    } else {
                                        setTotalProps(
                                            res.bukkens.length < 100
                                                ? res.bukkens.length
                                                : res.bukken_num
                                        );
                                    }
                                } else {
                                    setUnfilteredProperties([]);
                                    setFetching(false);
                                    setTotalProps(0);
                                }
                                setPage(0);
                                setSelectedProperty('');
                                if (list.current) {
                                    list.current.scrollTop = 0;
                                }
                            }
                        });
                    }

                    if (showSchools) fetchSchools(location, bounds);
                })
                .catch((error) => console.log(error));
        },
        [fetchSchools, showSchools, handleSort]
    );

    const updateUrl = useCallback(
        (c, z) => {
            const query = new URLSearchParams(window.location.search);
            const sParams =
                '?center=' +
                query.get('center') +
                (query.get('zoom') ? '&zoom=' + query.get('zoom') : '');
            const fParams = window.location.search.replace(sParams, '');
            history.replace('/map?center=' + c.lat + ',' + c.lng + '&zoom=' + z + fParams);
        },
        [history]
    );

    const onLoad = useCallback(
        function callback(map) {
            setMap(map);
            const query = new URLSearchParams(window.location.search);
            let c;
            if (query.get('center')) {
                c = {
                    lat: parseFloat(query.get('center').split(',')[0]),
                    lng: parseFloat(query.get('center').split(',')[1]),
                };
                map.panTo(c);
            } else {
                c = { lat: map.getCenter().lat(), lng: map.getCenter().lng() };
            }
            let z = map.getZoom();
            if (query.get('zoom')) {
                z = parseInt(query.get('zoom'));
                map.setZoom(z);
                setZoom(z);
            }
            const sParams =
                '?center=' + c.lat + ',' + c.lng + (query.get('zoom') ? '&zoom=' + z : '');
            const fParams = window.location.search.replace(sParams, '');
            history.replace('/map' + sParams + fParams);
            setSearchParams(sParams);
            setPlacesService(new window.google.maps.places.PlacesService(map));
        },
        [history]
    );

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const onDragEnd = useCallback(
        function callback() {
            const c = { lat: map.getCenter().lat(), lng: map.getCenter().lng() };
            setCenter(c);
            if (
                lastFetchedCenter == null ||
                (lastFetchedCenter &&
                    Math.hypot(lastFetchedCenter.lat - c.lat, lastFetchedCenter.lng - c.lng) >
                        0.002)
            ) {
                fetchData(c, map.getBounds(), map.getZoom(), filters);
                setLastFetchedCenter(c);
            }
            updateUrl(c, map.getZoom());
        },
        [map, lastFetchedCenter, fetchData, updateUrl, filters]
    );

    const onDragStart = useCallback(
        function callback() {
            if (width <= 850) {
                setSelectedProperty('');
            }
        },
        [width]
    );

    const onZoomChanged = useRef(
        _.debounce((map, zoom, filters) => {
            if (map && map.getZoom() !== zoom) {
                const c = {
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng(),
                };
                fetchData(c, map.getBounds(), map.getZoom(), filters);
                setZoom(map.getZoom());
                updateUrl(c, map.getZoom());
            }
        }, 1000)
    );

    const [boundsInit, setBoundsInit] = useState(false);
    const onBoundsChanged = useCallback(
        function callback() {
            if (center && map && !boundsInit) {
                setBoundsInit(true);
            }
        },
        [map, center, boundsInit]
    );

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const c = query.get('center');
        if (c) {
            setCenter({
                lat: parseFloat(c.split(',')[0]),
                lng: parseFloat(c.split(',')[1]),
            });
        } else {
            setCenter(defaultCenter);
        }
    }, []);

    useEffect(() => {
        if (map && boundsInit && !filtersInit) {
            const c = {
                lat: map.getCenter().lat(),
                lng: map.getCenter().lng(),
            };
            fetchData(c, map.getBounds(), map.getZoom(), filters);
            setLastFetchedCenter(c);
            setFiltersInit(true);
        }
    }, [map, filters, boundsInit, filtersInit, fetchData]);

    const handleInvalidImage = (index) => {
        unfilteredProperties.splice(index, 1);
        setUnfilteredProperties(unfilteredProperties.slice(0));
    };

    const getColorFromPrice = (price, estPrice) => {
        const baseColor = [212, 212, 212];
        if (estPrice) {
            const diff = Math.max(Math.min((estPrice - price) / price / 0.2, 1), 0);
            const color = [
                baseColor[0] + (220 - baseColor[0]) * diff,
                baseColor[1] + (20 - baseColor[1]) * diff,
                baseColor[2] + (60 - baseColor[2]) * diff,
            ];
            return `rgb(${color[0]},${color[1]},${color[2]})`;
        } else {
            return `rgb(${baseColor[0]},${baseColor[1]},${baseColor[2]})`;
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const bid = query.get('id');
        if (bid) {
            setProperty(bid);
        } else {
            setProperty(null);
        }
    }, [history.location]);

    const isSelectedOrHovered = (bid) => {
        return hoveredProperty === bid || selectedProperty === bid;
    };

    const hideProperties = useCallback(() => {
        setSelectedProperty('');
    }, []);

    const onMarkerClick = useCallback(
        (grid, index) => {
            if (width < 900) {
                setSelectedProperty(grid.bid);
                if (slider.current) {
                    slider.current.slickGoTo(
                        unfilteredProperties.findIndex((p) => p.bid === grid.bid)
                    );
                }
            } else {
                const p = Math.floor(index / propertiesPerPage);
                const selectedIndex = index % propertiesPerPage;

                setPage(p);
                list.current.children[selectedIndex].scrollIntoView();
                setSelectedProperty(grid.bid);
            }
        },
        [unfilteredProperties, width]
    );

    return (
        <Wrapper height={height}>
            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                libraries={libraries}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    options={mapOptions}
                    onZoomChanged={() => onZoomChanged.current(map, zoom, filters)}
                    onBoundsChanged={onBoundsChanged}
                    onClick={hideProperties}
                >
                    <Toolbar>
                        <SearchbarContainer>
                            <Searchbar1
                                initPlacesService={false}
                                mapPlacesService={placesService}
                                onSearch={(c) => {
                                    map.panTo(c);
                                    setCenter(c);
                                    fetchData(c, map.getBounds(), map.getZoom(), filters);
                                    setLastFetchedCenter(c);
                                    updateUrl(c, map.getZoom());
                                }}
                            />
                        </SearchbarContainer>
                        <VerticalToolbar>
                            <StyledButton1
                                onClick={() => {
                                    setFilterOverlayOpen(!filterOverlayOpen);
                                }}
                                width={'120px'}
                                justifyContent={width > 500 ? 'flex-start' : 'center'}
                                style={filters ? buttonActiveStyle : {}}
                            >
                                <FaFilter
                                    size="16"
                                    style={{ margin: '0 5px' }}
                                    color={filters ? 'white' : theme.colors.accent}
                                />
                                <span
                                    style={{ width: '100%', textAlign: 'center' }}
                                >
                                    絞り込み
                                </span>
                            </StyledButton1>
                            {!disableSurroundingInfo && (
                                <StyledButton1
                                    onClick={() => {
                                        setShowSurrInfo(!showSurrInfo);
                                    }}
                                    width={width > 500 ? '110px' : '45px'}
                                    justifyContent={width > 500 ? 'flex-start' : 'center'}
                                >
                                    <FaMap
                                        style={{
                                            margin: width > 500 ? '0 5px' : 0,
                                            minWidth: '1rem',
                                        }}
                                        size={18}
                                        color={theme.colors.accent}
                                    />
                                    {width > 500 && (
                                        <span style={{ width: '100%', textAlign: 'center' }}>
                                            周辺情報
                                        </span>
                                    )}
                                </StyledButton1>
                            )}
                        </VerticalToolbar>
                    </Toolbar>

                    {width < 850 && selectedProperty !== '' && (
                        <PropertyWindow show={true}>
                            {unfilteredProperties.length > 0 && (
                                <Slider
                                    {...sliderSettings}
                                    beforeChange={(current, next) => {
                                        setSelectedProperty(unfilteredProperties[next].bid);
                                        map.panTo({
                                            lat: parseFloat(unfilteredProperties[next].lat),
                                            lng: parseFloat(unfilteredProperties[next].lon),
                                        });
                                    }}
                                    ref={slider}
                                >
                                    {unfilteredProperties.map((property, index) => (
                                        <div key={property.bid}>
                                            <Card
                                                onClick={() => {
                                                    saveToHistory(property);
                                                    history.push(
                                                        window.location.search +
                                                            `&id=${property.bid}`
                                                    );
                                                }}
                                                property={property}
                                                width={width}
                                                color={getColorFromPrice(
                                                    property.set_rent,
                                                    property.est_rent
                                                )}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            )}
                        </PropertyWindow>
                    )}

                    <SlideIn show={filterOverlayOpen} zIndex={10}>
                        <FiltersWindow show={true}>
                            <FiltersWindowHeader>条件を入力</FiltersWindowHeader>
                            <CloseFilterSettingsButton onClick={() => setFilterOverlayOpen(false)}>
                                <MdClose size="25" />
                            </CloseFilterSettingsButton>
                            <FiltersWindowList>
                                <FilterBox
                                    filterOverlayOpen={true}
                                    setFilterOverlayOpen={setFilterOverlayOpen}
                                    width={width}
                                    searchParams={searchParams}
                                    properties={[]}
                                    onInit={({ filters }) => {
                                        setFilteredPropsInit(true);
                                        setFilters(filters);
                                    }}
                                    onFilter={({ filters }) => {
                                        const c = {
                                            lat: map.getCenter().lat(),
                                            lng: map.getCenter().lng(),
                                        };
                                        fetchData(c, map.getBounds(), map.getZoom(), filters);
                                        setLastFetchedCenter(c);
                                        setFilters(filters);
                                    }}
                                    filteredPropsInit={filteredPropsInit}
                                    showCloseBtn={filterOverlayOpen && width <= 1000}
                                    closeOnSubmit={filterOverlayOpen && width <= 1000}
                                    hideHeader={width > 1000}
                                    queryOnly
                                />
                            </FiltersWindowList>
                        </FiltersWindow>
                    </SlideIn>

                    {!disableSurroundingInfo && (
                        <SlideIn show={showSurrInfo}>
                            <SurroundingInfo>
                                <CloseFilterSettingsButton onClick={() => setShowSurrInfo(false)}>
                                    <MdClose size="25" color={theme.colors.textGrey} />
                                </CloseFilterSettingsButton>
                                <h2>周辺情報</h2>
                                <SurroundingInfoItem
                                    onClick={() => {
                                        if (!showSchools) {
                                            const c = {
                                                lat: map.getCenter().lat(),
                                                lng: map.getCenter().lng(),
                                            };
                                            fetchSchools(c, map.getBounds());
                                        }
                                        setShowSchools(!showSchools);
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            margin: width > 500 ? '0 5px' : 0,
                                        }}
                                    >
                                        <FaSchool
                                            size={18}
                                        />
                                        <ButtonLoaderContainer show={schoolsFetching}>
                                            <Spinner size="25px" />
                                        </ButtonLoaderContainer>
                                    </div>
                                    <span>学区</span>
                                    <div style={{ left: '10px', position: 'absolute' }}>
                                        {!showSchools ? (
                                            <MdCheckBoxOutlineBlank size={25} />
                                        ) : (
                                            <MdCheckBox size={25} color={theme.colors.accent} />
                                        )}
                                    </div>
                                </SurroundingInfoItem>
                            </SurroundingInfo>
                        </SlideIn>
                    )}

                    {(width > 900 || !listMode) &&
                        unfilteredProperties.map((grid, index) => (
                            <Marker
                                key={grid.bid}
                                position={{
                                    lat: parseFloat(grid.lat),
                                    lng: parseFloat(grid.lon),
                                }}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    fillColor: isSelectedOrHovered(grid.bid)
                                        ? 'green'
                                        : getColorFromPrice(grid.set_rent, grid.est_rent),
                                    fillOpacity: 1,
                                    strokeColor: 'white',
                                    strokeOpacity: 1,
                                    strokeWeight: isSelectedOrHovered(grid.bid) ? 3 : 2,
                                    scale: isSelectedOrHovered(grid.bid) ? 8 : 7,
                                }}
                                zIndex={isSelectedOrHovered(grid.bid) ? 1000 : undefined}
                                onClick={() => {
                                    onMarkerClick(grid, index);
                                }}
                            />
                        ))}

                    {(width > 900 || !listMode) &&
                        showSchools &&
                        schools.length > 0 &&
                        schools.map((school, index) => (
                            <CustomSchoolMarker
                                key={
                                    school.point.geometries[0].coordinates[1].toString() +
                                    school.point.geometries[0].coordinates[0].toString()
                                }
                                position={{
                                    lat: school.point.geometries[0].coordinates[1],
                                    lng: school.point.geometries[0].coordinates[0],
                                }}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    fillColor: '#deb435',
                                    fillOpacity: 1,
                                    strokeColor: 'white',
                                    strokeOpacity: 1,
                                    strokeWeight: 2,
                                    scale: 7,
                                }}
                                name={school.name}
                                ps={placesService}
                            />
                        ))}

                    {(width > 900 || !listMode) &&
                        showSchools &&
                        schools.length > 0 &&
                        schools.map((school, index) =>
                            school.polygon.geometries.map((geometry) => (
                                <Polygon
                                    key={index}
                                    paths={geometry.coordinates[0].map((coord) => {
                                        return {
                                            lat: parseFloat(coord[1]),
                                            lng: parseFloat(coord[0]),
                                        };
                                    })}
                                    options={{
                                        strokeColor: '#deb435',
                                        strokeWeight: 5,
                                        fillColor: '#ffce3b',
                                    }}
                                ></Polygon>
                            ))
                        )}
                    <PropertyCounter>
                        {parseInt(totalProps).toLocaleString()} 件の内{' '}
                        {unfilteredProperties.length.toLocaleString()} 件を表示中
                    </PropertyCounter>
                </GoogleMap>
            </LoadScript>
            {(listMode || width > 900) && map && (
                <Properties show={listMode}>
                    <PropertiesWindowList1 ref={list}>
                        <PropertiesWindowTitle>
                            {width > 900 && <span>{unfilteredProperties.length + '件'}</span>}
                            {width <= 900 && (
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
                                    (i) =>
                                        setUnfilteredProperties(handleSort(unfilteredProperties, i))
                                }
                                selected={SortOrder[sortOrder]}
                                bold
                                borderOn
                                fontSize='0.9rem'
                            />
                        </PropertiesWindowTitle>
                        {unfilteredProperties
                            .slice(
                                page * propertiesPerPage,
                                Math.min(page * propertiesPerPage + propertiesPerPage),
                                unfilteredProperties.length - 1
                            )
                            .map((property, index) => (
                                <PropertyCard
                                    onClick={() => {
                                        saveToHistory(property);
                                        history.push(
                                            window.location.search + `&id=${property.bid}`
                                        );
                                    }}
                                    key={property.bid}
                                    rowLayout={true}
                                    stretch={true}
                                    image={property.image === '' ? Placeholder : property.image}
                                    images={property.images}
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
                                    station={
                                        property.nearest_station_name && property.nearest_minute
                                            ? property.nearest_station_name +
                                              '駅 ' +
                                              property.nearest_minute +
                                              '分'
                                            : null
                                    }
                                    onInvalidImage={() =>
                                        handleInvalidImage(page * propertiesPerPage + index)
                                    }
                                    selected={property.bid === selectedProperty}
                                    onMouseEnter={() =>
                                        debounceFunction.current(() =>
                                            setHoveredProperty(property.bid)
                                        )
                                    }
                                    onMouseLeave={() =>
                                        debounceFunction.current(() => setHoveredProperty(''))
                                    }
                                />
                            ))}
                        <Pager>
                            <PageButton
                                onClick={() => {
                                    if (page - 1 >= 0) {
                                        setPage(Math.max(page - 1, 0));
                                        list.current.scrollTop = 0;
                                    }
                                }}
                            >
                                {'<'}
                            </PageButton>
                            {[
                                ...Array(
                                    Math.ceil(unfilteredProperties.length / propertiesPerPage)
                                ).keys(),
                            ].map((i) => (
                                <PageButton
                                    selected={i === page}
                                    key={i}
                                    onClick={() => {
                                        setPage(i);
                                        list.current.scrollTop = 0;
                                    }}
                                >
                                    {i + 1}
                                </PageButton>
                            ))}
                            <PageButton
                                onClick={() => {
                                    if (
                                        page + 1 <
                                        Math.ceil(unfilteredProperties.length / propertiesPerPage)
                                    ) {
                                        setPage(
                                            Math.min(
                                                page + 1,
                                                Math.ceil(
                                                    unfilteredProperties.length / propertiesPerPage
                                                ) - 1
                                            )
                                        );
                                        list.current.scrollTop = 0;
                                    }
                                }}
                            >
                                {'>'}
                            </PageButton>
                        </Pager>
                    </PropertiesWindowList1>
                    <Loader show={fetching} />
                </Properties>
            )}

            {width <= 900 && (
                <Toggle listMode={listMode}>
                    {listMode ? (
                        <>
                            <button
                                onClick={() => {
                                    setListMode(!listMode);
                                    setSelectedProperty('');
                                }}
                            >
                                <FiMapPin style={{ marginRight: '5px' }} />
                                <p>マップ</p>
                            </button>
                            <span>{unfilteredProperties.length + '件'}</span>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setListMode(!listMode);
                                setSelectedProperty('');
                            }}
                        >
                            <FaList size="15" style={{ marginRight: '5px' }} />
                            <p>リスト</p>
                        </button>
                    )}
                </Toggle>
            )}
            {property && (
                <PropertyPopup>
                    <PropertyPage
                        propertyId={property}
                        width={width}
                        backButton={
                            <PopupCloseButton
                                onClick={() =>
                                    history.push(
                                        window.location.search.replace(`&id=${property}`, '')
                                    )
                                }
                            >
                                <FaChevronLeft size="18" />
                            </PopupCloseButton>
                        }
                    />
                </PropertyPopup>
            )}
        </Wrapper>
    );
}

export default withRouter(MapSearchPage);

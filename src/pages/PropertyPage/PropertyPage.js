// Copyright 2021, Banson Tong, All rights reserved

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { filterDuplicates, filterMissingImages } from '../../Util';
import styled from 'styled-components';
import Loader from '../../components/Loader/Loader';
import theme from '../../themes/default';
import ImageGallery from 'react-image-gallery';
import Slider from 'react-slick';
import ReactTooltip from 'react-tooltip';

import 'react-image-gallery/styles/css/image-gallery.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { MdInfoOutline } from 'react-icons/md';
import { AiOutlineForm } from 'react-icons/ai';
import { FaChevronRight, FaChevronLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import StyledButton from '../../components/StyledButton/StyledButton';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import Placeholder from '../../images/home/255x200.png';

import ShoppingIcon from '../../images/property/shopping.png';
import BankIcon from '../../images/property/bank.png';
import ChildcareIcon from '../../images/property/childcare.png';
import HospitalIcon from '../../images/property/hospital.png';
import KobanIcon from '../../images/property/koban.png';
import LibraryIcon from '../../images/property/library.png';
import ParkIcon from '../../images/property/park.png';
import PostIcon from '../../images/property/post.png';
import RestaurantIcon from '../../images/property/restaurant.png';
import UtilIcon from '../../images/property/util.png';
import EducationIcon from '../../images/property/education.png';
import DrugStoreIcon from '../../images/property/drugstore.png';

const Wrapper = styled.div`
    min-width: 300px;
    min-height: 100vh;
    font-family: ${theme.fonts.default};

    opacity: ${({ show }) => (show ? 1 : 0)};
    transition: opacity 200ms ease-in-out;

    pointer-events: ${({ show }) => (show ? 'auto' : 'none')};

    color: ${theme.colors.textGrey};
    background-color: white;

    .image-gallery-content .image-gallery-slide .image-gallery-image {
        height: 450px;
        max-height: 450px;
    }

    .image-gallery-thumbnail-image {
        object-fit: cover;
        height: 80px;
        max-height: 80px;
    }

    @media only screen and (max-width: 500px) {
        .image-gallery-content .image-gallery-slide .image-gallery-image {
            height: 210px;
            max-height: 210px;
        }
    }
`;

const Section = styled.div`
    position: relative;
    // border-radius: 10px;
    background-color: white;
    // border: 1px solid ${theme.colors.grey};
    margin: 5px;
    // box-shadow: 0px 0px 20px ${theme.colors.grey};
    padding: 15px;
    overflow: hidden;

    height: ${(props) => (props.dropdown ? (props.toggle ? 'auto' : '2rem') : 'auto')};

    h2 {
        margin: 0 0 20px 0;
        // padding-bottom: 10px;
        padding-left: 15px;
        border-left: solid 4px ${theme.colors.cherry};
        cursor: ${(props) => (props.dropdown ? 'pointer' : 'auto')};
    }

    h2 span {
        float: right;
        margin-right: 5px;
    }

    @media only screen and (max-width: 500px) {
        margin: 0px;

        h2 {
            font-size: 1.3rem;
        }
    }
`;

const BulletPoints = styled.ul`
    li {
        float: left;
        width: calc((1000px / ${(props) => props.columns}) - 30px);
        line-height: 2rem;
        margin-left: 30px;
    }

    @media only screen and (max-width: 1100px) {
        li {
            width: 100%;
            margin-left: 0;
        }
    }
`;

const BulletPointsWithIcons = styled.ul`
    padding-inline-start: 15px;

    li {
        float: left;
        width: 100%;
        line-height: 2rem;
        display: flex;
    }

    li img {
        height: 2rem;
        margin-right: 0.7rem;
    }

    @media only screen and (max-width: 1100px) {
        padding-inline-start: 10px;

        li {
            width: 100%;
            margin-left: 0;
        }
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    width: 1100px;
    margin: 0 auto;
    padding: 10px 0px 50px 0px;
    @media only screen and (max-width: 1100px) {
        width: 100%;
        padding: 0;
    }
`;

const Header = styled.div`
    display: flex;
    // justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        padding-left: 0;
        // border-left: solid 4px ${theme.colors.cherry};
        border-left: 0;
        margin: 0 0 0 5px;
    }

    @media only screen and (max-width: 500px) {
        h2 {
            font-size: 1.3rem;
            margin: 0;
        }
    }
`;

const Price = styled.span`
    font-size: 2rem;
    font-weight: bold;
    color: ${theme.colors.accent};
    width: 55%;

    span {
        font-size: 1.5rem;
        font-weight: normal;
        color: grey;
    }

    h3 {
        padding: 0;
        margin: 0;
        font-size: 0.8rem;
    }

    @media only screen and (max-width: 500px) {
        font-size: 1.7rem;
    }
`;

const EstPrice = styled.span`
    font-size: 1.5rem;
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

    @media only screen and (max-width: 500px) {
        font-size: 1.3rem;
    }
`;

const Label = styled.div`
    background-color: ${theme.colors.accent};
    color: white;
    border-radius: 5px;
    padding: 5px 10px;
    margin-bottom: 20px;
    font-size: 0.8rem;
    margin-right: auto;
    float: right;
`;

const MaintenanceFee = styled.span`
    font-size: 1rem;
    font-weight: normal;
    // padding-left: 10px;
    color: grey;
    // border-bottom: 1px solid ${theme.colors.darkGrey};
    padding-bottom: 10px;
`;

const ExtraPrices = styled.div`
    font-size: 1rem;

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    ul li {
        display: inline-block;
        padding: 5px 15px 5px 0;
    }

    span {
        padding: 0 15px 0 0;
        color: grey;
    }

    border-top: 1px solid ${theme.colors.darkGrey};
    border-bottom: 1px solid ${theme.colors.darkGrey};
`;

const ExtraDetails = styled.div`
    font-size: 1rem;
    padding: 15px 0;

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    ul li {
        padding: 2px 15px 2px 0;
        line-height: 2rem;
        min-height: 2rem;
    }

    span {
        margin: 0 15px 0 0;
        float: left;
        width: 70px;
        color: grey;
        background-color: ${theme.colors.grey};
        padding-left: 0.25rem;
        border-radius: 3px;
    }

    border-bottom: 1px solid ${theme.colors.darkGrey};
`;

const StationDetails = styled.div`
    display: flex;
    align-items: center;
    margin: 15px 0;
    align-items: stretch;

    span {
        margin: 0 15px 0 0;
        float: left;
        width: 70px;
        min-width: 70px;
        color: grey;
        background-color: ${theme.colors.grey};
        padding-left: 0.25rem;
        border-radius: 3px;
        display: flex;
        line-height: 2rem;
        min-height: 2rem;
        padding: 2px 0 2px 0.25rem;
    }

    ul {
        margin: 0;
        padding-left: 0px;
    }

    ul li {
        line-height: 2rem;
        display: block;
    }

    a {
        color: ${theme.colors.cherry};

        &:hover {
            text-decoration: underline;
        }
    }
`;

const Summary = styled.div`
    font-size: 1rem;

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    ul li {
        padding: 2px 15px 2px 0;
        float: left;
        width: 45%;
        line-height: 2rem;
        min-height: 2rem;
    }

    span {
        margin: 0 15px 0 0;
        float: left;
        width: 100px;
        color: grey;
        background-color: ${theme.colors.grey};
        padding-left: 0.25rem;
        border-radius: 3px;
    }

    @media only screen and (max-width: 1100px) {
        ul li {
            width: 100%;
        }
    }
`;

const GalleryNav = styled.button`
    border-radius: 50%;
    height: 50px;
    width: 50px;
    position: absolute;
    right: ${(props) => (props.right ? '0' : 'auto')};
    left: ${(props) => (props.left ? '0' : 'auto')};
    top: calc(50% - 25px);
    // border: 1px solid ${theme.colors.grey};
    border: 0;
    box-shadow: 0 2px 5px -1px rgb(0 0 0 / 30%);
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 2;
    color: ${theme.colors.accent};
    transition: all 200ms ease-in-out;
    &:hover {
        box-shadow: 0 0 10px rgba(1, 1, 1, 0.3);
    }

    @media only screen and (max-width: 500px) {
        height: 40px;
        width: 40px;
        right: ${(props) => (props.right ? '-10px' : 'auto')};
        left: ${(props) => (props.left ? '-10px' : 'auto')};
    }
`;

const StyledCarousel = styled.div`
    width: 95%;
    margin: 0 auto;

    @media only screen and (max-width: 500px) {
        width: 85%;
    }
`;

const parsePrice = (p) => {
    let parsedPrice = parseInt(p);
    if (parsedPrice >= 10000) {
        return parsedPrice / 10000 + '万';
    } else {
        return parsedPrice;
    }
};

const containerStyle = {
    width: '100%',
    height: '40vh',
};

const libraries = ['places'];

const StyledRecArrow = styled.div`
    position: absolute;
    left: ${(props) => (props.left ? '-35px' : 'auto')};
    right: ${(props) => (props.right ? '-35px' : 'auto')};
    top: calc((100% - 30px) / 2);
    height: 30px;
    width: 30px;
    background-color: ${(props) => (props.disabled ? theme.colors.grey : theme.colors.darkGrey)};
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 200ms ease-in-out;
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

    &:hover {
        background-color: grey;
    }
`;

const RecArrow = (props) => {
    const isLeft = props.className.includes('slick-prev');
    return (
        <StyledRecArrow
            onClick={props.onClick}
            left={isLeft}
            right={!isLeft}
            disabled={props.className.includes('slick-disabled')}
        >
            {isLeft ? <FaChevronLeft /> : <FaChevronRight />}
        </StyledRecArrow>
    );
};

const recSliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <RecArrow />,
    prevArrow: <RecArrow />,
    responsive: [
        {
            breakpoint: 1100,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            },
        },
        {
            breakpoint: 850,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 3,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

const landmarkTypes = [
    {
        name: '（コンビニ）',
        icon: ShoppingIcon,
    },
    {
        name: '（スーパー）',
        icon: ShoppingIcon,
    },
    {
        name: '（警察署・交番）',
        icon: KobanIcon,
    },
    {
        name: '（公園）',
        icon: ParkIcon,
    },
    {
        name: '（その他）',
        icon: UtilIcon,
    },
    {
        name: '（病院）',
        icon: HospitalIcon,
    },
    {
        name: '（ショッピングセンター）',
        icon: ShoppingIcon,
    },
    {
        name: '（銀行）',
        icon: BankIcon,
    },
    {
        name: '（ドラッグストア）',
        icon: DrugStoreIcon,
    },
    {
        name: '（郵便局）',
        icon: PostIcon,
    },
    {
        name: '（大学・短大）',
        icon: EducationIcon,
    },
    {
        name: '（小学校）',
        icon: EducationIcon,
    },
    {
        name: '（飲食店）',
        icon: RestaurantIcon,
    },
    {
        name: '（中学校）',
        icon: EducationIcon,
    },
    {
        name: '（役所）',
        icon: UtilIcon,
    },
    {
        name: '（幼稚園・保育園）',
        icon: ChildcareIcon,
    },
    {
        name: '（ホームセンター）',
        icon: UtilIcon,
    },
    {
        name: '（レンタルビデオ）',
        icon: ShoppingIcon,
    },
    {
        name: '（図書館）',
        icon: LibraryIcon,
    },
    {
        name: '（高校・高専）',
        icon: EducationIcon,
    },
];

const SectionRotator = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;

    @media only screen and (max-width: 1100px) {
        flex-direction: ${(props) => (props.reverse ? 'column-reverse' : 'column')};
    }
`;

const ProgressBar = styled.div`
    display: flex;
    width: 95%;
    margin: 2rem auto;
`;

const ProgressBarItem = ({ price, percent, color, label, start, end }) => {
    return price > 0 && percent > 0 ? (
        <div
            style={{
                width: percent + '%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                {parsePrice(price).toLocaleString() + '円'}
            </span>
            <div
                style={{
                    width: '100%',
                    height: '2rem',
                    backgroundColor: color,
                    borderRadius: start ? '0.5rem 0 0 0.5rem' : end ? '0 0.5rem 0.5rem 0' : '0',
                    margin: '10px 0',
                }}
            />
            <span style={{ fontSize: '0.9rem', color: 'grey', whiteSpace: 'nowrap' }}>{label}</span>
        </div>
    ) : (
        <div />
    );
};

const Disclaimer = styled.div`
    font-size: 0.8rem;
    color: grey;

    @media only screen and (max-width: 500px) {
        font-size: 0.6rem;
    }
`;

const getTotalExpenditure = (property) => {
    return property.set_rent * 2 + property.shikikin + property.reikin;
};

const getClosestStation = (traffics) => {
    if (!traffics || traffics.length === 0) return null;
    let lowest = Number.POSITIVE_INFINITY;
    let station, line;
    for (let i = 0; i < traffics.length; i++) {
        if (traffics[i].minute < lowest) {
            lowest = traffics[i].minute;
            station = traffics[i].station;
            line = traffics[i].line;
        }
    }
    return line + '/' + station + '駅 歩' + lowest + '分';
};

function PropertyPage({ width, propertyId, backButton }) {
    const history = useHistory();
    const [fetching, setFetching] = useState(true);
    const [bukken, setBukken] = useState(null);
    // const [recs, setRecs] = useState([]);
    const [recs1, setRecs1] = useState([]);
    const [images, setImages] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [surrounding, setSurrounding] = useState([]);
    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState(null);
    const [center, setCenter] = useState({
        lat: 35.681702400836386,
        lng: 139.76714638757284,
    });
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        document.title = '';
    }, []);

    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const onLoad = useCallback(function callback(map) {
        const placesService = new window.google.maps.places.PlacesService(map);
        setPlaces(placesService);
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    useEffect(() => {
        if (bukken && places && map) {
            if (bukken.lat && bukken.lon) {
                const dest = {
                    lat: bukken.lat,
                    lng: bukken.lon,
                };
                map.panTo(dest);
                setCenter(dest);
            } else {
                places.findPlaceFromQuery(
                    { query: bukken.address, fields: ['geometry'] },
                    function callback(e) {
                        if (e) {
                            const dest = {
                                lat: e[0].geometry.location.lat(),
                                lng: e[0].geometry.location.lng(),
                            };
                            map.panTo(dest);
                            setCenter(dest);
                        }
                    }
                );
            }
        }
    }, [bukken, places, map]);

    const fetchData = useCallback((bid) => {
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
                                setBukken(res.bukken);
                                let temp = [];
                                res.bukken.images
                                    .split(',')
                                    .forEach((image) =>
                                        temp.push({ original: image, thumbnail: image })
                                    );
                                setImages(temp);
                                temp = [];
                                res.bukken.equipment
                                    .split('、')
                                    .forEach((point) => temp.push(point));
                                setEquipment(temp);
                                temp = [];
                                res.bukken.surround.split(',').forEach((point) => {
                                    landmarkTypes.forEach((type) => {
                                        if (point.includes(type.name)) {
                                            temp.push([
                                                type.icon,
                                                point.replace('■', '').replace(type.name, ''),
                                            ]);
                                        }
                                    });
                                });
                                setSurrounding(temp);
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
                                                        setRecs1(
                                                            filterDuplicates(
                                                                filterMissingImages(res.bukkens)
                                                            )
                                                        );
                                                    }
                                                }
                                            });
                                        }
                                    })
                                    .catch((error) => console.log(error));

                                document.title = '' + res.bukken.name;
                            } else {
                            }
                            setFetching(false);
                        }
                    });
                }
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const bid = query.get('id');
        if (propertyId) {
            fetchData(propertyId);
        } else if (bid !== null) {
            fetchData(bid);
            window.scroll({ top: 0, left: 0 });
        }
    }, [fetchData, propertyId]);

    const deleteItem1 = (index) => {
        recs1.splice(index, 1);
        setRecs1(recs1.slice(0));
    };

    const saveToViewedHistory = (property) => {
        let restoredHistory = JSON.parse(localStorage.getItem('history'));
        let isDuplicate = false;
        for (let i = 0; i < restoredHistory.length; i++) {
            if (restoredHistory[i].item.suumoLink === property.suumoLink) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            restoredHistory.push({ id: Date.now(), item: property });
            localStorage.setItem('history', JSON.stringify(restoredHistory));
        }
    };

    const InfoTooltip = () => {
        return (
            <ReactTooltip
                id="help"
                place={width > 500 ? 'top' : 'left'}
                effect="solid"
                type="dark"
            >
                <span>
                </span>
            </ReactTooltip>
        );
    };

    return (
        <>
            <Wrapper show={!fetching}>
                {bukken && (
                    <Content>
                        <SectionRotator>
                            <Section
                                style={{
                                    minWidth: width <= 1100 ? 'auto' : '50%',
                                }}
                            >
                                <Header>
                                    {backButton && backButton}
                                    <h2>{bukken.name}</h2>
                                    {width > 500 && (
                                        <StyledButton
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={bukken.suumoLink}
                                            style={{
                                                backgroundColor: theme.colors.orange,
                                                boxShadow: 'none',
                                                margin: 0,
                                                marginLeft: 'auto',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <AiOutlineForm
                                                    size="20"
                                                    style={{ marginRight: '5px' }}
                                                />
                                                お問い合わせ
                                            </div>
                                        </StyledButton>
                                    )}
                                </Header>
                                <ImageGallery
                                    items={images}
                                    showFullscreenButton={false}
                                    showPlayButton={false}
                                    renderRightNav={(onClick, disabled) => (
                                        <GalleryNav right onClick={onClick} disabled={disabled}>
                                            <FaChevronRight size="20" />
                                        </GalleryNav>
                                    )}
                                    renderLeftNav={(onClick, disabled) => (
                                        <GalleryNav left onClick={onClick} disabled={disabled}>
                                            <FaChevronLeft size="20" />
                                        </GalleryNav>
                                    )}
                                />
                            </Section>
                            {width <= 500 && (
                                <StyledButton
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={bukken.suumoLink}
                                    style={{
                                        backgroundColor: theme.colors.orange,
                                        boxShadow: 'none',
                                        textAlign: 'center',
                                        width: 'auto',
                                        margin: '5px 10px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AiOutlineForm size="20" style={{ marginRight: '5px' }} />
                                        お問い合わせ
                                    </div>
                                </StyledButton>
                            )}
                            <Section style={{ width: width <= 1100 ? 'auto' : '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex' }}>
                                        <Price>
                                            <h3>家賃（管理費・共益費込み）</h3>
                                            {bukken.set_rent.toLocaleString() + '円'}
                                        </Price>
                                        <EstPrice>
                                            <h3>相場家賃</h3>
                                            <span>
                                                <s>{bukken.est_rent.toLocaleString() + '円'}</s>
                                                <div
                                                    data-tip
                                                    data-for="mainHelp"
                                                    data-event="click"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginLeft: '3px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <MdInfoOutline color="grey" />
                                                </div>
                                                <ReactTooltip
                                                    id="mainHelp"
                                                    place="left"
                                                    effect="solid"
                                                    type="dark"
                                                    globalEventOff="click"
                                                >
                                                    <span>
                                                    </span>
                                                </ReactTooltip>
                                            </span>
                                        </EstPrice>
                                    </div>

                                    <MaintenanceFee>
                                        {'(管理費・共益費: ' +
                                            bukken.maintenance_fee.toLocaleString() +
                                            '円)'}
                                    </MaintenanceFee>
                                    {bukken.est_rent - bukken.set_rent > 0 && (
                                        <Label>
                                            {(bukken.est_rent - bukken.set_rent).toLocaleString() +
                                                '円 OFF'}
                                        </Label>
                                    )}
                                    <ExtraPrices>
                                        <ul>
                                            <li>
                                                <span>敷金</span>
                                                {bukken.shikikin === 0
                                                    ? '-'
                                                    : parsePrice(bukken.shikikin)}
                                            </li>
                                            <li>
                                                <span>礼金</span>
                                                {bukken.reikin === 0
                                                    ? '-'
                                                    : parsePrice(bukken.reikin)}
                                            </li>
                                        </ul>
                                    </ExtraPrices>

                                    <ExtraDetails>
                                        <ul>
                                            <li>
                                                <div style={{ display: 'flex' }}>
                                                    <div
                                                        style={{
                                                            minWidth: '70px',
                                                            marginRight: '15px',
                                                            color: 'grey',
                                                            paddingLeft: '0.25rem',
                                                            backgroundColor: theme.colors.grey,
                                                            borderRadius: '3px',
                                                        }}
                                                    >
                                                        所在地
                                                    </div>
                                                    <div>{bukken.address}</div>
                                                </div>
                                            </li>
                                            <li>
                                                <span>間取り</span>
                                                {bukken.layout}
                                            </li>
                                            <li>
                                                <span>築年数</span>
                                                {'築' + bukken.age + '年'}
                                            </li>
                                            <li>
                                                <span>専有面積</span>
                                                {bukken.area + ' m²'}
                                            </li>
                                            <li>
                                                <span>階</span>
                                                {bukken.floor + '階'}
                                            </li>
                                            <li>
                                                <span>向き</span>
                                                {bukken.direction === '' ? '-' : bukken.direction}
                                            </li>
                                            <li>
                                                <span>建物種別</span>
                                                {bukken.structure === 0 ? 'アパート' : 'マンション'}
                                            </li>
                                        </ul>
                                    </ExtraDetails>

                                    <StationDetails>
                                        <span>駅徒歩</span>
                                        <ul>
                                            {bukken.traffics.map((station, index) => (
                                                <li key={index}>
                                                    <a
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={'/search?kcode=' + station.kcode}
                                                    >
                                                        {station.line_name +
                                                            '/' +
                                                            station.station_name +
                                                            '駅'}
                                                    </a>
                                                    {' - ' + station.minute}分
                                                </li>
                                            ))}
                                        </ul>
                                    </StationDetails>
                                </div>
                            </Section>
                        </SectionRotator>

                        <Section>
                            <h2>初期費用見積もり</h2>
                            <div
                                style={{
                                    fontSize: '1.5rem',
                                    marginLeft: '10px',
                                    marginBottom: '20px',
                                    fontWeight: 'bold',
                                    color: theme.colors.cherry,
                                }}
                            >
                                <u>
                                    {'合計：約' +
                                        parsePrice(getTotalExpenditure(bukken)).toLocaleString() +
                                        '円'}
                                </u>
                            </div>

                            <ProgressBar>
                                <ProgressBarItem
                                    price={bukken.set_rent}
                                    percent={(bukken.set_rent / getTotalExpenditure(bukken)) * 100}
                                    color={theme.colors.cherry}
                                    label="前家賃"
                                    start
                                />
                                <ProgressBarItem
                                    price={bukken.shikikin}
                                    percent={(bukken.shikikin / getTotalExpenditure(bukken)) * 100}
                                    color="rgb(121,187,255)"
                                    label="敷金"
                                />
                                <ProgressBarItem
                                    price={bukken.reikin}
                                    percent={(bukken.reikin / getTotalExpenditure(bukken)) * 100}
                                    color="#e2e289"
                                    label="礼金"
                                />
                                <ProgressBarItem
                                    price={bukken.set_rent - bukken.maintenance_fee}
                                    percent={
                                        ((bukken.set_rent - bukken.maintenance_fee) /
                                            getTotalExpenditure(bukken)) *
                                        100
                                    }
                                    color="rgb(62,222,170)"
                                    label="仲介手数料"
                                    end
                                />
                            </ProgressBar>

                            <Disclaimer>
                            </Disclaimer>
                        </Section>

                        <Section>
                            <h2>概要</h2>
                            <Summary>
                                <ul>
                                    <li>
                                        <span>間取り詳細</span>
                                        {bukken.layout_detail}
                                    </li>
                                    <li>
                                        <span>階建</span>
                                        {bukken.total_floor + '階'}
                                    </li>
                                    <li>
                                        <span>損保</span>
                                        {bukken.insurance}
                                    </li>
                                    <li>
                                        <span>入居</span>
                                        {bukken.movein}
                                    </li>
                                    <li>
                                        <div style={{ display: 'flex' }}>
                                            <div
                                                style={{
                                                    minWidth: '100px',
                                                    marginRight: '15px',
                                                    color: 'grey',
                                                    paddingLeft: '0.25rem',
                                                    backgroundColor: theme.colors.grey,
                                                    borderRadius: '3px',
                                                }}
                                            >
                                                条件
                                            </div>
                                            <div>{bukken.condition}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <span>構造</span>
                                        {bukken.structure_detail}
                                    </li>
                                    <li>
                                        <span>築年月</span>
                                        {bukken.build_year}
                                    </li>
                                    <li>
                                        <span>駐車場</span>
                                        {bukken.parking}
                                    </li>
                                    <li>
                                        <span>取引態様</span>
                                        {bukken.contract_type}
                                    </li>
                                    <li>
                                        <span>総戸数</span>
                                        {bukken.total_rooms}
                                    </li>
                                    <li>
                                        <div style={{ display: 'flex' }}>
                                            <div
                                                style={{
                                                    minWidth: '100px',
                                                    marginRight: '15px',
                                                    color: 'grey',
                                                    paddingLeft: '0.25rem',
                                                    backgroundColor: theme.colors.grey,
                                                    borderRadius: '3px',
                                                }}
                                            >
                                                保証会社
                                            </div>
                                            <div>{bukken.guarantor}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div style={{ display: 'flex' }}>
                                            <div
                                                style={{
                                                    minWidth: '100px',
                                                    marginRight: '15px',
                                                    color: 'grey',
                                                    paddingLeft: '0.25rem',
                                                    backgroundColor: theme.colors.grey,
                                                    borderRadius: '3px',
                                                }}
                                            >
                                                ほか諸費用
                                            </div>
                                            <div>{bukken.other_costs}</div>
                                        </div>
                                    </li>
                                </ul>
                            </Summary>
                        </Section>

                        <Section
                            dropdown={equipment.length > 9}
                            toggle={showDetails}
                            style={{ minHeight: '200px' }}
                        >
                            <h2 onClick={() => setShowDetails(!showDetails)}>
                                特徴・設備
                                <span>
                                    {showDetails ? (
                                        <FaChevronUp size="20" />
                                    ) : (
                                        <FaChevronDown size="20" />
                                    )}
                                </span>
                            </h2>
                            <BulletPoints columns={3}>
                                {equipment.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </BulletPoints>
                            {equipment.length > 9 && !showDetails && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        height: '100%',
                                        width: '100%',
                                        pointerEvents: 'none',
                                        background:
                                            'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 70%, rgba(255,255,255,0) 100%)',
                                    }}
                                />
                            )}
                        </Section>

                        <SectionRotator reverse>
                            <Section style={{ width: width > 1100 ? '100%' : 'auto' }}>
                                <h2>地図</h2>
                                {!propertyId ? (
                                    <LoadScript
                                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                        libraries={libraries}
                                    >
                                        <GoogleMap
                                            mapContainerStyle={containerStyle}
                                            center={center}
                                            zoom={16}
                                            onLoad={onLoad}
                                            onUnmount={onUnmount}
                                        >
                                            {/* Child components, such as markers, info windows, etc. */}
                                            <Marker position={center} />
                                        </GoogleMap>
                                    </LoadScript>
                                ) : (
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={center}
                                        zoom={16}
                                        onLoad={onLoad}
                                        onUnmount={onUnmount}
                                    >
                                        {/* Child components, such as markers, info windows, etc. */}
                                        <Marker position={center} />
                                    </GoogleMap>
                                )}
                            </Section>
                            {surrounding.length > 0 && surrounding[0] !== '' && (
                                <Section style={{ width: width > 1100 ? '60%' : 'auto' }}>
                                    <h2>周辺情報</h2>
                                    <BulletPointsWithIcons>
                                        {surrounding.map((e, i) => (
                                            <li key={i}>
                                                <img alt="" src={e[0]} />
                                                {e[1]}
                                            </li>
                                        ))}
                                    </BulletPointsWithIcons>
                                </Section>
                            )}
                        </SectionRotator>
                        {recs1.length > 0 && (
                            <Section>
                                <h2>近隣のおすすめ物件</h2>
                                <StyledCarousel>
                                    <Slider {...recSliderSettings}>
                                        {recs1.slice(0, 20).map((property, index) => (
                                            <div key={index}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        margin: width <= 600 ? '0' : '5px',
                                                    }}
                                                >
                                                    <PropertyCard
                                                        onClick={() => {
                                                            saveToViewedHistory(property);
                                                            history.push(
                                                                window.location.search.replace(
                                                                    `&id=${bukken.id}`,
                                                                    `&id=${property.bid}`
                                                                )
                                                            );
                                                            window.scroll({ top: 0, left: 0 });
                                                        }}
                                                        image={
                                                            property.image === ''
                                                                ? Placeholder
                                                                : property.image
                                                        }
                                                        name={property.name}
                                                        address={property.address}
                                                        station={getClosestStation(
                                                            property.traffics
                                                        )}
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
                                                        onInvalidImage={() => {
                                                            deleteItem1(index);
                                                        }}
                                                        forceDesktop
                                                        stretch
                                                        disableTooltip
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                    <InfoTooltip />
                                </StyledCarousel>
                            </Section>
                        )}
                    </Content>
                )}
            </Wrapper>
            <Loader show={fetching} />
        </>
    );
}

export default withRouter(PropertyPage);

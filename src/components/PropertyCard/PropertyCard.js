// Copyright 2021, Banson Tong, All rights reserved

import React, { useRef } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';
import ReactTooltip from 'react-tooltip';

import { MdInfoOutline } from 'react-icons/md';
import { FiChevronRight } from 'react-icons/fi';

const StyledPropertyCard = styled.div`
    height: ${({ rowLayout }) => (rowLayout ? 'auto' : '380px')};
    min-height: ${({ rowLayout }) => (rowLayout ? 'auto' : '380px')};
    width: 100%;
    min-width: ${({ rowLayout }) => (rowLayout ? '100%' : '240px')};
    max-width: ${({ rowLayout, stretch }) => (rowLayout ? '100%' : stretch ? '300px' : '240px')};
    display: flex;
    // background-color: white;
    // box-shadow: 0px 0px 10px rgba(0.2, 0.2, 0.2, 0.1);
    // border-radius: 8px;
    // border-radius: 3px;
    cursor: pointer;
    margin: ${({ rowLayout }) => (rowLayout ? '5px 0' : '5px')};
    box-sizing: border-box;
    padding: ${({ rowLayout }) => (rowLayout ? '0 10px' : '0')};

    transition: transform 200ms ease-in-out, box-shadow 200ms ease-in-out, height 200ms ease-in-out;

    border: ${(props) =>
        props.selected ? '3px solid ' + theme.colors.cherry : '2px solid transparent'};

    @media only screen and (min-width: 1000px) {
        &:hover {
            // box-shadow: 0px 0px 10px rgba(0.1, 0.1, 0.1, 0.25);
        }
    }

    @media only screen and (max-width: 1000px) {
        min-width: ${(props) =>
            props.forceDesktop ? '240px' : props.rowLayout ? '100%' : '500px'};
        max-width: ${(props) =>
            props.forceDesktop
                ? props.stretch
                    ? '300px'
                    : '240px'
                : props.rowLayout
                ? '100%'
                : '700px'};
        height: ${(props) => (props.forceDesktop ? '360px' : 'auto')};
        min-height: ${(props) => (props.forceDesktop ? '360px' : 'auto')};
        margin: ${(props) => (props.forceDesktop ? '5px' : '5px 0')};
        padding: ${(props) => (props.forceDesktop ? '0' : '0 10px')};
    }

    @media only screen and (max-width: 500px) {
        min-width: ${(props) => (props.forceDesktop ? '240px' : '100%')};
        max-width: ${(props) =>
            props.forceDesktop ? (props.stretch ? '300px' : '240px') : '100%'};
        height: ${(props) => (props.forceDesktop ? '360px' : '210px')};
        min-height: ${(props) => (props.forceDesktop ? '360px' : '210px')};
        margin: ${(props) => (props.forceDesktop ? '5px' : '5px 0')};
        border-radius: ${(props) => (props.forceDesktop ? '8px' : 0)};
        padding: 0 10px;
    }
`;

const StyledPropertyImage = styled.div`
    width: 100%;
    border-radius: ${({ rowLayout }) => (rowLayout ? '5px' : '5px')};
    height: 180px;
    max-width: 350px;
    min-height: 180px;
    object-fit: cover;
    // border: 1px solid ${theme.colors.grey};

    img {
        width: 100%;
        height: 180px;
        max-width: 350px;
        min-height: 180px;
        object-fit: cover;
    }

    @media only screen and (max-width: 1000px) {
        width: ${(props) => (props.forceDesktop ? '100%' : '100%')};
        min-width: 100%;
        height: ${(props) => (props.forceDesktop ? '180px' : '180px')};
        min-height: ${(props) => (props.forceDesktop ? '180px' : '100px')};
        border-radius: ${(props) => (props.forceDesktop ? '5px' : '5px')};

        img {
            width: ${(props) => (props.forceDesktop ? '100%' : '100%')};
            min-width: 100%;
            height: ${(props) => (props.forceDesktop ? '180px' : '180px')};
            min-height: ${(props) => (props.forceDesktop ? '180px' : '100px')};
        }
    }

    @media only screen and (max-width: 500px) {
        height: ${(props) => (props.forceDesktop ? '180px' : '130px')};

        img {
            height: ${(props) => (props.forceDesktop ? '180px' : '130px')};
        }
    }
`;

const Rotator = styled.div`
    display: flex;
    flex-direction: ${({ rowLayout }) => (rowLayout ? 'row' : 'column')};
    // padding-left: ${({ rowLayout }) => (rowLayout ? '10px' : '0')};
    @media only screen and (max-width: 1000px) {
        flex-direction: ${(props) => (props.forceDesktop ? 'column' : 'row')};
        // padding: ${(props) => (props.forceDesktop ? '0' : '0 10px')};
    }
`;

const OtokuLabel = styled.div`
    height: 2rem;
    line-height: 2rem;
    width: auto;
    // max-width: 150px;
    background-color: ${theme.colors.accent};
    // position: absolute;
    // top: -25px;
    // left: 5px;
    border-radius: 5px;
    color: white;
    font-size: 1rem;
    vertical-align: center;
    text-align: center;
    box-shadow: 0px 3px ${theme.colors.darkGrey};
    padding: 0 5px 0 10px;

    @media only screen and (max-width: 1000px) {
        // top: -25px;
        // left: -5px;
    }
`;

const StyledPropertyContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;

    @media only screen and (max-width: 1000px) {
    }

    @media only screen and (max-width: 500px) {
    }
`;

const StyledPropertyTitle = styled.div`
    font-size: 1.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    color: ${theme.colors.textGrey};
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-bottom: solid 2px ${theme.colors.grey};
    padding: ${(props) => (props.rowLayout ? '0' : '5px 0')};

    @media only screen and (max-width: 1000px) {
        padding: ${(props) => (props.rowLayout ? '5px 0' : '5px 10px')};
    }
`;

const StyledPropertyAddress = styled.div`
    font-size: 0.8rem;
    color: grey;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // padding: 0 10px;

    @media only screen and (max-width: 1000px) {
        width: ${(props) => (props.forceDesktop ? 'auto' : '100%')};
        padding: ${(props) => (props.forceDesktop ? '0 10px' : 0)};
    }
`;

const StyledPropertyStation = styled.div`
    font-size: 0.9rem;
    // padding: 0 10px;
`;

const StyledPropertyDetails = styled.div`
    font-size: 0.9rem;
    color: grey;
    // padding: ${({ rowLayout }) => (rowLayout ? '0 10px' : '0px')};
    height: auto;

    @media only screen and (max-width: 1000px) {
        // padding: ${(props) => (props.forceDesktop ? '0' : '10px 0 0 0')};
    }

    @media only screen and (max-width: 500px) {
        font-size: 0.8rem;
    }
`;

const StyledPrices = styled.div`
    position: relative;
    padding: ${({ rowLayout }) => (rowLayout ? '5px' : '0px')};
    border-radius: ${({ rowLayout }) => (rowLayout ? '10px' : '0px 0px 10px 10px')};
    // margin-top: 25px;
    justify-content: center;
    font-size: 0.9rem;
    // border-top: ${({ rowLayout }) => (rowLayout ? '0' : '2px solid ' + theme.colors.grey)};
    background-color: ${({ rowLayout }) => (rowLayout ? theme.colors.grey : 'transparent')};
    // margin-left: ${({ rowLayout }) => (rowLayout ? '10px' : '0')};
    // margin-right: ${({ rowLayout }) => (rowLayout ? '10px' : '0')};
    margin-bottom: ${({ rowLayout }) => (rowLayout ? '10px' : '0')};
    white-space: nowrap;

    @media only screen and (max-width: 1000px) {
        border-radius: ${(props) => (props.forceDesktop ? '0px 0px 10px 10px' : '5px')};
        // margin-left: ${(props) => (props.forceDesktop ? '0' : '10px')};
        margin-bottom: 5px;
        background-color: ${(props) => (props.forceDesktop ? 'white' : theme.colors.grey)};
        // border-top: ${(props) => (props.forceDesktop ? '2px solid ' + theme.colors.grey : 0)};
        padding: ${(props) => (props.forceDesktop ? '0' : '8px')};
    }
`;

const StyledPropertyEstimatedPrice = styled.div`
    display: flex;
    margin-top: 5px;
    color: ${theme.colors.textGrey};
    @media only screen and (max-width: 500px) {
    }
`;

const StyledPropertyPrice = styled.div`
    font-weight: bold;
    font-size: 1.3rem;
    color: ${(props) => (props.color ? props.color : theme.colors.textGrey)};
    @media only screen and (max-width: 500px) {
        font-size: 1.1rem;
    }
`;

const PropertyContent = ({
    image,
    rowLayout,
    location,
    address,
    estimatedPrice,
    name,
    price,
    area,
    distance,
    floor,
    age,
    layout,
    url,
    onClick,
    windowWidth,
    hideArrow,
    onInvalidImage,
    showNegativeLabel,
    forceDesktop,
    disableTooltip,
    station,
    images,
}) => {
    let priceDiff = estimatedPrice - price;

    const helpButton = useRef(null);

    return (
        <StyledPropertyContent rowLayout={rowLayout}>
            {!forceDesktop && windowWidth <= 1000 && (
                <StyledPropertyTitle rowLayout={rowLayout}>
                    <div
                        style={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            whiteSpace: 'nowwrap',
                            textOverflow: 'ellipsis',
                            lineHeight: '30px',
                            height: '30px',
                            verticalAlign: 'middle',
                        }}
                    >
                        {name}
                    </div>
                    {!hideArrow && (
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <FiChevronRight size="18" />
                        </div>
                    )}
                </StyledPropertyTitle>
            )}

            <Rotator rowLayout={rowLayout} forceDesktop={forceDesktop}>
                <div
                    style={{
                        width: forceDesktop || (!rowLayout && windowWidth > 1000) ? '100%' : '45%',
                    }}
                >
                    <StyledPropertyImage
                        rowLayout={rowLayout}
                        forceDesktop={forceDesktop}
                    >
                        <img
                            src={image}
                            alt=""
                            onLoad={(e) => {
                                if (
                                    e.target.naturalHeight === 100 &&
                                    e.target.naturalWidth === 100
                                ) {
                                    onInvalidImage();
                                }
                            }}
                        />
                    </StyledPropertyImage>
                    {!forceDesktop && windowWidth <= 1000 && (
                        <StyledPropertyAddress style={{ paddingBottom: '5px' }}>
                            {address}
                        </StyledPropertyAddress>
                    )}
                </div>
                <div
                    style={{
                        width:
                            forceDesktop || (!rowLayout && windowWidth > 1000)
                                ? '100%'
                                : 'calc(55% - 10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        paddingLeft:
                            forceDesktop || (!rowLayout && windowWidth > 1000) ? '0' : '10px',
                    }}
                >
                    {(forceDesktop || windowWidth > 1000) && (
                        <StyledPropertyTitle rowLayout={rowLayout}>
                            <div
                                style={{
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowwrap',
                                    textOverflow: 'ellipsis',
                                    lineHeight: '30px',
                                    height: '30px',
                                    verticalAlign: 'middle',
                                }}
                            >
                                {name}
                            </div>
                            {!hideArrow && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <FiChevronRight size="18" />
                                </div>
                            )}
                        </StyledPropertyTitle>
                    )}
                    <StyledPrices rowLayout={rowLayout} forceDesktop={forceDesktop}>
                        {priceDiff > 0 ? (
                            <OtokuLabel>
                                <span style={{ fontSize: '0.95rem' }}>月</span>
                                <b>{priceDiff.toLocaleString()}</b>
                                <span style={{ fontSize: '0.95rem' }}>円お得！</span>
                            </OtokuLabel>
                        ) : (
                            showNegativeLabel && (
                                <OtokuLabel style={{ backgroundColor: theme.colors.negativeBlue }}>
                                    <span style={{ fontSize: '0.95rem' }}>月</span>
                                    <b>{Math.abs(priceDiff).toLocaleString()}</b>
                                    <span style={{ fontSize: '0.95rem' }}>円損！</span>
                                </OtokuLabel>
                            )
                        )}
                        <StyledPropertyEstimatedPrice>
                            <div style={{ marginRight: '5px' }}>相場家賃:</div>
                            {estimatedPrice ? (
                                <strike>{parseInt(estimatedPrice).toLocaleString() + '円'}</strike>
                            ) : (
                                <span>-</span>
                            )}

                            <div
                                ref={helpButton}
                                data-tip
                                data-for="help"
                                data-event="click"
                                style={{ display: 'flex', alignItems: 'center', marginLeft: '3px' }}
                            >
                                <MdInfoOutline color="grey" />
                            </div>
                            {!disableTooltip && (
                                <ReactTooltip
                                    id="help"
                                    place={windowWidth > 500 ? 'top' : 'left'}
                                    effect="solid"
                                    type="dark"
                                    // globalEventOff="click"
                                >
                                    <span>
                                        相場家賃は、2000万件を超える不動産価格
                                        <br />
                                        データベースから独自に計算されています。
                                    </span>
                                </ReactTooltip>
                            )}
                        </StyledPropertyEstimatedPrice>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div
                                    style={{
                                        marginRight: '5px',
                                        height: '100%',
                                        lineHeight: '2rem',
                                        verticalAlign: 'bottom',
                                    }}
                                >
                                    掲載家賃:
                                </div>
                                <StyledPropertyPrice
                                    color={priceDiff >= 0 ? '#ff0023' : theme.colors.negativeBlue}
                                >
                                    {parseInt(price).toLocaleString() + '円'}
                                </StyledPropertyPrice>
                            </div>
                        </div>
                    </StyledPrices>
                    {station && <StyledPropertyStation>{station}</StyledPropertyStation>}
                    {!station && (forceDesktop || windowWidth > 1000) && (
                        <StyledPropertyAddress forceDesktop={forceDesktop}>
                            {address}
                        </StyledPropertyAddress>
                    )}
                    <StyledPropertyDetails rowLayout={rowLayout} forceDesktop={forceDesktop}>
                        {layout + ' / ' + area + ' m²'}{' '}
                        {distance && (windowWidth <= 500 || !rowLayout) ? <br /> : ' / '}
                        {(distance ? '徒歩' + distance + '分 / ' : '') +
                            floor +
                            '階 / ' +
                            (parseInt(age) === 0 ? '新築' : '築' + parseInt(age) + '年')}
                    </StyledPropertyDetails>
                </div>
            </Rotator>
        </StyledPropertyContent>
    );
};

const PropertyCard = ({
    onClick,
    rowLayout,
    stretch,
    image,
    location,
    address,
    name,
    estimatedPrice,
    price,
    area,
    distance,
    floor,
    layout,
    age,
    url,
    bid,
    windowWidth,
    hideArrow,
    onInvalidImage,
    showNegativeLabel,
    forceDesktop,
    disableTooltip,
    station,
    images,
    selected,
    onMouseEnter,
    onMouseLeave,
}) => {
    // const history = useHistory();

    return (
        <StyledPropertyCard
            rowLayout={rowLayout}
            stretch={stretch}
            forceDesktop={forceDesktop}
            onClick={() => {
                onClick();
            }}
            selected={selected}
            onMouseEnter={() => {
                if (onMouseEnter) onMouseEnter();
            }}
            onMouseLeave={() => {
                if (onMouseLeave) onMouseLeave();
            }}
        >
            <PropertyContent
                image={image}
                images={images}
                rowLayout={rowLayout}
                location={location}
                address={address}
                name={name}
                estimatedPrice={estimatedPrice}
                price={price}
                area={area}
                distance={distance}
                floor={floor}
                age={age}
                layout={layout}
                url={url}
                onClick={onClick}
                windowWidth={windowWidth}
                hideArrow={hideArrow}
                onInvalidImage={() => {
                    if (onInvalidImage) onInvalidImage();
                }}
                showNegativeLabel={showNegativeLabel}
                forceDesktop={forceDesktop}
                disableTooltip={disableTooltip}
                station={station}
            />
        </StyledPropertyCard>
    );
};

export default PropertyCard;

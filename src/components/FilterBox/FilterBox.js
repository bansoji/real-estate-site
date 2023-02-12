// Copyright 2021, Banson Tong, All rights reserved

import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';
import { useHistory } from 'react-router-dom';

import Select from '../../components/Select/Select';
import StyledButton from '../../components/StyledButton/StyledButton';

import { MdCheckBox, MdCheckBoxOutlineBlank, MdClose } from 'react-icons/md';
import { BsArrowCounterclockwise, BsArrowRight } from 'react-icons/bs';

const FilterSettings = styled.div`
    // background-color: white;
    align-items: center;
    justify-content: center;
    justify-items: center;
    color: ${theme.colors.textGrey};
    display: flex;
    flex-direction: column;
    height: ${({ overlayOpen }) => (overlayOpen ? '100%' : '0px')};
    overflow-y: ${({ overlayOpen }) => (overlayOpen ? 'visible' : 'hidden')};
    padding: 0 10px 10px 10px;
    justify-content: flex-start;
    // margin: 0px 20px 0 0;
    position: relative;
    border-radius: 5px;
    // border: 1px solid ${theme.colors.grey};
    min-width: 300px;
    font-size: 0.9rem;

    @media only screen and (max-width: 1000px) {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 0px;
        padding: 0;
        z-index: 20;
        overflow-y: ${({ overlayOpen }) => (overlayOpen ? 'scroll' : 'hidden')};
        border-radius: 0px;
        min-width: auto;
        width: 100%;
        background-color: white;
        font-size: 1rem;
    }
`;

const CloseFilterSettingsButton = styled.button`
    position: absolute;
    right: 10px;
    top: 10px;
    border: 0;
    width: 2rem;
    height: 2rem;
    background-color: transparent;
    color: white;
    visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
    z-index: 6;
    cursor: pointer;
`;

const FilterSettingsHeader = styled.div`
    display: flex;
    height: 50px;
    font-weight: bold;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    left: 0;
    color: ${theme.colors.textGrey};
    font-size: 1rem;
    border-bottom: 1px solid ${theme.colors.grey};

    @media only screen and (max-width: 1000px) {
        background-color: ${theme.colors.accent};
        color: white;
        position: sticky;
        top: 0;
        z-index: 5;
        visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
    }
`;

const FilterSectionHeader = styled.span`
    font-size: 0.9rem;
    font-weight: bold;
    width: 97%;
    padding: 10px 0;
    padding-left: 3%;
    margin-top: 15px;

    @media only screen and (max-width: 1000px) {
        margin-top: 0px;
        background-color: ${theme.colors.grey};
        font-size: 1rem;
    }
`;

const FilterSubmitButton = styled.div`
    position: sticky;
    bottom: 0;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.8) 85%,
        rgba(255, 255, 255, 0) 100%
    );
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;

    button {
        margin: 20px 5px;
        background-color: white;

        font-weight: bold;

        &:hover {
            background-color: white;
        }
    }

    #search_button {
        width: 100%;
        border: 2px solid ${theme.colors.accent};
        color: ${theme.colors.accent};
    }

    #reset_button {
        width: 50%;
        border: 2px solid ${theme.colors.textGrey};
        color: ${theme.colors.textGrey};
    }

    @media only screen and (min-width: 1000px) {
        #search_button {
            &:hover {
                background-color: ${theme.colors.accent};
                color: white;
            }
        }

        #reset_button {
            &:hover {
                background-color: ${theme.colors.textGrey};
                color: white;
            }
        }
    }
`;

const priceFilterOptions = [
    '指定なし',
    '3万',
    '3.5万',
    '4万',
    '4.5万',
    '5万',
    '5.5万',
    '6万',
    '6.5万',
    '7万',
    '7.5万',
    '8万',
    '8.5万',
    '9万',
    '9.5万',
    '10万',
    '10.5万',
    '11万',
    '11.5万',
    '12万',
    '12.5万',
    '13万',
    '13.5万',
    '14万',
    '14.5万',
    '15万',
    '15.5万',
    '16万',
    '16.5万',
    '17万',
    '17.5万',
    '18万',
    '18.5万',
    '19万',
    '19.5万',
    '20万',
    '21万',
    '22万',
    '23万',
    '24万',
    '25万',
    '26万',
    '27万',
    '28万',
    '29万',
    '30万',
    '35万',
    '40万',
    '50万',
    '100万',
];

const ageFilterOptions = [
    '指定なし',
    '～1年',
    '～3年',
    '～5年',
    '～7年',
    '～10年',
    '～15年',
    '～20年',
    '～25年',
    '～30年',
];

const areaFilterOptions = [
    '指定なし',
    '20m²',
    '25m²',
    '30m²',
    '40m²',
    '50m²',
    '60m²',
    '70m²',
    '80m²',
    '90m²',
    '100m²',
];

const distanceFilterOptions = [
    '指定なし',
    '1分以内',
    '5分以内',
    '7分以内',
    '10分以内',
    '15分以内',
    '20分以内',
];

const layoutFilters = [
    'ワンルーム',
    '1K',
    '1DK',
    '1LDK',
    '2K',
    '2DK',
    '2LDK',
    '3K',
    '3DK',
    '3LDK',
    '4K',
    '4DK',
    '4LDK',
    '5以上',
];

const directionFilters = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];

const structureFilters = ['アパート', 'マンション'];

const materialFilters = ['鉄筋コン', '鉄骨', '木造', 'その他'];

const StyledRangeBoxContent = styled.div`
    display: flex;
    height: auto;
    justify-content: center;
    flex-shrink: 0;
`;

function FilterBox({
    filterOverlayOpen,
    setFilterOverlayOpen,
    width,
    searchParams,
    setFilteredProperties,
    properties,
    onInit,
    onFilter,
    filteredPropsInit,
    showCloseBtn,
    closeOnSubmit,
    hideHeader,
    queryOnly,
}) {
    const history = useHistory();

    const [minPriceFilter, setMinPriceFilter] = useState(priceFilterOptions[0]);
    const [maxPriceFilter, setMaxPriceFilter] = useState(priceFilterOptions[0]);
    const isPriceValid = useCallback(
        (property) => {
            const parsedMin = parseFloat(minPriceFilter.replace('万', '')) * 10000;
            const parsedMax = parseFloat(maxPriceFilter.replace('万', '')) * 10000;
            if (
                minPriceFilter !== priceFilterOptions[0] &&
                parseInt(property.set_rent) < parsedMin
            ) {
                return false;
            }
            if (
                (maxPriceFilter !== priceFilterOptions[0] || parsedMax > parsedMin) &&
                parseInt(property.set_rent) > parsedMax
            ) {
                return false;
            }
            return true;
        },
        [minPriceFilter, maxPriceFilter]
    );

    const [karitokuFilter, setKaritokuFilter] = useState(false);
    const isKaritokuValid = useCallback(
        (property) => {
            return !karitokuFilter || (karitokuFilter && property.est_rent - property.set_rent > 0);
        },
        [karitokuFilter]
    );

    const [ageFilter, setAgeFilter] = useState(ageFilterOptions[0]);
    const isAgeValid = useCallback(
        (property) => {
            return (
                ageFilter === ageFilterOptions[0] ||
                property.age <= parseInt(ageFilter.replace('～', '').replace('年', ''))
            );
        },
        [ageFilter]
    );

    const [minAreaFilter, setMinAreaFilter] = useState(areaFilterOptions[0]);
    const [maxAreaFilter, setMaxAreaFilter] = useState(areaFilterOptions[0]);
    const isAreaValid = useCallback(
        (property) => {
            if (
                minAreaFilter !== areaFilterOptions[0] &&
                parseInt(property.area) < parseFloat(minAreaFilter.replace('m²', ''))
            )
                return false;
            if (
                (maxAreaFilter !== areaFilterOptions[0] ||
                    parseInt(maxAreaFilter.replace('m²', '')) >
                        parseInt(minAreaFilter.replace('m²', ''))) &&
                parseFloat(property.area) > parseInt(maxAreaFilter.replace('m²', ''))
            )
                return false;
            return true;
        },
        [minAreaFilter, maxAreaFilter]
    );

    const [distanceFilter, setDistanceFilter] = useState(distanceFilterOptions[0]);
    const isDistanceValid = useCallback(
        (property) => {
            return (
                distanceFilter === distanceFilterOptions[0] ||
                parseFloat(property.minute) <= parseFloat(distanceFilter.replace('分以内', ''))
            );
        },
        [distanceFilter]
    );

    // detail filters

    const [bathToiletFilter, setBathToiletFilter] = useState(false);
    const [deliveryBoxFilter, setDeliveryBoxFilter] = useState(false);
    const [petsFilter, setPetsFilter] = useState(false);
    const [secondFloorAboveFilter, setSecondFloorAboveFilter] = useState(false);
    const [washingMachineAreaFilter, setWashingMachineAreaFilter] = useState(false);
    const [autoLockFilter, setAutoLockFilter] = useState(false);
    const [airConFilter, setAirConFilter] = useState(false);
    const [flooringFilter, setFlooringFilter] = useState(false);
    const [separateSinkFilter, setSeparateSinkFilter] = useState(false);
    const [interphoneFilter, setInterphoneFilter] = useState(false);
    const [reheatingFilter, setReheatingFilter] = useState(false);
    const [securitySystemFilter, setSecuritySystemFilter] = useState(false);
    const [multiStoveFilter, setMultiStoveFilter] = useState(false);
    const [cityGasFilter, setCityGasFilter] = useState(false);
    const [elevatorFilter, setElevatorFilter] = useState(false);
    const [freeInternetFilter, setFreeInternetFilter] = useState(false);
    const [cornerRoomFilter, setCornerRoomFilter] = useState(false);
    const [systemKitchenFilter, setSystemKitchenFilter] = useState(false);
    const [bathroomHumidifierFilter, setBathroomHumidifierFilter] = useState(false);
    const [parkingFilter, setParkingFilter] = useState(false);

    const [currentLayoutFilters, setCurrentLayoutFilters] = useState([]);

    const [filtersInit, setFiltersInit] = useState(false);

    const isLayoutValid = useCallback(
        (property) => {
            return (
                currentLayoutFilters.length === 0 ||
                currentLayoutFilters.includes(property.layout) ||
                (parseInt(property.layout.charAt(0)) > 5 && currentLayoutFilters.includes('5以上'))
            );
        },
        [currentLayoutFilters]
    );

    const [currentDirectionFilters, setCurrentDirectionFilters] = useState([]);

    const isDirectionValid = useCallback(
        (property) => {
            return (
                currentDirectionFilters.length === 0 ||
                currentDirectionFilters.includes(property.direction)
            );
        },
        [currentDirectionFilters]
    );

    const [currentStructureFilters, setCurrentStructureFilters] = useState([]);

    const isStructureValid = useCallback(
        (property) => {
            return (
                currentStructureFilters.length === 0 ||
                (property.structure === 0 && currentStructureFilters.includes('アパート')) ||
                (property.structure === 1 && currentStructureFilters.includes('マンション'))
            );
        },
        [currentStructureFilters]
    );

    const [currentMaterialFilters, setCurrentMaterialFilters] = useState([]);

    const isDetailValid = useCallback(
        (property) => {
            return (
                ((bathToiletFilter && property.bts === 1) || !bathToiletFilter) &&
                ((deliveryBoxFilter && property.db === 1) || !deliveryBoxFilter) &&
                ((petsFilter && property.pet_available === 1) || !petsFilter) &&
                ((secondFloorAboveFilter && parseInt(property.floor) >= 2) ||
                    !secondFloorAboveFilter) &&
                ((washingMachineAreaFilter && property.iwmp === 1) || !washingMachineAreaFilter) &&
                ((autoLockFilter && property.automatic_lock === 1) || !autoLockFilter) &&
                ((airConFilter && property.air_con === 1) || !airConFilter) &&
                ((flooringFilter && property.wooden_floor === 1) || !flooringFilter) &&
                ((separateSinkFilter && property.separate_sink === 1) || !separateSinkFilter) &&
                ((interphoneFilter && property.interphone_with_monitor === 1) ||
                    !interphoneFilter) &&
                ((reheatingFilter && property.reheating === 1) || !reheatingFilter) &&
                ((securitySystemFilter && property.security_system === 1) ||
                    !securitySystemFilter) &&
                ((multiStoveFilter && property.multi_stove === 1) || !multiStoveFilter) &&
                ((cityGasFilter && property.city_gas === 1) || !cityGasFilter) &&
                ((elevatorFilter && property.elv === 1) || !elevatorFilter) &&
                ((freeInternetFilter && property.free_internet === 1) || !freeInternetFilter) &&
                ((cornerRoomFilter && property.corner_room === 1) || !cornerRoomFilter) &&
                ((systemKitchenFilter && property.system_kitchen === 1) || !systemKitchenFilter) &&
                ((bathroomHumidifierFilter && property.bathroom_dehumidifier === 1) ||
                    !bathroomHumidifierFilter) &&
                ((parkingFilter && property.parking !== '-') || !parkingFilter) &&
                isLayoutValid(property) &&
                isDirectionValid(property) &&
                isStructureValid(property)
            );
        },
        [
            bathToiletFilter,
            deliveryBoxFilter,
            petsFilter,
            secondFloorAboveFilter,
            washingMachineAreaFilter,
            autoLockFilter,
            airConFilter,
            flooringFilter,
            separateSinkFilter,
            interphoneFilter,
            reheatingFilter,
            securitySystemFilter,
            multiStoveFilter,
            cityGasFilter,
            elevatorFilter,
            freeInternetFilter,
            cornerRoomFilter,
            systemKitchenFilter,
            bathroomHumidifierFilter,
            parkingFilter,
            isLayoutValid,
            isDirectionValid,
            isStructureValid,
        ]
    );

    const CheckboxFilterItem = ({ children, onChange, customWidth, checked }) => {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 15px',
                    width: customWidth ? customWidth : '200px',
                    flexShrink: '0',
                    boxSizing: 'border-box',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: '1rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                    onClick={() => onChange({ value: children, checked: !checked })}
                >
                    {checked ? (
                        <MdCheckBox size="25" color={theme.colors.accent} />
                    ) : (
                        <MdCheckBoxOutlineBlank size="25" />
                    )}
                    <span style={{ paddingLeft: '5px' }}>{children}</span>
                </div>
            </div>
        );
    };

    const GroupedCheckboxFilters = ({
        label,
        options,
        optionStates,
        setOptionStates,
        customWidth,
    }) => {
        const handleChange = (event) => {
            let states = optionStates.splice(0);
            if (event.checked) {
                if (!states.includes(event.value)) {
                    states.push(event.value);
                    setOptionStates(states);
                }
            } else {
                if (states.includes(event.value)) {
                    states.splice(states.indexOf(event.value), 1);
                    setOptionStates(states);
                }
            }
        };
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    color: theme.colors.textGrey,
                    flexShrink: '0',
                    width: customWidth ? customWidth : 'auto',
                }}
            >
                {label && <span style={{ padding: '10px', fontWeight: 'bold' }}>{label}</span>}
                <div
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoFlow: 'row' }}
                >
                    {options.map((layout, index) => (
                        <CheckboxFilterItem
                            key={index}
                            checked={optionStates.includes(layout)}
                            customWidth="150px"
                            onChange={handleChange}
                        >
                            {layout}
                        </CheckboxFilterItem>
                    ))}
                </div>
            </div>
        );
    };

    const resetFilters = () => {
        setMinPriceFilter(priceFilterOptions[0]);
        setMaxPriceFilter(priceFilterOptions[0]);
        setAgeFilter(ageFilterOptions[0]);
        setMinAreaFilter(areaFilterOptions[0]);
        setMaxAreaFilter(areaFilterOptions[0]);
        setDistanceFilter(distanceFilterOptions[0]);
        setCurrentLayoutFilters([]);
        setCurrentStructureFilters([]);
        setBathToiletFilter(false);
        setDeliveryBoxFilter(false);
        setPetsFilter(false);
        setSecondFloorAboveFilter(false);
        setWashingMachineAreaFilter(false);
        setAirConFilter(false);
        setAutoLockFilter(false);
        setFlooringFilter(false);
        setSeparateSinkFilter(false);
        setInterphoneFilter(false);
        setReheatingFilter(false);
        setSecuritySystemFilter(false);
        setMultiStoveFilter(false);
        setCityGasFilter(false);
        setElevatorFilter(false);
        setFreeInternetFilter(false);
        setCornerRoomFilter(false);
        setSystemKitchenFilter(false);
        setBathroomHumidifierFilter(false);
        setParkingFilter(false);
        setKaritokuFilter(false);
        setCurrentDirectionFilters([]);
        setCurrentMaterialFilters([]);
    };

    const updateFilterParams = () => {
        if (searchParams === '') return;
        let params = '';
        let i = 0;
        if (minPriceFilter !== priceFilterOptions[0]) {
            params += '&minPrice=' + minPriceFilter;
        }
        if (maxPriceFilter !== priceFilterOptions[0]) {
            params += '&maxPrice=' + maxPriceFilter;
        }
        if (ageFilter !== ageFilterOptions[0]) {
            params += '&age=' + ageFilter;
        }
        if (minAreaFilter !== areaFilterOptions[0]) {
            params += '&minArea=' + minAreaFilter;
        }
        if (maxAreaFilter !== areaFilterOptions[0]) {
            params += '&maxArea=' + maxAreaFilter;
        }
        if (distanceFilter !== distanceFilterOptions[0]) {
            params += '&minutes=' + distanceFilter;
        }
        if (currentLayoutFilters.length > 0) {
            params += '&layouts=';
            for (i = 0; i < currentLayoutFilters.length; i++) {
                params += currentLayoutFilters[i];
                if (i !== currentLayoutFilters.length - 1) {
                    params += ',';
                }
            }
        }
        if (currentStructureFilters.length > 0) {
            params += '&structures=';
            for (i = 0; i < currentStructureFilters.length; i++) {
                params += currentStructureFilters[i];
                if (i !== currentStructureFilters.length - 1) {
                    params += ',';
                }
            }
        }
        if (bathToiletFilter) {
            params += '&bts=1';
        }
        if (deliveryBoxFilter) {
            params += '&db=1';
        }
        if (petsFilter) {
            params += '&pets=1';
        }
        if (secondFloorAboveFilter) {
            params += '&2ndFloor=1';
        }
        if (washingMachineAreaFilter) {
            params += '&iwmp=1';
        }
        if (airConFilter) {
            params += '&aircon=1';
        }
        if (autoLockFilter) {
            params += '&autoLock=1';
        }
        if (flooringFilter) {
            params += '&flooring=1';
        }
        if (separateSinkFilter) {
            params += '&separateSink=1';
        }
        if (interphoneFilter) {
            params += '&interphone=1';
        }
        if (reheatingFilter) {
            params += '&reheating=1';
        }
        if (securitySystemFilter) {
            params += '&security=1';
        }
        if (multiStoveFilter) {
            params += '&multistove=1';
        }
        if (cityGasFilter) {
            params += '&citygas=1';
        }
        if (elevatorFilter) {
            params += '&elevator=1';
        }
        if (freeInternetFilter) {
            params += '&freenet=1';
        }
        if (cornerRoomFilter) {
            params += '&corner=1';
        }
        if (systemKitchenFilter) {
            params += '&syskitchen=1';
        }
        if (bathroomHumidifierFilter) {
            params += '&brhumid=1';
        }
        if (parkingFilter) {
            params += '&parking=1';
        }
        if (karitokuFilter) {
            params += '&karitoku=1';
        }
        if (currentDirectionFilters.length > 0) {
            params += '&directions=';
            for (i = 0; i < currentDirectionFilters.length; i++) {
                params += currentDirectionFilters[i];
                if (i !== currentDirectionFilters.length - 1) {
                    params += ',';
                }
            }
        }
        if (currentMaterialFilters.length > 0) {
            params += '&materials=';
            for (i = 0; i < currentMaterialFilters.length; i++) {
                params += currentMaterialFilters[i];
                if (i !== currentMaterialFilters.length - 1) {
                    params += ',';
                }
            }
        }
        // updateFilteredCount(properties);
        history.replace(searchParams + params);
        // console.log('update params with ' + searchParams + params);
    };

    // Update url

    const initFilters = useCallback(
        (params) => {
            const query = new URLSearchParams(params);
            if (query.get('minPrice') !== null) {
                setMinPriceFilter(query.get('minPrice'));
            } else {
                setMinPriceFilter(priceFilterOptions[0]);
            }
            if (query.get('maxPrice') !== null) {
                setMaxPriceFilter(query.get('maxPrice'));
            } else {
                setMaxPriceFilter(priceFilterOptions[0]);
            }
            if (query.get('age') !== null) {
                setAgeFilter(query.get('age'));
            } else {
                setAgeFilter(ageFilterOptions[0]);
            }
            if (query.get('minArea') !== null) {
                setMinAreaFilter(query.get('minArea'));
            } else {
                setMinAreaFilter(areaFilterOptions[0]);
            }
            if (query.get('maxArea') !== null) {
                setMaxAreaFilter(query.get('maxArea'));
            } else {
                setMaxAreaFilter(areaFilterOptions[0]);
            }
            if (query.get('minutes') !== null) {
                setDistanceFilter(query.get('minutes'));
            } else {
                setDistanceFilter(distanceFilterOptions[0]);
            }
            if (query.get('layouts') !== null) {
                setCurrentLayoutFilters(query.get('layouts').split(','));
            } else {
                setCurrentLayoutFilters([]);
            }
            if (query.get('structures') !== null) {
                setCurrentStructureFilters(query.get('structures').split(','));
            } else {
                setCurrentStructureFilters([]);
            }
            if (query.get('bts') !== null) {
                setBathToiletFilter(query.get('age') === '1');
            } else {
                setBathToiletFilter(false);
            }
            if (query.get('db') !== null) {
                setDeliveryBoxFilter(query.get('db') === '1');
            } else {
                setDeliveryBoxFilter(false);
            }
            if (query.get('pets') !== null) {
                setPetsFilter(query.get('pets') === '1');
            } else {
                setPetsFilter(false);
            }
            if (query.get('2ndFloor') !== null) {
                setSecondFloorAboveFilter(query.get('2ndFloor') === '1');
            } else {
                setSecondFloorAboveFilter(false);
            }
            if (query.get('iwmp') !== null) {
                setWashingMachineAreaFilter(query.get('iwmp') === '1');
            } else {
                setWashingMachineAreaFilter(false);
            }
            if (query.get('aircon') !== null) {
                setAirConFilter(query.get('aircon') === '1');
            } else {
                setAirConFilter(false);
            }
            if (query.get('autoLock') !== null) {
                setAutoLockFilter(query.get('autoLock') === '1');
            } else {
                setAutoLockFilter(false);
            }
            if (query.get('flooring') !== null) {
                setFlooringFilter(query.get('flooring') === '1');
            } else {
                setFlooringFilter(false);
            }
            if (query.get('separateSink') !== null) {
                setSeparateSinkFilter(query.get('separateSink') === '1');
            } else {
                setSeparateSinkFilter(false);
            }
            if (query.get('interphone') !== null) {
                setInterphoneFilter(query.get('interphone') === '1');
            } else {
                setInterphoneFilter(false);
            }
            if (query.get('reheating') !== null) {
                setReheatingFilter(query.get('reheating') === '1');
            } else {
                setReheatingFilter(false);
            }
            if (query.get('security') !== null) {
                setSecuritySystemFilter(query.get('security') === '1');
            } else {
                setSecuritySystemFilter(false);
            }
            if (query.get('multistove') !== null) {
                setMultiStoveFilter(query.get('multistove') === '1');
            } else {
                setMultiStoveFilter(false);
            }
            if (query.get('citygas') !== null) {
                setCityGasFilter(query.get('citygas') === '1');
            } else {
                setCityGasFilter(false);
            }
            if (query.get('elevator') !== null) {
                setElevatorFilter(query.get('elevator') === '1');
            } else {
                setElevatorFilter(false);
            }
            if (query.get('freenet') !== null) {
                setFreeInternetFilter(query.get('freenet') === '1');
            } else {
                setFreeInternetFilter(false);
            }
            if (query.get('corner') !== null) {
                setCornerRoomFilter(query.get('corner') === '1');
            } else {
                setCornerRoomFilter(false);
            }
            if (query.get('syskitchen') !== null) {
                setSystemKitchenFilter(query.get('syskitchen') === '1');
            } else {
                setSystemKitchenFilter(false);
            }
            if (query.get('brhumid') !== null) {
                setBathroomHumidifierFilter(query.get('brhumid') === '1');
            } else {
                setBathroomHumidifierFilter(false);
            }
            if (query.get('parking') !== null) {
                setParkingFilter(query.get('parking') === '1');
            } else {
                setParkingFilter(false);
            }
            if (query.get('karitoku') !== null) {
                setKaritokuFilter(query.get('karitoku') === '1');
            } else {
                setKaritokuFilter(false);
            }
            if (query.get('directions') !== null) {
                setCurrentDirectionFilters(query.get('directions').split(','));
            } else {
                setCurrentDirectionFilters([]);
            }
            if (query.get('materials') !== null) {
                setCurrentMaterialFilters(query.get('materials').split(','));
            } else {
                setCurrentMaterialFilters([]);
            }

            setFiltersInit(true);
        },
        [setFiltersInit]
    );

    const filterProperties = useCallback(
        (properties) => {
            return properties.filter((property) => {
                return (
                    isPriceValid(property) &&
                    isAgeValid(property) &&
                    isAreaValid(property) &&
                    isDistanceValid(property) &&
                    isDetailValid(property) &&
                    isKaritokuValid(property)
                );
            });
        },
        [isPriceValid, isAgeValid, isAreaValid, isDistanceValid, isDetailValid, isKaritokuValid]
    );

    const getFilterQuery = useCallback(() => {
        let params = '';
        let i = 0;
        if (minPriceFilter !== priceFilterOptions[0]) {
            params += '&rent_min=' + parseFloat(minPriceFilter.replace('万', '')) * 10;
        }
        if (maxPriceFilter !== priceFilterOptions[0]) {
            params += '&rent_max=' + parseFloat(maxPriceFilter.replace('万', '')) * 10;
        }
        if (ageFilter !== ageFilterOptions[0]) {
            params += '&age_max=' + ageFilter.replace('～', '').replace('年', '');
        }
        if (minAreaFilter !== areaFilterOptions[0]) {
            params += '&area_min=' + minAreaFilter.replace('m²', '');
        }
        if (maxAreaFilter !== areaFilterOptions[0]) {
            params += '&area_max=' + maxAreaFilter.replace('m²', '');
        }
        if (distanceFilter !== distanceFilterOptions[0]) {
            params += '&minutes=' + distanceFilter.replace('分以内', '');
        }
        if (currentLayoutFilters.length > 0) {
            for (i = 0; i < currentLayoutFilters.length; i++) {
                if (currentLayoutFilters[i] === 'ワンルーム') {
                    params += '&layouts[]=layout_1R';
                } else {
                    params += '&layouts[]=layout_' + currentLayoutFilters[i].replace('以上', '');
                }
            }
        }
        if (currentStructureFilters.length > 0) {
            if (currentStructureFilters.includes('アパート')) {
                params += '&structures[]=pt_ap';
            }
            if (currentStructureFilters.includes('マンション')) {
                params += '&structures[]=pt_mn';
            }
        }
        if (bathToiletFilter) {
            params += '&commitments[]=separated_toilet_bath';
        }
        if (deliveryBoxFilter) {
            params += '&commitments[]=delivery_box';
        }
        if (petsFilter) {
            params += '&commitments[]=pet_available';
        }
        if (secondFloorAboveFilter) {
            params += '&commitments[]=not_first_floor';
        }
        if (washingMachineAreaFilter) {
            params += '&commitments[]=indoor_washing_machine_place';
        }
        if (airConFilter) {
            params += '&commitments[]=air_con';
        }
        if (autoLockFilter) {
            params += '&commitments[]=automatic_lock';
        }
        if (flooringFilter) {
            params += '&commitments[]=wooden_floor';
        }
        if (separateSinkFilter) {
            params += '&commitments[]=separate_sink';
        }
        if (interphoneFilter) {
            params += '&commitments[]=interphone_with_monitor';
        }
        if (reheatingFilter) {
            params += '&commitments[]=reheating';
        }
        if (securitySystemFilter) {
            params += '&commitments[]=security_system';
        }
        if (multiStoveFilter) {
            params += '&commitments[]=multi_stove';
        }
        if (cityGasFilter) {
            params += '&commitments[]=city_gas';
        }
        if (elevatorFilter) {
            params += '&commitments[]=elevator';
        }
        if (freeInternetFilter) {
            params += '&commitments[]=free_internet';
        }
        if (cornerRoomFilter) {
            params += '&commitments[]=corner_room';
        }
        if (systemKitchenFilter) {
            params += '&commitments[]=system_kitchen';
        }
        if (bathroomHumidifierFilter) {
            params += '&commitments[]=bathroom_dehumidifier';
        }
        if (parkingFilter) {
            params += '&commitments[]=parking';
        }
        if (karitokuFilter) {
            params += '&kt=1';
        }
        if (currentDirectionFilters.length > 0) {
            params += '&directions=';
            for (i = 0; i < currentDirectionFilters.length; i++) {
                params += '&directions[]=dir_';
                switch (currentDirectionFilters[i]) {
                    case '北':
                        params += 'n';
                        break;
                    case '北東':
                        params += 'ne';
                        break;
                    case '東':
                        params += 'e';
                        break;
                    case '南東':
                        params += 'se';
                        break;
                    case '南':
                        params += 's';
                        break;
                    case '南西':
                        params += 'sw';
                        break;
                    case '西':
                        params += 'w';
                        break;
                    case '北西':
                        params += 'nw';
                        break;
                    default:
                        params += '';
                        break;
                }
            }
        }
        if (currentMaterialFilters.length > 0) {
            for (i = 0; i < currentMaterialFilters.length; i++) {
                params += '&strs[]=';
                switch (currentMaterialFilters[i]) {
                    case materialFilters[0]:
                        params += 'st_rc';
                        break;
                    case materialFilters[1]:
                        params += 'st_st';
                        break;
                    case materialFilters[2]:
                        params += 'st_wood';
                        break;
                    case materialFilters[3]:
                        params += 'st_other';
                        break;
                    default:
                        params += '';
                        break;
                }
            }
        }
        return params;
    }, [
        ageFilter,
        currentDirectionFilters,
        currentLayoutFilters,
        currentStructureFilters,
        currentMaterialFilters,
        distanceFilter,
        karitokuFilter,
        maxAreaFilter,
        minAreaFilter,
        maxPriceFilter,
        minPriceFilter,
        bathToiletFilter,
        deliveryBoxFilter,
        petsFilter,
        secondFloorAboveFilter,
        washingMachineAreaFilter,
        autoLockFilter,
        airConFilter,
        flooringFilter,
        separateSinkFilter,
        interphoneFilter,
        reheatingFilter,
        securitySystemFilter,
        multiStoveFilter,
        cityGasFilter,
        elevatorFilter,
        freeInternetFilter,
        cornerRoomFilter,
        systemKitchenFilter,
        bathroomHumidifierFilter,
        parkingFilter,
    ]);

    useEffect(() => {
        if (searchParams !== '') {
            let f = window.location.search.replace(searchParams, '');
            initFilters(f);
            // console.log('init with ' + f);
        }
    }, [searchParams, initFilters, filtersInit]);

    useLayoutEffect(() => {
        // console.log('filtersInit: ' + filtersInit);
        // console.log('filteredPropsInit: ' + filteredPropsInit);
        if ((properties.length > 0 || queryOnly) && filtersInit && !filteredPropsInit) {
            // console.log('update filtered props');
            onInit({
                result: filterProperties(properties),
                filters: getFilterQuery(),
            });
        }
    }, [
        properties,
        filterProperties,
        filteredPropsInit,
        filtersInit,
        setFilteredProperties,
        onInit,
        getFilterQuery,
        queryOnly,
    ]);

    return (
        <FilterSettings overlayOpen={filterOverlayOpen}>
            {!hideHeader && (
                <FilterSettingsHeader open={filterOverlayOpen}>
                    条件を入力
                    <CloseFilterSettingsButton
                        show={showCloseBtn}
                        onClick={() => setFilterOverlayOpen(false)}
                    >
                        <MdClose size="25" />
                    </CloseFilterSettingsButton>
                </FilterSettingsHeader>
            )}
            <FilterSectionHeader>賃料</FilterSectionHeader>
            <StyledRangeBoxContent style={{ width: '100%' }}>
                <Select
                    label="指定なし"
                    width="100%"
                    borderOff
                    options={priceFilterOptions}
                    onSelected={(i) => setMinPriceFilter(i)}
                    selected={minPriceFilter}
                />
                <div style={{ lineHeight: '40px', padding: '0 10px' }}>～</div>
                <Select
                    label="指定なし"
                    width="100%"
                    borderOff
                    options={priceFilterOptions}
                    onSelected={(i) => setMaxPriceFilter(i)}
                    selected={maxPriceFilter}
                />
            </StyledRangeBoxContent>

            <CheckboxFilterItem
                customWidth="100%"
                onChange={(e) => setKaritokuFilter(e.checked)}
                checked={karitokuFilter}
            >
                割安な物件のみ表示する
            </CheckboxFilterItem>

            <FilterSectionHeader>広さ</FilterSectionHeader>

            <StyledRangeBoxContent style={{ width: '100%' }}>
                <Select
                    label="指定なし"
                    width="100%"
                    borderOff
                    options={areaFilterOptions}
                    onSelected={(i) => setMinAreaFilter(i)}
                    selected={minAreaFilter}
                />
                <div style={{ lineHeight: '40px', padding: '0 10px' }}>～</div>
                <Select
                    label="指定なし"
                    width="100%"
                    borderOff
                    options={areaFilterOptions}
                    onSelected={(i) => setMaxAreaFilter(i)}
                    selected={maxAreaFilter}
                />
            </StyledRangeBoxContent>

            <FilterSectionHeader>築年数</FilterSectionHeader>
            <Select
                label="指定なし"
                width="100%"
                borderOff
                options={ageFilterOptions}
                onSelected={(i) => setAgeFilter(i)}
                selected={ageFilter}
            />

            <FilterSectionHeader>駅徒歩</FilterSectionHeader>
            <Select
                label="指定なし"
                width="100%"
                borderOff
                options={distanceFilterOptions}
                onSelected={(i) => setDistanceFilter(i)}
                selected={distanceFilter}
            />

            <FilterSectionHeader>間取り</FilterSectionHeader>
            <GroupedCheckboxFilters
                label=""
                customWidth="100%"
                options={layoutFilters}
                optionStates={currentLayoutFilters}
                setOptionStates={setCurrentLayoutFilters}
            />

            <FilterSectionHeader>建物種類</FilterSectionHeader>
            <GroupedCheckboxFilters
                label=""
                customWidth="100%"
                options={structureFilters}
                optionStates={currentStructureFilters}
                setOptionStates={setCurrentStructureFilters}
            />

            <FilterSectionHeader>建物構造</FilterSectionHeader>
            <GroupedCheckboxFilters
                label=""
                customWidth="100%"
                options={materialFilters}
                optionStates={currentMaterialFilters}
                setOptionStates={setCurrentMaterialFilters}
            />

            <FilterSectionHeader>方位</FilterSectionHeader>
            <GroupedCheckboxFilters
                label=""
                customWidth="100%"
                options={directionFilters}
                optionStates={currentDirectionFilters}
                setOptionStates={setCurrentDirectionFilters}
            />

            <FilterSectionHeader>こだわり条件</FilterSectionHeader>
            <div style={{ width: '100%' }}>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setBathToiletFilter(e.checked)}
                    checked={bathToiletFilter}
                >
                    バス・トイレ別
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setDeliveryBoxFilter(e.checked)}
                    checked={deliveryBoxFilter}
                >
                    宅配ボックスあり
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setPetsFilter(e.checked)}
                    checked={petsFilter}
                >
                    ペット相談
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setSecondFloorAboveFilter(e.checked)}
                    checked={secondFloorAboveFilter}
                >
                    2階以上住戸
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setWashingMachineAreaFilter(e.checked)}
                    checked={washingMachineAreaFilter}
                >
                    室内洗濯機置場
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setAirConFilter(e.checked)}
                    checked={airConFilter}
                >
                    エアコン付
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setAutoLockFilter(e.checked)}
                    checked={autoLockFilter}
                >
                    オートロック
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setFlooringFilter(e.checked)}
                    checked={flooringFilter}
                >
                    フローリング
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setSeparateSinkFilter(e.checked)}
                    checked={separateSinkFilter}
                >
                    独立洗面台
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setInterphoneFilter(e.checked)}
                    checked={interphoneFilter}
                >
                    TVモニタ付きインターフォン
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setReheatingFilter(e.checked)}
                    checked={reheatingFilter}
                >
                    追焚機能浴室
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setSecuritySystemFilter(e.checked)}
                    checked={securitySystemFilter}
                >
                    警備会社加入
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setMultiStoveFilter(e.checked)}
                    checked={multiStoveFilter}
                >
                    2口以上コンロ
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setCityGasFilter(e.checked)}
                    checked={cityGasFilter}
                >
                    都市ガス
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setElevatorFilter(e.checked)}
                    checked={elevatorFilter}
                >
                    エレベータ
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setFreeInternetFilter(e.checked)}
                    checked={freeInternetFilter}
                >
                    インターネット無料
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setCornerRoomFilter(e.checked)}
                    checked={cornerRoomFilter}
                >
                    角部屋
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setSystemKitchenFilter(e.checked)}
                    checked={systemKitchenFilter}
                >
                    システムキッチン
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setBathroomHumidifierFilter(e.checked)}
                    checked={bathroomHumidifierFilter}
                >
                    浴室乾燥機
                </CheckboxFilterItem>
                <CheckboxFilterItem
                    customWidth="300px"
                    onChange={(e) => setParkingFilter(e.checked)}
                    checked={parkingFilter}
                >
                    駐車場
                </CheckboxFilterItem>
            </div>
            <FilterSubmitButton>
                <StyledButton
                    id="reset_button"
                    buttonType={true}
                    onClick={() => {
                        resetFilters();
                    }}
                >
                    <div>
                        <BsArrowCounterclockwise size={18} style={{ marginRight: '5px' }} />
                        リセット
                    </div>
                </StyledButton>
                <StyledButton
                    id="search_button"
                    buttonType={true}
                    onClick={() => {
                        if (closeOnSubmit) setFilterOverlayOpen(false);
                        updateFilterParams();
                        onFilter({
                            result: filterProperties(properties),
                            filters: getFilterQuery(),
                        });
                    }}
                >
                    <div>
                        この条件で検索する
                        <BsArrowRight size="24" style={{ marginLeft: '5px' }} />
                    </div>
                </StyledButton>
            </FilterSubmitButton>
        </FilterSettings>
    );
}

export default FilterBox;

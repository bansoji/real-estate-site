// Copyright 2021, Banson Tong, All rights reserved

import React, { useLayoutEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import theme from '../../themes/default';

import ReactTooltip from 'react-tooltip';
import { FaHistory } from 'react-icons/fa';

import FloatingButton from '../../components/FloatingButton/FloatingButton';
import StyledButton from '../../components/StyledButton/StyledButton';
import Searchbar from '../../components/Searchbar/Searchbar';
import History, { getClosestStation } from '../../components/History/History';
import Backdrop from '../../components/Drawer/Backdrop';
import Drawer from '../../components/Drawer/Drawer';
import Recommendations from '../../components/Recommendations/Recommendations';

import money1 from '../../images/Money_1.svg';
import money2 from '../../images/Money_2.svg';
import money3 from '../../images/Money_3.svg';
import money4 from '../../images/Money_4.svg';
import money5 from '../../images/Money_5.svg';
import assistant from '../../images/Assistant.svg';
import bg from '../../images/background_optimized.jpg';

const MainContent = styled.div`
    width: 100%;
    //background-color: ${theme.colors.accent};
`;

const Background = styled.div`
    position: fixed;
    width: 100%;
    height: 100vh;
    background: url('${bg}');
    background-position: center;
    background-size: cover;
    opacity: 0.8;
    // background-color: rgba(47, 149, 181, 1);
    z-index: -1;
`;

const BackgroundDim = styled.div`
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: black;
    background-position: center;
    background-size: cover;
    // background-color: rgba(47, 149, 181, 1);
    z-index: -2;
`;

const Hero = styled.div`
    display: grid;
    height: 100vh;
    align-content: center;
    justify-items: center;
    text-align: center;
    margin-top: -50px;
    padding: 0 10% 0 10%;
    color: white;
`;

const HeroHeader = styled.p`
    font-family: ${theme.fonts.default};
    font-weight: normal;
    font-style: normal;
    font-size: 34px; 
    margin-top: 0;
    margin-bottom: 0;
    // text-shadow: 0px 0px 10px black;

    @media only screen and (max-width: 500px) {
        font-size: 22px;
    }
`;

const HeroContent = styled.p`
    font-family: ${theme.fonts.default};
    font-weight: 300;
    font-style: normal;
    font-size: 20px; 
    // text-shadow: 0px 0px 10px black;
    line-height: 30px;
    margin: 8px 0;

    @media only screen and (max-width: 500px) {
        font-size: 16px;
    }
`;

const SubHero = styled.div`
    display: grid;
    height: 20vh;
    align-content: center;
    justify-items: center;
    text-align: center;
    margin-top: -50px;
    padding: 0 10% 0 10%;
    color: grey;
    background-color: white;

    @media only screen and (max-width: 500px) {
        height: 30vh;
    }
`;

const HeroSpacing = styled.div`
    height: 0;

    @media only screen and (max-width: 500px) {
        height: 100px;
    }
`;

const SearchError = styled.div`
    height: ${({showError}) => showError ? 'auto' : 0};
    width: 75%;
    max-width: 600px;
    min-width: 300px;
    max-height: ${({showError}) => showError ? '25px' : 0};
    overflow: hidden;
    background-color: #ed2d53;
    transition: max-height 200ms ease-in-out;
    margin-top: 10px;
    border-radius: 5px;
    font-family: ${theme.fonts.default};
    font-weight: normal;
    font-size: 14px;
    padding: ${({showError}) => showError ? '3px' : 0};
    color: white;

    @media only screen and (max-width: 500px) {
        height: ${({showError}) => showError ? 'auto' : 0};
        max-height: ${({showError}) => showError ? '50px' : 0};
    }
`;

const HeroButtonsContainer = styled.div`
    display: grid;
    grid-auto-flow: column;
    // grid-template-columns: 1fr 1fr;

    @media only screen and (max-width: 500px) {
        grid-auto-flow: row;
        grid-template-columns: none;
    }
`;

const Results = styled.div`
    display: grid;
    position: relative;
    background-color: ${theme.colors.grey};
    height: ${({show}) => show ? 'auto' : 0};
    min-height: ${({show}) => show ? '92vh' : 0};
    align-content: center;
    justify-items: center;
    text-align: center;
    overflow: hidden;
    padding: ${({show}) => show ? '5%' : '0'};
    font-family: ${theme.fonts.default};
    font-style: normal;
    font-weight: normal;

    @media only screen and (max-width: 500px) {
        padding: ${({show}) => show ? '25% 5% 15% 5%' : '0 5% 0 5%'};
    }
`;

const FeedbackBubble = styled.div`
    display: flex;
    height: auto;
    width: auto;
    max-width: 50%;
    min-width: 300px;
    background-color: ${theme.colors.darkGrey};
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    margin-top: 50px;
    z-index: 3;
`;

const Assistant = styled.img.attrs({ src: assistant, alt:'' })`
    display: block;
    position: absolute; 
    top: 300px;
    left: 35%;

    @media only screen and (max-width: 500px) {
        top: 400px;
        left: 12%;
    }
`;

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

function URLSearchPage({ popoverCallback }) {
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const [assessmentData, setAssessmentData] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    // const [popoverType, setPopoverType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const resultsRef = useRef(null);

    const [fetchingRecs, setFetchingRecs] = useState(false);

    const width = useWindowSize()[0];

    const [historyState, setHistoryState] = useState([]); // only using this to force re-render right now

    const scrollDown = () => {
        if (resultsRef.current.clientHeight !== 0) {
            resultsRef.current.scrollIntoView({ block: 'start', behavior: 'smooth'})
        } else {
            setTimeout(scrollDown, 50);
        }
    };

    const suumoUrl = 'https://suumo.jp';
    const suumoUrlRegex = /https:\/\/suumo\.jp[^ $\n]+/g;

    const fetchData = (i) => {
        setShowError(false);

        let input = i;
        let matches = [];
        let match;

        if (input.includes(suumoUrl) && !input.startsWith('suumoUrl')) {
            match = suumoUrlRegex.exec(input);
            while (match) {
                matches.push(match[0]);
                match = suumoUrlRegex.exec(input);
            }
            if (matches.length === 2) {
                input = matches[1];
            }
        }

        input = encodeURIComponent(input);
        fetch(
        ``,
        {
            method: "GET",
        }
        )
        .then(
        res　=> {
        if (res.ok) {
            res.json().then( res => {
                if (res.error_code === 100) {
                    setAssessmentData(res)
                    setIsResultsVisible(input !== '')
                    scrollDown()
                    saveToHistory(res)
                    fetchRecommendations(res)
                } else {
                    let msg
                    if (res.error_code === 200) {
                        msg = 'エラーがありました。この物件はすでに売れてしまっている可能性があります。'
                    } else if (res.error_code === 201) {
                        msg = 'URLが不正です。SUUMOの賃貸物件のURLでない可能性があります。'
                    } else if (res.error_code === 202) {
                        msg = '分析対象エリア外の物件です。'
                    } else if (res.error_code === 203) {
                        msg = '建物タイプが「マンション」でも「アパート」でもありません。'
                    } else if (res.error_code === 204) {
                        msg = '「階」が不正です（地下とか）'
                    } 
                    setErrorMessage(msg)
                    setShowError(true)
                }
            })
        }
        })
        .catch(error => console.log(error));
    }

    const fetchRecommendations = (result) => {
        // get index of closest station
        let lowest = Number.POSITIVE_INFINITY;
        let index, distance;
        for (let i = 0; i < result.traffics.length; i++) {
            if (result.traffics[i].minute < lowest) {
                lowest = result.traffics[i].minute;
                index = i;
                distance = result.traffics[i].minute;
            }
        }
        let lineId = result.traffics[index].line_id;
        let stationId = result.traffics[index].station_id;

        setFetchingRecs(true);

        fetch(
        ``,
        {
            method: "GET",
        }
        ).then(
            res => {
                if (res.ok) {
                    res.json().then(
                        res => {
                            // console.log(res);
                            setRecommendations(res);
                        }
                    )
                }
                setFetchingRecs(false);
            }
        ).catch(error => console.log(error));
    }

    const rerender = () => {
        setHistoryState(history);
    }

    const toggleDrawer = () => {
        setShowDrawer(!showDrawer); 
        ReactTooltip.hide();
    };

    const historyKey = 'history';
    let history = historyState;

    if (localStorage.getItem(historyKey) === null) {
        localStorage.setItem(historyKey, JSON.stringify(history));
    } else {
        history = JSON.parse(localStorage.getItem(historyKey));
    }

    const saveToHistory = (result) => {
        let restoredHistory = JSON.parse(localStorage.getItem(historyKey));
        let isDuplicate = false;
        for (let i = 0; i < restoredHistory.length; i++) {
            if (restoredHistory[i].item.suumo_link === result.suumo_link) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            restoredHistory.push({id: Date.now(), item: result});
            localStorage.setItem(historyKey, JSON.stringify(restoredHistory));
            setHistoryState(history);
        }
    };

    const updateHistory = (newList) => {
        localStorage.setItem(historyKey, JSON.stringify(newList));
        setHistoryState(newList);
        ReactTooltip.hide();
    };

    const parseDeviation = (deviation) => {
        let feedback;
        let score;
        let image;

        if (deviation <= 25) {
            feedback = '';
            score = 0;
            image = money1;
        } else if (deviation <= 30) {
            feedback = '';
            score = 0.5;
            image = money1;
        } else if (deviation <= 35) {
            feedback = '';
            score = 1;
            image = money2;
        } else if (deviation <= 40) {
            feedback = '';
            score = 1.5;
            image = money2;
        } else if (deviation <= 45) {
            feedback = '';
            score = 2;
            image = money3;
        } else if (deviation <= 50) {
            feedback = '';
            score = 2.5;
            image = money3;
        } else if (deviation <= 55) {
            feedback = '';
            score = 3;
            image = money4;
        } else if (deviation <= 60) {
            feedback = '';
            score = 3.5;
            image = money4;
        } else if (deviation <= 65) {
            feedback = '';
            score = 4;
            image = money5;
        } else if (deviation <= 70) {
            feedback = '';
            score = 4.5;
            image = money5;
        } else {
            feedback = '';
            score = 5;
            image = money5;
        }

        return { score: score, feedback: feedback, image: image };
    };

    const priceDiff = assessmentData.est_rent - assessmentData.set_rent;

    return (
        <React.Fragment>
            <BackgroundDim />
            <Background />
            <Backdrop show={showDrawer || showPopover} zIndex={showDrawer ? 4 : 8} backdropHandler={() => {
                setShowDrawer(false);
                setShowPopover(false);
                }} />
            <Drawer show={showDrawer} >
                <History historyList={history} onDeleteClicked={(newList) => updateHistory(newList)} parseDeviation={(d) => parseDeviation(d)} rerender={() => rerender()}/>
            </Drawer>
            <FloatingButton clickHandler={toggleDrawer} tooltip='履歴'><FaHistory color='white'/></FloatingButton>
            <MainContent>
                <Hero>
                    <HeroHeader>
                    </HeroHeader>
                    <HeroContent style={{marginBottom: '25px', lineHeight: '20px'}}>
                    </HeroContent>
                    
                    <Searchbar handleSearch={(input) => { fetchData(input)}}/>
                    <SearchError showError={showError}>
                        {errorMessage}
                    </SearchError>
                    <HeroSpacing />
                </Hero>
                <SubHero>
                    <HeroContent style={{fontSize: '13px', lineHeight: '18px'}}>
                    </HeroContent>
                    <HeroButtonsContainer>
                        <StyledButton target='_blank' rel='noopener noreferrer' href='https://suumo.jp/chintai/kanto' style={{fontSize: '14px'}}>
                            SUUMOでお部屋探し!
                        </ StyledButton>
                    </HeroButtonsContainer>
                </SubHero>
                <Results show={isResultsVisible} ref={resultsRef}>
                <p style={{fontSize: 36, margin: 0, fontFamily: theme.fonts.header, fontWeight: 'normal', fontStyle: 'normal'}}>カリトク判定</p>
                <hr style={{height: 1, backgroundColor: 'black', border: 'none', width: '50%', minWidth: '300px', marginBottom: '25px'}}/>
                <p style={{fontSize: 24, margin: 0}}> あなたのみている物件は</p>
                <p style={{fontSize: 28, margin: 0}}>
                    2年間で <font color={priceDiff < 0 ? '#00498e': 'red' } size='12'><b>{Math.abs(Math.round(priceDiff) * 24).toLocaleString()}</b></font> 円
                    {width < 500 ? <br /> : ''}の{priceDiff < 0 ? ' 借り損です。' : ' 借り得です。'}
                </p>
                <p style={{fontSize: 20, margin: 0}}> (月間 {Math.abs(Math.round(priceDiff)).toLocaleString()} 円<font color={priceDiff < 0 ? '#00498e': 'red' } size='6'>{priceDiff < 0 ? ' 高い' : ' 安い'}</font>です！) </p>
                <img alt='' src={parseDeviation(assessmentData.deviation).image} style={{ marginTop: '20px' }}></img>
                <Assistant />
                <FeedbackBubble> 
                    {parseDeviation(assessmentData.deviation).feedback} 
                </FeedbackBubble>
                <StyledButton style={{marginTop: '40px'}} target='_blank' rel='noopener noreferrer' href={assessmentData.suumo_link}>
                    SUUMOに戻る
                </StyledButton>
                <p style={{fontSize: '24px', margin: '24px 0 0 0'}}>近隣のおすすめ物件！</p>
                <Recommendations recList={recommendations} parser={(i) => parseDeviation(i)} isFetching={fetchingRecs} station={getClosestStation(assessmentData.traffics).station}/>
                </Results>
            </MainContent>
        </React.Fragment>
    );
}

export default URLSearchPage;
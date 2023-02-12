// Copyright 2021, Banson Tong, All rights reserved

import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../themes/default';
import { useHistory } from 'react-router-dom';

import ReactTooltip from 'react-tooltip';
import { FaHistory } from 'react-icons/fa';

import FloatingButton from '../../components/FloatingButton/FloatingButton';
import StyledButton from '../../components/StyledButton/StyledButton';
import History, { getClosestStation } from '../../components/History/History';
import Backdrop from '../../components/Drawer/Backdrop';
import Drawer from '../../components/Drawer/Drawer';
import PropertyCard from '../../components/PropertyCard/PropertyCard';

import money1 from '../../images/Money_1.svg';
import money2 from '../../images/Money_2.svg';
import money3 from '../../images/Money_3.svg';
import money4 from '../../images/Money_4.svg';
import money5 from '../../images/Money_5.svg';
import assistant from '../../images/Assistant.svg';
import Placeholder from '../../images/home/255x200.png';

const MainContent = styled.div`
    position: relative;
    width: 100%;
    color: ${theme.colors.textGrey};
    font-family: ${theme.fonts.default};
`;

const Results = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: auto;
    align-items: center;
    justify-items: center;
    text-align: center;
    overflow: hidden;
    padding: 5%;
    font-family: ${theme.fonts.default};
    font-style: normal;
    font-weight: normal;

    @media only screen and (max-width: 500px) {
        padding: 40px 20px;
    }
`;

const FeedbackBubble = styled.div`
    display: flex;
    height: auto;
    width: auto;
    max-width: 50%;
    min-width: 300px;
    background-color: ${theme.colors.grey};
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    margin-top: 50px;
    z-index: 3;
`;

const Assistant = styled.img.attrs({ src: assistant, alt: '' })`
    display: block;
    position: absolute;
    top: 300px;
    left: 35%;

    @media only screen and (max-width: 500px) {
        top: 349px;
        left: 12%;
    }
`;

//#region Loader

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    opacity: ${({ show }) => (show ? '100%' : 0)};
    transition: opacity 500ms ease-in-out;
    pointer-events: none;
    background-color: ${theme.colors.background};
    z-index: 5;
`;

const Loader = styled.div`
    border: 10px solid #f3f3f3; /* Light grey */
    border-top: 10px solid ${(props) => props.theme.colors.accent};
    border-radius: 50%;
    width: 100px;
    height: 100px;
    animation: ${spin} 1s linear infinite;
    pointer-events: none;
`;

//#endregion

//#region FeatureList
// Needs to be moved to a component

const StyledFeature = styled.div`
    display: flex;
    flex-direction: column;
    height: 400px;
    width: 100%;
    background-color: white;
    padding-top: 40px;
    padding-bottom: 40px;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 1000px) {
        height: auto;
    }

    a {
        color: ${theme.colors.textGrey};
    }
`;

const FeatureHeader = ({ title, children }) => {
    return (
        <StyledFeatureHeader>
            <span>{title}</span>
            <span>{children}</span>
        </StyledFeatureHeader>
    );
};

const StyledFeatureWrapper = styled.div`
    width: 1000px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: ${theme.colors.textGrey};

    @media only screen and (max-width: 1000px) {
        width: auto;
        min-width: 500px;
        max-width: 700px;
    }

    @media only screen and (max-width: 1000px) {
        min-width: 100%;
        max-width: 100%;
    }
`;

const StyledFeatureHeader = styled.div`
    width: 1000px;
    height: 50px;
    font-weight: bold;
    font-size: 1.75rem;
    display: flex;
    flex-direction: row;
    flex-stretch: 0;
    align-items: center;

    @media only screen and (max-width: 1000px) {
        width: 500px;
        flex-direction: column;
        align-items: flex-start;
        height: auto;
    }

    @media only screen and (max-width: 500px) {
        width: 90vw;
        font-size: 1.5rem;
    }
`;

const StyledFeatureList = styled.div`
    position: relative;
    display: flex;
    width: 1000px;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;

    @media only screen and (max-width: 1000px) {
        flex-direction: column;
        width: 500px;
    }

    @media only screen and (max-width: 500px) {
        width: 90%;
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
`;

//#endregion

function AssessPage({ width }) {
    const [assessmentData, setAssessmentData] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fetching, setFetching] = useState(true);
    const [invalidImages, setInvalidImages] = useState([]);

    const history = useHistory();

    const [assessHistory, setAssessHistory] = useState([]);
    const historyKey = 'assessHistory';

    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const fetchData = (i) => {
            const suumoUrl = 'https://suumo.jp';
            const suumoUrlRegex = /https:\/\/suumo\.jp[^ $\n]+/g;
            setShowError(false);
            setFetching(true);

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
            fetch(``, {
                method: 'GET',
            })
                .then((res) => {
                    if (res.ok) {
                        res.json().then((res) => {
                            if (isMounted.current) {
                                if (res.error_code === 100) {
                                    setAssessmentData(res);
                                    saveToHistory(res);
                                    document.title = '' + res.name;
                                } else {
                                    let msg;
                                    if (res.error_code === 200) {
                                        msg =
                                            'エラーがありました。この物件はすでに売れてしまっている可能性があります。';
                                    } else if (res.error_code === 201) {
                                        msg =
                                            'URLが不正です。SUUMOの賃貸物件のURLでない可能性があります。';
                                    } else if (res.error_code === 202) {
                                        msg = '分析対象エリア外の物件です。';
                                    } else if (res.error_code === 203) {
                                        msg =
                                            '建物タイプが「マンション」でも「アパート」でもありません。';
                                    } else if (res.error_code === 204) {
                                        msg = '「階」が不正です（地下とか）';
                                    }
                                    setErrorMessage(msg);
                                    setShowError(true);
                                }
                                setFetching(false);
                            }
                        });
                    }
                })
                .catch((error) => console.log(error));
        };

        const query = new URLSearchParams(window.location.search);
        if (query.get('url') != null) {
            fetchData(query.get('url'));
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        }
    }, [history.location]);

    useEffect(() => {
        const fetchRecs = (pref, station) => {
            fetch(
                `` +
                    pref +
                    `&station=` +
                    station,
                {
                    method: 'GET',
                }
            )
                .then((res) => {
                    if (res.ok) {
                        res.json().then((res) => {
                            if (isMounted.current) {
                                if (res.error_code === 100) {
                                    setRecommendations(
                                        res.bukkens.sort(
                                            (a, b) =>
                                                parseFloat(b.est_rent) -
                                                parseFloat(b.set_rent) -
                                                (parseFloat(a.est_rent) - parseFloat(a.set_rent))
                                        )
                                    );
                                }
                            }
                        });
                    }
                })
                .catch((error) => console.log(error));
        };
        if (assessmentData && assessmentData.pref && assessmentData.pref !== '') {
            let closestStation = getClosestStation(assessmentData.traffics);
            fetchRecs(assessmentData.pref, closestStation.station);
        }
    }, [assessmentData]);

    const toggleDrawer = () => {
        setShowDrawer(!showDrawer);
        ReactTooltip.hide();
    };

    useEffect(() => {
        if (localStorage.getItem(historyKey) !== null) {
            setAssessHistory(JSON.parse(localStorage.getItem(historyKey)));
        } else {
            localStorage.setItem(historyKey, JSON.stringify([]));
        }
    }, []);

    const saveToHistory = (result) => {
        const his = JSON.parse(localStorage.getItem(historyKey));
        for (let i = 0; i < his.length; i++) {
            if (his[i].item.suumo_link === result.suumo_link) {
                his.splice(i, 1);
            }
        }
        his.push({ id: Date.now(), item: result });
        localStorage.setItem(historyKey, JSON.stringify(his));
        setAssessHistory(his);
    };

    const updateHistory = (newList) => {
        localStorage.setItem(historyKey, JSON.stringify(newList));
        setAssessHistory(newList);
        ReactTooltip.hide();
    };

    const parseDeviation = (deviation) => {
        let feedback;
        let score;
        let image;

        if (deviation <= 25) {
            feedback =
                'ここまで高いと逆にレアな物件ですね！何かプレミアがついているに違いありません！';
            score = 0;
            image = money1;
        } else if (deviation <= 30) {
            feedback =
                'ひどい！相場と比べて家賃が高すぎます。問い合わせるまでもありません。他の優良物件を探しましょう！';
            score = 0.5;
            image = money1;
        } else if (deviation <= 35) {
            feedback =
                '残念…。相場より家賃が非常に高いです。毎月かなりの金額を損してしまいます。今すぐ他の物件を探しましょう！';
            score = 1;
            image = money2;
        } else if (deviation <= 40) {
            feedback =
                '同じ駅や間取り・広さなどの物件と比べて割高な物件です。よほどのことがなければ住んではいけません。お得な物件を探しましょう！';
            score = 1.5;
            image = money2;
        } else if (deviation <= 45) {
            feedback =
                '同じ駅や間取り・広さなどの物件と比べて少しだけ割高です。特別な理由がなければ住む必要はありません。他にお得な物件があるはずです！';
            score = 2;
            image = money3;
        } else if (deviation <= 50) {
            feedback =
                'まあまあ。同じ駅や間取り・広さなどの物件の相場に相応の家賃です。もっとお得な物件があるはずです。探してみましょう！';
            score = 2.5;
            image = money3;
        } else if (deviation <= 55) {
            feedback =
                '同じ駅や間取り・広さなどの物件と比べて少しだけお得です。他に気に入った物件がなければ、住んでもいいかもしれません。';
            score = 3;
            image = money4;
        } else if (deviation <= 60) {
            feedback =
                'いい物件です！同じ駅や間取り・広さなどの物件と比べて十分お得な家賃なので候補に入れても良いでしょう！探せばもっといいお部屋が見つかるかも？';
            score = 3.5;
            image = money4;
        } else if (deviation <= 65) {
            feedback =
                'Good！同じ駅や間取り・広さなどの物件と比べてかなり安いです！とてもお得な物件なので有力候補に入れておきましょう！お問い合わせして詳細を確認してもいいかも！';
            score = 4;
            image = money5;
        } else if (deviation <= 70) {
            feedback =
                '素晴らしい！堀出し物です！同条件のお部屋と比べてあまりにお得なのですぐに埋まってしまうかも…。他の人に取られてしまう前に今すぐお問い合わせをしてください！';
            score = 4.5;
            image = money5;
        } else {
            feedback =
                'もはや安すぎ！何かあるのではないかと疑ってしまいます！格安の理由を聞いてみてください！もしかしたら本当に超優良物件なだけ！?';
            score = 5;
            image = money5;
        }

        return { score: score, feedback: feedback, image: image };
    };

    const priceDiff = assessmentData ? assessmentData.est_rent - assessmentData.set_rent : 0;

    // Needs to be moved to FeatureList component

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

    const handleInvalidImage = (image) => {
        invalidImages.push(image);
        let copy = invalidImages.slice(0);
        setInvalidImages(copy);
    };

    return (
        <React.Fragment>
            <Backdrop
                show={showDrawer || showPopover}
                zIndex={showDrawer ? 4 : 8}
                backdropHandler={() => {
                    setShowDrawer(false);
                    setShowPopover(false);
                }}
            />
            <Drawer show={showDrawer}>
                <History
                    historyList={assessHistory}
                    onDeleteClicked={(newList) => updateHistory(newList)}
                    parseDeviation={(d) => parseDeviation(d)}
                />
            </Drawer>
            <FloatingButton clickHandler={toggleDrawer} tooltip="履歴">
                <FaHistory color="white" />
            </FloatingButton>
            <MainContent>
                {showError && (
                    <Results>
                        <p
                            style={{
                                fontSize: '1.8rem',
                                margin: 0,
                                fontFamily: theme.fonts.header,
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                            }}
                        >
                            エラーが発生しました
                        </p>
                        <hr
                            style={{
                                height: 1,
                                backgroundColor: 'black',
                                border: 'none',
                                width: '50%',
                                minWidth: '300px',
                                marginBottom: '25px',
                            }}
                        />
                        <p style={{ fontSize: '1rem', margin: 0 }}>{errorMessage}</p>
                        <StyledButton
                            buttonType={true}
                            style={{ marginTop: '20px' }}
                            onClick={() => {
                                history.push('/');
                            }}
                        >
                            ホームに戻る
                        </StyledButton>
                    </Results>
                )}

                {!showError && assessmentData && (
                    <div style={{ minHeight: '90vh' }}>
                        <Results>
                            <p
                                style={{
                                    fontSize: '1.8rem',
                                    margin: 0,
                                    fontFamily: theme.fonts.header,
                                    fontWeight: 'bold',
                                    fontStyle: 'normal',
                                }}
                            >
                            </p>
                            <hr
                                style={{
                                    height: 2,
                                    backgroundColor: theme.colors.darkGrey,
                                    border: 'none',
                                    width: '50%',
                                    minWidth: '300px',
                                    marginBottom: '25px',
                                }}
                            />
                            <p style={{ fontSize: '1.2rem', margin: 0 }}> あなたのみている物件は</p>
                            <p style={{ fontSize: '1.2rem', margin: 0 }}>
                                2年間で{' '}
                                <font
                                    color={priceDiff < 0 ? '#00498e' : theme.colors.accent}
                                    size="7"
                                >
                                    <b>{Math.abs(Math.round(priceDiff) * 24).toLocaleString()}</b>
                                </font>{' '}
                                円{width < 500 ? <br /> : ''}の
                                {priceDiff < 0 ? ' 借り損です。' : ' 借り得です。'}
                            </p>
                            <p style={{ fontSize: '1.2rem', margin: 0 }}>
                                {' '}
                                (月間 {Math.abs(Math.round(priceDiff)).toLocaleString()} 円
                                <font
                                    color={priceDiff < 0 ? '#00498e' : theme.colors.accent}
                                    size="6"
                                >
                                    {priceDiff < 0 ? ' 高い' : ' 安い'}
                                </font>
                                です！){' '}
                            </p>
                            <img
                                alt=""
                                src={parseDeviation(assessmentData.deviation).image}
                                style={{ marginTop: '20px' }}
                            ></img>
                            <Assistant />
                            <FeedbackBubble>
                                {parseDeviation(assessmentData.deviation).feedback}
                            </FeedbackBubble>
                            <div
                                style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}
                            >
                                <StyledButton
                                    buttonType={true}
                                    onClick={() => {
                                        history.push('/');
                                    }}
                                >
                                    ホームに戻る
                                </StyledButton>
                                <StyledButton
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={assessmentData.suumo_link}
                                >
                                    SUUMOへ
                                </StyledButton>
                            </div>
                        </Results>
                        {recommendations.length > 0 && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                }}
                            >
                                <StyledFeature>
                                    <StyledFeatureWrapper>
                                        <FeatureHeader title="近隣のおすすめ物件" />
                                        <StyledFeatureList>
                                            {recommendations
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
                                                                    recommendations[index - 1]
                                                                        .address &&
                                                                property.area !==
                                                                    recommendations[index - 1]
                                                                        .area &&
                                                                property.minute !==
                                                                    recommendations[index - 1]
                                                                        .minute
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
                                                            saveToViewedHistory(property);
                                                        }}
                                                        key={index}
                                                        image={
                                                            property.image === ''
                                                                ? Placeholder
                                                                : property.image
                                                        }
                                                        name={property.name}
                                                        address={property.address}
                                                        price={property.set_rent}
                                                        estimatedPrice={property.est_rent}
                                                        area={property.area}
                                                        distance={property.minute}
                                                        floor={property.floor}
                                                        layout={property.layout}
                                                        age={property.age}
                                                        url={property.suumoLink}
                                                        windowWidth={width}
                                                        onInvalidImage={() =>
                                                            handleInvalidImage(property.image)
                                                        }
                                                    />
                                                ))}
                                        </StyledFeatureList>
                                    </StyledFeatureWrapper>
                                </StyledFeature>
                                <ShowMoreButton
                                    onClick={() => {
                                        let closestStation = getClosestStation(
                                            assessmentData.traffics
                                        );
                                        history.push(
                                            '/search?pref=' +
                                                assessmentData.pref +
                                                '&station=' +
                                                closestStation.station
                                        );
                                    }}
                                    style={{ marginBottom: '40px' }}
                                >
                                    {'もっと見る (' +
                                        recommendations.filter((property, index) => {
                                            if (
                                                property.image !== 'None' &&
                                                property.image !==
                                                    'https://maintenance.suumo.jp/maintenance.jpg' &&
                                                !invalidImages.includes(property.image)
                                            ) {
                                                if (index > 0) {
                                                    return (
                                                        property.address !==
                                                            recommendations[index - 1].address &&
                                                        property.area !==
                                                            recommendations[index - 1].area &&
                                                        property.minute !==
                                                            recommendations[index - 1].minute
                                                    );
                                                } else {
                                                    return true;
                                                }
                                            } else {
                                                return false;
                                            }
                                        }).length +
                                        ')'}
                                </ShowMoreButton>
                            </div>
                        )}
                    </div>
                )}
            </MainContent>
            <LoaderContainer show={fetching}>
                <Loader />
            </LoaderContainer>
        </React.Fragment>
    );
}

export default AssessPage;

import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import PageLoader from './common/pageLoader'

const Display = () => {
    const [matchInfo, setMatchInfo] = useState(null)
    const [team1Data, setTeam1Data] = useState(null)
    const [team2Data, setTeam2Data] = useState(null)
    const [currentBall, setCurrentBall] = useState(null)
    const [previousBall, setPreviousBall] = useState(null);
    const navigate = useNavigate();
    const [ballCounter, setBallCounter] = useState(0);
    const [isSet, setIsSet] = useState(false);
    const [imagecounst, setImagecounst] = useState(0);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [currentOverStatus, setCurrentOverStatus] = useState(null);
    const[battingTeamName, setBattingTeamName] = useState('');

    const imageList = ['./images/gravinPRO.png', './images/Ninth_Cloud.png', './images/khuber.png', './images/THINKCLOUD.png', './images/storyWala.png', './images/pixelnx.png', './images/gravin.png', './images/SevenHeavenFinal.png'];

    // Initial setup effect
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
    }, []);



    // Data loading effect
    useEffect(() => {
        const loadData = () => {
            const matchData = JSON.parse(localStorage.getItem('matchInfo'));
            const team1ScoreData = JSON.parse(localStorage.getItem('team1ScoreData'));
            const team2ScoreData = JSON.parse(localStorage.getItem('team2ScoreData'));
            const lastBall = localStorage.getItem('currentBall');
            const previousBall = localStorage.getItem('previousBall');

            setMatchInfo(matchData);
            setTeam1Data(team1ScoreData);
            setTeam2Data(team2ScoreData);
            setCurrentBall(lastBall);
            setPreviousBall(previousBall);
            setIsSet(localStorage.getItem('isSet'));
        };

        loadData();
        const interval = setInterval(loadData, 500);
        return () => clearInterval(interval);
    }, []);

    // Ball counter effect
    useEffect(() => {

        setImagecounst(isSet);

    }, [isSet]);

    useEffect(() => {
        let currentOver = JSON.parse(localStorage.getItem('currentOverData'));
        if (currentOver) {
            setCurrentOverStatus(currentOver);
            if (currentOver.teamNumber === 1) {
                setCurrentTeam(JSON.parse(localStorage.getItem('team1ScoreData')));
                setBattingTeamName(JSON.parse(localStorage.getItem('matchInfo')).team1);
            } else {
                setCurrentTeam(JSON.parse(localStorage.getItem('team2ScoreData')));
                setBattingTeamName(JSON.parse(localStorage.getItem('matchInfo')).team2);
            }
        }
    }, [currentBall, team1Data, team2Data]);





    const getBallDescription = (ball) => {

        if (!ball) return '';
        const value = ball.toUpperCase();
        const consecutiveCount = parseInt(localStorage.getItem('consecutiveZerosCount') || '0');

        // Show warning message if we have 2 consecutive zeros
        if (consecutiveCount === 2 && value === '0') {
            return (
                <>
                    <div className='inner-text done-animating'>
                        <h6 className='letter animate' style={{ color: '#ff4444', fontWeight: 'bold' }}>
                            0 Runs! <br></br> <span style={{ fontSize: "28px", fontWeight: '500' }}>(3rd Ball WARNING)</span>
                        </h6>
                    </div>
                </>
            );
        }

        switch (value) {
            case 'W': return <>
                <div className='inner-text done-animating'>
                    <h6 className='letter animate' > Wide ball (+2 runs)</h6>
                </div>
            </>;
            case 'N': return <>
                <div className='inner-text done-animating'>
                    <h6 className='letter animate' >No ball (+2 runs )</h6>
                </div>
            </>;
            case 'C': return <>
                <div className='bc_show_score_b_img'>
                    <img src={imageList[imagecounst]} alt="Catch out"></img>
                </div>
                {/* <div id="inner-text" className={doneAnimating ? 'done-animating' : ''}><h6 className={`letter ${isAnimating ? 'animate' : ''}`}>Catch Out (-5 runs)</h6></div> */}
                <div className='inner-text done-animating'>
                    <h6 className='letter animate' > Catch Out (-5 runs)</h6>
                </div>

            </>;
            case '4': return <>
                <div className='bc_show_score_b_img'>
                    <img src={imageList[imagecounst]} alt="4 runs" />
                </div>
                <div className='inner-text done-animating'>
                    <h6 className='letter animate'>4 Runs</h6>
                </div>

            </>;
            case '5': return <>
                <div className='bc_show_score_b_img'>
                    <img src={imageList[imagecounst]} alt="5 runs" />
                </div>
                <div className='inner-text done-animating'>
                    <h6 className='letter animate'>5 Runs</h6>
                </div>

            </>;
            case '7': return <>
                <div className='bc_show_score_b_img'>
                    <img src={imageList[imagecounst]} alt="7 runs" />
                </div>
                <div className='inner-text done-animating'>
                    <h6 className='letter animate'>7 Runs</h6>
                </div>

            </>;
            case 'B': return <>
                <div className='bc_show_score_b_img'>
                    <img src={imageList[imagecounst]} alt="Bowled" />
                </div>
                <div className='inner-text done-animating'>
                    <h6 className='letter animate'>Bowled (-5 runs)</h6>
                </div>

            </>;
            case 'R': return <>
                <div className='bc_show_score_b_img'>
                    <img src={imageList[imagecounst]} alt="Run out" />
                </div>
                <div className='inner-text done-animating'>
                    <h6 className='letter animate'>Run-out (-5 Runs)</h6>
                </div>

            </>;
            case 'S': return <>
                <div className='bc_show_score_b_img'>
                    <img src={imageList[imagecounst]} alt="Stumped" />
                </div>
                <div className=' inner-text done-animating'>
                    <h6 className='letter animate'>Stumped (-5 Runs)</h6>
                </div>

            </>;
            case 'H': return <>
                <div className='bc_show_score_b_img'>
                    <img src={imageList[imagecounst]} alt="Hit wicket" />
                </div>
                <div className='inner-text done-animating'>
                    <h6 className='letter animate'>Hit Wicket (-5 Runs)</h6>
                </div>

            </>;
            default:
                const runs = parseInt(value);
                if (!isNaN(runs) && runs >= 0) {
                    return <div className='className=' inner-text done-animating>
                        <h6 className='letter animate'>{runs} {runs === 1 ? 'Run' : 'Runs'}</h6>
                    </div>

                    // `${runs} ${runs === 1 ? 'Run' : 'Runs'}`;
                }
                return '';
        }

    }

    const calculateSkinScore = (teamData, skinIndex, oversPerSkin) => {
        if (!teamData) return 0

        // Calculate the over range for this skin
        const startOver = skinIndex * parseInt(oversPerSkin)
        const endOver = Math.min(startOver + parseInt(oversPerSkin), parseInt(matchInfo.totalOvers))
        let skinTotal = 0

        teamData.forEach(pair => {
            pair.batsmen.forEach(batsman => {
                batsman.overs.forEach((over) => {
                    // Get the actual over number (1-based)
                    const overNumber = parseInt(over.bowlerNum)
                    // Check if this over belongs to the current skin
                    if (overNumber > startOver && overNumber <= endOver) {
                        // Main balls
                        over.balls.forEach((ball, index) => {
                            if (!ball) return;
                            const value = ball;
                            const extraRun = parseInt(over.extraRuns[index] || 0);
                            const upperValue = value.toUpperCase();
                            if (upperValue === 'W') {
                                skinTotal += 2 + extraRun; // Wide ball: 1 run plus extra runs
                            } else if (upperValue === 'N') {
                                skinTotal += 2 + extraRun; // No ball: 1 run plus extra runs
                            } else if (['R', 'C', 'B', 'S', 'H'].includes(upperValue)) {
                                skinTotal -= 5; // Subtract 5 for wickets
                            } else {
                                const numValue = parseInt(value);
                                if (!isNaN(numValue) && numValue >= 0) {
                                    skinTotal += numValue; // Add any valid number of runs
                                }
                            }
                        });
                        // Extra balls
                        if (over.extraBalls && over.extraBalls.length > 0) {
                            over.extraBalls.forEach((ball, index) => {
                                if (!ball) return;
                                const value = ball;
                                const extraRun = parseInt(over.extraRuns[index + over.balls.length] || 0);
                                const upperValue = value.toUpperCase();
                                if (upperValue === 'W') {
                                    skinTotal += 2 + extraRun;
                                } else if (upperValue === 'N') {
                                    skinTotal += 2 + extraRun;
                                } else if (['R', 'C', 'B', 'S', 'H'].includes(upperValue)) {
                                    skinTotal -= 5;
                                } else {
                                    const numValue = parseInt(value);
                                    if (!isNaN(numValue) && numValue >= 0) {
                                        skinTotal += numValue;
                                    }
                                }
                            });
                        }
                    }
                })
            })
        })

        return skinTotal
    }

    // const calculateTeamTotal = (teamData) => {
    //     if (!teamData) return { total: 0, skins: 0 }

    //     const skinScores = Array(parseInt(matchInfo?.oversPerSkin || 0)).fill(0)
    //         .map((_, index) => calculateSkinScore(teamData, index, parseInt(matchInfo?.oversPerSkin || 0)))

    //     const total = skinScores.reduce((sum, score) => sum + score, 0)
    //     const skins = skinScores.length > 0 ?
    //         skinScores.filter((score, index) =>
    //             score > calculateSkinScore(teamData === team1Data ? team2Data : team1Data, index, parseInt(matchInfo?.oversPerSkin || 0))
    //         ).length : 0

    //     return { total, skins }
    // }

    const calculateTeamTotal = (teamData) => {
        if (!teamData) return { total: 0, skins: 0 }

        // Calculate total number of skins based on totalOvers and oversPerSkin
        const numberOfSkins = Math.ceil(parseInt(matchInfo?.totalOvers || 0) / parseInt(matchInfo?.oversPerSkin || 0))

        // Calculate scores for all skins including the last one
        const skinScores = Array(numberOfSkins).fill(0)
            .map((_, index) => calculateSkinScore(teamData, index, parseInt(matchInfo?.oversPerSkin || 0)))

        // Sum up all skin scores for total
        const total = skinScores.reduce((sum, score) => sum + score, 0)

        // Calculate number of skins won
        const skins = skinScores.length > 0 ?
            skinScores.filter((score, index) =>
                score > calculateSkinScore(teamData === team1Data ? team2Data : team1Data, index, parseInt(matchInfo?.oversPerSkin || 0))
            ).length : 0

        return { total, skins }
    }

    if (!matchInfo || !team1Data || !team2Data) {
        return <PageLoader />
    }

    const numberOfSkins = Math.ceil(parseInt(matchInfo.totalOvers) / parseInt(matchInfo.oversPerSkin))
    const skinColumns = Array(numberOfSkins).fill(0)
        .map((_, index) => index + 1)

    return (
        <div className="ps_display_box">
            <div className='row'>
                <div id='display_final' className='col-xl-12 ps_display_mb_5'>
                    <div className='bc_final_head_boxes' style={{ borderRadius: "0px 0px 10px 10px" }} >

                        <div className="box_cric_team_heading">
                            <h3 className="m-0">Final Score</h3>
                        </div>

                        <div className="table-responsive  bc_final_score">
                            <table className="table table-bordered box_cric_team_box p-0">
                                <thead>
                                    <tr>
                                        <th className='bb-1 border-head'></th>
                                        <th className='bb-1 text-center border-head ps_display_team_head' colSpan={skinColumns.length} >Skins</th>
                                        <th className='bb-1 border-head ps_display_team_head'>TOTAL</th>
                                    </tr>
                                    <tr>
                                        <th className='bb-1'></th>
                                        {skinColumns.map(num => (
                                            <th key={num} className="text-center bb-1 ps_display_lh_ft ps_display_team_skin">{num}</th>
                                        ))}
                                        <th className='bb-1'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold text-center ps_display_lh_ft ps_display_team_name">{matchInfo.team1}</td>
                                        {skinColumns.map((_, index) => (
                                            <td key={index} className="text-center ps_display_lh_ft2 ps_display_team_score">
                                                {calculateSkinScore(team1Data, index, parseInt(matchInfo.oversPerSkin))}
                                            </td>
                                        ))}
                                        <td className="fw-bold text-center ps_display_lh_ft ps_display_team_total">
                                            {calculateTeamTotal(team1Data).total}
                                            ({calculateTeamTotal(team1Data).skins} skins)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-center ps_display_lh_ft ps_display_team_name">{matchInfo.team2}</td>
                                        {skinColumns.map((_, index) => (
                                            <td key={index} className="text-center ps_display_lh_ft2 ps_display_team_score">
                                                {calculateSkinScore(team2Data, index, parseInt(matchInfo.oversPerSkin))}
                                            </td>
                                        ))}
                                        <td className="fw-bold text-center ps_display_lh_ft ps_display_team_total">
                                            {calculateTeamTotal(team2Data).total}
                                            ({calculateTeamTotal(team2Data).skins} skins)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div id='display_status' className='col-xl-12 '>
                    <div className='bc_fullWidth_box'>
                        <div className='row'>
                            <div className='col-lg-9'>
                                <div className='bc_final_head_boxes'>
                                    <div className="box_cric_team_heading">
                                        <h3 className="m-0">Last Ball Status</h3>
                                    </div>

                                    <div className="bc_score_box_show_waiting">
                                        {currentBall ? (
                                            <>
                                                <div className="text-center fs-5 mb-0">{getBallDescription(currentBall)}</div>

                                            </>
                                        ) : (
                                            <>
                                                <div className='bc_score_box_show_waiting_box '>
                                                    <div className=''>
                                                        <img src='./images/waiting.gif'></img>
                                                    </div>
                                                    <div className='inner-text done-animating '>
                                                        <h6 className='letter animate'>Waiting for ball...</h6>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        {currentOverStatus && (
                                            <div className='bc_current_over_box'>
                                                <div className="box_cric_team_heading mb-2">

                                                    <h3 className="m-0">Over {currentOverStatus.overNumber}</h3>
                                                    <h3 className="m-0">Batting Team: {battingTeamName}</h3>
                                                    <tr className="border-top border-dark">
                                                        <td colSpan="2" className="text-end pe-2">Bowler:</td>
                                                        <td colSpan="8" className="fw-bold">
                                                            {currentTeam[currentOverStatus.rowIndex].batsmen[0].overs[currentOverStatus.overIndex].bowlerName}
                                                        </td>
                                                    </tr>

                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center">Batsman</th>
                                                                <th colSpan="6" className="text-center">Balls</th>
                                                                <th className="text-center">Total
                                                                    <tr>
                                                                        {currentTeam[currentOverStatus.rowIndex]?.totals[currentOverStatus?.overIndex]}
                                                                    </tr>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentTeam[currentOverStatus.rowIndex].batsmen.map((batsman, batsmanIndex) => (
                                                                <tr key={`batsman-${batsmanIndex}`}>

                                                                    <td className='ps_relative' style={{ width: '150px' }}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control box_cric_input_filed_name"
                                                                            placeholder="Batsman name"
                                                                            autoComplete="off"
                                                                            value={batsman.name}
                                                                            disabled={true}
                                                                        />

                                                                    </td>
                                                                    {batsman.overs.map((over, overIndex) => (
                                                                        overIndex === currentOverStatus.overIndex && (
                                                                            <td key={overIndex} className="p-2">
                                                                                <div className="d-flex justify-content-between gap-1 align-items-start" style={{ minWidth: '160px' }}>
                                                                                    {/* 6 balls */}
                                                                                    <div className='d-flex justify-content-center gap-1'>
                                                                                        {batsman.overs[overIndex].balls.map((ball, ballIndex) => (
                                                                                            <div key={ballIndex} className="d-flex flex-column align-items-center">
                                                                                                <div className="d-flex">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        disabled={true}
                                                                                                        className="form-control box_cric_input_score"
                                                                                                        value={ball}
                                                                                                    />
                                                                                                </div>
                                                                                                {(ball === 'W' || ball === 'n' || ball === 'N' || ball === 'w') && (
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        disabled={true}
                                                                                                        className="form-control box_cric_input_score mt-1"
                                                                                                        value={over.extraRuns[ballIndex] || ''}
                                                                                                        placeholder=""
                                                                                                    />
                                                                                                )}
                                                                                            </div>))}

                                                                                        {/* Extra balls section */}
                                                                                        {over.extraBalls && over.extraBalls.map((extraBall, extraBallIndex) => (
                                                                                            <div key={`extra-${extraBallIndex}`} className="d-flex flex-column align-items-center">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    disabled={true}
                                                                                                    className="form-control box_cric_input_score"
                                                                                                    value={extraBall}
                                                                                                />
                                                                                                {/* Show extra runs input for W and N below */}
                                                                                                {(extraBall?.toUpperCase() === 'W' || extraBall?.toUpperCase() === 'N') && (
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control box_cric_input_score mt-1"
                                                                                                        disabled={true}
                                                                                                        value={over.extraRuns[extraBallIndex + over.balls.length] || ''}
                                                                                                        placeholder=""
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>

                                                                                    {/* Score total and Add Extra Ball button side by side */}
                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control box_cric_input_score box_cric_input_scoreTT"
                                                                                            value={over.overTotal}
                                                                                            readOnly
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        )))}
                                                                </tr>
                                                            ))}


                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div className='col-lg-3'>
                                <div className='bc_final_head_boxes_logo'>
                                    <div className='bc_legend_img'> <img src='./images/cricket_legends.jpg'></img></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Display
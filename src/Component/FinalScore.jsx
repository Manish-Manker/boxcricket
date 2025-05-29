import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import PageLoader from './common/pageLoader'


const FinalScore = () => {
    const [matchInfo, setMatchInfo] = useState(null)
    const [team1Data, setTeam1Data] = useState(null)
    const [team2Data, setTeam2Data] = useState(null)
    const [currentBall, setCurrentBall] = useState(null)
    const [previousBall, setPreviousBall] = useState(null);
    const navigate = useNavigate();

    const [imagecounst, setImagecounst] = useState(0);
    const imageList = ['./images/gravinPRO.png', './images/Ninth_Cloud.png', './images/khuber.png', './images/THINKCLOUD.png', './images/storyWala.png', './images/pixelnx.png', './images/gravin.png', './images/SevenHeavenFinal.png']

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        let value = currentBall;
        if (value === 'C' || 'c' || value === '2' || value === '4' || value === '5' || value === '7' || value === 'B' || value === 'b' || value === 'R' || value === 'r' || value === 'S' || value === 's' || value === 'H' || value === 'h') {
            setImagecounst(imagecounst + 1)
            console.log('imagecounst', imagecounst);

        }
    }, [currentBall]);

    useEffect(() => {
        // Load match info and team data from localStorage
        const loadData = () => {
            const matchData = JSON.parse(localStorage.getItem('matchInfo'))
            const team1ScoreData = JSON.parse(localStorage.getItem('team1ScoreData'))
            const team2ScoreData = JSON.parse(localStorage.getItem('team2ScoreData'))
            const lastBall = localStorage.getItem('currentBall')
            const previousBall = localStorage.getItem('previousBall')

            setMatchInfo(matchData)
            setTeam1Data(team1ScoreData)
            setTeam2Data(team2ScoreData)
            setCurrentBall(lastBall)
            setPreviousBall(previousBall)

        }

        // console.log('curent ball', currentBall,'previous ball', previousBall);


        loadData()
        const interval = setInterval(loadData, 500)
        return () => clearInterval(interval)
    }, [])


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

        if (imagecounst > imageList.length - 1) {
            setImagecounst(0)
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
        <div className="">
            <div className='row'>
                <div className='col-xl-6 bc_mb-4'>
                    <div className='bc_final_head_boxes' style={{ paddingRight: '30px' }}>

                        <div className="box_cric_team_heading">
                            <h3 className="m-0">Final Score</h3>
                        </div>

                        <div className="table-responsive  bc_final_score">
                            <table className="table table-bordered box_cric_team_box p-0">
                                <thead>
                                    <tr>
                                        <th className='bb-1 border-head'></th>
                                        <th className='bb-1 text-center border-head' colSpan={skinColumns.length} >Skins</th>
                                        <th className='bb-1 border-head'>TOTAL</th>
                                    </tr>
                                    <tr>
                                        <th className='bb-1'></th>
                                        {skinColumns.map(num => (
                                            <th key={num} className="text-center bb-1 bc-lh-45 f-16">{num}</th>
                                        ))}
                                        <th className='bb-1'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold text-center f-16 bc-lh-45">{matchInfo.team1}</td>
                                        {skinColumns.map((_, index) => (
                                            <td key={index} className="text-center bc-lh-45">
                                                {calculateSkinScore(team1Data, index, parseInt(matchInfo.oversPerSkin))}
                                            </td>
                                        ))}
                                        <td className="fw-bold text-center f-16 bc-lh-45">
                                            {calculateTeamTotal(team1Data).total}
                                            ({calculateTeamTotal(team1Data).skins} skins)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-center f-16 bc-lh-45">{matchInfo.team2}</td>
                                        {skinColumns.map((_, index) => (
                                            <td key={index} className="text-center bc-lh-45">
                                                {calculateSkinScore(team2Data, index, parseInt(matchInfo.oversPerSkin))}
                                            </td>
                                        ))}
                                        <td className="fw-bold text-center f-16 bc-lh-45">
                                            {calculateTeamTotal(team2Data).total}
                                            ({calculateTeamTotal(team2Data).skins} skins)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='col-xl-6 '>
                    <div className='bc_final_head_boxes'>
                        <div className='row'>
                            <div className='col-lg-8'>
                                <div >
                                    <div className="box_cric_team_heading">
                                        <h3 className="m-0">Last Ball Status</h3>
                                    </div>

                                    <div className="bc_score_box_show_waiting">
                                        {currentBall ? (
                                            <>
                                                {/* <h2 className="mb-3 text-center">{currentBall.toUpperCase()}</h2> */}
                                                <div className="text-center fs-5 mb-0">{getBallDescription(currentBall)}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className='bc_score_box_show_waiting_box'>
                                                    <div className=''>
                                                        <img src='./images/waiting.gif'></img>
                                                    </div>
                                                    <div className='inner-text done-animating'>
                                                        <h6 className='letter animate'>Waiting for ball...</h6>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='col-lg-4 m-auto'>
                                <div className='bc_legend_img'> <img src='./images/cricket_legends.jpg'></img></div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>

            {/* Current Ball Info - 40% width */}

        </div>
    )
}

export default FinalScore
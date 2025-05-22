import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const FinalScore = () => {
    const [matchInfo, setMatchInfo] = useState(null)
    const [team1Data, setTeam1Data] = useState(null)
    const [team2Data, setTeam2Data] = useState(null)
    const [currentBall, setCurrentBall] = useState(null)

    useEffect(() => {
        // Load match info and team data from localStorage
        const loadData = () => {
            const matchData = JSON.parse(localStorage.getItem('matchInfo'))
            const team1ScoreData = JSON.parse(localStorage.getItem('team1ScoreData'))
            const team2ScoreData = JSON.parse(localStorage.getItem('team2ScoreData'))
            const lastBall = localStorage.getItem('currentBall')

            setMatchInfo(matchData)
            setTeam1Data(team1ScoreData)
            setTeam2Data(team2ScoreData)
            setCurrentBall(lastBall)
        }

        loadData()
        const interval = setInterval(loadData, 500) // Check every half second for updates

        return () => clearInterval(interval)
    }, [])

    const getBallDescription = (ball) => {
        if (!ball) return '';
        const value = ball; // Keep the case to differentiate between N and n
        switch (value) {
            case 'W': return 'Wide ball (extra runs only)';
            // case 'N': return 'No ball (+2 runs and extra ball)';
            case 'n': return 'No ball (extra runs only)';
            // case 'R': return 'Run Out (-5 runs)';
            case 'C': return  <>
                <div className='bc_show_score_b_img'>
                <img src='./images/gravinPRO.jpg'></img>
                 </div>
                <h6 className='bc_show_score_b_run'>Catch Out (-5 runs)</h6>
            </>;;
            // case 'B': return 'Bowled (-5 runs)';
            case '4': return <>
                <div className='bc_show_score_b_img'>
                <img src='./images/Ninth_Cloud.png'></img>
                 </div>
                <h6 className='bc_show_score_b_run'>4 Runs</h6>
            </>;
             case '5': return <>
                <div className='bc_show_score_b_img'>
                <img src='./images/khuber.jpg'></img>
                 </div>
                <h6 className='bc_show_score_b_run'>5 Runs</h6>
            </>;
             case '7': return <>
                <div className='bc_show_score_b_img'>
                <img src='./images/THINKCLOUD.png'></img>
                 </div>
                <h6 className='bc_show_score_b_run'>7 Runs</h6>
            </>;
             case 'B': return <>
                <div className='bc_show_score_b_img'>
                <img src='./images/storyWala.png'></img>
                 </div>
                <h6 className='bc_show_score_b_run'>Bowled (-5 runs)</h6>
            </>;
            case 'R': return <>
                <div className='bc_show_score_b_img'>
                <img src='./images/logo.svg'></img>
                 </div>
                <h6 className='bc_show_score_b_run'>Run-out -5 Runs</h6>
            </>;

             case 'S': return <>
                <div className='bc_show_score_b_img'>
                <img src='./images/gravin.jpg'></img>
                 </div>
                <h6 className='bc_show_score_b_run'>Stumped -5 Runs</h6>
            </>;

             case 'H': return <>
                <div className='bc_show_score_b_img'>
                <img src='./images/SevenHeavenFinal.png'></img>
                 </div>
                <h6 className='bc_show_score_b_run'>Hit Wicket -5 Runs</h6>
            </>;
            default:
                const runs = parseInt(value);
                if (runs >= 0 && runs <= 7) {
                    return `${runs} ${runs === 1 ? 'Run' : 'Runs'}`;
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
                        over.balls.forEach((ball, index) => {
                            if (!ball) return;
                            const value = ball; // Don't convert to uppercase to preserve N/n difference
                            const extraRun = parseInt(over.extraRuns[index] || 0);
                            if (value === 'W' ) {
                                skinTotal += extraRun; // Wide/No ball: only extra runs
                            }else if( value === 'n'){
                                skinTotal += 2+extraRun;
                            }
                              else if (['R', 'C', 'B', 'S', 'H'].includes(value.toUpperCase())) {
                                skinTotal -= 5; // Subtract 5 for wickets
                            } else {
                                const numValue = parseInt(value);
                                if (numValue >= 0 && numValue <= 7) {
                                    skinTotal += numValue;
                                }
                            }
                        });
                    }
                })
            })
        })

        return skinTotal
    }

    const calculateTeamTotal = (teamData) => {
        if (!teamData) return { total: 0, skins: 0 }

        const skinScores = Array(parseInt(matchInfo?.oversPerSkin || 0)).fill(0)
            .map((_, index) => calculateSkinScore(teamData, index, parseInt(matchInfo?.oversPerSkin || 0)))

        const total = skinScores.reduce((sum, score) => sum + score, 0)
        const skins = skinScores.length > 0 ?
            skinScores.filter((score, index) =>
                score > calculateSkinScore(teamData === team1Data ? team2Data : team1Data, index, parseInt(matchInfo?.oversPerSkin || 0))
            ).length : 0

        return { total, skins }
    }

    if (!matchInfo || !team1Data || !team2Data) {
        return <div className="container mt-5">Loading...</div>
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
                                            <th key={num} className="text-center bb-1 bc-lh-35">{num}</th>
                                        ))}
                                        <th className='bb-1'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold text-center">{matchInfo.team1}</td>
                                        {skinColumns.map((_, index) => (
                                            <td key={index} className="text-center">
                                                {calculateSkinScore(team1Data, index, parseInt(matchInfo.oversPerSkin))}
                                            </td>
                                        ))}
                                        <td className="fw-bold text-center">
                                            {calculateTeamTotal(team1Data).total}
                                            ({calculateTeamTotal(team1Data).skins} skins)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-center">{matchInfo.team2}</td>
                                        {skinColumns.map((_, index) => (
                                            <td key={index} className="text-center">
                                                {calculateSkinScore(team2Data, index, parseInt(matchInfo.oversPerSkin))}
                                            </td>
                                        ))}
                                        <td className="fw-bold text-center">
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
                            <div className='col-md-8'>
                                <div >
                                    <div className="box_cric_team_heading">
                                        <h3 className="m-0">Last Ball Status</h3>
                                    </div>

                                    <div className="bc_score_box_show">
                                        {currentBall ? (
                                            <>
                                                {/* <h2 className="mb-3 text-center">{currentBall.toUpperCase()}</h2> */}
                                                <p className="text-center fs-5 mb-0">{getBallDescription(currentBall)}</p>
                                            </>
                                        ) : (
                                            <p className="text-center text-muted mb-0">Waiting for ball...</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='col-md-4'>
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
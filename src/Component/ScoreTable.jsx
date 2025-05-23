import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import FinalScore from './FinalScore'
import { PDFDownloadLink } from '@react-pdf/renderer';
import FullMatchPDF from './FullMatchPDF';

const ScoreTable = () => {
  const [matchInfo, setMatchInfo] = useState(null)
  const [team1Data, setTeam1Data] = useState(null)
  const [team2Data, setTeam2Data] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    localStorage.removeItem('currentBall');
  }, []);

  // Helper function to create initial rows
  const createRows = (rowCount, oversPerSkin) => {
    return Array(rowCount).fill().map((_, rowIndex) => ({
      pairId: rowIndex + 1,
      batsmen: [
        {
          name: '',
          overs: Array(oversPerSkin).fill().map((_, overIndex) => ({
            bowlerNum: (rowIndex * oversPerSkin + overIndex + 1),
            bowlerName: '',
            balls: Array(6).fill(''),
            extraBalls: [], // For storing extra balls from capital N
            extraRuns: Array(6).fill(''), // Store extra runs for W and n
            overTotal: '0'
          }))
        },
        {
          name: '',
          overs: Array(oversPerSkin).fill().map((_, overIndex) => ({
            bowlerNum: (rowIndex * oversPerSkin + overIndex + 1),
            bowlerName: '',
            balls: Array(6).fill(''),
            extraBalls: [], // For storing extra balls from capital N
            extraRuns: Array(6).fill(''), // Store extra runs for W and n
            overTotal: '0'
          }))
        }
      ],
      totals: Array(oversPerSkin).fill('0/0')
    }))
  }

  // Initialize data from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('matchInfo'))
    setMatchInfo(data)
    setLoading(false)
  }, [])

  // Initialize score data when matchInfo is available
  useEffect(() => {
    if (matchInfo && (!team1Data || !team2Data)) {
      const numberOfRows = Math.ceil(parseInt(matchInfo.totalOvers) / parseInt(matchInfo.oversPerSkin))
      const numberOfCols = parseInt(matchInfo.oversPerSkin)

      // Initialize both teams' data
      if (!team1Data) {
        setTeam1Data(createRows(numberOfRows, numberOfCols))
      }
      if (!team2Data) {
        setTeam2Data(createRows(numberOfRows, numberOfCols))
      }
    }
  }, [matchInfo, team1Data, team2Data])

  useEffect(() => {
    // Save team1Data to localStorage whenever it changes
    if (team1Data) {
      localStorage.setItem('team1ScoreData', JSON.stringify(team1Data))
    }
  }, [team1Data])

  useEffect(() => {
    // Save team2Data to localStorage whenever it changes
    if (team2Data) {
      localStorage.setItem('team2ScoreData', JSON.stringify(team2Data))
    }
  }, [team2Data])

  if (loading || !matchInfo || !team1Data || !team2Data) {
    return <div className='bc_loader_box'>
      <div className='bc_loader_box_div'>
        <div className="card-content">
          <div className="loader-1">
            <div className="pulse-container">
              <div className="pulse-circle"></div>
              <div className="pulse-circle"></div>
              <div className="pulse-circle"></div>
            </div>
          </div>
        </div>
        <img src='./images/logo.svg'></img>
        <h6>Pixa-Score created by PixelNX-FZCO</h6>
      </div>

    </div>
  }

  const numberOfCols = parseInt(matchInfo.oversPerSkin)
  const isValidInput = (value) => {
    if (!value) return true;
    const upperValue = value.toUpperCase();
    // Check for special characters (case-insensitive)
    if (['W', 'N', 'R', 'C', 'B', 'S', 'H'].includes(upperValue)) {
      return true;
    }
    // Check for any valid number
    const numValue = parseInt(value);
    return !isNaN(numValue) && numValue >= 0 && numValue <= 99;
  };

  const isValidExtraRun = (value) => {
    if (!value) return true;
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 99;
  };
  // Calculate total for one over (6 balls + extra balls)  
  const calculateOverTotal = (balls, extraRuns, extraBalls = []) => {
    // Function to calculate total for a single ball
    const calculateBallTotal = (ball, extraRun = 0) => {
      if (!ball) return 0;
      const value = ball.toUpperCase();

      // Handle special ball types
      if (value === 'W') return parseInt(extraRun || 0);  // Wide ball: 1 run + extra runs
      if (value === 'N') return 2 + parseInt(extraRun || 0);  // No ball: 1 run + extra runs
      if (['R', 'C', 'B', 'S', 'H'].includes(value)) return -5;  // Wickets: -5 runs

      // Handle numeric values
      const numValue = parseInt(value);
      return numValue >= 0 ? numValue : 0;
    };

    // Calculate total from main balls
    const mainBallsTotal = balls.reduce((sum, ball, index) => {
      const extraRun = parseInt(extraRuns[index] || 0);
      return sum + calculateBallTotal(ball, extraRun);
    }, 0);

    // Calculate total from extra balls
    const extraBallsTotal = extraBalls.reduce((sum, ball, index) => {
      const extraRun = parseInt(extraRuns[index + balls.length] || 0);
      return sum + calculateBallTotal(ball, extraRun);
    }, 0);

    return mainBallsTotal + extraBallsTotal;
  };

  // Count wickets (R/C/B) in an over
  const countWickets = (balls) => {
    return balls.reduce((count, ball) => {
      if (!ball) return count;
      const value = ball.toUpperCase();
      return ['R', 'C', 'B', 'S', 'H'].includes(value) ? count + 1 : count;
    }, 0);
  }
  // Calculate total for one batsman (all overs)
  const calculateBatsmanTotal = (overs) => {
    return overs.reduce((sum, over) => {
      return sum + calculateOverTotal(over.balls, over.extraRuns, over.extraBalls)
    }, 0)
  }

  const handleBallChange = (teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, value) => {
    // Only allow valid inputs
    if (!isValidInput(value)) {
      return;
    }

    // Save current ball to localStorage
    localStorage.setItem('currentBall', value);

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data;

    setTeamData(prevData => {
      const newData = [...prevData];
      // Update the ball value
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls[ballIndex] = value;

      // Calculate new over total and wickets
      const overBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls;
      const overExtraRuns = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns;
      const overExtraBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraBalls;
      const overTotal = calculateOverTotal(overBalls, overExtraRuns, overExtraBalls);
      const wickets = countWickets(overBalls);

      // Update over stats
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].overTotal = overTotal.toString();      // Update pair totals for this over
      const pairOverTotal = calculateOverTotal(
        newData[rowIndex].batsmen[0].overs[overIndex].balls,
        newData[rowIndex].batsmen[0].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[0].overs[overIndex].extraBalls
      ) + calculateOverTotal(
        newData[rowIndex].batsmen[1].overs[overIndex].balls,
        newData[rowIndex].batsmen[1].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[1].overs[overIndex].extraBalls
      );
      const pairOverWickets = countWickets(newData[rowIndex].batsmen[0].overs[overIndex].balls) +
        countWickets(newData[rowIndex].batsmen[1].overs[overIndex].balls);
      newData[rowIndex].totals[overIndex] = `${pairOverWickets}/${pairOverTotal}`;

      return newData;
    });
  };

  const handleExtraRunsChange = (teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, value) => {
    if (!isValidExtraRun(value)) {
      return;
    }

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data;

    setTeamData(prevData => {
      const newData = [...prevData];
      // Update the extra runs value
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns[ballIndex] = value;

      // Calculate new over total
      const overBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls;
      const overExtraRuns = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns;
      const overExtraBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraBalls;
      const overTotal = calculateOverTotal(overBalls, overExtraRuns, overExtraBalls);

      // Update over stats
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].overTotal = overTotal.toString();      // Update pair totals for this over
      const pairOverTotal = calculateOverTotal(
        newData[rowIndex].batsmen[0].overs[overIndex].balls,
        newData[rowIndex].batsmen[0].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[0].overs[overIndex].extraBalls
      ) + calculateOverTotal(
        newData[rowIndex].batsmen[1].overs[overIndex].balls,
        newData[rowIndex].batsmen[1].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[1].overs[overIndex].extraBalls
      );

      const pairOverWickets = countWickets(newData[rowIndex].batsmen[0].overs[overIndex].balls) +
        countWickets(newData[rowIndex].batsmen[1].overs[overIndex].balls);

      newData[rowIndex].totals[overIndex] = `${pairOverWickets}/${pairOverTotal}`;

      return newData;
    });
  };
  const handleExtraBallChange = (teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, value) => {
    // Allow empty value for clearing
    if (value !== '' && !isValidInput(value)) {
      return;
    }

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data; setTeamData(prevData => {
      const newData = [...prevData];
      // Get reference to current over
      const currentOver = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex];
      const balls = currentOver.balls;
      const extraBalls = currentOver.extraBalls || [];

      // Update extra ball value
      extraBalls[ballIndex] = value;
      currentOver.extraBalls = extraBalls;

      // Convert to uppercase for case-insensitive comparison
      const upperValue = value.toUpperCase();

      // Handle special cases for wide and no-ball
      if (upperValue === 'W' || upperValue === 'N') {
        // Initialize extraRuns array if not exists
        if (!currentOver.extraRuns) {
          currentOver.extraRuns = Array(6 + extraBalls.length).fill('0');
        }
        // Ensure we have enough slots in extraRuns array for extra balls
        while (currentOver.extraRuns.length <= ballIndex + balls.length) {
          currentOver.extraRuns.push('0');
        }
        // If it's not already showing the extra runs input, show it with default value '0'
        if (!currentOver.extraRuns[ballIndex + balls.length]) {
          currentOver.extraRuns[ballIndex + balls.length] = '0';
        }
      }
      // Handle wicket types
      else if (['R', 'C', 'B', 'S', 'H'].includes(upperValue)) {
        // Wickets should not have extra runs in box cricket
        newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns[ballIndex] = '0';
      }

      // Calculate new over total including extra balls
      const overBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls;
      const overExtraRuns = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns;
      const overExtraBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraBalls;

      // Calculate over total with updated values
      const overTotal = calculateOverTotal(overBalls, overExtraRuns, overExtraBalls);

      // Update over stats
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].overTotal = overTotal.toString();

      // Update pair totals for this over
      const pairOverTotal = calculateOverTotal(
        newData[rowIndex].batsmen[0].overs[overIndex].balls,
        newData[rowIndex].batsmen[0].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[0].overs[overIndex].extraBalls
      ) + calculateOverTotal(
        newData[rowIndex].batsmen[1].overs[overIndex].balls,
        newData[rowIndex].batsmen[1].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[1].overs[overIndex].extraBalls
      );

      // Calculate wickets from both regular and extra balls
      const pairOverWickets =
        countWickets(newData[rowIndex].batsmen[0].overs[overIndex].balls) +
        countWickets(newData[rowIndex].batsmen[0].overs[overIndex].extraBalls) +
        countWickets(newData[rowIndex].batsmen[1].overs[overIndex].balls) +
        countWickets(newData[rowIndex].batsmen[1].overs[overIndex].extraBalls);

      newData[rowIndex].totals[overIndex] = `${pairOverWickets}/${pairOverTotal}`;

      // Save the last entered value to indicate current ball
      if (value) {
        localStorage.setItem('currentBall', value);
      }

      return newData;
    });
  };

  const handleAddExtraBall = (teamNumber, rowIndex, batsmanIndex, overIndex, event) => {
    // Prevent event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data;

    setTeamData(prevData => {
      const newData = [...prevData];
      const currentOver = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex];
      // Initialize extraBalls array if it doesn't exist
      if (!currentOver.extraBalls) {
        currentOver.extraBalls = [];
      }
      // Only add a new empty slot if there isn't already one
      if (currentOver.extraBalls.length === 0 || currentOver.extraBalls[currentOver.extraBalls.length - 1] !== '') {
        currentOver.extraBalls.push('');
      }
      return newData;
    });
    return
  };

  const handleBowlerNameChange = (teamNumber, rowIndex, overIndex, value) => {
    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data

    setTeamData(prevData => {
      const newData = [...prevData]
      newData[rowIndex].batsmen[0].overs[overIndex].bowlerName = value
      newData[rowIndex].batsmen[1].overs[overIndex].bowlerName = value
      return newData
    })
  }

  const handleBatsmanNameChange = (teamNumber, rowIndex, batsmanIndex, value) => {
    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data

    setTeamData(prevData => {
      const newData = [...prevData]
      newData[rowIndex].batsmen[batsmanIndex].name = value
      return newData
    })
  }


  const renderTable = (teamName, teamNumber, teamData) => {
    return (
      <div className=" box_cric_team_box">
        <div className="box_cric_team_heading">
          <h3 className="m-0">Batting Team: {teamName}</h3>
        </div>
        <div className="table-responsive boc_cric_table">
          <table className="table table-bordered">
            <tbody>
              {teamData.map((pair, rowIndex) => (
                <React.Fragment key={pair.pairId}>
                  {/* First row - Over numbers */}
                  <tr>
                    <td className="border-head" colSpan="2"></td>
                    {Array(numberOfCols).fill().map((_, i) => (
                      <td key={i} className="text-center fw-bold border-head">
                        {pair.pairId * numberOfCols - numberOfCols + i + 1}
                      </td>
                    ))}
                    <td className="fw-bold border-head">Total</td>
                  </tr>
                  {/* Second row - Bowler names */}
                  <tr>
                    <td className="bb-1" colSpan="2"></td>
                    {pair.batsmen[0].overs.map((over, overIndex) => (
                      <td key={overIndex} className="bb-1">
                        <input
                          type="text"
                          className="form-control  box_cric_input_filed_name"
                          placeholder="Bowler name"
                          value={over.bowlerName}
                          onChange={(e) => handleBowlerNameChange(teamNumber, rowIndex, overIndex, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="bb-1"></td>
                  </tr>
                  {/* Batsmen rows */}
                  {pair.batsmen.map((batsman, batsmanIndex) => (
                    <tr key={`${pair.pairId}-${batsmanIndex}`}>
                      {batsmanIndex === 0 && (
                        <td rowSpan="2" className="align-middle text-center" style={{ width: '40px' }}>
                          {pair.pairId}
                        </td>
                      )}
                      <td style={{ width: '150px' }}>
                        <input
                          type="text"
                          className="form-control box_cric_input_filed_name"
                          placeholder="Batsman name"
                          value={batsman.name}
                          onChange={(e) => handleBatsmanNameChange(teamNumber, rowIndex, batsmanIndex, e.target.value)}
                        />
                      </td>
                      {batsman.overs.map((over, overIndex) => (
                        <td key={overIndex} className="p-2">
                          <div className="d-flex justify-content-between gap-1 align-items-start" style={{ minWidth: '160px' }}>
                            {/* 6 balls */}
                            <div className='d-flex justify-content-center gap-1'>
                              {over.balls.map((ball, ballIndex) => (
                                <div key={ballIndex} className="d-flex flex-column align-items-center">
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control box_cric_input_score"
                                      value={ball}
                                      onChange={(e) => handleBallChange(teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, e.target.value)}
                                    />
                                  </div>
                                  {/* Show extra runs input for W and n below */}
                                  {(ball === 'W' || ball === 'n' || ball === 'N' || ball === 'w') && (
                                    <input
                                      type="text"
                                      className="form-control box_cric_input_score mt-1"
                                      value={over.extraRuns[ballIndex] || ''}
                                      onChange={(e) => handleExtraRunsChange(teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, e.target.value)}
                                      placeholder=""
                                    />
                                  )}
                                </div>))}

                              {/* Extra balls section */}                              {over.extraBalls && over.extraBalls.map((extraBall, extraBallIndex) => (
                                <div key={`extra-${extraBallIndex}`} className="d-flex flex-column align-items-center">
                                  <input
                                    type="text"
                                    className="form-control box_cric_input_score"
                                    value={extraBall}
                                    onChange={(e) => handleExtraBallChange(teamNumber, rowIndex, batsmanIndex, overIndex, extraBallIndex, e.target.value)}
                                  />
                                  {/* Show extra runs input for W and N below */}
                                  {(extraBall?.toUpperCase() === 'W' || extraBall?.toUpperCase() === 'N') && (
                                    <input
                                      type="text"
                                      className="form-control box_cric_input_score mt-1"

                                      value={over.extraRuns[extraBallIndex + over.balls.length] || ''}
                                      onChange={(e) => handleExtraRunsChange(teamNumber, rowIndex, batsmanIndex, overIndex, extraBallIndex + over.balls.length, e.target.value)}
                                      placeholder=""
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Score total and Add Extra Ball button side by side */}
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="box_cric_btn  box_cric_btn_sm"
                                onClick={(e) => handleAddExtraBall(teamNumber, rowIndex, batsmanIndex, overIndex, e)}
                              >
                                +
                              </button>
                              <input
                                type="text"
                                className="form-control box_cric_input_score box_cric_input_scoreTT"
                                value={over.overTotal}
                                readOnly
                              />
                            </div>
                          </div>
                        </td>
                      ))}
                      <td className="align-middle text-center">
                        {calculateBatsmanTotal(batsman.overs)}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="border-bottom border-dark">
                    <td colSpan="2" className="text-end pe-3">
                      {(pair.pairId - 1) * numberOfCols + 1}/{pair.pairId * numberOfCols}
                    </td>
                    {pair.totals.map((total, idx) => (
                      <td key={idx} className="text-center">{total}</td>
                    ))}
                    <td className="text-center">
                      {calculateBatsmanTotal(pair.batsmen[0].overs) + calculateBatsmanTotal(pair.batsmen[1].overs)}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className=" container-fluid p-0" style={{ height: "100vh" }}>
      <div id='finalScore' className="bc_finalScore">
        <FinalScore />

        <div className="d-flex justify-content-end my-4">
          {/* <div><button
            className="box_cric_btn"
            onClick={() => window.open('/finalscore', '_blank')}
          >
            Open Final Score in New Tab
          </button></div> */}

          <div className="d-flex justify-content-end my-4 gap-2">
            <button
              className="box_cric_btn"
              onClick={() => window.open('/finalscore', '_blank')}
            >
              Open Final Score in New Tab
            </button>
            <PDFDownloadLink
              document={
                <FullMatchPDF
                  matchInfo={matchInfo}
                  team1Data={team1Data}
                  team2Data={team2Data}
                />
              }
              fileName="FullMatchScorecard.pdf"
              className="box_cric_btn"
            >
              {({ loading }) => (loading ? 'Preparing PDF...' : 'Download Full Match PDF')}
            </PDFDownloadLink>
          </div>

        </div>
      </div>




      <div id='scoreTable' className='bc_score_table' >
        {renderTable(matchInfo.team1, 1, team1Data)}


        {renderTable(matchInfo.team2, 2, team2Data)}
      </div>
    </div>
  )
}

export default ScoreTable

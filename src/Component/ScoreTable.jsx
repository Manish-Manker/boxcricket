import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import FinalScore from './FinalScore'

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
    return (
      ['W', 'n', 'R', 'C', 'B', 'S', 'H'].includes(value) ||
      (parseInt(value) >= 0 && parseInt(value) <= 7)
    );
  };

  const isValidExtraRun = (value) => {
    if (!value) return true;
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 7;
  };
  // Calculate total for one over (6 balls + extra balls)
  const calculateOverTotal = (balls, extraRuns, extraBalls = []) => {
    const mainBallsTotal = balls.reduce((sum, ball, index) => {
      if (!ball) return sum;
      const value = ball;  // Don't convert to uppercase to differentiate N and n
      const extraRun = parseInt(extraRuns[index] || 0);

      // Handle special ball types
      if (value === 'W') return sum + extraRun;  // Wide ball: only extra runs
      if (value === 'n') return sum + 2 + extraRun;  // n: base 2 runs + extra runs
      if (['R', 'C', 'B', 'S', 'H'].includes(value.toUpperCase())) return sum - 5;  // Wickets: -5 runs

      // Handle numeric values
      const numValue = parseInt(value);
      return sum + (numValue >= 0 && numValue <= 7 ? numValue : 0);
    }, 0);

    // Calculate total from extra balls (for 'N' balls)
    const extraBallsTotal = extraBalls.reduce((sum, ball) => {
      if (!ball) return sum;

      // Handle wickets in extra balls
      if (['R', 'C', 'B', 'S', 'H'].includes(ball.toUpperCase())) {
        return sum - 5;
      }

      // Handle numeric values in extra balls
      const numValue = parseInt(ball);
      return sum + (numValue >= 0 && numValue <= 7 ? numValue : 0);
    }, 0);

    return mainBallsTotal + extraBallsTotal;
  };

  // Count wickets (R/C/B) in an over
  const countWickets = (balls) => {
    return balls.reduce((count, ball) => {
      if (!ball) return count;
      return ['R', 'C', 'B', 'S', 'H'].includes(ball.toUpperCase()) ? count + 1 : count;
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
      const overTotal = calculateOverTotal(overBalls, overExtraRuns);
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
      const overTotal = calculateOverTotal(overBalls, overExtraRuns);

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

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data;

    setTeamData(prevData => {
      const newData = [...prevData];
      // Update the extra ball value
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraBalls[ballIndex] = value;

      // If value is a wicket type, add 0 extra runs
      if (['R', 'C', 'B', 'S', 'H'].includes(value)) {
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
                          <div className="d-flex justify-content-between gap-1" style={{ minWidth: '160px' }}>
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
                                  {(ball === 'W' || ball === 'n') && (
                                    <input
                                      type="text"
                                      className="form-control form-control-sm mt-1"
                                      style={{
                                        width: '28px',
                                        height: '28px',
                                        padding: '2px',
                                        textAlign: 'center',
                                        border: '1px solid #dee2e6'
                                      }}
                                      value={over.extraRuns[ballIndex] || ''}
                                      onChange={(e) => handleExtraRunsChange(teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, e.target.value)}
                                      placeholder=""
                                    />
                                  )}
                                </div>                              ))}

                              {/* Extra balls section */}
                              {over.extraBalls && over.extraBalls.map((extraBall, extraBallIndex) => (
                                <input
                                  key={`extra-${extraBallIndex}`}
                                  type="text"
                                  className="form-control box_cric_input_score"
                                  value={extraBall}
                                  onChange={(e) => handleExtraBallChange(teamNumber, rowIndex, batsmanIndex, overIndex, extraBallIndex, e.target.value)}
                                />
                              ))}
                            </div>

                            {/* Score total and Add Extra Ball button side by side */}
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm box_cric_btn"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  padding: '0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}                                onClick={(e) => handleAddExtraBall(teamNumber, rowIndex, batsmanIndex, overIndex, e)}
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
          <div><button
            className="box_cric_btn"
            onClick={() => window.open('/finalscore', '_blank')}
          >
            Open Final Score in New Tab
          </button></div>
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

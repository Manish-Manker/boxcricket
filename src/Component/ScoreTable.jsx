import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const ScoreTable = () => {
  const [matchInfo, setMatchInfo] = useState(null)
  const [team1Data, setTeam1Data] = useState(null)
  const [team2Data, setTeam2Data] = useState(null)
  const [loading, setLoading] = useState(true)

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
            overTotal: '0'
          }))
        },
        {
          name: '',
          overs: Array(oversPerSkin).fill().map((_, overIndex) => ({
            bowlerNum: (rowIndex * oversPerSkin + overIndex + 1),
            bowlerName: '',
            balls: Array(6).fill(''),
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
    return <div className="container mt-5">Loading...</div>
  }

  // const numberOfRows = Math.ceil(parseInt(matchInfo.totalOvers) / parseInt(matchInfo.oversPerSkin))
  const numberOfCols = parseInt(matchInfo.oversPerSkin)

  // Calculate score for a single ball including special characters
  // const calculateBallValue = (ball) => {
  //   if (!ball) return 0
    
  //   // Handle special characters
  //   switch(ball.toUpperCase()) {
  //     case 'W': return 2
  //     case 'R':
  //     case 'C':
  //     case 'B': return -5
  //     default:
  //       // Handle numeric values
  //       const numValue = parseInt(ball)
  //       return numValue >= 0 && numValue <= 6 ? numValue : 0
  //   }
  // }

  // Calculate total for one over (6 balls)
  const calculateOverTotal = (balls) => {
    return balls.reduce((sum, ball) => {
      if (!ball) return sum;
      const value = ball.toUpperCase();
      if (value === 'W') return sum + 2;
      if (['R', 'C', 'B'].includes(value)) return sum - 5;
      const numValue = parseInt(value);
      return sum + (numValue >= 0 && numValue <= 6 ? numValue : 0);
    }, 0);
  }

  // Count wickets (R/C/B) in an over
  const countWickets = (balls) => {
    return balls.reduce((count, ball) => {
      if (!ball) return count;
      return ['R', 'C', 'B'].includes(ball.toUpperCase()) ? count + 1 : count;
    }, 0);
  }

  // Calculate total for one batsman (all overs)
  const calculateBatsmanTotal = (overs) => {
    return overs.reduce((sum, over) => {
      return sum + calculateOverTotal(over.balls)
    }, 0)
  }

  // Calculate total for a pair (both batsmen)
  const calculatePairTotal = (pair) => {
    return pair.batsmen.reduce((sum, batsman) => {
      return sum + calculateBatsmanTotal(batsman.overs);
    }, 0);
  };

  const isValidInput = (value) => {
    if (!value) return true;
    const upperValue = value.toUpperCase();
    return (
      ['W', 'R', 'C', 'B'].includes(upperValue) ||
      (parseInt(value) >= 0 && parseInt(value) <= 6)
    );
  };

  const handleBallChange = (teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, value) => {
    // Only allow valid inputs
    if (!isValidInput(value)) {
      return;
    }

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data;
    
    setTeamData(prevData => {
      const newData = [...prevData];
      // Update the ball value
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls[ballIndex] = value;
      
      // Calculate new over total and wickets
      const overBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls;
      const overTotal = calculateOverTotal(overBalls);
      const wickets = countWickets(overBalls);
      
      // Update over stats
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].overTotal = overTotal.toString();
      
      // Update pair totals for this over
      const pairOverTotal = calculateOverTotal(newData[rowIndex].batsmen[0].overs[overIndex].balls) +
                           calculateOverTotal(newData[rowIndex].batsmen[1].overs[overIndex].balls);
      const pairOverWickets = countWickets(newData[rowIndex].batsmen[0].overs[overIndex].balls) +
                             countWickets(newData[rowIndex].batsmen[1].overs[overIndex].balls);
      newData[rowIndex].totals[overIndex] = `${pairOverWickets}/${pairOverTotal}`;
      
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

  const renderBowlerStats = (over) => {
    const total = over.total || 0;
    const wickets = over.wickets || 0;
    return `${wickets}/${total}`;
  };

  // const renderOverRow = (pair, pairIndex) => {
  //   return (
  //     <tr key={pairIndex}>
  //       <td>{pairIndex + 1}</td>
  //       {pair.batsmen.map((batsman, batsmanIndex) => (
  //         <React.Fragment key={batsmanIndex}>
  //           <td>{batsman.name || `Batsman ${batsmanIndex + 1}`}</td>
  //           {batsman.overs.map((over, overIndex) => (
  //             <React.Fragment key={overIndex}>
  //               {over.balls.map((ball, ballIndex) => (
  //                 <td key={ballIndex}>
  //                   <input
  //                     type="text"
  //                     value={ball || ''}
  //                     maxLength={1}
  //                     onChange={(e) => handleBallChange(e, pairIndex, batsmanIndex, overIndex, ballIndex)}
  //                     className="ball-input"
  //                   />
  //                 </td>
  //               ))}
  //               <td className="over-total">{renderBowlerStats(over)}</td>
  //             </React.Fragment>
  //           ))}
  //         </React.Fragment>
  //       ))}
  //       <td className="pair-total">{calculatePairTotal(pair)}</td>
  //     </tr>
  //   );
  // };

  const renderTable = (teamName, teamNumber, teamData) => {
    return (
      <div className="mb-5">
        <div className="border p-2 mb-3">
          <h3 className="m-0">Batting Team: {teamName}</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <tbody>
              {teamData.map((pair, rowIndex) => (
                <React.Fragment key={pair.pairId}>
                  {/* First row - Over numbers */}
                  <tr>
                    <td colSpan="2"></td>
                    {Array(numberOfCols).fill().map((_, i) => (
                      <td key={i} className="text-center fw-bold">
                        {pair.pairId * numberOfCols - numberOfCols + i + 1}
                      </td>
                    ))}
                    <td>Total</td>
                  </tr>
                  {/* Second row - Bowler names */}
                  <tr>
                    <td colSpan="2"></td>
                    {pair.batsmen[0].overs.map((over, overIndex) => (
                      <td key={overIndex}>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          placeholder="Bowler name"
                          value={over.bowlerName}
                          onChange={(e) => handleBowlerNameChange(teamNumber, rowIndex, overIndex, e.target.value)}
                        />
                      </td>
                    ))}
                    <td></td>
                  </tr>
                  {/* Batsmen rows */}
                  {pair.batsmen.map((batsman, batsmanIndex) => (
                    <tr key={`${pair.pairId}-${batsmanIndex}`}>
                      {batsmanIndex === 0 && (
                        <td rowSpan="2" className="align-middle text-center" style={{width: '40px'}}>
                          {pair.pairId}
                        </td>
                      )}
                      <td style={{width: '150px'}}>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          placeholder="Batsman name"
                          value={batsman.name}
                          onChange={(e) => handleBatsmanNameChange(teamNumber, rowIndex, batsmanIndex, e.target.value)}
                        />
                      </td>
                      {batsman.overs.map((over, overIndex) => (
                        <td key={overIndex} className="p-2">
                          <div className="d-flex justify-content-center align-items-center gap-1" style={{minWidth: '160px'}}>
                            {/* 6 balls */}
                            {over.balls.map((ball, ballIndex) => (
                              <input
                                key={ballIndex}
                                type="text"
                                className="form-control form-control-sm"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  padding: '2px',
                                  textAlign: 'center',
                                  border: '1px solid #dee2e6'
                                }}
                                value={ball}
                                onChange={(e) => handleBallChange(teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, e.target.value)}
                              />
                            ))}
                            {/* 7th box for over total */}
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              style={{
                                width: '28px',
                                height: '28px',
                                padding: '2px',
                                textAlign: 'center',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dee2e6'
                              }}
                              value={over.overTotal}
                              readOnly
                            />
                          </div>
                          {/* Over total below 7th box */}
                          {batsmanIndex === 1 && (
                            <div className="d-flex justify-content-end" style={{marginTop: '4px', paddingRight: '4px'}}>
                              <div style={{width: '28px', textAlign: 'center'}}>
                                <small>{pair.totals[overIndex]}</small>
                              </div>
                            </div>
                          )}
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
    <div className="container-fluid mt-3">
      {renderTable(matchInfo.team1, 1, team1Data)}
      {renderTable(matchInfo.team2, 2, team2Data)}
    </div>
  )
}

export default ScoreTable

import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const ScoreTable = () => {
  const [matchInfo, setMatchInfo] = useState(null)
  const [scoreData, setScoreData] = useState(null)
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
    if (matchInfo && !scoreData) {
      const numberOfRows = Math.ceil(parseInt(matchInfo.totalOvers) / parseInt(matchInfo.oversPerSkin))
      const numberOfCols = parseInt(matchInfo.oversPerSkin)
      setScoreData(createRows(numberOfRows, numberOfCols))
    }
  }, [matchInfo, scoreData])

  if (loading || !matchInfo) {
    return <div className="container mt-5">Loading...</div>
  }

  const numberOfRows = Math.ceil(parseInt(matchInfo.totalOvers) / parseInt(matchInfo.oversPerSkin))
  const numberOfCols = parseInt(matchInfo.oversPerSkin)

  // Calculate total for one over (6 balls)
  const calculateOverTotal = (balls) => {
    return balls.reduce((sum, ball) => {
      const value = parseInt(ball) || 0
      return sum + value
    }, 0)
  }

  // Calculate total for one batsman (all overs)
  const calculateBatsmanTotal = (overs) => {
    return overs.reduce((sum, over) => {
      return sum + calculateOverTotal(over.balls)
    }, 0)
  }

  const handleBallChange = (rowIndex, batsmanIndex, overIndex, ballIndex, value) => {
    setScoreData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const over = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex]
      
      // Update ball value
      over.balls[ballIndex] = value

      // Recalculate over total
      over.overTotal = calculateOverTotal(over.balls).toString()

      // Update row totals
      const pair = newData[rowIndex]
      pair.totals[overIndex] = `${calculateOverTotal(pair.batsmen[0].overs[overIndex].balls)}/${calculateOverTotal(pair.batsmen[1].overs[overIndex].balls)}`

      return newData
    })
  }

  const renderTable = (teamName) => {
    if (!scoreData) return null

    return (
      <div className="mb-5">
        <div className="border p-2 mb-3">
          <h3 className="m-0">Batting Team: {teamName}</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <tbody>
              {scoreData.map((pair, rowIndex) => (
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
                          onChange={(e) => {
                            const newData = [...scoreData]
                            newData[rowIndex].batsmen[0].overs[overIndex].bowlerName = e.target.value
                            newData[rowIndex].batsmen[1].overs[overIndex].bowlerName = e.target.value
                            setScoreData(newData)
                          }}
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
                          onChange={(e) => {
                            const newData = [...scoreData]
                            newData[rowIndex].batsmen[batsmanIndex].name = e.target.value
                            setScoreData(newData)
                          }}
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
                                onChange={(e) => handleBallChange(rowIndex, batsmanIndex, overIndex, ballIndex, e.target.value)}
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
      {renderTable(matchInfo.team1)}
      {renderTable(matchInfo.team2)}
    </div>
  )
}

export default ScoreTable

import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const ScoreTable = () => {
  const [matchInfo, setMatchInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('matchInfo'))
    setMatchInfo(data)
    setLoading(false)
  }, [])

  if (loading || !matchInfo) {
    return <div className="container mt-5">Loading...</div>
  }

  const numberOfRows = Math.ceil(parseInt(matchInfo.totalOvers) / parseInt(matchInfo.oversPerSkin))
  const numberOfCols = parseInt(matchInfo.oversPerSkin)

  const createRows = (rowCount) => {
    return Array(rowCount).fill().map((_, rowIndex) => ({
      pairId: rowIndex + 1,
      batsmen: [
        {
          name: '',
          overs: Array(numberOfCols).fill().map((_, overIndex) => ({
            bowlerNum: (rowIndex * numberOfCols + overIndex + 1),
            bowlerName: '',
            balls: Array(6).fill(''),
            overTotal: '0'
          }))
        },
        {
          name: '',
          overs: Array(numberOfCols).fill().map((_, overIndex) => ({
            bowlerNum: (rowIndex * numberOfCols + overIndex + 1),
            bowlerName: '',
            balls: Array(6).fill(''),
            overTotal: '0'
          }))
        }
      ],
      totals: Array(numberOfCols).fill('0/0')
    }))
  }

  const renderTable = (teamName) => {
    const rows = createRows(numberOfRows)

    return (
      <div className="mb-5">
        <div className="border p-2 mb-3">
          <h3 className="m-0">Batting Team: {teamName}</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <tbody>
              {rows.map((pair) => (
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
                    {Array(numberOfCols).fill().map((_, i) => (
                      <td key={i}>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          placeholder="Bowler name"
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
                        />
                      </td>
                      {batsman.overs.map((over, overIndex) => (
                        <td key={overIndex} className="p-2">
                          <div className="d-flex justify-content-center align-items-center gap-1" style={{minWidth: '160px'}}>
                            {/* 6 balls */}
                            {over.balls.map((_, ballIndex) => (
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
                                <small>{over.overTotal}</small>
                              </div>
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="align-middle text-center">0</td>
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
                    <td className="text-center">0</td>
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

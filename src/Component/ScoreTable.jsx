import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const ScoreTable = () => {
  const [matchInfo, setMatchInfo] = useState(null)
  const [scoreData, setScoreData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('matchInfo'))
    setMatchInfo(data)
    setLoading(false)
  }, [])

  if (loading || !matchInfo) {
    return <div className="container mt-5">Loading...</div>
  }

  // Calculate number of rows based on total overs
  const numberOfPairs = Math.ceil(parseInt(matchInfo.totalOvers) / 6)

  const createRows = (count) => {
    return Array(count).fill().map((_, index) => ({
      pairId: index + 1,
      batsmen: [
        {
          name: '',
          overs: Array(6).fill().map((_, overIndex) => ({
            bowlerNum: (index * 6 + overIndex + 1),
            bowlerName: '',
            balls: Array(6).fill(''),
            overTotal: '0/0' // runs/wickets for this over
          }))
        },
        {
          name: '',
          overs: Array(6).fill().map((_, overIndex) => ({
            bowlerNum: (index * 6 + overIndex + 1),
            bowlerName: '',
            balls: Array(6).fill(''),
            overTotal: '0/0'
          }))
        }
      ],
      totals: Array(6).fill('0/0') // Combined totals for each over
    }))
  }

  const renderTable = (teamName) => {
    const rows = createRows(numberOfPairs)

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
                  {/* First row - Bowler numbers */}
                  <tr>
                    <td colSpan="2"></td>
                    {pair.batsmen[0].overs.map((over, idx) => (
                      <td key={idx} className="text-center fw-bold">
                        {over.bowlerNum}
                      </td>
                    ))}
                    <td>Total</td>
                  </tr>
                  {/* Second row - Bowler names */}
                  <tr>
                    <td colSpan="2"></td>
                    {pair.batsmen[0].overs.map((over, idx) => (
                      <td key={idx}>
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
                        <td key={overIndex} className="p-0 position-relative">
                          <div className="d-flex flex-wrap" style={{minWidth: '120px'}}>
                            {over.balls.map((_, ballIndex) => (
                              <input
                                key={ballIndex}
                                type="text"
                                className="form-control form-control-sm border-0"
                                style={{width: '20px'}}
                              />
                            ))}
                          </div>
                          {batsmanIndex === 1 && (
                            <div className="border-top text-center">
                              {over.overTotal}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="align-middle text-center">
                        {/* Individual batsman total */}
                        0
                      </td>
                    </tr>
                  ))}
                  {/* Total row after each pair */}
                  <tr className="border-bottom border-dark">
                    <td colSpan="2" className="text-end pe-3">Total</td>
                    {pair.totals.map((total, idx) => (
                      <td key={idx} className="text-center">{total}</td>
                    ))}
                    <td className="text-center">
                      {/* Grand total for this pair */}
                      0
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

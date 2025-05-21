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
    if (!ball) return ''
    const value = ball.toUpperCase()
    
    switch(value) {
      case 'W': return 'Wide ball (+2 runs)'
      case 'R': return 'Run Out (-5 runs)'
      case 'C': return 'Catch Out (-5 runs)'
      case 'B': return 'Bowled (-5 runs)'
      default:
        const runs = parseInt(value)
        if (runs >= 0 && runs <= 6) {
          return `${runs} ${runs === 1 ? 'Run' : 'Runs'}`
        }
        return ''
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
        batsman.overs.forEach(over => {
          // Get the actual over number (1-based)
          const overNumber = parseInt(over.bowlerNum)
          // Check if this over belongs to the current skin
          if (overNumber > startOver && overNumber <= endOver) {
            skinTotal += over.balls.reduce((sum, ball) => {
              if (!ball) return sum
              const value = ball.toUpperCase()
              if (value === 'W') return sum + 2
              if (['R', 'C', 'B'].includes(value)) return sum - 5
              const numValue = parseInt(value)
              return sum + (numValue >= 0 && numValue <= 6 ? numValue : 0)
            }, 0)
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
    <div className="d-flex h-100">
      {/* Final Score Table - 60% width */}
      <div style={{ width: '60%', borderRight: '1px solid #dee2e6', padding: '10px' }}>
        <h4 className="mb-3">Final Score</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead>
              <tr>
                <th></th>
                <th colSpan={skinColumns.length} className="text-center">Skins</th>
                <th>TOTAL</th>
              </tr>
              <tr>
                <th></th>
                {skinColumns.map(num => (
                  <th key={num} className="text-center">{num}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold">{matchInfo.team1}</td>
                {skinColumns.map((_, index) => (
                  <td key={index} className="text-center">
                    {calculateSkinScore(team1Data, index, parseInt(matchInfo.oversPerSkin))}
                  </td>
                ))}
                <td className="fw-bold">
                  {calculateTeamTotal(team1Data).total} 
                  ({calculateTeamTotal(team1Data).skins} skins)
                </td>
              </tr>
              <tr>
                <td className="fw-bold">{matchInfo.team2}</td>
                {skinColumns.map((_, index) => (
                  <td key={index} className="text-center">
                    {calculateSkinScore(team2Data, index, parseInt(matchInfo.oversPerSkin))}
                  </td>
                ))}
                <td className="fw-bold">
                  {calculateTeamTotal(team2Data).total} 
                  ({calculateTeamTotal(team2Data).skins} skins)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Current Ball Info - 40% width */}
      <div style={{ width: '40%', padding: '10px' }}>
        <h4 className="mb-3">Last Ball Status</h4>
        <div className="p-3 bg-light rounded">
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
  )
}

export default FinalScore
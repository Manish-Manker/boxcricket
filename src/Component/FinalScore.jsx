import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const FinalScore = () => {
  const [matchInfo, setMatchInfo] = useState(null)
  const [team1Data, setTeam1Data] = useState(null)
  const [team2Data, setTeam2Data] = useState(null)

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      const matchData = JSON.parse(localStorage.getItem('matchInfo'))
      const team1ScoreData = JSON.parse(localStorage.getItem('team1ScoreData'))
      const team2ScoreData = JSON.parse(localStorage.getItem('team2ScoreData'))
      
      setMatchInfo(matchData)
      setTeam1Data(team1ScoreData)
      setTeam2Data(team2ScoreData)
    }

    loadData() // Load initial data

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'team1ScoreData' || e.key === 'team2ScoreData' || e.key === 'matchInfo') {
        loadData() // Reload all data when any team's data changes
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also set up an interval to check for changes
    const interval = setInterval(loadData, 1000)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const calculateSkinScore = (teamData, skinIndex, oversPerSkin) => {
    if (!teamData) return 0
    
    const startOver = skinIndex * oversPerSkin
    const endOver = startOver + oversPerSkin
    let skinTotal = 0

    teamData.forEach(pair => {
      pair.batsmen.forEach(batsman => {
        batsman.overs.forEach((over, overIndex) => {
          const overNumber = parseInt(over.bowlerNum)
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

  const skinColumns = Array(parseInt(matchInfo.oversPerSkin)).fill(0)
    .map((_, index) => index + 1)

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Final Score</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
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
                {calculateTeamTotal(team1Data).total} ({calculateTeamTotal(team1Data).skins} skins)
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
                {calculateTeamTotal(team2Data).total} ({calculateTeamTotal(team2Data).skins} skins)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FinalScore
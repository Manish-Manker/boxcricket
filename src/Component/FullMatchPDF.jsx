import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


// Helper to render the Final Score Table (Skins Table)
const FinalScoreTable = ({ matchInfo, team1Data, team2Data }) => {
  // ...copy and adapt calculateSkinScore and calculateTeamTotal from FinalScore.jsx...
  const calculateSkinScore = (teamData, skinIndex, oversPerSkin) => {
    if (!teamData) return 0;
    const startOver = skinIndex * parseInt(oversPerSkin);
    const endOver = Math.min(startOver + parseInt(oversPerSkin), parseInt(matchInfo.totalOvers));
    let skinTotal = 0;
    teamData.forEach(pair => {
      pair.batsmen.forEach(batsman => {
        batsman.overs.forEach((over) => {
          const overNumber = parseInt(over.bowlerNum);
          if (overNumber > startOver && overNumber <= endOver) {
            // Main balls
            over.balls.forEach((ball, index) => {
              if (!ball) return;
              const value = ball;
              const extraRun = parseInt(over.extraRuns[index] || 0);
              const upperValue = value.toUpperCase();
              if (upperValue === 'W') {
                skinTotal += 2 + extraRun;
              } else if (upperValue === 'N') {
                skinTotal += 2 + extraRun;
              } else if (["R", "C", "B", "S", "H"].includes(upperValue)) {
                skinTotal -= 5;
              } else {
                const numValue = parseInt(value);
                if (!isNaN(numValue) && numValue >= 0) {
                  skinTotal += numValue;
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
                } else if (["R", "C", "B", "S", "H"].includes(upperValue)) {
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
        });
      });
    });
    return skinTotal;
  };
  const calculateTeamTotal = (teamData) => {
    if (!teamData) return { total: 0, skins: 0 };
    const numberOfSkins = Math.ceil(parseInt(matchInfo.totalOvers) / parseInt(matchInfo.oversPerSkin));
    const skinScores = Array(numberOfSkins).fill(0)
      .map((_, index) => calculateSkinScore(teamData, index, parseInt(matchInfo.oversPerSkin)));
    const total = skinScores.reduce((sum, score) => sum + score, 0);
    const skins = skinScores.length > 0 ?
      skinScores.filter((score, index) =>
        score > calculateSkinScore(teamData === team1Data ? team2Data : team1Data, index, parseInt(matchInfo.oversPerSkin))
      ).length : 0;
    return { total, skins, skinScores };
  };
  const numberOfSkins = Math.ceil(parseInt(matchInfo.totalOvers) / parseInt(matchInfo.oversPerSkin));
  const team1 = calculateTeamTotal(team1Data);
  const team2 = calculateTeamTotal(team2Data);
  return (
    <View style={{ marginBottom: 20 }}>

       <View style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 8 }}>
      <Image src='./images/cricket_legends.jpg' style={{ width: 100, height: 100 }} />
      </View>
      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>Final Score</Text>
      <View style={{ display: 'table', width: '100%', borderStyle: 'solid', borderWidth: '0.5', borderColor: '#e9ebfa', borderRightWidth: '10px' }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#f1f4fb' }}>
          <Text style={{ flex: 1, padding: 4, fontSize: 5 }}></Text>
          {Array(numberOfSkins).fill(0).map((_, i) => (
            <Text key={i} style={{ flex: 1, textAlign: 'center', padding: 2, fontSize: 6, fontWeight: 'bold', }}>Skin {i + 1}</Text>
          ))}
          <Text style={{ flex: 1, padding: 2, fontSize: 6, fontWeight: 'bold', }}>TOTAL</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1, padding: 4, fontSize: 5, fontWeight: 'bold', }}>{matchInfo.team1}</Text>
          {team1.skinScores.map((score, i) => (
            <Text key={i} style={{ flex: 1, fontSize: 5, textAlign: 'center', padding: 4 }}>{score}</Text>
          ))}
          <Text style={{ flex: 1, padding: 4, fontSize: 5 }}>{team1.total} ({team1.skins} skins)</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1, padding: 4, fontSize: 5, fontWeight: 'bold', }}>{matchInfo.team2}</Text>
          {team2.skinScores.map((score, i) => (
            <Text key={i} style={{ flex: 1, fontSize: 5, textAlign: 'center', padding: 4 }}>{score}</Text>
          ))}
          <Text style={{ flex: 1, padding: 4, fontSize: 5 }}>{team2.total} ({team2.skins} skins)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e9ebfa',
    fontSize: 6, // Small font for compactness
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: '#e9ebfa',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e9ebfa',
    padding: 1,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
  },
  batsmanCell: {
    flex: 2,
    textAlign: 'left',
    paddingLeft: 2,
  },
});

// Helper to render the detailed score table for a team (like ScoreTable)
const TeamScoreTable = ({ teamName, teamData, oversPerSkin }) => {
  const maxPairs = teamData?.length || 2;
  const oversPerPair = teamData?.[0]?.batsmen?.[0]?.overs?.length || 2;
  const ballsPerOver = 6;

  // Helper to render a single ball cell (main or extra)
  const renderBallCell = (ball, extraRun, key) => {
    const upperValue = (ball || '').toUpperCase();
    let showExtra = false;
    if (upperValue === 'W' || upperValue === 'N') showExtra = true;
    return (
      <View key={key} style={{ borderWidth: 0.5, borderColor: '#cbcbcb', minWidth: 10, minHeight: 10, alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0 }}>
        <Text style={{ fontSize: 6 }}>{ball}</Text>
        {showExtra && !!extraRun && (
          <Text style={{ fontSize: 5, color: '#555' }}>+{extraRun}</Text>
        )}
      </View>
    );
  };

  // Helper to render a row of bowler names for a pair
  const renderBowlerNamesRow = (pair) => (
    <View style={{ flexDirection: 'row' }}>
      <Text style={[styles.tableCell, { flex: 0.3, borderTopWidth: 0 }]}></Text>
      <Text style={[styles.tableCell, { flex: 0.8, borderTopWidth: 0 }]}></Text>
      {pair?.batsmen?.[0]?.overs.map((over, overIdx) => (
        <View key={overIdx} style={{ flex: 1, borderWidth: 0.5, borderColor: '#e9ebfa', alignItems: 'center', justifyContent: 'center', minHeight: 10 }}>
          <Text style={{ fontSize: 5 }}>{over.bowlerName || ''}</Text>
        </View>
      ))}
      <Text style={[styles.tableCell, { borderTopWidth: 0 }]}></Text>
    </View>
  );

  // Helper to render a pair (with both batsmen, overs, and totals)
  const renderPair = (pair, pairIdx) => {
    return (
      <React.Fragment key={pairIdx}>
        {/* Over numbers header - make more compact */}
        <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', minHeight: 12, borderColor: "#e9ebfa", overflow: "hidden" }}>
          <Text style={[styles.tableCell, { flex: 0.3, backgroundColor: '#f1f4fb', padding: 3 }]}></Text>
          <Text style={[styles.tableCell, { flex: 0.7, backgroundColor: '#f1f4fb' }]}></Text>
          {pair.batsmen[0].overs.map((_, overIdx) => (
            <Text key={overIdx} style={[styles.tableCell, { fontWeight: 'bold', fontSize: 5, backgroundColor: '#f1f4fb', padding: 3 }]}>
              {pair.pairId * oversPerPair - oversPerPair + overIdx + 1}
            </Text>
          ))}
          <Text style={[styles.tableCell, { fontWeight: 'bold', fontSize: 5, backgroundColor: '#f1f4fb', padding: 3 }]}>Total</Text>
        </View>

        {/* Bowler names row - more compact */}
        <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
          <Text style={[styles.tableCell, { flex: 0.3, borderTopWidth: 0 }]}></Text>
          <Text style={[styles.tableCell, { flex: 0.7, borderTopWidth: 0 }]}></Text>
          {pair?.batsmen?.[0]?.overs.map((over, overIdx) => (
            <View key={overIdx} style={[styles.tableCell, { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 10, backgroundColor: '#fff' }]}>
              <Text style={{ fontSize: 5 }}>{over.bowlerName || ''}</Text>
            </View>
          ))}
          <Text style={[styles.tableCell, { flex: 0.3, borderTopWidth: 0, backgroundColor: '#fff' }]}></Text>
        </View>

        {/* Batsmen rows with balls and totals */}
        <View style={{ flexDirection: 'row', alignItems: 'stretch', minHeight: 24, backgroundColor: '#fff' }}>
          {/* Pair number and batsman names */}
          <View style={{ flexDirection: 'column', flex: 1, borderWidth: '0' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={[styles.tableCell, { flex: 0.3, borderBottomWidth: 0 }]}>{pair.pairId}</Text>
              <Text style={[styles.tableCell, { flex: 0.7, textAlign: 'left', fontSize: 5 }]}>{pair.batsmen[0].name}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={[styles.tableCell, { flex: 0.3, borderTopWidth: 0 }]}></Text>
              <Text style={[styles.tableCell, { flex: 0.7, textAlign: 'left', fontSize: 5 }]}>{pair.batsmen[1].name}</Text>
            </View>
          </View>

          {/* Overs with balls and totals */}
          {pair.batsmen[0].overs.map((over, overIdx) => (
            <View key={overIdx} style={{ flex: 1, borderRightWidth: '0.2', borderColor: '#e9ebfa' }}>
              {/* First batsman's balls and total */}
              <View style={{ flexDirection: 'row', borderWidth: '0', borderColor: '#e9ebfa', padding: 4 }}>
                <View style={{ flex: 0.8, flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                  {over.balls.map((ball, ballIdx) => renderBallCell(ball, over.extraRuns[ballIdx], `main-${overIdx}-${ballIdx}`))}
                  {over.extraBalls?.map((ball, extraIdx) => renderBallCell(ball, over.extraRuns[over.balls.length + extraIdx], `extra-${overIdx}-${extraIdx}`))}
                </View>
                <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 5 }}>{over.overTotal || '0'}</Text>
                </View>
              </View>

              {/* Second batsman's balls and total */}
              <View style={{ flexDirection: 'row', padding: 4 }}>
                <View style={{ flex: 0.8, flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                  {pair.batsmen[1].overs[overIdx]?.balls.map((ball, ballIdx) =>
                    renderBallCell(ball, pair.batsmen[1].overs[overIdx].extraRuns[ballIdx], `main-b1-${overIdx}-${ballIdx}`))}
                  {pair.batsmen[1].overs[overIdx]?.extraBalls?.map((ball, extraIdx) =>
                    renderBallCell(ball, pair.batsmen[1].overs[overIdx].extraRuns[pair.batsmen[1].overs[overIdx].balls.length + extraIdx], `extra-b1-${overIdx}-${extraIdx}`))}
                </View>
                <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 5 }}>{pair.batsmen[1].overs[overIdx]?.overTotal || '0'}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Individual and pair totals */}          <View style={{ flex: 0.3, borderLeftWidth: 0, borderColor: '#e9ebfa' }}>
            <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: '#e9ebfa', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 5, padding: 3 }}>
                {pair.batsmen[0].overs.reduce((sum, o) => sum + (parseInt(o.overTotal) || 0), 0)}
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 5, padding: 3 }}>
                {pair.batsmen[1].overs.reduce((sum, o) => sum + (parseInt(o.overTotal) || 0), 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Pair totals row */}
        <View style={{ flexDirection: 'row', backgroundColor: '#f5f5f5', minHeight: 12 }}>
          <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontSize: 5, padding: 3 }]}>
            {(pair.pairId - 1) * oversPerPair + 1}/{pair.pairId * oversPerPair}
          </Text>
          {pair?.totals?.map((total, idx) => (
            <Text key={idx} style={[styles.tableCell, { flex: 1, fontSize: 5, padding: 3 }]}>{total}</Text>
          ))}
          <Text style={[styles.tableCell, { flex: 0.3, fontWeight: 'bold', fontSize: 5, padding: 3 }]}>
            {pair.batsmen.reduce((sum, b) => sum + b.overs.reduce((s, o) => s + (parseInt(o.overTotal) || 0), 0), 0)}
          </Text>
        </View>
      </React.Fragment>
    );
  };

  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ fontSize: 7, fontWeight: 'bold', marginBottom: 2 }}>Batting Team: {teamName}</Text>
      <View style={[styles.table, { fontSize: 5 }]}>
        {teamData.map((pair, pairIdx) => renderPair(pair, pairIdx))}
      </View>
    </View>
  );
};

// Helper to calculate player statistics
const calculatePlayerStats = (teamData, opposingTeamData) => {
  const playerStats = new Map();
  const teamPlayerNames = new Set();

  // First, collect all player names from this team
  teamData.forEach(pair => {
    pair.batsmen.forEach(batsman => {
      if (batsman.name) teamPlayerNames.add(batsman.name);
    });
  });

  // Process batting stats (RS) - only for team players
  teamData.forEach(pair => {
    pair.batsmen.forEach(batsman => {
      if (!playerStats.has(batsman.name)) {
        playerStats.set(batsman.name, {
          name: batsman.name,
          RS: 0,    // Runs scored
          OB: 0,    // Overs bowled
          RC: 0,    // Runs conceded
          Wkts: 0,  // Wickets taken
          Econ: 0,  // Economy rate
          C: 0      // Contribution
        });
      }
      const stats = playerStats.get(batsman.name);
      stats.RS += batsman.overs.reduce((sum, over) => sum + (parseInt(over.overTotal) || 0), 0);
    });
  });
  // Process bowling stats (OB, RC, Wkts)
  opposingTeamData.forEach(pair => {
    pair.batsmen.forEach(batsman => {
      batsman.overs.forEach(over => {
        // Only process if bowler is from our team
        if (over.bowlerName && over.bowlerName.trim() && teamPlayerNames.has(over.bowlerName)) {
          if (!playerStats.has(over.bowlerName)) {
            playerStats.set(over.bowlerName, {
              name: over.bowlerName,
              RS: 0, OB: 0, RC: 0, Wkts: 0, Econ: 0, C: 0
            });
          }
          const stats = playerStats.get(over.bowlerName);
          stats.OB += 1;

          // Calculate runs conceded and wickets
          let overRuns = 0;
          let overWickets = 0;

          // Process main balls
          over.balls.forEach((ball, idx) => {
            if (!ball) return;
            const value = ball.toUpperCase();
            if (['R', 'C', 'B', 'S', 'H'].includes(value)) {
              overWickets++;
              overRuns -= 5; // Subtract 5 runs for wickets
            } else if (value === 'W') {
              overRuns += 2 + parseInt(over.extraRuns[idx] || 0);
            } else if (value === 'N') {
              overRuns += 2 + parseInt(over.extraRuns[idx] || 0);
            } else {
              const numValue = parseInt(value);
              if (!isNaN(numValue)) overRuns += numValue;
            }
          });

          // Process extra balls
          if (over.extraBalls) {
            over.extraBalls.forEach((ball, idx) => {
              if (!ball) return;
              const value = ball.toUpperCase();
              const extraRunIndex = over.balls.length + idx;
              if (['R', 'C', 'B', 'S', 'H'].includes(value)) {
                overWickets++;
                overRuns -= 5; // Subtract 5 runs for wickets
              } else if (value === 'W') {
                overRuns += 2 + parseInt(over.extraRuns[extraRunIndex] || 0);
              } else if (value === 'N') {
                overRuns += 2 + parseInt(over.extraRuns[extraRunIndex] || 0);
              } else {
                const numValue = parseInt(value);
                if (!isNaN(numValue)) overRuns += numValue;
              }
            });
          }

          stats.RC += overRuns;
          stats.Wkts += overWickets;
        }
      });
    });
  });

  // Calculate Economy and Contribution
  playerStats.forEach(stats => {
    stats.Econ = stats.OB > 0 ? (stats.RC / stats.OB).toFixed(1) : '0.0';
    stats.C = stats.RS - stats.RC;
  });

  return Array.from(playerStats.values());
};

const PlayerStatsTable = ({ team1Name, team1Data, team2Name, team2Data }) => {
  // Get stats and sort by C value (highest to lowest)
  const team1Stats = calculatePlayerStats(team1Data, team2Data).sort((a, b) => b.C - a.C);
  const team2Stats = calculatePlayerStats(team2Data, team1Data).sort((a, b) => b.C - a.C);

  // Find player of the match (highest C value from both teams)
  const allPlayers = [...team1Stats, ...team2Stats];
  const playerOfMatch = allPlayers.reduce((max, player) =>
    player.C > max.C ? player : max,
    allPlayers[0]
  );

  const headerStyle = {
    backgroundColor: '#f1f4fb',
    fontWeight: 'bold',
    fontSize: 6,
    padding: 2,
    textAlign: 'center',
    borderBottom: 1,
    borderRight: 1,
    borderColor: '#e9ebfa'
  };

  const cellStyle = {
    fontSize: 6,
    padding: 2,
    textAlign: 'center',
    borderBottom: 1,
    borderRight: 1,
    borderColor: '#e9ebfa'
  };

  const tableStyle = {
    borderLeft: 1,
    borderTop: 1,
    borderColor: '#e9ebfa',
    marginBottom: 8
  };

  const potmStyle = {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f1f4fb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e9ebfa'
  };

  return (
    <View>
      {/* Player of the Match Section */}
      <View style={potmStyle}>
        <Text style={{ fontSize: 8, fontWeight: 'bold', marginBottom: 4 }}>Player of the Match</Text>
        <Text style={{ fontSize: 7 }}>
          {playerOfMatch.name} (C: {playerOfMatch.C}) - {playerOfMatch.RS} runs, {playerOfMatch.Wkts} wickets
        </Text>
      </View>

      {/* Player Statistics Tables */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* Team 1 Stats */}
        <View style={[{ flex: 1 }, tableStyle]}>
          <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0' }}>
            <Text style={[headerStyle, { flex: 2 }]}>{team1Name}</Text>
            <Text style={[headerStyle, { flex: 1 }]}>RS</Text>
            <Text style={[headerStyle, { flex: 1 }]}>OB</Text>
            <Text style={[headerStyle, { flex: 1 }]}>RC</Text>
            <Text style={[headerStyle, { flex: 1 }]}>Wkts</Text>
            <Text style={[headerStyle, { flex: 1 }]}>Econ</Text>
            <Text style={[headerStyle, { flex: 1 }]}>C</Text>
          </View>
          {team1Stats.map((player, idx) => (
            <View key={idx} style={{ flexDirection: 'row' }}>
              <Text style={[cellStyle, { flex: 2, textAlign: 'left' }]}>{player.name}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.RS}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.OB}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.RC}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.Wkts}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.Econ}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.C}</Text>
            </View>
          ))}
        </View>

        {/* Team 2 Stats */}
        <View style={[{ flex: 1 }, tableStyle]}>
          <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0' }}>
            <Text style={[headerStyle, { flex: 2 }]}>{team2Name}</Text>
            <Text style={[headerStyle, { flex: 1 }]}>RS</Text>
            <Text style={[headerStyle, { flex: 1 }]}>OB</Text>
            <Text style={[headerStyle, { flex: 1 }]}>RC</Text>
            <Text style={[headerStyle, { flex: 1 }]}>Wkts</Text>
            <Text style={[headerStyle, { flex: 1 }]}>Econ</Text>
            <Text style={[headerStyle, { flex: 1 }]}>C</Text>
          </View>
          {team2Stats.map((player, idx) => (
            <View key={idx} style={{ flexDirection: 'row' }}>
              <Text style={[cellStyle, { flex: 2, textAlign: 'left' }]}>{player.name}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.RS}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.OB}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.RC}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.Wkts}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.Econ}</Text>
              <Text style={[cellStyle, { flex: 1 }]}>{player.C}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};


const FullMatchPDF = ({ matchInfo, team1Data, team2Data }) => (
  <Document>
    <Page size="A4" style={{ padding: 20 }}>
     
      {/* Final Score Table (Skins) */}
      <FinalScoreTable matchInfo={matchInfo} team1Data={team1Data} team2Data={team2Data} />
      {/* Team 1 Score Table */}
      <TeamScoreTable teamName={matchInfo.team1} teamData={team1Data} oversPerSkin={matchInfo.oversPerSkin} />
      {/* Team 2 Score Table */}
      <TeamScoreTable teamName={matchInfo.team2} teamData={team2Data} oversPerSkin={matchInfo.oversPerSkin} />

    </Page>
    <Page size="A4" style={{ padding: 20 }}>
      <PlayerStatsTable
        team1Name={matchInfo.team1}
        team1Data={team1Data}
        team2Name={matchInfo.team2}
        team2Data={team2Data}
      />
    </Page>
  </Document>
);

export default FullMatchPDF;

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


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
                skinTotal +=  extraRun;
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
                  skinTotal +=  extraRun;
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
      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>Final Score</Text>
      <View style={{ display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0' }}>
          <Text style={{ flex: 1, padding: 2 }}></Text>
          {Array(numberOfSkins).fill(0).map((_, i) => (
            <Text key={i} style={{ flex: 1, textAlign: 'center', padding: 4 }}>Skin {i + 1}</Text>
          ))}
          <Text style={{ flex: 1, padding: 2 }}>TOTAL</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1, padding: 2 }}>{matchInfo.team1}</Text>
          {team1.skinScores.map((score, i) => (
            <Text key={i} style={{ flex: 1, textAlign: 'center', padding: 4 }}>{score}</Text>
          ))}
          <Text style={{ flex: 1, padding: 2 }}>{team1.total} ({team1.skins} skins)</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1, padding: 2 }}>{matchInfo.team2}</Text>
          {team2.skinScores.map((score, i) => (
            <Text key={i} style={{ flex: 1, textAlign: 'center', padding: 4 }}>{score}</Text>
          ))}
          <Text style={{ flex: 1, padding: 2 }}>{team2.total} ({team2.skins} skins)</Text>
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
    borderColor: '#000',
    fontSize: 6, // Small font for compactness
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 1,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
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
      <View key={key} style={{ borderWidth: 0.5, borderColor: '#000', minWidth: 10, minHeight: 10, alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0 }}>
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
      <Text style={[styles.tableCell, { flex: 0.5, borderTopWidth: 0 }]}></Text>
      <Text style={[styles.tableCell, { flex: 1.5, borderTopWidth: 0 }]}></Text>
      {pair?.batsmen?.[0]?.overs.map((over, overIdx) => (
        <View key={overIdx} style={{ flex: 1, borderWidth: 0.6, borderColor: '#000', alignItems: 'center', justifyContent: 'center', minHeight: 10 }}>
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
        <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', minHeight: 12 }}>
          <Text style={[styles.tableCell, { flex: 0.3 }]}></Text>
          <Text style={[styles.tableCell, { flex: 1 }]}></Text>
          {pair.batsmen[0].overs.map((_, overIdx) => (
            <Text key={overIdx} style={[styles.tableCell, { fontWeight: 'bold', fontSize: 5 }]}>
              {pair.pairId * oversPerPair - oversPerPair + overIdx + 1}
            </Text>
          ))}
          <Text style={[styles.tableCell, { fontWeight: 'bold', fontSize: 5 }]}>Total</Text>
        </View>

        {/* Bowler names row - more compact */}
        {renderBowlerNamesRow(pair)}

        {/* Batsmen rows with balls and totals */}
        <View style={{ flexDirection: 'row', alignItems: 'stretch', minHeight: 24 }}>
          {/* Pair number and batsman names */}
          <View style={{ flexDirection: 'column', flex: 1.3, borderRightWidth: 1, borderColor: '#000' }}>
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
            <View key={overIdx} style={{ flex: 1, borderRightWidth: 1, borderColor: '#000' }}>
              {/* First batsman's balls and total */}
              <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#000', padding: 1 }}>
                <View style={{ flex: 0.8, flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                  {over.balls.map((ball, ballIdx) => renderBallCell(ball, over.extraRuns[ballIdx], `main-${overIdx}-${ballIdx}`))}
                  {over.extraBalls?.map((ball, extraIdx) => renderBallCell(ball, over.extraRuns[over.balls.length + extraIdx], `extra-${overIdx}-${extraIdx}`))}
                </View>
                <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 5 }}>{over.overTotal || '0'}</Text>
                </View>
              </View>

              {/* Second batsman's balls and total */}
              <View style={{ flexDirection: 'row', padding: 1 }}>
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

          {/* Individual and pair totals */}
          <View style={{ flex: 0.5, borderLeftWidth: 1, borderColor: '#000' }}>
            <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 5 }}>
                {pair.batsmen[0].overs.reduce((sum, o) => sum + (parseInt(o.overTotal) || 0), 0)}
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 5 }}>
                {pair.batsmen[1].overs.reduce((sum, o) => sum + (parseInt(o.overTotal) || 0), 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Pair totals row */}
        <View style={{ flexDirection: 'row', backgroundColor: '#f5f5f5', minHeight: 12 }}>
          <Text style={[styles.tableCell, { flex: 1.3, textAlign: 'right', fontSize: 5 }]}>
            {(pair.pairId - 1) * oversPerPair + 1}/{pair.pairId * oversPerPair}
          </Text>
          {pair?.totals?.map((total, idx) => (
            <Text key={idx} style={[styles.tableCell, { fontSize: 5 }]}>{total}</Text>
          ))}
          <Text style={[styles.tableCell, { flex: 0.5, fontWeight: 'bold', fontSize: 5 }]}>
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
  </Document>
);

export default FullMatchPDF;

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ScoreCardPDF from './ScoreCardPDF';

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
        {/* Over numbers header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0' }}>
          <Text style={[styles.tableCell, { flex: 0.5 }]}></Text>
          <Text style={[styles.tableCell, { flex: 1.5 }]}></Text>
          {pair.batsmen[0].overs.map((_, overIdx) => (
            <Text key={overIdx} style={[styles.tableCell, { fontWeight: 'bold', fontSize: 6 }]}> {pair.pairId * oversPerPair - oversPerPair + overIdx + 1} </Text>
          ))}
          <Text style={[styles.tableCell, { fontWeight: 'bold', fontSize: 6 }]}>Total</Text>
        </View>
        {/* Bowler names row */}
        {renderBowlerNamesRow(pair)}
        {/* Batsmen rows, with balls and over totals aligned per over */}
        <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          {/* Pair number and batsman names (vertical) */}
          <View style={{ flexDirection: 'column', flex: 0.5 + 1.5, borderRightWidth: 1, borderColor: '#000' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={[styles.tableCell, { flex: 0.5, borderBottomWidth: 0 }]} rowSpan={2}>{pair.pairId}</Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'left', fontSize: 6, borderBottomWidth: 0 }]}>{pair.batsmen[0].name}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={[styles.tableCell, { flex: 0.5, borderTopWidth: 0 }]}></Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'left', fontSize: 6, borderTopWidth: 0 }]}>{pair.batsmen[1].name}</Text>
            </View>
          </View>
          {/* For each over: a column with over total (left), then ball cells for both batsmen (vertical) */}
          {pair.batsmen[0].overs.map((over, overIdx) => (
            <View key={overIdx} style={{ flex: 1, flexDirection: 'column', borderRightWidth: 1, borderColor: '#000', alignItems: 'stretch', justifyContent: 'flex-start' }}>
              {/* Over total (top, left-aligned) */}
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderBottomWidth: 0.5, borderColor: '#000', minHeight: 10 }}>
                <Text style={{ fontSize: 6, width: 18, textAlign: 'center' }}>{over.overTotal || '0'}</Text>
                <View style={{ flex: 1 }}></View>
              </View>
              {/* Balls for batsman 0 */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {over.balls.map((ball, ballIdx) => renderBallCell(ball, over.extraRuns[ballIdx], `main-${overIdx}-${ballIdx}`))}
                {over.extraBalls && over.extraBalls.map((ball, extraIdx) => renderBallCell(ball, over.extraRuns[over.balls.length + extraIdx], `extra-${overIdx}-${extraIdx}`))}
              </View>
              {/* Balls for batsman 1 (same over index) */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTopWidth: 0.5, borderColor: '#000' }}>
                {pair.batsmen[1].overs[overIdx]?.balls.map((ball, ballIdx) => renderBallCell(ball, pair.batsmen[1].overs[overIdx].extraRuns[ballIdx], `main-b1-${overIdx}-${ballIdx}`))}
                {pair.batsmen[1].overs[overIdx]?.extraBalls && pair.batsmen[1].overs[overIdx].extraBalls.map((ball, extraIdx) => renderBallCell(ball, pair.batsmen[1].overs[overIdx].extraRuns[pair.batsmen[1].overs[overIdx].balls.length + extraIdx], `extra-b1-${overIdx}-${extraIdx}`))}
              </View>
            </View>
          ))}
          {/* Pair total (rightmost cell, vertical merge) */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderColor: '#000' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 6 }}>
              {pair.batsmen.reduce((sum, b) => sum + b.overs.reduce((s, o) => s + (parseInt(o.overTotal) || 0), 0), 0)}
            </Text>
          </View>
        </View>
        {/* Totals row for the pair (as in UI) */}
        <View style={{ flexDirection: 'row', backgroundColor: '#eaeaea' }}>
          <Text style={[styles.tableCell, { flex: 2, textAlign: 'right', fontSize: 6 }]}>Totals</Text>
          {pair?.totals?.map((total, idx) => (
            <Text key={idx} style={[styles.tableCell, { fontSize: 6 }]}>{total}</Text>
          ))}
          <Text style={[styles.tableCell, { fontWeight: 'bold', fontSize: 6 }]}>{pair.batsmen.reduce((sum, b) => sum + b.overs.reduce((s, o) => s + (parseInt(o.overTotal) || 0), 0), 0)}</Text>
        </View>
      </React.Fragment>
    );
  };

  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 8, fontWeight: 'bold', marginBottom: 2 }}>Batting Team: {teamName}</Text>
      <View style={styles.table}>
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
      {/* Player Stats Tables Side by Side */}
      {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <View style={{ flex: 1 }}>
          <ScoreCardPDF team1Data={team1Data} team2Data={[]} matchInfo={matchInfo} />
        </View>
        <View style={{ flex: 1 }}>
          <ScoreCardPDF team1Data={[]} team2Data={team2Data} matchInfo={matchInfo} />
        </View>
      </View> */}
    </Page>
  </Document>
);

export default FullMatchPDF;

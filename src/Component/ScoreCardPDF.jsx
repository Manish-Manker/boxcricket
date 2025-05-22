import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Calculate total runs scored for a batsman
const calculateTotalRuns = (overs) => {
  return overs.reduce((total, over) => {
    const overTotal = over.balls.reduce((sum, ball, index) => {
      if (!ball) return sum;
      const value = ball;
      const extraRun = parseInt(over.extraRuns[index] || 0);

      if (value === 'W' || value === 'n') {
        return sum + extraRun;
      }
      if (value === 'N') {
        return sum + 2 + (parseInt(over.extraBalls[index] || 0));
      }
      if (['R', 'C', 'B'].includes(value)) {
        return sum - 5;
      }
      const numValue = parseInt(value);
      return sum + (numValue >= 0 && numValue <= 7 ? numValue : 0);
    }, 0);
    return total + overTotal;
  }, 0);
};

// Count number of overs bowled
const countOversPlayed = (overs) => {
  return overs.reduce((total, over) => {
    const validBalls = over.balls.filter(ball => ball).length;
    return total + (validBalls > 0 ? 2 : 0); // Each over is 2 points
  }, 0);
};

// Calculate runs cancelled (negative impact)
const calculateRunsCancelled = (overs) => {
  return overs.reduce((total, over) => {
    const overCancelled = over.balls.reduce((sum, ball, index) => {
      if (!ball) return sum;
      if (['R', 'C', 'B'].includes(ball)) {
        return sum + 5;  // Wickets cancel 5 runs
      }
      return sum;
    }, 0);
    return total + overCancelled;
  }, 0);
};

// Calculate total wickets taken
const calculateWickets = (overs) => {
  return overs.reduce((total, over) => {
    const overWickets = over.balls.reduce((sum, ball) => {
      return sum + (['R', 'C', 'B'].includes(ball) ? 1 : 0);
    }, 0);
    return total + overWickets;
  }, 0);
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    padding: 30,
  },
  section: {
    flex: 1,
    margin: 10,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  playerOfMatch: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const ScoreCardPDF = ({ team1Data, team2Data, matchInfo }) => {
  const getPlayerStats = (teamData) => {
    return teamData.map(pair => 
      pair.batsmen.map(batsman => {
        const stats = {
          name: batsman.name,
          RS: calculateTotalRuns(batsman.overs),
          OB: countOversPlayed(batsman.overs),
          RC: calculateRunsCancelled(batsman.overs),
          Wkts: calculateWickets(batsman.overs),
          Econ: 0,
          C: 0,
        };
        stats.Econ = stats.RC / stats.OB;
        stats.C = stats.RS - stats.RC;
        return stats;
      })
    ).flat();
  };

  const findPlayerOfMatch = (team1Stats, team2Stats) => {
    const allPlayers = [...team1Stats, ...team2Stats];
    return allPlayers.reduce((max, player) => 
      (player.C > max.C) ? player : max
    );
  };

  const team1Stats = getPlayerStats(team1Data);
  const team2Stats = getPlayerStats(team2Data);
  const playerOfMatch = findPlayerOfMatch(team1Stats, team2Stats);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.teamName}>{matchInfo.team1}</Text>
          <View style={styles.table}>
            {/* Table Headers */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>RS</Text>
              <Text style={styles.tableCell}>OB</Text>
              <Text style={styles.tableCell}>RC</Text>
              <Text style={styles.tableCell}>Wkts</Text>
              <Text style={styles.tableCell}>Econ</Text>
              <Text style={styles.tableCell}>C</Text>
            </View>
            {/* Team 1 Data */}
            {team1Stats.map((player, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{player.name}</Text>
                <Text style={styles.tableCell}>{player.RS}</Text>
                <Text style={styles.tableCell}>{player.OB}</Text>
                <Text style={styles.tableCell}>{player.RC}</Text>
                <Text style={styles.tableCell}>{player.Wkts}</Text>
                <Text style={styles.tableCell}>{player.Econ.toFixed(1)}</Text>
                <Text style={styles.tableCell}>{player.C}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.teamName}>{matchInfo.team2}</Text>
          <View style={styles.table}>
            {/* Table Headers */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>RS</Text>
              <Text style={styles.tableCell}>OB</Text>
              <Text style={styles.tableCell}>RC</Text>
              <Text style={styles.tableCell}>Wkts</Text>
              <Text style={styles.tableCell}>Econ</Text>
              <Text style={styles.tableCell}>C</Text>
            </View>
            {/* Team 2 Data */}
            {team2Stats.map((player, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{player.name}</Text>
                <Text style={styles.tableCell}>{player.RS}</Text>
                <Text style={styles.tableCell}>{player.OB}</Text>
                <Text style={styles.tableCell}>{player.RC}</Text>
                <Text style={styles.tableCell}>{player.Wkts}</Text>
                <Text style={styles.tableCell}>{player.Econ.toFixed(1)}</Text>
                <Text style={styles.tableCell}>{player.C}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.playerOfMatch}>
            Player of the Match: {playerOfMatch.name} (C: {playerOfMatch.C})
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ScoreCardPDF;
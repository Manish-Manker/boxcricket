import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FinalScore from './FinalScore';
import FullMatchPDF from './FullMatchPDF';
import { useNavigate } from 'react-router-dom'
import PageLoader from './common/pageLoader';
import svg from './common/svg';
import ConfirmationPopup from './common/confirmPopup';

const ScoreTable = () => {
  // State management
  const [matchInfo, setMatchInfo] = useState(null);
  const [team1Data, setTeam1Data] = useState(null);
  const [team2Data, setTeam2Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);
  const [numberOfCols, setNumberOfCols] = useState(0);
  const [isRemove, setIsRemove] = useState(false);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const navigate = useNavigate();
  const DEV_API = process.env.REACT_APP_DEV_API;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
    const matchId = localStorage.getItem('matchId');
    
    if (!matchId) {
      navigate('/');
    }

  }, []);


  // Clear current ball on mount
  useEffect(() => {
    localStorage.removeItem('currentBall');
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('currentBall');
    localStorage.removeItem('currentSkinIndex');
    localStorage.removeItem('isSet');
    localStorage.removeItem('matchId');
    localStorage.removeItem('matchInfo');
    localStorage.removeItem('previousBall');
    localStorage.removeItem('team1ScoreData');
    localStorage.removeItem('team2ScoreData');
    localStorage.removeItem('consecutiveZerosCount');
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setIsRemove(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setIsRemove(false);
  };

  const handleCancelPopup = () => {
    setIsRemove(false);
    setIsCreateNew(false);
  };

  const createNewMatch = () => {
    navigate('/');
    setIsCreateNew(false);
  }

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
            extraBalls: [],
            extraRuns: Array(6).fill(''),
            overTotal: '0'
          }))
        },
        {
          name: '',
          overs: Array(oversPerSkin).fill().map((_, overIndex) => ({
            bowlerNum: (rowIndex * oversPerSkin + overIndex + 1),
            bowlerName: '',
            balls: Array(6).fill(''),
            extraBalls: [],
            extraRuns: Array(6).fill(''),
            overTotal: '0'
          }))
        }
      ],
      totals: Array(oversPerSkin).fill('0/0')
    }));
  };

  // Load match data from API
  const loadData = async () => {
    try {
      const matchId = localStorage.getItem('matchId');
      const token = localStorage.getItem('authToken');

      if (!matchId || !token) {
        // console.log('No matchId or token found in localStorage');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${DEV_API}/api/match/${matchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const { matchInfo: matchData, team1Data: team1Response, team2Data: team2Response } = response.data.data;

      if (matchData) {
        setMatchInfo(matchData);

        // Calculate dimensions for the table
        const rows = Math.ceil(parseInt(matchData.totalOvers) / parseInt(matchData.oversPerSkin));
        const cols = parseInt(matchData.oversPerSkin);
        setNumberOfCols(cols);

        // console.log('Initializing table with:', { rows, cols });

        // Create or use existing data
        const newTeam1Data = team1Response?.length > 0
          ? team1Response
          : createRows(rows, cols);

        const newTeam2Data = team2Response?.length > 0
          ? team2Response
          : createRows(rows, cols);

        setTeam1Data(newTeam1Data);
        setTeam2Data(newTeam2Data);
      }
    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Auto-save team data effects
  useEffect(() => {
    if (!team1Data) return;

    const saveData = async () => {
      const matchId = localStorage.getItem('matchId');
      if (!matchId) return;

      try {
        await axios.post(`${DEV_API}/api/teamdata/${matchId}`, {
          teamNumber: 1,
          data: team1Data
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        localStorage.setItem('team1ScoreData', JSON.stringify(team1Data));
      } catch (error) {
        console.error('Error saving team 1 data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [team1Data, DEV_API]);

  useEffect(() => {
    if (!team2Data) return;

    const saveData = async () => {
      const matchId = localStorage.getItem('matchId');
      if (!matchId) return;

      try {
        await axios.post(`${DEV_API}/api/teamdata/${matchId}`, {
          teamNumber: 2,
          data: team2Data
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        localStorage.setItem('team2ScoreData', JSON.stringify(team2Data));
      } catch (error) {
        console.error('Error saving team 2 data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [team2Data, DEV_API]);

  useEffect(() => {
    const handelKeyPress = (event) => {
      let key = event.key;
      let currentBall = localStorage.getItem('currentBall');
      if (key === 'Backspace' && currentBall === '0') {
        let ZerosCount = parseInt(localStorage.getItem('consecutiveZerosCount'));
        if (ZerosCount > 0) {
          localStorage.setItem('consecutiveZerosCount', (ZerosCount - 1).toString());
        }
      }
    }
    window.addEventListener('keydown', handelKeyPress);
    return () => {
      window.removeEventListener('keydown', handelKeyPress);
    }
  }, [])


  // Validation functions
  const isValidInput = (value) => {
    if (!value) return true;
    const upperValue = value.toUpperCase();
    // Check for special characters (case-insensitive)
    if (['W', 'N', 'R', 'C', 'B', 'S', 'H'].includes(upperValue)) {
      return true;
    }
    // Check for any valid number
    const numValue = parseInt(value);
    return !isNaN(numValue) && numValue >= 0 && numValue <= 99;
  };

  const isValidExtraRun = (value) => {
    if (!value) return true;
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 99;
  };

  // Calculation functions
  // Calculate total for one over (6 balls + extra balls)  
  const calculateOverTotal = (balls, extraRuns, extraBalls = []) => {
    // Function to calculate total for a single ball
    const calculateBallTotal = (ball, extraRun = 0) => {
      if (!ball) return 0;
      const value = ball.toUpperCase();

      // Handle special ball types
      if (value === 'W') return 2 + parseInt(extraRun || 0);  // Wide ball: 1 run + extra runs
      if (value === 'N') return 2 + parseInt(extraRun || 0);  // No ball: 1 run + extra runs
      if (['R', 'C', 'B', 'S', 'H'].includes(value)) return -5;  // Wickets: -5 runs

      // Handle numeric values
      const numValue = parseInt(value);
      return numValue >= 0 ? numValue : 0;
    };

    // Calculate total from main balls
    const mainBallsTotal = balls.reduce((sum, ball, index) => {
      const extraRun = parseInt(extraRuns[index] || 0);
      return sum + calculateBallTotal(ball, extraRun);
    }, 0);

    // Calculate total from extra balls
    const extraBallsTotal = extraBalls.reduce((sum, ball, index) => {
      const extraRun = parseInt(extraRuns[index + balls.length] || 0);
      return sum + calculateBallTotal(ball, extraRun);
    }, 0);

    return mainBallsTotal + extraBallsTotal;
  };

  // Count wickets (R/C/B) in an over
  const countWickets = (balls) => {
    return balls.reduce((count, ball) => {
      if (!ball) return count;
      const value = ball.toUpperCase();
      return ['R', 'C', 'B', 'S', 'H'].includes(value) ? count + 1 : count;
    }, 0);
  }
  // Calculate total for one batsman (all overs)
  const calculateBatsmanTotal = (overs) => {
    return overs.reduce((sum, over) => {
      return sum + calculateOverTotal(over.balls, over.extraRuns, over.extraBalls)
    }, 0)
  }

  // Event handlers
  const handleBallChange = (teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, value) => {
    // Only allow valid inputs
    if (!isValidInput(value)) {
      return;
    }    // Only clear consecutive zeros when it's a new skin/pair
    if (rowIndex !== parseInt(localStorage.getItem('currentSkinIndex'))) {
      localStorage.removeItem('previousBall');
      localStorage.removeItem('consecutiveZerosCount');
      localStorage.setItem('currentSkinIndex', rowIndex.toString());
    }

    // Save current ball to localStorage
    if (value) {
      const currentBall = localStorage.getItem('currentBall');

      // Update previous and current ball first
      localStorage.setItem('previousBall', currentBall || '');
      localStorage.setItem('currentBall', value);

      // Track consecutive zeros within the same skin
      if (value === '0') {
        if (currentBall === '0' &&
          parseInt(localStorage.getItem('currentSkinIndex')) === rowIndex) {
          const count = parseInt(localStorage.getItem('consecutiveZerosCount') || '0');
          localStorage.setItem('consecutiveZerosCount', (count + 1).toString());
        } else {
          localStorage.setItem('consecutiveZerosCount', '1');
        }
      } else {
        localStorage.removeItem('consecutiveZerosCount');
      }
    }

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data;

    setTeamData(prevData => {
      const newData = [...prevData];
      // Update the ball value
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls[ballIndex] = value;

      // Calculate new over total and wickets
      const overBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls;
      const overExtraRuns = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns;
      const overExtraBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraBalls;
      const overTotal = calculateOverTotal(overBalls, overExtraRuns, overExtraBalls);
      const wickets = countWickets(overBalls);

      // Update over stats
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].overTotal = overTotal.toString();      // Update pair totals for this over
      const pairOverTotal = calculateOverTotal(
        newData[rowIndex].batsmen[0].overs[overIndex].balls,
        newData[rowIndex].batsmen[0].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[0].overs[overIndex].extraBalls
      ) + calculateOverTotal(
        newData[rowIndex].batsmen[1].overs[overIndex].balls,
        newData[rowIndex].batsmen[1].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[1].overs[overIndex].extraBalls
      );
      const pairOverWickets = countWickets(newData[rowIndex].batsmen[0].overs[overIndex].balls) +
        countWickets(newData[rowIndex].batsmen[1].overs[overIndex].balls);
      newData[rowIndex].totals[overIndex] = `${pairOverWickets}/${pairOverTotal}`;

      return newData;
    });
  };

  const handleExtraRunsChange = (teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, value) => {
    if (!isValidExtraRun(value)) {
      return;
    }

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data;

    setTeamData(prevData => {
      const newData = [...prevData];
      // Update the extra runs value
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns[ballIndex] = value;

      // Calculate new over total
      const overBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls;
      const overExtraRuns = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns;
      const overExtraBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraBalls;
      const overTotal = calculateOverTotal(overBalls, overExtraRuns, overExtraBalls);

      // Update over stats
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].overTotal = overTotal.toString();      // Update pair totals for this over
      const pairOverTotal = calculateOverTotal(
        newData[rowIndex].batsmen[0].overs[overIndex].balls,
        newData[rowIndex].batsmen[0].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[0].overs[overIndex].extraBalls
      ) + calculateOverTotal(
        newData[rowIndex].batsmen[1].overs[overIndex].balls,
        newData[rowIndex].batsmen[1].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[1].overs[overIndex].extraBalls
      );

      const pairOverWickets = countWickets(newData[rowIndex].batsmen[0].overs[overIndex].balls) +
        countWickets(newData[rowIndex].batsmen[1].overs[overIndex].balls);

      newData[rowIndex].totals[overIndex] = `${pairOverWickets}/${pairOverTotal}`;

      return newData;
    });
  };
  const handleExtraBallChange = (teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, value) => {
    // Allow empty value for clearing
    if (value !== '' && !isValidInput(value)) {
      return;
    }

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data; setTeamData(prevData => {
      const newData = [...prevData];
      // Get reference to current over
      const currentOver = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex];
      const balls = currentOver.balls;
      const extraBalls = currentOver.extraBalls || [];

      // Update extra ball value
      extraBalls[ballIndex] = value;
      currentOver.extraBalls = extraBalls;

      // Convert to uppercase for case-insensitive comparison
      const upperValue = value.toUpperCase();

      // Handle special cases for wide and no-ball
      if (upperValue === 'W' || upperValue === 'N') {
        // Initialize extraRuns array if not exists
        if (!currentOver.extraRuns) {
          currentOver.extraRuns = Array(6 + extraBalls.length).fill('0');
        }
        // Ensure we have enough slots in extraRuns array for extra balls
        while (currentOver.extraRuns.length <= ballIndex + balls.length) {
          currentOver.extraRuns.push('0');
        }
        // If it's not already showing the extra runs input, show it with default value '0'
        if (!currentOver.extraRuns[ballIndex + balls.length]) {
          currentOver.extraRuns[ballIndex + balls.length] = '0';
        }
      }
      // Handle wicket types
      else if (['R', 'C', 'B', 'S', 'H'].includes(upperValue)) {
        // Wickets should not have extra runs in box cricket
        newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns[ballIndex] = '0';
      }

      // Calculate new over total including extra balls
      const overBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].balls;
      const overExtraRuns = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraRuns;
      const overExtraBalls = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].extraBalls;

      // Calculate over total with updated values
      const overTotal = calculateOverTotal(overBalls, overExtraRuns, overExtraBalls);

      // Update over stats
      newData[rowIndex].batsmen[batsmanIndex].overs[overIndex].overTotal = overTotal.toString();

      // Update pair totals for this over
      const pairOverTotal = calculateOverTotal(
        newData[rowIndex].batsmen[0].overs[overIndex].balls,
        newData[rowIndex].batsmen[0].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[0].overs[overIndex].extraBalls
      ) + calculateOverTotal(
        newData[rowIndex].batsmen[1].overs[overIndex].balls,
        newData[rowIndex].batsmen[1].overs[overIndex].extraRuns,
        newData[rowIndex].batsmen[1].overs[overIndex].extraBalls
      );

      // Calculate wickets from both regular and extra balls
      const pairOverWickets =
        countWickets(newData[rowIndex].batsmen[0].overs[overIndex].balls) +
        countWickets(newData[rowIndex].batsmen[0].overs[overIndex].extraBalls) +
        countWickets(newData[rowIndex].batsmen[1].overs[overIndex].balls) +
        countWickets(newData[rowIndex].batsmen[1].overs[overIndex].extraBalls);

      newData[rowIndex].totals[overIndex] = `${pairOverWickets}/${pairOverTotal}`;

      // Save the last entered value to indicate current ball
      if (value) {
        const isLastBallOfOver = ballIndex === 5 && !currentOver.extraBalls?.length;
        if (!isLastBallOfOver && localStorage.getItem('currentBall')) {
          localStorage.setItem('previousBall', localStorage.getItem('currentBall'));
        }
        localStorage.setItem('currentBall', value);
      }

      return newData;
    });
  };

  const handleAddExtraBall = (teamNumber, rowIndex, batsmanIndex, overIndex, event) => {
    // Prevent event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const setTeamData = teamNumber === 1 ? setTeam1Data : setTeam2Data;

    setTeamData(prevData => {
      const newData = [...prevData];
      const currentOver = newData[rowIndex].batsmen[batsmanIndex].overs[overIndex];
      // Initialize extraBalls array if it doesn't exist
      if (!currentOver.extraBalls) {
        currentOver.extraBalls = [];
      }
      // Only add a new empty slot if there isn't already one
      if (currentOver.extraBalls.length === 0 || currentOver.extraBalls[currentOver.extraBalls.length - 1] !== '') {
        currentOver.extraBalls.push('');
      }
      return newData;
    });
    return
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


  const renderTable = (teamName, teamNumber, teamData) => {
    return (
      <div className=" box_cric_team_box">
        <div className="box_cric_team_heading">
          <h3 className="m-0">Batting Team: {teamName}</h3>
        </div>
        <div className="table-responsive boc_cric_table">
          <table className="table table-bordered">
            <tbody>
              {teamData.map((pair, rowIndex) => (
                <React.Fragment key={pair.pairId}>
                  {/* First row - Over numbers */}
                  <tr>
                    <td className="border-head" colSpan="2"></td>
                    {Array(numberOfCols).fill().map((_, i) => (
                      <td key={i} className="text-center fw-bold border-head">
                        {pair.pairId * numberOfCols - numberOfCols + i + 1}
                      </td>
                    ))}
                    <td className="fw-bold border-head">Total</td>
                  </tr>
                  {/* Second row - Bowler names */}
                  <tr>
                    <td className="bb-1" colSpan="2"></td>
                    {pair.batsmen[0].overs.map((over, overIndex) => (
                      <td key={overIndex} className="bb-1">
                        <input
                          type="text"
                          className="form-control  box_cric_input_filed_name"
                          placeholder="Bowler name"
                          autoComplete='on'
                          value={over.bowlerName}
                          onChange={(e) => handleBowlerNameChange(teamNumber, rowIndex, overIndex, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="bb-1"></td>
                  </tr>
                  {/* Batsmen rows */}
                  {pair.batsmen.map((batsman, batsmanIndex) => (
                    <tr key={`${pair.pairId}-${batsmanIndex}`}>
                      {batsmanIndex === 0 && (
                        <td rowSpan="2" className="align-middle text-center" style={{ width: '40px' }}>
                          {pair.pairId}
                        </td>
                      )}
                      <td style={{ width: '150px' }}>
                        <input
                          type="text"
                          className="form-control box_cric_input_filed_name"
                          placeholder="Batsman name"
                          autoComplete='on'
                          value={batsman.name}
                          onChange={(e) => handleBatsmanNameChange(teamNumber, rowIndex, batsmanIndex, e.target.value)}
                        />
                      </td>
                      {batsman.overs.map((over, overIndex) => (
                        <td key={overIndex} className="p-2">
                          <div className="d-flex justify-content-between gap-1 align-items-start" style={{ minWidth: '160px' }}>
                            {/* 6 balls */}
                            <div className='d-flex justify-content-center gap-1'>
                              {over.balls.map((ball, ballIndex) => (
                                <div key={ballIndex} className="d-flex flex-column align-items-center">
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control box_cric_input_score"
                                      value={ball}
                                      onChange={(e) => handleBallChange(teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, e.target.value)}
                                    />
                                  </div>
                                  {/* Show extra runs input for W and n below */}
                                  {(ball === 'W' || ball === 'n' || ball === 'N' || ball === 'w') && (
                                    <input
                                      type="text"
                                      className="form-control box_cric_input_score mt-1"
                                      value={over.extraRuns[ballIndex] || ''}
                                      onChange={(e) => handleExtraRunsChange(teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, e.target.value)}
                                      placeholder=""
                                    />
                                  )}
                                </div>))}

                              {/* Extra balls section */}                              {over.extraBalls && over.extraBalls.map((extraBall, extraBallIndex) => (
                                <div key={`extra-${extraBallIndex}`} className="d-flex flex-column align-items-center">
                                  <input
                                    type="text"
                                    className="form-control box_cric_input_score"
                                    value={extraBall}
                                    onChange={(e) => handleExtraBallChange(teamNumber, rowIndex, batsmanIndex, overIndex, extraBallIndex, e.target.value)}
                                  />
                                  {/* Show extra runs input for W and N below */}
                                  {(extraBall?.toUpperCase() === 'W' || extraBall?.toUpperCase() === 'N') && (
                                    <input
                                      type="text"
                                      className="form-control box_cric_input_score mt-1"

                                      value={over.extraRuns[extraBallIndex + over.balls.length] || ''}
                                      onChange={(e) => handleExtraRunsChange(teamNumber, rowIndex, batsmanIndex, overIndex, extraBallIndex + over.balls.length, e.target.value)}
                                      placeholder=""
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Score total and Add Extra Ball button side by side */}
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="box_cric_btn  box_cric_btn_sm"
                                onClick={(e) => handleAddExtraBall(teamNumber, rowIndex, batsmanIndex, overIndex, e)}
                              >
                                +
                              </button>
                              <input
                                type="text"
                                className="form-control box_cric_input_score box_cric_input_scoreTT"
                                value={over.overTotal}
                                readOnly
                              />
                            </div>
                          </div>
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

  if (loading || !matchInfo || !team1Data || !team2Data) {
    return <PageLoader />
  }

  return (
    <>
      <div className=" container-fluid p-0" style={{ height: "100vh" }}>
        <div id='finalScore' className="bc_finalScore">

          <div className=" box_cric_score_all_btn box_cric_btn_score justify-content-between">

            <div>
              <div className='box_cric_back_btn' onClick={() => navigate('/')}>
                {svg.app.back_icon} Back
              </div>
             </div>
            <div className='box_cric_score_all_btn m-0'>
              <button
                className="box_cric_btn"
                onClick={() => window.open('/display', '_blank')}
              >
                Open Final Score in New Tab

              </button>

              {showPDF && (
                <PDFDownloadLink
                  document={
                    <FullMatchPDF
                      matchInfo={matchInfo}
                      team1Data={team1Data}
                      team2Data={team2Data}
                    />
                  }
                  fileName="FinalMatchScorecard.pdf"
                  className="box_cric_btn"
                >
                  {({ loading, url }) => {
                    if (!loading && url) {
                      setTimeout(() => setShowPDF(false), 3000);
                    }
                    return loading ? <div className='ps_loader_pdf_dl'>  <span className=" spinner-border spinner-border-sm mr-3" /> Preparing PDF...</div> : 'Download Final Match PDF';
                  }}
                </PDFDownloadLink>
              )}

              {!showPDF && (
                <button
                  className="box_cric_btn"
                  onClick={() => setShowPDF(true)}
                >
                  {svg.app.pdf_download} Create Full Match PDF
                </button>
              )}
              <button type="submit" className="box_cric_btn" onClick={() => setIsCreateNew(true)} > {svg.app.create} Create New Match</button>
              <button type="submit" className="box_cric_btn box_cric_btn_logout" onClick={handleLogoutClick} > {svg.app.logout} Log Out</button>
            </div>
          </div>

          <FinalScore />
        </div>


        <div id='scoreTable' className='bc_score_table' >
          {renderTable(matchInfo.team1, 1, team1Data)}
          {renderTable(matchInfo.team2, 2, team2Data)}
        </div>
      </div>


      <ConfirmationPopup
        shownPopup={isRemove}
        closePopup={handleCancelPopup}
        title="Confirm Logout"
        subTitle="Are you sure you want to log out?"
        type="User"
        removeAction={handleConfirmLogout}
      />

      <ConfirmationPopup
        shownPopup={isCreateNew}
        closePopup={handleCancelPopup}
        title="Create New Match"
        subTitle="Are you sure you want to create new match?"
        type="User"
        removeAction={createNewMatch}
      />

    </>
  )
}

export default ScoreTable

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
import { toast } from 'react-toastify';
import Logout from './common/logout';
import MicAnnouncer from './MicAnnouncer';

const ScoreTable = () => {
  // State management
  const [matchInfo, setMatchInfo] = useState(null);
  const [team1Data, setTeam1Data] = useState(null);
  const [team2Data, setTeam2Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);
  const [numberOfCols, setNumberOfCols] = useState(0);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [loadingClass, setLoadingClass] = useState('');
  const [status, setStatus] = useState("complete");
  const [rowOverIndex, setRowOverIndex] = useState(null);
  const navigate = useNavigate();
  const DEV_API = process.env.REACT_APP_DEV_API;

  const [allNames, setAllNames] = useState(['manish', 'manker', 'nam', 'rohit', 'rahul']);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [focusedFieldKey, setFocusedFieldKey] = useState(null);


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
    setRowOverIndex({ teamNumber: -1, rowIndex: -1, overIndex: -1 });
    localStorage.removeItem('currentOverData');
  }, []);



  const handleInputFocus = (value, fieldKey) => {
    setFocusedFieldKey(fieldKey);
    const filtered = allNames.filter(name =>
      name?.toLowerCase()?.includes((fieldKey.value || '')?.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleInputBlur = (value) => {
    const name = value.trim();
    if (name && !allNames.includes(name)) {
      setAllNames(prev => [...prev, name]);
      saveplayerName(name);
    }
    setTimeout(() => {
      setFocusedFieldKey(null);
      setFilteredSuggestions([]);
    }, 100);
  };

  const handleSuggestionClick = (key, name) => {
    key.onChange(name);
    setFocusedFieldKey(null);
  };

  const handleCancelPopup = () => {
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
        setStatus(matchData.status);

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

  const loadplayerName = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${DEV_API}/api/playername`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.status === 401 || response.data.status === 403) {

        navigate('/login');
        return
      }

      if (response.data.status === 200) {
        // toast.success(response?.data?.message);
        setAllNames(response.data.data);
        console.log(response.data.data);
      }
    }
    catch (error) {
      console.log(error);
      return
    }
  }

  const saveplayerName = async (name) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`${DEV_API}/api/playername`, {
        playerNames: name
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.status === 401 || response.data.status === 403) {
        navigate('/login');
        return
      }

      if (response.data.status === 200) {
        toast.success(response?.data?.message);
        console.log(response.data);
      }
    }
    catch (error) {
      console.log(error);
      return
    }
  }

  // Initial data load
  useEffect(() => {
    loadData();
    loadplayerName();
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
      if (value === 'W') return 2 + parseInt(extraRun || 0);
      if (value === 'N') return 2 + parseInt(extraRun || 0);
      if (['R', 'C', 'B', 'S', 'H'].includes(value)) return -5;

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

  const handelTick = (teamNumber, rowIndex, overIndex, overNumber) => {

    if (rowOverIndex?.teamNumber === teamNumber && rowOverIndex?.rowIndex === rowIndex && rowOverIndex?.overIndex === overIndex) {
      setRowOverIndex({ teamNumber: -1, rowIndex: -1, overIndex: -1 });
      localStorage.removeItem('currentOverData');
      return
    }

    setRowOverIndex({ teamNumber, rowIndex, overIndex });

    let data = {
      teamNumber: teamNumber,
      rowIndex: rowIndex,
      overIndex: overIndex,
      overNumber: overNumber
    }
    localStorage.setItem('currentOverData', JSON.stringify(data));


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
                        <div className='ps_check_btn_displayover'>
                          <input
                            type="checkbox"
                            id={`checkbox-${teamNumber}-${rowIndex}-${i}`}
                            className='ps_check_btn_displayover'
                            checked={teamNumber === rowOverIndex?.teamNumber && rowIndex === rowOverIndex?.rowIndex && i === rowOverIndex?.overIndex}
                            onChange={() => handelTick(teamNumber, rowIndex, i, `${pair.pairId * numberOfCols - numberOfCols + i + 1}`)}
                          />

                          <label htmlFor={`checkbox-${teamNumber}-${rowIndex}-${i}`}></label>
                        </div>
                      </td>
                    ))}
                    <td className="fw-bold border-head">Total</td>
                  </tr>
                  {/* Second row - Bowler names */}
                  < tr >
                    <td className="bb-1" colSpan="2"></td>
                    {
                      pair.batsmen[0].overs.map((over, overIndex) => (
                        <td key={overIndex} className="bb-1 ps_relative">
                          <input
                            type="text"
                            className="form-control box_cric_input_filed_name"
                            placeholder="Bowler name"
                            autoComplete="off"
                            disabled={status === 'ongoing' ? false : true}
                            value={over.bowlerName}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleBowlerNameChange(teamNumber, rowIndex, overIndex, value);
                              handleInputFocus(value, { type: 'bowler', teamNumber, rowIndex, overIndex, value });
                            }}
                            onBlur={() => handleInputBlur(over.bowlerName)}
                          />
                          {focusedFieldKey?.type === 'bowler' &&
                            focusedFieldKey.teamNumber === teamNumber &&
                            focusedFieldKey.rowIndex === rowIndex &&
                            focusedFieldKey.overIndex === overIndex &&
                            filteredSuggestions.length > 0 && (
                              <ul className="suggestion-dropdown ">
                                {filteredSuggestions.map((name, idx) => (
                                  <li
                                    key={idx}
                                    onMouseDown={() =>
                                      handleSuggestionClick(
                                        {
                                          onChange: (val) => handleBowlerNameChange(teamNumber, rowIndex, overIndex, val)
                                        },
                                        name
                                      )
                                    }
                                    style={{ padding: '2px 10px', cursor: 'pointer' }}
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </td>
                      ))
                    }
                    < td className="bb-1" ></td>
                  </tr>
                  {/* Batsmen rows */}
                  {pair.batsmen.map((batsman, batsmanIndex) => (
                    <tr key={`${pair.pairId}-${batsmanIndex}`}>
                      {batsmanIndex === 0 && (
                        <td rowSpan="2" className="align-middle text-center" style={{ width: '40px' }}>
                          {pair.pairId}
                        </td>
                      )}
                      <td className='ps_relative' style={{ width: '150px' }}>
                        <input
                          type="text"
                          className="form-control box_cric_input_filed_name"
                          placeholder="Batsman name"
                          autoComplete="off"
                          disabled={status === 'ongoing' ? false : true}
                          value={batsman.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleBatsmanNameChange(teamNumber, rowIndex, batsmanIndex, value);
                            handleInputFocus(value, { type: 'batsman', teamNumber, rowIndex, batsmanIndex, value });
                          }}
                          onBlur={() => handleInputBlur(batsman.name)}
                        />
                        {focusedFieldKey?.type === 'batsman' &&
                          focusedFieldKey.teamNumber === teamNumber &&
                          focusedFieldKey.rowIndex === rowIndex &&
                          focusedFieldKey.batsmanIndex === batsmanIndex &&
                          filteredSuggestions.length > 0 && (
                            <ul className="suggestion-dropdown">
                              {filteredSuggestions.map((name, idx) => (
                                <li
                                  key={idx}
                                  onMouseDown={() =>
                                    handleSuggestionClick(
                                      {
                                        onChange: (val) => handleBatsmanNameChange(teamNumber, rowIndex, batsmanIndex, val)
                                      },
                                      name
                                    )
                                  }
                                  style={{ padding: '4px 10px', cursor: 'pointer' }}
                                >
                                  {name}
                                </li>
                              ))}
                            </ul>
                          )}
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
                                      disabled={status === 'ongoing' ? false : true}
                                      className="form-control box_cric_input_score"
                                      value={ball}
                                      onChange={(e) => handleBallChange(teamNumber, rowIndex, batsmanIndex, overIndex, ballIndex, e.target.value)}
                                    />
                                  </div>
                                  {/* Show extra runs input for W and n below */}
                                  {(ball === 'W' || ball === 'n' || ball === 'N' || ball === 'w') && (
                                    <input
                                      type="text"
                                      disabled={status === 'ongoing' ? false : true}
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
                                    disabled={status === 'ongoing' ? false : true}
                                    className="form-control box_cric_input_score"
                                    value={extraBall}
                                    onChange={(e) => handleExtraBallChange(teamNumber, rowIndex, batsmanIndex, overIndex, extraBallIndex, e.target.value)}
                                  />
                                  {/* Show extra runs input for W and N below */}
                                  {(extraBall?.toUpperCase() === 'W' || extraBall?.toUpperCase() === 'N') && (
                                    <input
                                      type="text"
                                      className="form-control box_cric_input_score mt-1"
                                      disabled={status === 'ongoing' ? false : true}
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
                                disabled={status === 'ongoing' ? false : true}
                                className={`box_cric_btn box_cric_btn_sm ${status !== 'ongoing' ? 'ps_btn_disabled' : ''}`}
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
          </table >
        </div >
      </div >
    )
  }

  if (loading || !matchInfo || !team1Data || !team2Data) {
    return <PageLoader />
  }

  const renderMatchStatus = (status) => {
    let statusClass;
    let statustext;

    switch (status) {
      case "completed":
        statusClass = 'ps-complete-bg';
        statustext = 'Completed';
        break;
      case "ongoing":
        statusClass = 'ps-process-bg';
        statustext = 'Ongoing';
        break;
      case 'cancel':
        statusClass = 'ps-cancel-bg';
        statustext = 'Canceled';
        break;
      default:
        statusClass = 'status-unknown';
        statustext = 'Unknown';
    }

    return (<>
      {/* <div className='ps_match_status_box'>
        <span className={`ps_match_status_bg ${statusClass}`}>{statustext}</span>
      </div> */}

      <div className='ps_defalt_drop'>
        <select className={`ps_match_status_box ${statusClass}`} value={status} onChange={handleChange} >
          <option className='ps_match_status_box_select' value="completed">Complete</option>
          <option className='ps_match_status_box_select' value="ongoing">Ongoing</option>
          <option className='ps_match_status_box_select' value="cancel">Cancel</option>
        </select>
      </div>

    </>


    );
  };

  const handleChange = async (event) => {
    let value = event.target.value;

    try {
      setLoading(true);
      let token = localStorage.getItem('authToken');
      let matchId = localStorage.getItem('matchId');

      let responce = await axios.put(`${DEV_API}/api/chnageStatus`, { matchId, status: value },
        { headers: { 'Authorization': `Bearer ${token}` } });

      if (responce.status === 200) {
        toast.success(responce?.data?.message);
        console.log("praveen", responce.data);
        setStatus(value);
        setLoading(false);
        // navigate('/');
      } else {
        toast.error(responce?.data?.message);
      }

    } catch (error) {
      console.log(error);
      return
    }


  };

  return (
    <>
      {loading ? <PageLoader /> :
        <div className=" container-fluid p-0" style={{ height: "100vh" }}>
          <div id='finalScore' className="bc_finalScore">

            <div className=" box_cric_score_all_btn box_cric_btn_score justify-content-between">

              <div>
                <div className='box_cric_back_btn' onClick={() => navigate('/')}>
                  {svg.app.back_icon} Back
                </div>
              </div>
              <div className='box_cric_score_all_btn m-0'>

                <div style={{ }}>
                  <MicAnnouncer />
                </div>


                <div>

                  <div>
                    {renderMatchStatus(status)}
                  </div>
                </div>
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
                    className="box_cric_btn ps_z99"
                  >
                    {({ loading, url }) => {
                      if (!loading && url) {
                        setLoadingClass('ps_loader_pdf_dl');
                        setTimeout(() => {
                          setShowPDF(false);
                          setLoadingClass('');
                        }, 5000);


                      }
                      return loading ? <div >  <span className=" spinner-border spinner-border-sm mr-3" /> Preparing PDF...</div> : <>  <span>Download Final Match PDF</span></>;
                    }}
                  </PDFDownloadLink>
                )}
                <div className={loadingClass}></div>


                {!showPDF && (
                  <button
                    className="box_cric_btn"
                    onClick={() => setShowPDF(true)}
                  >
                    {svg.app.pdf_download} Create Full Match PDF
                  </button>
                )}
                <button type="submit" className="box_cric_btn" onClick={() => setIsCreateNew(true)} > {svg.app.create} Create New Match</button>
                <Logout />
              </div>
            </div>

            <FinalScore />
          </div>


          <div id='scoreTable' className='bc_score_table' >
            {renderTable(matchInfo.team1, 1, team1Data)}
            {renderTable(matchInfo.team2, 2, team2Data)}
          </div>
        </div>
      }




      <ConfirmationPopup
        shownPopup={isCreateNew}
        closePopup={handleCancelPopup}
        title="Create New Match"
        subTitle="Are you sure you want to create new match?"
        type="User"
        removeAction={createNewMatch}
      />

      <style jsx>{`
  .suggestion-dropdown {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-height: 200px;
    left:8px;
    right:20px;
    max-width:calc(100% - 15px);
    overflow-y: auto;
    width: 100%;
    z-index: 1000;
    margin: 0;
    padding: 8px;
    list-style: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .suggestion-dropdown li {
    padding: 4px 10px;
    cursor: pointer;
    font-size: 16px;
  }

  .suggestion-dropdown li:hover {
    background-color: #e9ebfa;
    border-radius: 3px;
  }

  .form-control.box_cric_input_filed_name {
    position: relative;
  }
`}</style>
    </>
  )
}

export default ScoreTable

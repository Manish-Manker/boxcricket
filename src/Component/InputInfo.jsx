import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import PageLoader from './common/pageLoader';
import ConfirmationPopup from './common/confirmPopup';
import svg from './common/svg';
import { toast } from 'react-toastify';
import Logout from './common/logout';

const InputInfo = () => {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const [userMatchList, setUserMatchList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    if (!token) {
      navigate('/login');
    }
    if(token && user && JSON.parse(user).role === 'admin') {
      navigate('/admin/users');
    }

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
          toast.success("Successfully logged out");
          navigate('/login');
      };

  const setUserMatchData = async () => {

    const token = localStorage.getItem('authToken');
    const DEV_API = process.env.REACT_APP_DEV_API;

    try {
      const response = await axios.get(`${DEV_API}/api/userwisematch`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response?.data?.status === 401 || response?.data?.status === 403) {
        console.log("+-+-+-", response);

        // toast.error(response?.data?.message);
        logout();
        navigate('/login');
        return
      }

      if (response.data.status === 200) {
        // toast.success(response?.data?.message);
        setUserMatchList(response.data.data);
        console.log(response.data.data);
      }
    }
    catch (error) {
      console.log(error);
      return
    }
  }

  useEffect(() => {
    setUserMatchData();
    setUser(JSON.parse(localStorage.getItem('userData')));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500)
  }, [])

  useEffect(() => {
    setBtnLoading(false);
  }, []);




  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    totalOvers: '',
    oversPerSkin: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Check for empty values
    if (!formData.team1.trim()) {
      newErrors.team1 = 'Team 1 name is required';
    }
    if (!formData.team2.trim()) {
      newErrors.team2 = 'Team 2 name is required';
    }
    if (!formData.totalOvers) {
      newErrors.totalOvers = 'Total overs is required';
    }
    if (!formData.oversPerSkin) {
      newErrors.oversPerSkin = 'Overs per skin is required';
    }

    // Validate numbers
    if (isNaN(formData.totalOvers) || parseInt(formData.totalOvers) <= 0) {
      newErrors.totalOvers = 'Total overs must be a positive number';
    }
    if (isNaN(formData.oversPerSkin) || parseInt(formData.oversPerSkin) <= 0) {
      newErrors.oversPerSkin = 'Overs per skin must be a positive number';
    }

    // Validate overs and skins compatibility
    if (!newErrors.totalOvers && !newErrors.oversPerSkin) {
      const totalOvers = parseInt(formData.totalOvers);
      const oversPerSkin = parseInt(formData.oversPerSkin);

      if (totalOvers % oversPerSkin !== 0) {
        newErrors.oversPerSkin = `Total overs (${totalOvers}) and overs per skin (${oversPerSkin}) must be a multiple of each other`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setBtnLoading(true);
      try {
        const DEV_API = process.env.REACT_APP_DEV_API;
        const token = localStorage.getItem('authToken');

        const response = await axios.post(`${DEV_API}/api/match`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 401 || response.data.status === 403) {
          toast.error(response?.data?.message);
          navigate('/login');
          return
        }
        toast.success(response?.data?.message);
        const matchId = response.data.data._id;

        // Save matchId to localStorage
        localStorage.setItem('matchId', matchId);
        localStorage.setItem('matchInfo', JSON.stringify(formData));

        // Navigate to score table
        navigate('/scoretable');
      } catch (error) {
        console.error('Error creating match:', error);
        // Handle unauthorized access
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setBtnLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };


  const handleMatchClick = (match) => {
    localStorage.removeItem('currentBall');
    localStorage.removeItem('matchInfo');
    localStorage.removeItem('team1ScoreData');
    localStorage.removeItem('team2ScoreData');

    localStorage.setItem('matchId', match._id);
    let data = {
      team1: match.team1,
      team2: match.team2,
      totalOvers: match.totalOvers,
      oversPerSkin: match.oversPerSkin,
      status: match.status
    }
    localStorage.setItem('matchInfo', JSON.stringify(data));
    navigate('/scoretable');
  }


  const renderMatchStatus = (status) => {
    let statusClass;
    let statustext;

    switch (status) {
      case "completed":
        statusClass = 'ps-complete';
        statustext = 'Completed';
        break;
      case "ongoing":
        statusClass = 'ps-process';
        statustext = 'Ongoing';
        break;
      case 'cancel':
        statusClass = 'ps-cancel';
        statustext = 'Canceled';
        break;
      default:
        statusClass = 'status-unknown';
        statustext = 'Unknown';
    }

    return (
      <div className='ps_match_status_box_list'>
        <span className={` ${statusClass}`}>{statustext}</span>
      </div>
    );
  };


  return (<>
    <div className='boxc_input_box'>

      {loading ? <PageLoader />
        : ''}

      <div className='ps_form_logut_div'>
        <div></div>
        <div>  <Logout /></div>
      </div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className='ps_cricket_box_flex'>
              <div className='boxc_input_box_form'>


                <div className='w-100'>
                  <div className="bc_login_logo">
                    <a href="/#" className="wpa_logo"><img src="./images/logo.svg" alt="logo" /></a>
                  </div>

                  <div className='bc_form_head'>
                    <h3>Hello, {user && user.name}  Welcome to Pixa-Score!</h3>
                    <h4>Create New Match</h4>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Team 1 Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.team1 ? 'is-invalid' : ''}`}
                        placeholder='Enter team 1 name '
                        value={formData.team1}
                        onChange={(e) => handleInputChange('team1', e.target.value)}
                      />
                      {errors.team1 && <div className="invalid-feedback">{errors.team1}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Team 2 Name</label>
                      <input
                        type="text"
                        placeholder='Enter team 2 name '
                        className={`form-control ${errors.team2 ? 'is-invalid' : ''}`}
                        value={formData.team2}
                        onChange={(e) => handleInputChange('team2', e.target.value)}
                      />
                      {errors.team2 && <div className="invalid-feedback">{errors.team2}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Number of Overs</label>
                      <input
                        type="number"
                        placeholder='Enter No. of overs '
                        className={`form-control ${errors.totalOvers ? 'is-invalid' : ''}`}
                        value={formData.totalOvers}
                        onChange={(e) => handleInputChange('totalOvers', e.target.value)}
                        min="1"
                      />
                      {errors.totalOvers && <div className="invalid-feedback">{errors.totalOvers}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Overs per Skin</label>
                      <input
                        type="number"
                        placeholder='Enter overs  per skin'
                        className={`form-control ${errors.oversPerSkin ? 'is-invalid' : ''}`}
                        value={formData.oversPerSkin}
                        onChange={(e) => handleInputChange('oversPerSkin', e.target.value)}
                        min="1"
                      />
                      {errors.oversPerSkin && <div className="invalid-feedback">{errors.oversPerSkin}</div>}
                    </div>
                    <button type="submit" className="box_cric_btn">   {btnLoading ? (
                      <span className="spinner-border spinner-border-sm mr-3" />
                    ) : ("")}  &nbsp; Submit</button>
                    <br></br>

                  </form>
                </div>


              </div>
              {Array.isArray(userMatchList) && userMatchList.length > 0 && (<div className='boxc_input_box_previous'>

                <div className='bc_form_head'>
                  <h3> Previous Matches</h3>
                </div>

                <div className='boxc_input_box_previous_matches'>
                  <ul>
                    {userMatchList.map((match) => (
                      <li className='match-item' onClick={() => handleMatchClick(match)} key={match._id} >
                        <div className="match-details">
                          <div className="team-name"><h5><span>T1</span> {match.team1}</h5></div>
                          <div className="team-name"><h5><span>T2</span>{match.team2}</h5></div>
                        </div>
                        <div className="ps_match_status">
                          <h5> {new Date(match.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</h5>
                          {renderMatchStatus(match.status)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>

   
  </>

  )
}

export default InputInfo
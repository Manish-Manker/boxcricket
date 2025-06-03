import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import PageLoader from './common/pageLoader';

const InputInfo = () => {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const [userMatchList, setUserMatchList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, []);

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
      if (response.data.status === 401 || response.data.status === 403) {
        navigate('/login');
        return
      }

      if (response.data.status === 200) {
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
          navigate('/login');
          return
        }

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
      oversPerSkin: match.oversPerSkin
    }
    localStorage.setItem('matchInfo', JSON.stringify(data));
    navigate('/scoretable');
  }

  return (
    <div className='boxc_input_box'>

      {loading ? <PageLoader />
        : ''}

      <div className='ps_form_logut_div'>
        <div></div>
        <div> <button type="submit" className="box_cric_btn box_cric_btn_logout" onClick={logout} > <svg width="18px" height="18px" fill='#fff' viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="icon">
          <path d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 0 1-112.7 75.9A352.8 352.8 0 0 1 512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 0 1-112.7-75.9 353.28 353.28 0 0 1-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6z" />
        </svg>  &nbsp; Log Out</button></div>
      </div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className='boxc_input_box_form'>


              <div className='w-100'>
                <div className="bc_login_logo">
                  <a href="/#" className="wpa_logo"><img src="./images/logo.svg" alt="logo" /></a>
                </div>

                <div className='bc_form_head'>
                  <h3>Hello, {user && user.name}  Welcome to Pixa-Score!</h3>
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

            <div>
              Previous Matches
              <ul>
                {userMatchList.map((match) => (
                  <li onClick={() => handleMatchClick(match)} key={match._id}>
                    {match.team1} vs {match.team2} on {new Date(match.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')
                    }
                  </li>
                ))}
              </ul>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default InputInfo
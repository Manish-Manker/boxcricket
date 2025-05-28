import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';

const InputInfo = () => {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

   useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData')));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500)
  }, [])

  

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
      try {
        const DEV_API = process.env.REACT_APP_DEV_API;
        const token = localStorage.getItem('authToken');
        
        const response = await axios.post(`${DEV_API}/api/match`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
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

  return (
    <div className='boxc_input_box'>

      {loading ? <div className='bc_loader_box'>
        <div className='bc_loader_box_div'>
          <div className="card-content">
            <div className="loader-1">
              <div className="pulse-container">
                <div className="pulse-circle"></div>
                <div className="pulse-circle"></div>
                <div className="pulse-circle"></div>
              </div>
            </div>
          </div>
          <img alt='' src='./images/logo.svg'></img>
          <h6>Pixa-Score created by PixelNX-FZCO</h6>
        </div>

      </div>
        : ''}
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
                  <button type="submit" className="box_cric_btn">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputInfo
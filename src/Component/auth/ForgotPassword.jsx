import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../common/pageLoader';


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});
  const DEV_API = process.env.REACT_APP_DEV_API;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const validateForm = () => {
    const newErrors = {};
   
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // const response = await axios.post(`${DEV_API}/api/signup`, formData);
        // if (response.data.status === 201) {
        //   navigate('/login');
        // }
      } catch (error) {
        console.error('Error signing up:', error);
        setErrors({
          submit: error.response?.data?.message || 'An error occurred during signup'
        });
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <div className='boxc_input_box'>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className='boxc_input_box_form'>
                <div className='w-100'>
                  <div className="bc_login_logo">
                    <a href="/" className="wpa_logo">
                      <img src="./images/logo.svg" alt="logo" />
                    </a>
                  </div>
                  <div className='bc_form_head'>
                    <h3>Forgot Your Account Password?</h3>
                  </div>

                  <form onSubmit={handleSubmit}>
                    

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder='Enter your email'
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    {errors.submit && (
                      <div className="alert alert-danger" role="alert">
                        {errors.submit}
                      </div>
                    )}

                    <button type="submit" disabled={true} className={`box_cric_btn ${true ? 'ps_btn_disabled' : ''}`} >Sign Up</button>

                    <div className="mt-4 text-center">
                      <p>OTP has been send to this email</p>
                      <p className='mb-0'>Back to <a href="/login" className="ps_sign_link">Login </a></p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
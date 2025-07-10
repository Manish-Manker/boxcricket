import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from './common/pageLoader';
import { toast } from 'react-toastify';
import svg from './common/svg';

const Login = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const DEV_API = process.env.REACT_APP_DEV_API;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');

    if (token && user && JSON.parse(user).role === 'admin') {
      navigate('/admin/users');
    }
    else if (token) {
      navigate('/input');
    }
  }, []);

  useEffect(() => {
    setBtnLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setBtnLoading(true);
      try {
        const response = await axios.post(`${DEV_API}/api/login`, formData);

        if (response.data.status === 200) {
          toast.success(response?.data?.message);
          // Store the token
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data.user));

          // Set default authorization header for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

          console.log(response.data.user);

          // Redirect to main page after successful login
          if (response.data.user.role === 'admin') {
            navigate('/admin/users');
          } else {
            navigate('/input');
          }
        }
      } catch (error) {
        console.error('Error logging in:', error);
        setErrors({
          submit: error.response?.data?.message || 'Invalid email or password'
        });
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

  return (
    <div className='boxc_input_box'>
      {loading ? (
        <PageLoader />
      ) : (

        <div className="container mt-5">
          <button onClick={() => navigate('/')} >Back To Home</button>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className='boxc_input_box_form'>
                <div className='w-100'>
                  <div className="bc_login_logo">
                    <a href="/#" className="wpa_logo">
                      <img src="./images/logo.svg" alt="logo" />
                    </a>
                  </div>
                  <div className='bc_form_head'>
                    <h3>Welcome Back to Pixa-Score!</h3>
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

                    <div className="mb-3 ps_position_relative">
                      <label className="form-label">Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder='Enter your password'
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />

                      <span
                        onClick={() => setShowPassword(!showPassword)} // Toggle password visibility on click
                        style={{ cursor: 'pointer', position: 'absolute', right: '20px', bottom: '20%' }}
                      >
                        {showPassword ? (
                          svg.app.open_eye_icon
                        ) : (
                          svg.app.close_eye_icon
                        )}
                      </span>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    {errors.submit && (
                      <div className="alert alert-danger" role="alert">
                        {errors.submit}
                      </div>
                    )}

                    <button type="submit" className="box_cric_btn" disabled={btnLoading}>
                      {btnLoading ? (
                        <span className="spinner-border spinner-border-sm mr-3" />
                      ) : ("")}
                      &nbsp; Login
                    </button>

                    <div className="mt-4 text-center">
                      <p>Don't have an account? <a href="/signup" className="ps_sign_link">Sign up here</a></p>
                    </div>
                    <div className="mt-4 text-center">
                      <p><a href="/forgotPassword" className="ps_sign_link">Forgot Password</a></p>
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

export default Login;
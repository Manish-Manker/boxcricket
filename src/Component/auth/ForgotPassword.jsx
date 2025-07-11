import React, { useState, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../common/pageLoader';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const DEV_API = process.env.REACT_APP_DEV_API;

  const [visibelity, setVisibility] = useState(false);

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateEmail(email)) {
      try {
        const response = await axios.post(`${DEV_API}/api/forgotPassword`, { email });
        if (response.data.status === 200) {
          setVisibility(true);
          toast.success(response?.data?.message);
          setTimeout(() => {
            // navigate('/login');
            navigate(`/resetPassword?${response.data.token}`);
          }, 2000);
        }
      } catch (error) {
        console.error('Error signing up:', error);
        setErrors({
          submit: error.response?.data?.message || 'An error occurred'
        });
      }
    } else {
      toast.error('Please enter a valid email address');
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
                    <Link to="/" className="wpa_logo">
                      <img src="./images/logo.svg" alt="logo" />
                    </Link>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    {errors.submit && (
                      <div className="alert alert-danger" role="alert">
                        {errors.submit}
                      </div>
                    )}

                    <button type="submit" className={`box_cric_btn`} >Submit</button>

                    <div className="mt-4 text-center">
                      {visibelity && <p>Reset Link has been send to this email</p>}
                      <p className='mb-0'>Back to <Link to="/login" className="ps_sign_link">Login </Link></p>
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
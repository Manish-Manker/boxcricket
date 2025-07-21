import React, { useState, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../common/pageLoader';
import svg from '../common/svg';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCfmPassword, setShowCfmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [cfmPassword, setCfmPassword] = useState('');
    const [errors, setErrors] = useState({});
     const [btnLoading, setBtnLoading] = useState(false);
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
    }, 800);
  }, []);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    useEffect(() => {
        setErrors({});
    },[password, cfmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password != cfmPassword) {
            setErrors({ cfmPassword: 'Passwords is not matching with Confirm Password' });
            return
        }

        if (validatePassword(password)) {
              setBtnLoading(true);
            try {
                const response = await axios.post(`${DEV_API}/api/resetPassword`, { password, token: window.location.search.split('?')[1] });
                if (response.data.status === 200) {
                    toast.success(response?.data?.message || 'Password reset successfully');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } catch (error) {
                console.error('Error signing up:', error);
                setErrors({
                    submit: error.response?.data?.message || 'An error occurred during signup'
                });
            }
        }
        else {
              setBtnLoading(false);
            setErrors({ password: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
            return
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
                                        <h3>Reset Your Account Password?</h3>
                                    </div>

                                    <form onSubmit={handleSubmit}>


                                        <div className="mb-3 ps_position_relative">
                                            <label className="form-label">New Password</label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder='Enter your password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />

                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ cursor: 'pointer', position: 'absolute', right: '30px', top: '48px' }}
                                            >
                                                {showPassword ? (
                                                    svg.app.open_eye_icon
                                                ) : (
                                                    svg.app.close_eye_icon
                                                )}
                                            </span>
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        </div>

                                        <div className="mb-3 ps_position_relative">
                                            <label className="form-label">Confirm Password</label>
                                            <input
                                                type={showCfmPassword ? 'text' : 'password'}
                                                className={`form-control ${errors.cfmPassword ? 'is-invalid' : ''}`}
                                                placeholder='Enter your confirm password'
                                                value={cfmPassword}
                                                onChange={(e) => setCfmPassword(e.target.value)}
                                            />

                                            <span
                                                onClick={() => setShowCfmPassword(!showCfmPassword)}
                                                style={{ cursor: 'pointer', position: 'absolute', right: '30px', top: '48px' }}
                                            >
                                                {showCfmPassword ? (
                                                    svg.app.open_eye_icon
                                                ) : (
                                                    svg.app.close_eye_icon
                                                )}
                                            </span>
                                            {errors.cfmPassword && <div className="invalid-feedback">{errors.cfmPassword}</div>}
                                        </div>


                                        {errors.submit && (
                                            <div className="alert alert-danger" role="alert">
                                                {errors.submit}
                                            </div>
                                        )}

                                        <button type="submit" className={`box_cric_btn `} > {btnLoading ? (
                        <span className="spinner-border spinner-border-sm mr-3" />
                      ) : ("")} Submit</button>

                                        <div className="mt-4 text-center">

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

export default ResetPassword;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../Component/common/pageLoader';
import svg from '../Component/common/svg';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCfmPassword, setShowCfmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [cfmPassword, setCfmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const DEV_API = process.env.REACT_APP_DEV_API;


    const logout = async () => {
        let token = localStorage.getItem('authToken');
        let userData = localStorage.getItem('userData');
        const DEV_API = process.env.REACT_APP_DEV_API;

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

        try {
            let response = await axios.post(`${DEV_API}/api/logOut`,
                { userId: JSON.parse(userData)?.id },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response?.data?.status === 200) {
                toast.success(response?.data?.message);
            }
        } catch (error) {
            console.log("error", error);
        }
        finally {
            navigate('/login');
        }
    };


    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password != cfmPassword) {
            setErrors({ cfmPassword: 'Passwords is not matching with Confirm Password' });
            return
        }

        if (validatePassword(password)) {
            try {
                const response = await axios.post(`${DEV_API}/api/changePassword`, { password }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.status === 401 || response.data.status === 403) {
                    toast.error(response?.data?.message);
                    navigate('/login');
                    return
                }
                if (response.data.status === 200) {
                    toast.success(response?.data?.message || 'Password changed successfully');

                    setTimeout(() => {
                        logout();
                        navigate('/login');
                    }, 1000);
                }
            } catch (error) {
                console.error('Error signing up:', error);
                setErrors({
                    submit: error.response?.data?.message || 'An error occurred during signup'
                });
            }
        }
        else {
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
                                        <h3>Change Your Account Password?</h3>
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

                                        <button type="submit" className={`box_cric_btn `} >Submit</button>

                                        <div className="mt-4 text-center">

                                            <p className='mb-0'>Back to <Link to="/" className="ps_sign_link">Home </Link></p>
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

export default ChangePassword;
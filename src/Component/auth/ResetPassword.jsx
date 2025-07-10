import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../common/pageLoader';
import svg from '../common/svg';


const ResetPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCfmPassword, setShowCfmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        cpassword: '',
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

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }


        if (!formData.cpassword) {
            newErrors.cpassword = 'Confirm Password is required';
        }

        if (formData.password && formData.cpassword && formData.password !== formData.cpassword) {
            newErrors.cpassword = 'Confirm Password does not match Password';
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
                                        <h3>Reset Your Account Password?</h3>
                                    </div>

                                    <form onSubmit={handleSubmit}>


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

                                        <div className="mb-3 ps_position_relative">
                                            <label className="form-label">Confirm Password</label>
                                            <input
                                                type={showCfmPassword ? 'text' : 'password'}
                                                 className={`form-control ${errors.cpassword ? 'is-invalid' : ''}`}
                                                placeholder='Enter your confirm password'
                                               value={formData.cpassword}
                                                onChange={(e) => setFormData({ ...formData, cpassword: e.target.value })}
                                            />

                                            <span
                                                onClick={() => setShowCfmPassword(!showCfmPassword)} // Toggle password visibility on click
                                                style={{ cursor: 'pointer', position: 'absolute', right: '20px', bottom: '20%' }}
                                            >
                                                {showCfmPassword ? (
                                                    svg.app.open_eye_icon
                                                ) : (
                                                    svg.app.close_eye_icon
                                                )}
                                            </span>
                                             {errors.cpassword && <div className="invalid-feedback">{errors.cpassword}</div>}
                                        </div>

                                        
                                        {errors.submit && (
                                            <div className="alert alert-danger" role="alert">
                                                {errors.submit}
                                            </div>
                                        )}

                                        <button type="submit" disabled={true} className={`box_cric_btn ${true ? 'ps_btn_disabled' : ''}`} >Submit</button>

                                        <div className="mt-4 text-center">
                                            
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

export default ResetPassword;
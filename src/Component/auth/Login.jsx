import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../common/pageLoader';
import { toast } from 'react-toastify';
import svg from '../common/svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';


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
    }, 800);
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
    // <div className='boxc_input_box'>
    //   {loading ? (
    //     <PageLoader />
    //   ) : (

    //     <div className="container mt-5">

    //       <div className="row justify-content-center">
    //         <div className="col-md-12">
    //           <div className='boxc_input_box_form'>
    //             <div className='w-100'>
    //               <div className="bc_login_logo">
    //                 <Link to="/" className="wpa_logo">
    //                   <img src="./images/logo/DarkLogo.svg" alt="logo" />
    //                 </Link>
    //               </div>
    //               <div className='bc_form_head'>
    //                 <h3>Welcome Back to Pixa-Score!</h3>
    //               </div>

    //               <form onSubmit={handleSubmit}>
    //                 <div className="mb-3">
    //                   <label className="form-label">Email</label>
    //                   <input
    //                     type="email"
    //                     className={`form-control ${errors.email ? 'is-invalid' : ''}`}
    //                     placeholder='Enter your email'
    //                     value={formData.email}
    //                     onChange={(e) => handleInputChange('email', e.target.value)}
    //                   />
    //                   {errors.email && <div className="invalid-feedback">{errors.email}</div>}
    //                 </div>

    //                 <div className="mb-3 ps_position_relative">
    //                   <label className="form-label">Password</label>
    //                   <input
    //                     type={showPassword ? 'text' : 'password'}
    //                     className={`form-control ${errors.password ? 'is-invalid' : ''}`}
    //                     placeholder='Enter your password'
    //                     value={formData.password}
    //                     onChange={(e) => handleInputChange('password', e.target.value)}
    //                   />

    //                   <span
    //                     onClick={() => setShowPassword(!showPassword)} // Toggle password visibility on click
    //                     style={{ cursor: 'pointer', position: 'absolute', right: '20px', bottom: '20%' }}
    //                   >
    //                     {showPassword ? (
    //                       svg.app.open_eye_icon
    //                     ) : (
    //                       svg.app.close_eye_icon
    //                     )}
    //                   </span>
    //                   {errors.password && <div className="invalid-feedback">{errors.password}</div>}
    //                 </div>

    //                 {errors.submit && (
    //                   <div className="alert alert-danger" role="alert">
    //                     {errors.submit}
    //                   </div>
    //                 )}


    //                 <button type="submit" className="box_cric_btn" disabled={btnLoading}>
    //                   {btnLoading ? (
    //                     <span className="spinner-border spinner-border-sm mr-3" />
    //                   ) : ("")}
    //                   &nbsp; Login
    //                 </button>

    //                 <div className="d-flex justify-content-between mt-4 ">
    //                   <Link to="/" >Back To <span className="ps_sign_link">Home</span></Link>
    //                   <p><Link to="/forgotPassword" className="ps_sign_link">Forgot Password</Link></p>
    //                 </div>
    //                 <Link to="/signup" >Don't have an account?  <span className="ps_sign_link">Sign Up</span></Link>
    //                 <div className="mt-4 text-center">

    //                 </div>
    //               </form>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>


    <div className='boxc_input_box ps_auth_white_bg'>
      {loading ? (
        <PageLoader />
      ) : (
        <div className='ps_box_signup_css'>
          <div className="container pt-4">

            <div className='ps_logo_bb1'>
              <div className="bc_login_logo mb-4">
                <a href="/" className="wpa_logo">
                  <img src="./images/logo/DarkLogo.svg" alt="logo" />
                </a>
              </div>
            </div>
            <div className="row justify-content-center align-items-start">

              <div className="col-md-4 ">
                <div className='bc_form_head ps_login_auth_title'>
                  <h3>Login</h3>
                  <p className="text-muted">Welcome Back to Pixa-Score!</p>
                </div>

                <div className='boxc_input_box_form ps_login_auth_border' >
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
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

                    <div className="mb-2 ps_position_relative">
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
                        style={{ cursor: 'pointer', position: 'absolute', right: '20px', top: '50%' }}
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
                    <button type="submit" className="box_cric_btn mt-4" disabled={btnLoading}>
                      {btnLoading ? (
                        <span className="spinner-border spinner-border-sm mr-3" />
                      ) : ("")}
                      &nbsp; Login
                    </button>

                    <div className="d-flex justify-content-center mt-4 ">
                      <p><Link to="/forgotPassword" className="ps_sign_link">Forgot Password</Link></p>
                    </div>
                  </form>
                </div>

                <div className="mt-4 text-center">
                  <p className='ps_sign_link_fade mb-3'>Don't have an account? <Link to="/signup" className="ps_sign_link">Sign Up</Link></p>
                </div>
                {/* <div className="d-flex justify-content-center mt-4 ">
                <Link to="/signup" >Don't have an account?  <span className="ps_sign_link">Sign Up</span></Link>
              </div> */}

              </div>



            </div>

            <div className="text-center mt-5 mb-4">
              <div className='ps_section-title'><p >Here are the brands who trust on us</p></div>
              <div className="ps_section_brand">
                <Swiper
                  slidesPerView={6}
                  spaceBetween={0}
                  loop={true}
                  speed={4000}
                  autoplay={true}
                  breakpoints={{
                    340: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 6,
                    },
                  }}
                  modules={[Autoplay]}
                  className="mySwiper"
                >
                  {[
                    ['gravin', './images/gravin.png'],
                    ['gravinPRO', './images/gravinPRO.png'],
                    ['khuber', './images/khuber.png'],
                    ['SevenHeavenFinal', './images/SevenHeavenFinal.png'],
                    ['storyWala', './images/storyWala.png'],
                    ['THINKCLOUD', './images/THINKCLOUD.png'],
                    ['Ninth_Cloud', './images/Ninth_Cloud.png'],
                    ['pixelnx', './images/pixelnx.png'],
                  ].map(([alt, src], idx) => (
                    <SwiperSlide>
                      <img key={idx} src={src} alt={alt} style={{ maxHeight: '80px', opacity: 0.9 }} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Footer */}
            <footer className="ps_site_footer">
              <p> Copyright © 2025.  Made with ❤️ by <Link to="https://pixelnx.ae">PixelNX</Link>  </p>
              <div className='d-flex align-items-center gap-5 '>
                <Link to="/" className="ms-1">Privacy Policy</Link>
                <Link to="/" className="ms-1">Terms</Link>
              </div>

            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
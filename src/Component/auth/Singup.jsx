import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../common/pageLoader';
import svg from '../common/svg';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';


const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const DEV_API = process.env.REACT_APP_DEV_API;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/input');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Check for empty values
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(formData.password);

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character and must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(`${DEV_API}/api/signup`, formData);
        if (response.data.status === 201) {
          // Redirect to login page after successful signup
          toast.success(response?.data?.message);
          setTimeout(() => {
            // navigate('/login');          
            navigate('/verifyemail?' + response.data.token);
          }, 1500);
        }
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
    //                 <a href="/" className="wpa_logo">
    //                   <img src="./images/logo.svg" alt="logo" />
    //                 </a>
    //               </div>
    //               <div className='bc_form_head'>
    //                 <h3>Create your Pixa-Score Account</h3>
    //               </div>

    //               <form onSubmit={handleSubmit}>
    //                 <div className="mb-3">
    //                   <label className="form-label">Name</label>
    //                   <input
    //                     type="text"
    //                     className={`form-control ${errors.name ? 'is-invalid' : ''}`}
    //                     placeholder='Enter your name'
    //                     value={formData.name}
    //                     onChange={(e) => handleInputChange('name', e.target.value)}
    //                   />
    //                   {errors.name && <div className="invalid-feedback">{errors.name}</div>}
    //                 </div>

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

    //                 <button type="submit" className={`box_cric_btn `} >Sign Up</button>


    //                 <div className="mt-4 text-center">
    //                   {/* <h5 className='ps_sign_link_fade mb-3'>Sign up is Coming Soon </h5> */}
    //                   <p className='ps_sign_link_fade mb-3'>Already have an account? <Link to="/login" className="ps_sign_link">Login here</Link></p>
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

            <div className="col-md-4 mb-5">
              <div className='bc_form_head'>
                <h3>Get Started for Free</h3>
                <p className="text-muted">No credit card required.</p>
              </div>

              <div className='boxc_input_box_form'>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder='Name'
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder='Email'
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-4 ps_position_relative">
                    <label className="form-label">Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder=' Password'
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', position: 'absolute', right: '20px', top: '52%' }}
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

                  <button type="submit" className={`box_cric_btn `} >Create Account</button>

                  <div className="mt-4 text-center">
                    <p className='ps_sign_link_fade mb-3'>Already have an account? <Link to="/login" className="ps_sign_link">Login here</Link></p>
                  </div>
                </form>
              </div>

            </div>
            <div className='col-md-1'></div>

            <div className="col-md-4">
              {[
                {
                  img: "./images/user1.png",
                  name: "Emily Carter",
                  review: "Fantastic scoring app!",
                  detail: "Pixascore has completely transformed how I track my progress in games. The interface is smooth and engaging!"
                },
                {
                  img: './images/user2.png',
                  name: 'Oliver Smith',
                  review: 'Super intuitive!',
                  detail: 'I love how easy it is to use Pixascore. Its made scoring my games a breeze and more fun!',
                },
                {
                  img: './images/user3.png',
                  name: 'Ava Johnson',
                  review: 'Best scoring app out there!',
                  detail: 'With Pixascore, I can easily keep track of scores and stats. It’s a must-have for any gamer!',
                },

              ].map((item, idx) => (
                <div className="mb-4" key={idx}>
                  <div className='ps_testimonial_header'>
                    <div className='ps_testimonial_user_img'><img src={item.img} alt="user-avatar" /></div>
                    <div className="ps_tm_user_details">
                      <h6>
                        {item.name}<span className="user_icon"><img src="./images/shield.png" alt="shield-icn" /></span>
                      </h6>
                      <img className="reting_thumb" src="./images/5star.png " alt="reting" />
                    </div>
                  </div>

                  <div className="ps_tm_user_msg_wrapper">
                    <h6 className="view_details">“{item.review}”</h6>
                    <p className="user_msg">
                      {item.detail}
                    </p>
                  </div>

                </div>
              ))}
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
    </div>
  );
};

export default Signup;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../common/pageLoader';
import { toast } from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';

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
    }, 800);
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
    //                   <img src="./images/logo.svg" alt="logo" />
    //                 </Link>
    //               </div>

    //               <div className='bc_form_head'>
    //                 <h3>Forgot Your Account Password?</h3>
    //               </div>

    //               <form onSubmit={handleSubmit}>
    //                 <div className="mb-3">
    //                   <label className="form-label">Email</label>
    //                   <input
    //                     type="email"
    //                     className={`form-control ${errors.email ? 'is-invalid' : ''}`}
    //                     placeholder='Enter your email'
    //                     value={email}
    //                     onChange={(e) => setEmail(e.target.value)}
    //                   />
    //                   {errors.email && <div className="invalid-feedback">{errors.email}</div>}
    //                 </div>

    //                 {errors.submit && (
    //                   <div className="alert alert-danger" role="alert">
    //                     {errors.submit}
    //                   </div>
    //                 )}

    //                 <button type="submit" className={`box_cric_btn`} >Submit</button>

    //                 <div className="mt-4 text-center">
    //                   {visibelity && <p>Reset Link has been send to this email</p>}
    //                   <p className='mb-0'>Back to <Link to="/login" className="ps_sign_link">Login </Link></p>
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
                  <h3>Forgot Password</h3>
                  <p className="text-muted">Forgot Your Account Password?</p>
                </div>

                <div className='boxc_input_box_form ps_login_auth_border' >
                  <form onSubmit={handleSubmit}>
                    <div className="mb-5">
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

                <div className="mt-4 text-center">
                  <p className='ps_sign_link_fade mb-3'>Don't have an account? <Link to="/signup" className="ps_sign_link">Sign Up</Link></p>
                  
                </div>
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

export default ForgotPassword;
import React, { useEffect, useRef, useState } from 'react';
import svg from '../common/svg';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Scrollbar } from 'swiper/modules';
import Popup from '../common/Popup';

const testimonials = [
    { name: 'Jessica Barnes', role: 'Assistant Coach, New York Youth Cricket Club', quote: 'PixaScore made our weekend tournaments feel like professional events. The live scoreboard on the big screen was a huge hit with players and spectators.' },
    { name: 'Jason Miller', role: 'Tournament Organizer, California', quote: 'The match PDF summaries are fantastic. Our team now reviews every game in detail — its been great for training and tracking performance.' },
    { name: 'Emily Carter', role: 'Coach, Texas Indoor Cricket Club', quote: 'We’ve tried other scoring tools, but nothing comes close to the simplicity and reliability of PixaScore. Setup takes seconds, and it just works.' },
    { name: 'Michael Thompson', role: 'League Manager, New Jersey', quote: 'Our academy loves the display link feature. Parents in the audience can now follow every ball live. It adds excitement to every match!' },
    { name: 'Sarah Collins', role: 'Youth Coach, Florida Cricket Academy', quote: 'It’s so easy to use, even our junior scorers picked it up in minutes. The live match display adds a real wow factor to every game.”' },
    { name: 'Ryan Walker', role: 'Indoor Cricket League', quote: '“It’s so easy to use, even our junior scorers picked it up in minutes. The live match display adds a real wow factor to every game.' }
];

export default function LandingPage() {
    const [navBlack, setNavBlack] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
     const [addVideoPopup, setAddVideoPopup] = useState(false);

    const whyRef = useRef(null);
    const featuresRef = useRef(null);
    const testimonialsRef = useRef(null);
    const startRef = useRef(null);


    useEffect(() => {
        const handleScroll = () => {
            setNavBlack(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    // const handleToggleSidebar = () => {
    //     setIsSidebarOpen(!isSidebarOpen);
    //     const clsName = "menu_toggle";
    //     if (document.body.classList.contains(clsName)) {
    //         document.body.classList.remove(clsName);
    //     } else {
    //         document.body.classList.add(clsName);
    //     }
    // };

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

     const categoryPopupCloseHandler = () => {
        setAddVideoPopup(false);
    };

    return (
        <>  <div className='landing_page_body'>
            <nav className={`navbar navbar-expand-lg fixed-top py-3 ${navBlack ? 'PS_LP_navbar_light' : 'bg-transparent'} `}>
                <div className="container">
                    <div className="ps_lp_logo">
                        <Link to="/" className="wpa_logo">
                            <img src="./images/logo.svg" alt="logo" />
                        </Link>
                    </div>
                    <button className="toggle_btn" onClick={handleToggleSidebar}>
                        {isSidebarOpen ? svg.app.sidebar_toggle_cross : svg.app.sidebar_toggle}
                    </button>
                    <div className={"ps_lg_nav_tabs" + (isSidebarOpen ? " open" : "")}>
                        <div className='ps_landing_logonone'><Link to="/" className="wpa_logo">
                            <img src="./images/logo.svg" alt="logo" />
                        </Link>
                        </div>

                        <Link to="#" onClick={() => whyRef.current.scrollIntoView({ behavior: 'smooth' })}>Why PixaScore?</Link>
                        <Link to="#" onClick={() => featuresRef.current.scrollIntoView({ behavior: 'smooth' })}>Features</Link>
                        <Link to="#" onClick={() => testimonialsRef.current.scrollIntoView({ behavior: 'smooth' })}>Testimonials</Link>
                        <Link to="#start">Download Sample Report</Link>
                        <Link to="/login" onClick={() => startRef.current.scrollIntoView({ behavior: 'smooth' })}>Get Started</Link>
                        <Link to="/signup" onClick={() => startRef.current.scrollIntoView({ behavior: 'smooth' })}><button className="ps_lp_btn">Try for Free</button> </Link>
                    </div>
                </div>
            </nav>

            <section className="hero-section ">
                <div className="container">
                    <div className='row align_center'>
                        <div className='col-lg-6'>
                            <div className='ps_lp_banner_content'>
                                <h2 >PixaScore – Smart Scorekeeping for Indoor Cricket</h2>
                                <h6>Record. Display. Analyze. All in Real Time.</h6>
                                <p className="lead">Score every ball, generate detailed match PDFs, and broadcast the action live with PixaScore. Live scoring, real-time display, and automatic match stats — all from your phone.</p>
                                <div className="ps_lp_banner_btns">
                                    <Link to="/login" onClick={() => startRef.current.scrollIntoView({ behavior: 'smooth' })}><button className="ps_lp_btn">Book a demo</button> </Link>
                                    <button className="ps_lp_btn ps_lp_btn_dark" onClick={() => setAddVideoPopup((prev) => !prev)}>Watch in action</button>
                                </div>
                            </div>

                        </div>
                        <div className='col-lg-6'>
                            <div className='ps_lp_banner_img'> <img src="./images/LandingPage/banner1.png" alt="banner" /></div>
                        </div>
                    </div>

                </div>
            </section>

            <section ref={whyRef} id='why' className="why-choose-section ps_lb_container_sm">
                <div className="text-center ps_lp_title_box ps_lp_title_box_width">
                    <h2>Why Choose PixaScore?</h2>
                    <p>Everything you need to score, display, and analyze your indoor cricket matches — in one powerful app.</p>
                </div>

                <div className="container">
                    <div className="row g-4 justify-content-center">

                        <div className="col-lg-6 col-md-6">
                            <div className="feature-card active">
                                <div className="icon mb-2">{svg.app.LP_cricket_icon}</div>
                                <div className='ps_lp_title_box'>
                                    <h2>Made for Indoor Cricket</h2>
                                    <p>Purpose-built with rules, pace, and scoring patterns tailored
                                        specifically for indoor cricket matches</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="feature-card ">
                                <div className="icon mb-2">{svg.app.LP_real_time_icon}</div>
                                <div className='ps_lp_title_box'>
                                    <h2>Real-Time Display Integration</h2>
                                    <p>Instantly project live scores, player stats, and ball-by-ball updates to any screen using a unique display link.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="feature-card ">
                                <div className="icon mb-2">{svg.app.LP_gadegets_icon}</div>
                                <div className='ps_lp_title_box'>
                                    <h2>Auto-Generated Professional Match PDFs</h2>
                                    <p>Get comprehensive match reports — including scorecards, player stats, and innings breakdowns — in a shareable PDF.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="feature-card ">
                                <div className="icon mb-2">{svg.app.LP_autoGen_icon}</div>
                                <div className='ps_lp_title_box'>
                                    <h2>Works On Phones, Tablets, And Desktops</h2>
                                    <p>Score and manage matches from any device, with a responsive interface designed for maximum convenience.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="feature-card ">
                                <div className="icon mb-2">{svg.app.installation_icon}</div>
                                <div className='ps_lp_title_box'>
                                    <h2>No Installations Or Complex Setup</h2>
                                    <p>Start scoring right away — just open the app in your browser and you’re match-ready in seconds.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section ref={featuresRef} id='features' className="score-pro-section ps_lb_container_sm ps_lp_bg_grey">
                <div className="container">

                    <div className='row ps_lp_about_section '>
                        <div className='col-lg-6'>
                            {/* <div className='ps_lp_about_img'> <img src="./images/LandingPage/banner1.png" alt="banner" /></div> */}
                        </div>
                        <div className='col-lg-6'>
                            <div className='ps_lp_title_box'>
                                <h2 className="">Score Matches Like a Pro</h2>
                                <p className="py-3">
                                    Ditch the manual sheets. With PixaScore, you can easily record each ball,
                                    update the score in real time, and track every player’s performance.
                                </p>

                                <ul className="ps_lb_list-unstyled">
                                    <li >
                                        <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                        <span>Log runs, wickets, extras, overs, and player stats in real time</span>
                                    </li>
                                    <li >
                                        <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                        <span> Track striker/non-striker and bowler details</span>
                                    </li>
                                    <li >
                                        <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                        <span>Update match status with a clean, intuitive interface</span>
                                    </li>
                                    <li className="">
                                        <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                        <span>Works smoothly on both desktop and mobile devices</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </section>
            <section id='' className="score-pro-section ps_lb_container_sm">
                <div className="container">

                    <div className='row ps_lp_about_section '>

                        <div className='col-lg-6'>
                            <div className='ps_lp_title_box'>
                                <h2 className="">Display Live Scoreboard Anywhere</h2>
                                <p className="py-3">
                                    PixaScore lets you generate a live match display URL you can plug into TVs, projectors, or LED scoreboards.<br></br>
                                    Spectators, coaches, and players can view:
                                </p>

                                <ul className="ps_lb_list-unstyled">
                                    <li >
                                        <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                        <span>Live scores and overs</span>
                                    </li>
                                    <li >
                                        <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                        <span> Current batsman and bowler details</span>
                                    </li>
                                    <li >
                                        <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                        <span>Ball-by-ball updates</span>
                                    </li>
                                    <li className="">
                                        <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                        <span>Last ball outcome and game summary</span>
                                    </li>
                                </ul>
                                <p className="">No extra hardware needed — just connect and stream the live action</p>
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            {/* <div className='ps_lp_about_img'> <img src="./images/LandingPage/banner1.png" alt="banner" /></div> */}
                        </div>
                    </div>
                </div>
            </section>
            <section className="score-pro-section ps_lb_container_sm ps_lp_bg_grey">
                <div className="container">
                    <div className='row ps_lp_about_section '>
                        <div className='col-lg-6'>
                            {/* <div className='ps_lp_about_img'> <img src="./images/LandingPage/banner1.png" alt="banner" /></div> */}
                        </div>
                        <div className='col-lg-6'>
                            <div className='ps_lp_title_box'>
                                <h2 className="">Generate Match Reports in One Tap</h2>
                                <p className="py-3">
                                    At the end of the match, PixaScore automatically creates a downloadable PDF report filled with detailed stats:
                                </p>

                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <ul className="ps_lb_list-unstyled">
                                            <li >
                                                <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                                <span>Complete scorecard</span>
                                            </li>
                                            <li >
                                                <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                                <span> Fall of wickets</span>
                                            </li>
                                            <li >
                                                <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                                <span> Player performance analysis</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='col-lg-6'>
                                        <ul className="ps_lb_list-unstyled">
                                            <li >
                                                <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                                <span>Over-by-over breakdown</span>
                                            </li>
                                            <li >
                                                <span className="check-icon me-2">{svg.app.LP_list_check}</span>
                                                <span> Summary of innings</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <p>Perfect for sharing with teams, storing match history, or posting on social media.</p>
                            </div>
                        </div>

                    </div>

                </div>
            </section>


             <section className="pricing-section">
                <div className="text-center ps_lp_title_box ps_lp_title_box_width">
                    <h2>Plan And Pricing</h2>
                    <p>What Coaches, Organizers &amp; Players Are Saying About PixaScore</p>
                </div>
                <div className='row'>
                    <div className='col-md-12 d-flex gap-5 justify-content-center'>
                        <div className="auth_plan_container_box">
                            <span aria-label="SGOne" className=""><h4>Basic Plan</h4></span>
                            <div className="auth_plan_price_box">
                                <h5>$9.99<span> / Month</span></h5>
                            </div>
                            <div className="auth_plan_h4 bb1">
                                <p className="mb-2">Payment Type :Recurring </p>
                            </div>
                            <div className="auth_plan_h4 pb-0">
                                <ul className="ps_lb_list-unstyled ps_lb_price_box pb-1">
                                    <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><span>Account Aggregation</span></li>
                                    <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><span>Preority Support</span></li>
                                    <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><span>Expence Tracking</span></li>
                                </ul>
                            </div>
                            <button className="ps_lp_btn" style={{ margin: "auto", width: "100%" }}>Buy Now</button>
                        </div>
                   
                        <div className="auth_plan_container_box">
                            <span aria-label="SGOne" className=""><h4>Basic Plan</h4></span>
                            <div className="auth_plan_price_box">
                                <h5>$19.99<span> / Month</span></h5>
                            </div>
                            <div className="auth_plan_h4 bb1">
                                <p className="mb-2">Payment Type :Recurring </p>
                            </div>
                            <div className="auth_plan_h4 pb-0">
                                <ul className="ps_lb_list-unstyled ps_lb_price_box pb-1">
                                    <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><span>Account Aggregation</span></li>
                                    <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><span>Preority Support</span></li>
                                    <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><span>Expence Tracking</span></li>
                                </ul>
                            </div>
                            <button className="ps_lp_btn" style={{ margin: "auto", width: "100%" }}>Buy Now</button>
                        </div>
                    </div>
                   
                </div>

            </section>

            <section ref={testimonialsRef} id="testimonials" className="testimonials-section ">
                <div className="container-fluid">
                    <div className="text-center ps_lp_title_box ps_lp_title_box_width">
                        <h2>Hear from Our Users</h2>
                        <p>What Coaches, Organizers & Players Are Saying About PixaScore</p>
                    </div>
                    <div className="">
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={30}
                            freeMode={true}
                            loop={true}
                            speed={10000}
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                340: {
                                    slidesPerView: 1,
                                },
                                768: {
                                    slidesPerView: 1,
                                },
                                1024: {
                                    slidesPerView: 2,
                                },
                            }}
                            centeredSlides={true}
                            modules={[Autoplay, FreeMode]}
                            className="mySwiper"
                        >
                            {testimonials.slice(0, 6).map((t, i) => (
                                <SwiperSlide>
                                    <div key={i} className="testimonial-card">
                                        <h2>{t.name}</h2>
                                        <h6 >{t.role}</h6>
                                        <div>{svg.app.multi_stars_icon} </div>
                                        <p>{t.quote}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="">
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={30}
                            freeMode={true}
                            loop={true}
                            speed={10000}
                            dir="rtl"
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                340: {
                                    slidesPerView: 1,
                                },
                                768: {
                                    slidesPerView: 1,
                                },
                                1024: {
                                    slidesPerView: 2,
                                },
                            }}
                            scrollbar={{
                                hide: true,
                            }}
                            centeredSlides={true}

                            modules={[Autoplay, FreeMode, Scrollbar]}
                            className="mySwiper"
                        >
                            {testimonials.slice(0, 6).map((t, i) => (
                                <SwiperSlide>
                                    <div key={i} className="testimonial-card sylb_text_end">
                                        <h2>{t.name}</h2>
                                        <h6 >{t.role}</h6>
                                        <div>{svg.app.multi_stars_icon} </div>
                                        <p>{t.quote}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            <section ref={startRef} id='start' className="text-center ps_lb_container_sm ps_lp_bg_grey">
                <div className="container">
                    <div className='row ps_lp_about_section ps_lp_letterbox'>
                        <h2 className="fw-bold">Get Started</h2>
                        <h6>Record. Display. Analyze. All in Real Time.</h6>
                        <p className="lead">Ready to take your indoor cricket matches to the next level? <br></br>Score every ball, generate detailed match PDFs, and broadcast the action live with PixaScore.</p>
                        <div className="ps_lp_banner_btns justify-content-center">
                            <Link to="/signup" onClick={() => startRef.current.scrollIntoView({ behavior: 'smooth' })}><button className="ps_lp_btn">Try for Free</button> </Link>
                            <button className="ps_lp_btn ps_lp_btn_dark">Watch in action</button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="ps_lb_container_sm ps_lb_footer">
                <div className="container">
                    <div className='row'>
                        <div className='col-md-6 order-md-1 order-2 '>
                            <h6> Copyrights 2025. All Rights Reserved.</h6>
                        </div>
                        <div className='col-md-6 order-md-2 order-1 mb-md-0 mb-4'>
                            <h6> <Link to="/" >Privacy Policy </Link> <span className='px-4'>| </span> <Link to="/">Terms & Conditions</Link></h6>
                        </div>
                    </div>

                </div>
            </footer>

        </div>

          <Popup
                heading="Video"
                show={addVideoPopup}
                onClose={categoryPopupCloseHandler}
                 maxWidth={"970px"}
            >
                <div>
                    <iframe
                        width="100%"
                            height="500"
                        src="https://www.youtube.com/embed/YOUR_VIDEO_URL"
                        title="Sample Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </Popup>
        </>
    );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckoutButton from './CheckoutButton';
import axios from 'axios';
import { toast } from 'react-toastify';
const DEV_API = process.env.REACT_APP_DEV_API;


const SubscriptionPlan = () => {

    const [activePlan, setActivePlan] = useState('');
    const navigate = useNavigate();

    const getActivePlan = async () => {
        try {
            const response = await axios.get(`${DEV_API}/api/active_plan`, {
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
                console.log('Active Plan:', response.data.activePlan);

                setActivePlan(response.data.activePlan);
            }
        } catch (error) {
            console.error('Error signing up:', error);

        }
    }

    useEffect(() => {
        getActivePlan();
    }, []);

    return (
        <div className='ps_setting_'>
            <div className='w-100'>
                <div className='bc_form_head'>
                    <h3 className='text-start'>Subscription Plan</h3>
                </div>
                <div className='row'>

                    <div className='col-md-6'>
                        <div className={activePlan !== "Pro Plan" ? 'ps_setting_active_plan':'ps_setting_more_plan'}  >
                            <h3> {activePlan == "Pro Plan" ? "" : <spam>Active Plan</spam>} </h3>
                            <div className='ps_lp_price_flex_box'>
                                <div className="pricing-card basic ps_lp_right">
                                    <h5 className="plan-title">Basic Plan</h5>
                                    <div className="price">
                                        <span className="amount">$9.99</span><span className="duration">/month</span>
                                    </div>
                                    <h6 className="features-title">Features Like</h6>
                                    <ul className="features-list">
                                        <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span>live score board</span></li>
                                        <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span>PDF</span></li>
                                        <li className='ps_lp_disabled_list'><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" strokeWidth="1.25" strokeLinecap="round" stroke-linejoin="round"></path></svg></span><span>upload own logo</span></li>
                                        <li className='ps_lp_disabled_list'><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" strokeWidth="1.25" strokeLinecap="round" stroke-linejoin="round"></path></svg></span><span>upload sponsor's log</span></li>
                                    </ul>
                                    {/* <CheckoutButton planeName={'Basic'} btnTheame={"dark"} /> */}
                                    {activePlan == "Pro Plan" ? <CheckoutButton planeName={"Basic Plan"} btnTheame={"light"} /> : ""} 
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className={activePlan == "Pro Plan" ? 'ps_setting_active_plan':'ps_setting_more_plan'}>
                            <h3>{activePlan == "Pro Plan" ? <spam>Active Plan</spam> : ""}</h3>
                            <div className='ps_lp_price_flex_box'>
                                <div className="pricing-card basic">
                                    <h5 className="plan-title text-orange">Premium Plan</h5>
                                    <div className="price text-orange">
                                        <span className="amount">$19.99</span><span className="duration">/month</span>
                                    </div>
                                    <h6 className="features-title">Features Like</h6>
                                    <ul className="features-list">
                                        <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" strokeWidth="1.25" strokeLinecap="round" stroke-linejoin="round"></path></svg></span><span>live score board</span></li>
                                        <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" strokeWidth="1.25" strokeLinecap="round" stroke-linejoin="round"></path></svg></span><span>PDF</span></li>
                                        <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" strokeWidth="1.25" strokeLinecap="round" stroke-linejoin="round"></path></svg></span><span>upload own logo</span></li>
                                        <li><span className="check-icon me-2"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="15" height="15" rx="7.5" fill="#14B082"></rect><path d="M10.8334 5.25L6.25002 9.75L4.16669 7.70455" stroke="white" strokeWidth="1.25" strokeLinecap="round" stroke-linejoin="round"></path></svg></span><span>upload sponsor's log</span></li>
                                    </ul>
                                     {activePlan !== "Pro Plan" ? <CheckoutButton planeName={"Pro Plan"} btnTheame={"light"} /> : ""} 
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default SubscriptionPlan;
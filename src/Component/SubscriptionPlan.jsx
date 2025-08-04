import React, { useState, useEffect, use } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import CheckoutButton from './CheckoutButton';
import svg from './common/svg';




const SubscriptionPlan = ({activeP}) => {

    const [activePlan, setActivePlan] = useState(activeP);

    useEffect(() => {
        setActivePlan(activeP);
    }, [activeP]);
    
    

    return (
        <div className='ps_setting_'>
            <div className='w-100'>
                <div className='bc_form_head'>
                    <h3 className='text-start'>Subscription Plan</h3>
                </div>
                <div className='row'>
                    <div className='col-md-9 m-auto'>
                        <div className='ps_flex_subsciption_plan'>
                            <div className={activePlan === "Pro Plan" && 'ps_setting_more_plan' || activePlan === 'Basic Plan' && 'ps_setting_active_plan' || activePlan === null && 'ps_setting_more_plan'}  >
                                {activePlan === "Pro Plan" && <h3>Other Plans</h3> || activePlan === "Basic Plan" && <h3>Active Plan</h3> || activePlan === null && <h3></h3>}

                                <div className='ps_lp_price_flex_box'>
                                    <div className="pricing-card basic ">
                                        <h5 className="plan-title">Basic Plan</h5>
                                        <div className="price">
                                            <span className="amount">$9.99</span><span className="duration">/month</span>
                                        </div>
                                        <h6 className="features-title">Features Like</h6>
                                        <ul className="features-list">
                                            <li><span className="check-icon me-2">{svg.app.plan_list_check}</span><span>live score board</span></li>
                                            <li><span className="check-icon me-2">{svg.app.plan_list_check}</span><span>PDF</span></li>
                                            <li ><span className="check-icon me-2">{svg.app.landing_price_disable}</span><span className='ps_lp_disabled_list'>upload own logo</span></li>
                                            <li ><span className="check-icon me-2">{svg.app.landing_price_disable}</span><span className='ps_lp_disabled_list'>upload sponsor's logo</span></li>
                                        </ul>
                                        {/* <CheckoutButton planeName={'Basic'} btnTheame={"dark"} /> */}
                                        {activePlan == "Pro Plan" && <CheckoutButton planeName={"Basic Plan"} btnTheame={"light"} /> || activePlan === null && <CheckoutButton planeName={"Basic Plan"} btnTheame={"light"} />}
                                    </div>
                                </div>

                            </div>

                            <div className={activePlan === "Pro Plan" && 'ps_setting_active_plan' || activePlan === 'Basic Plan' && 'ps_setting_more_plan' || activePlan === null && 'ps_setting_more_plan'} >

                                {activePlan === "Pro Plan" && <h3>Active Plan</h3> || activePlan === "Basic Plan" && <h3>Other Plans</h3> || activePlan === null && <h3></h3>}
                                <div className='ps_lp_price_flex_box'>
                                    <div className="pricing-card basic">
                                        <h5 className="plan-title text-orange">Premium Plan</h5>
                                        <div className="price text-orange">
                                            <span className="amount">$19.99</span><span className="duration">/month</span>
                                        </div>
                                        <h6 className="features-title">Features Like</h6>
                                        <ul className="features-list">
                                            <li><span className="check-icon me-2">{svg.app.plan_list_check}</span><span>live score board</span></li>
                                            <li><span className="check-icon me-2">{svg.app.plan_list_check}</span><span>PDF</span></li>
                                            <li><span className="check-icon me-2">{svg.app.plan_list_check}</span><span>upload own logo</span></li>
                                            <li><span className="check-icon me-2">{svg.app.plan_list_check}</span><span>upload sponsor's logo</span></li>
                                        </ul>
                                        {activePlan !== "Pro Plan" ? <CheckoutButton planeName={"Pro Plan"} btnTheame={"light"} /> : ""}
                                    </div>
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
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../Component/common/pageLoader';
import svg from '../Component/common/svg';
import { toast } from 'react-hot-toast';
import NavbarUser from './common/NavbarUser';
import ChangePassword from './ChangePassword';
import UploadLogo from './UploadLogo';
import SubscriptionPlan from './SubscriptionPlan';

import CheckoutButton from './CheckoutButton';

const DEV_API = process.env.REACT_APP_DEV_API;

const UserSetting = () => {

    const [ToggleState, setToggleState] = useState(1);
    const navigate = useNavigate();
    const [activeP, setActiveP] = useState(null);

    const toggleTab = (index) => {
        setToggleState(index);
    };

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

                setActiveP(response.data.activePlan);
                console.log('Active Plan State:', activeP);

            }
        } catch (error) {
            console.error('Error signing up:', error);

        }
    }

    useEffect(() => {
        getActivePlan();
    }, []);

    const getActiveClass = (index, className) =>
        ToggleState === index ? className : "";

    return (
        <>
            <NavbarUser showBackButton={true} />
            <div className='boxc_input_box ps_setting_tabs '>
                <div className="container-fluid mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-12 px-0">
                             <div className='ps_back_absolute_setting'>
                                    <div className='box_cric_back_btn' onClick={() => navigate('/input')}>
                                        {svg.app.back_icon} Back
                                    </div>
                                </div>

                            <ul className="tab-list">
                               
                                <li
                                    className={`tabs ${getActiveClass(1, "active-tabs")}`}
                                    onClick={() => toggleTab(1)}
                                >
                                    Personal Info
                                </li>
                                {(activeP === "Pro Plan") &&
                                    <li
                                        className={`tabs ${getActiveClass(2, "active-tabs")}`}
                                        onClick={() => toggleTab(2)}
                                    >
                                        Upload Images
                                    </li>}

                                <li
                                    className={`tabs ${getActiveClass(3, "active-tabs")}`}
                                    onClick={() => toggleTab(3)}
                                >
                                    Plan Info
                                </li>
                            </ul>
                            <div className="content-container">
                                <div className={`content ${getActiveClass(1, "active-content")}`}>
                                    <ChangePassword />
                                </div>
                                {(activeP == "Pro Plan") &&
                                    <div className={`content ${getActiveClass(2, "active-content")}`}>
                                        <UploadLogo />
                                    </div>}

                                <div className={`content ${getActiveClass(3, "active-content")}`}>
                                    <SubscriptionPlan activeP={activeP} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
};

export default UserSetting;
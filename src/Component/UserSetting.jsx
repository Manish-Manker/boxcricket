import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PageLoader from '../Component/common/pageLoader';
import svg from '../Component/common/svg';
import { toast } from 'react-toastify';
import NavbarUser from './common/NavbarUser';
import ChangePassword from './ChangePassword';
import UploadLogo from './UploadLogo';
import SubscriptionPlan from './SubscriptionPlan';

const UserSetting = () => {

    const [ToggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
        setToggleState(index);
    };

    const getActiveClass = (index, className) =>
        ToggleState === index ? className : "";

    return (
        <>
            <NavbarUser showBackButton={true} />
            <div className='boxc_input_box ps_setting_tabs '>
                <div className="container-fluid mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-12 px-0">
                            <ul className="tab-list">
                                <li
                                    className={`tabs ${getActiveClass(1, "active-tabs")}`}
                                    onClick={() => toggleTab(1)}
                                >
                                   Personal Info
                                </li>
                                <li
                                    className={`tabs ${getActiveClass(2, "active-tabs")}`}
                                    onClick={() => toggleTab(2)}
                                >
                                   Upload Images
                                </li>
                                <li
                                    className={`tabs ${getActiveClass(3, "active-tabs")}`}
                                    onClick={() => toggleTab(3)}
                                >
                                   Plan Info
                                </li>
                            </ul>
                            <div className="content-container">
                                <div className={`content ${getActiveClass(1, "active-content")}`}>
                                   <ChangePassword/>
                                </div>
                                <div className={`content ${getActiveClass(2, "active-content")}`}>
                                    <UploadLogo />
                                </div>
                                <div className={`content ${getActiveClass(3, "active-content")}`}>
                                    <SubscriptionPlan/>
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
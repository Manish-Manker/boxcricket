import React from 'react';
import Logout from '../common/logout';
import svg from '../common/svg';

const AdminLayout = ({ children, showBackButton, onBackClick }) => {
    return (
        <div>
            <nav className='ps_navbar_box'>

                <div>
                    {showBackButton && (
                        <div className='box_cric_back_btn' onClick={onBackClick}>
                            {svg.app.back_icon} Back
                        </div>
                    )}
                </div>

                <div className="ps_navbar_box_logo">
                    <a href="/#" className="wpa_logo">
                        <img src="../images/logo.svg" alt="logo" />
                    </a>
                </div>
                <div><Logout /></div>
            </nav>
            <div>{children}</div>
        </div>
    );
};



export default AdminLayout;
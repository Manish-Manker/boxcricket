import React from 'react';

const NotFound = () => {


    const handleBackClick = () => {
        window.history.go(-1);
    };
    return (
        <div className="not-found">
            <div className="erp_404_main">
                <div className="wpa_login_main">
                    <div className="wpa_auth_login_box">
                        <div className="wpa_login_wrapper">
                            <div className="wpa_login_logo">
                                <a className="wpa_logo" href="/login"><img src="../images/404.png" alt="logo" /></a>
                            </div>
                            <h3>Oops!</h3>
                            <p className="mb-4">The page you are looking for does not exist</p>
                            <button className="box_cric_btn" onClick={handleBackClick}>Go To Home Page</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
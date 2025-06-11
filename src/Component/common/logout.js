// Logout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationPopup from './confirmPopup';
import svg from './svg';

const Logout = () => {
    const [isRemove, setIsRemove] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('currentBall');
        localStorage.removeItem('currentSkinIndex');
        localStorage.removeItem('isSet');
        localStorage.removeItem('matchId');
        localStorage.removeItem('matchInfo');
        localStorage.removeItem('previousBall');
        localStorage.removeItem('team1ScoreData');
        localStorage.removeItem('team2ScoreData');
        localStorage.removeItem('consecutiveZerosCount');
        toast.success("Successfully logged out");
        navigate('/login');
    };

    const handleLogoutClick = () => {
        setIsRemove(true);
    };

    const handleConfirmLogout = () => {
        logout();
        setIsRemove(false);
    };

    const handleCancelLogout = () => {
        setIsRemove(false);
    };

    return (
        <>
            <button className="box_cric_btn box_cric_btn_logout bc_btn_logoutMob" onClick={handleLogoutClick}>
               {svg.app.logout} <span>Log Out</span> 
            </button>

            <ConfirmationPopup
                shownPopup={isRemove}
                closePopup={handleCancelLogout}
                title="Confirm Logout"
                subTitle="Are you sure you want to log out?"
                type={"User"}
                removeAction={handleConfirmLogout}
            />
        </>
    );
};

export default Logout;
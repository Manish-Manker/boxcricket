// Logout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ConfirmationPopup from './confirmPopup';
import svg from './svg';
import axios from 'axios';

const Logout = () => {
    const [isRemove, setIsRemove] = useState(false);
    const navigate = useNavigate();

    const logout = async () => {
        let token = localStorage.getItem('authToken');
        let userData = localStorage.getItem('userData');
        const DEV_API = process.env.REACT_APP_DEV_API;

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

        try {
            let response = await axios.post(`${DEV_API}/api/logOut`,
                { userId: JSON.parse(userData)?.id },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response?.data?.status === 200) {
                toast.success(response?.data?.message);
            }
        } catch (error) {
            console.log("error", error);
        }
        finally {
            navigate('/login');
        }
    };

    const handleLogoutClick = () => {
        console.log("Logout button clicked");
        
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
            <button className="box_cric_btn box_cric_btn_logout bc_btn_logoutMob ps_navbar_logout" onClick={handleLogoutClick}>
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
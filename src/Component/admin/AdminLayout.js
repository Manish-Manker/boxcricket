// src/Component/AdminLayout.js

import React from 'react';
import { Link } from 'react-router-dom';
import Logout from '../common/logout';

const AdminLayout = ({ children }) => {
    const handleLogout = () => {
        // Logic for logout (e.g., redirecting, clearing tokens, etc.)
        console.log("Logout clicked");
    };

    return (
        <div>
            <nav className='ps_navbar_box'>
                <div></div>
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

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: '10px',
        color: '#fff',
    },
    logo: {
        flex: 1,
        textAlign: 'center',
        fontSize: '24px',
    },
    logoutButton: {
        background: 'transparent',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default AdminLayout;
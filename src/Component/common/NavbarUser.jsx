import React, { useState, useRef, useEffect } from 'react';
import Logout from '../common/logout';
import svg from '../common/svg';
import { useNavigate } from 'react-router-dom';

const NavbarUser = ({ children, showBackButton, onBackClick }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('userData')));
    }, [])


    const toggleDropdown = () => {
        setDropdownOpen(true);
    };

    const handleSettings = () => {
        navigate('/UserSetting');
        setDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        // Bind the event listener for clicks outside of the dropdown
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <nav className='ps_navbar_box'>
                <div className="ps_navbar_box_logo">
                    <a href="/#" className="wpa_logo">
                        <img src="../images/logo/DarkLogo.svg" alt="logo" />
                    </a>
                </div>
                <div className='ps_navbar_profile_box' onClick={toggleDropdown} ref={dropdownRef} style={{ cursor: "pointer" }}>
                    
                    <div className='ps_navbar_profile_img'>
                         <span className='profile-initial'>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
                        {/* <img src="./images/cricket_legends.png" alt="profile" /> */}
                    </div>
                    <h4>{user.name}</h4>
                    <div  className="dropdown-icon" >
                        {dropdownOpen ?
                            <span className='ps_drop_down_arrow'>{svg.app.dropdown_arrow}</span> :
                            <span className=''>{svg.app.dropdown_arrow}</span>
                        }
                    </div>
                    {dropdownOpen && (
                        <div className="ps_input_dropdown-menu">
                            <ul>
                                <li onClick={handleSettings}>Settings</li>
                              
                                <li className='ps_navbar_profile_logout'>
                                    <Logout />
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
            <div>{children}</div>
        </div>
    );
};

export default NavbarUser;
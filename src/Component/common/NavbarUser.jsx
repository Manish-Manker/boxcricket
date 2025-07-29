import React, { useState } from 'react';
import Logout from '../common/logout';
import svg from '../common/svg';
import { useNavigate } from 'react-router-dom'

const NavbarUser = ({ children, showBackButton, onBackClick }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
     const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

    const handleLogout = () => {
       
    };

    const handleSettings = () => {
         navigate('/UserSetting');
    };

    return (
        <div>
            <nav className='ps_navbar_box'>
                <div className="ps_navbar_box_logo">
                    <a href="/#" className="wpa_logo">
                        <img src="../images/logo/DarkLogo.svg" alt="logo" />
                    </a>
                </div>
                <div className='ps_navbar_profile_box'>
                    <div className='ps_navbar_profile_img'>
                        <img src="./images/cricket_legends.png" alt="profile" />
                    </div>
                    <h4>User Board</h4>
                    <div onClick={toggleDropdown} className="dropdown-icon">
                      { dropdownOpen ? <span className='ps_drop_down_arrow'>{svg.app.dropdown_arrow}</span>: <span className=''>{svg.app.dropdown_arrow}</span>}
                    </div>
                    {dropdownOpen && (
                        <div className="ps_input_dropdown-menu">
                            <ul>
                                <li onClick={handleSettings}>Settings</li>
                                <li className='ps_navbar_profile_logout'>  <Logout /></li>
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
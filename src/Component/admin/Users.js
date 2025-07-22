
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { toast } from 'react-toastify';
import svg from '../common/svg';
import ConfirmationPopup from '../common/confirmPopup';
import PageLoader from '../common/pageLoader';
import Popup from '../common/Popup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import AdminLayout from './AdminLayout';

const Users = () => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userId, setUserId] = useState('');
    const [addCategoryPopup, setAddCategoryPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();

    const [totalData, setTotalData] = useState({ totalUsers: 0, ActiveUsers: 0, InActiveUsers: 0, TotalMatches: 0 });

    const [loading, setLoading] = useState(false);

    const [totalRows, setTotalRows] = useState(10);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [search, setSearch] = useState('');
    const [statusChange, setStatusChange] = useState(false);
    const [loginChange, setLoginChange] = useState(false);
    const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);
    const [userToChangeStatus, setUserToChangeStatus] = useState(null);
    const [customerList, setcustomerList] = useState([])
    const [SelectedStatus, setSelectedStatus] = useState('');

    const [updatedPassword, setUpdatedPassword] = useState(false);

    const statusOption = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'In-Active' },
    ]


    useEffect(() => {
        loadUserData(page, perPage, SelectedStatus, search);

        const interval = setInterval(() => {
            loadUserData(page, perPage, SelectedStatus, search, false);
        }, 120000);

        if (localStorage.getItem('userName')) {
            localStorage.removeItem('userName');
        }
        if (localStorage.getItem('userId')) {
            localStorage.removeItem('userId');
        }

        return () => clearInterval(interval);
    }, [page, perPage, SelectedStatus]);

    const loadTotalData = () => {
        let token = localStorage.getItem('authToken');
        const DEV_API = process.env.REACT_APP_DEV_API;
        axios.get(`${DEV_API}/api/totalData`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            if (res.data.status === 200) {
                setTotalData(res?.data?.data);
            }
            if (res.data.status === 401 || res.data.status === 403) {
                toast.error(res?.data?.message);
                navigate('/login');
                return
            }
        }).catch((error) => {
            console.log("Error", error);
        })
    }

    const loadUserData = async (page, perPage, status, search , Rloding=true) => {

        if(Rloding) setLoading(true)
        try {
            let token = localStorage.getItem('authToken');
            const DEV_API = process.env.REACT_APP_DEV_API;

            let responce = await axios.post(`${DEV_API}/api/getalluser`, { page, perPage, status, search }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (responce.data.status === 200) {
                loadTotalData();
                if(Rloding) setLoading(false);
                let totalUsers = responce?.data?.totalUsers
                let data = responce?.data?.data
                setcustomerList(data);
                setTotalRows(totalUsers);
            }
            if (responce.data.status === 401 || responce.data.status === 403) {
                toast.error(responce?.data?.message);
                navigate('/login');
                return
            }
        } catch (error) {
            console.log("Error", error);
        }
    }

    useEffect(() => {
        if (search === '' && hasSubmittedSearch) {
            loadUserData(page, perPage, SelectedStatus, '');
            setHasSubmittedSearch(false);
        }
    }, [search, hasSubmittedSearch]);


    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setPage(1);
    };

    const validateForm = (formData, isUpdate = false) => {
        const newErrors = {};
        const errorMessages = [];

        // Check for empty values
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            errorMessages.push(newErrors.name);
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            errorMessages.push(newErrors.email);
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            errorMessages.push(newErrors.email);
        }

        if ('password' in formData) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
                errorMessages.push(newErrors.password);
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters long';
                errorMessages.push(newErrors.password);
            }
        }

        if (errorMessages.length > 0) {
            toast.error(errorMessages.join(', '));
        }
        return Object.keys(newErrors).length === 0;
    };

    const addUSer = async (e) => {
        e.preventDefault();

        let formData = {
            name: fullname,
            email: email,
            password: password
        }
        const DEV_API = process.env.REACT_APP_DEV_API;

        if (validateForm(formData)) {
            try {
                setLoading(true)
                const response = await axios.post(`${DEV_API}/api/signup`, formData);
                if (response.data.status === 201) {
                    setLoading(false)
                    loadUserData();
                    toast.success(response?.data?.message);
                    categoryPopupCloseHandler();
                    setAddCategoryPopup(false);
                }
            } catch (error) {
                console.error('Error signing up:', error);
                toast.error(error?.response?.data?.message);
            }
        }


    }

    const updateUSer = async (e) => {
        e.preventDefault();
        let formData = {
            name: fullname,
            email: email
        };

        if (updatedPassword) {
            formData.password = password;
        }

        if (validateForm(formData)) {
            try {
                setLoading(true)
                const token = localStorage.getItem('authToken');
                const DEV_API = process.env.REACT_APP_DEV_API;

                let responce = await axios.put(`${DEV_API}/api/edituser/${userId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (responce.data.status === 200) {
                    loadUserData();
                    toast.success(responce?.data?.message);
                }
            } catch (error) {
                console.log("Error", error);
            }
            finally {
                setAddCategoryPopup(false);
                setLoading(false);
            }
        }
    }


    const handleSearchKeyupEvent = (e) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
        if (e.keyCode === 13) {
            const trimmedValue = searchValue.trim();
            if (trimmedValue) {
                setHasSubmittedSearch(true);
            }
        }
    };

    const handleStatusChangeClick = (user) => {
        setUserToChangeStatus(user);
        setStatusChange(true);
    };

    const confirmStatusChange = async (user) => {
        const token = localStorage.getItem('authToken');
        const DEV_API = process.env.REACT_APP_DEV_API;

        let updatedStatus = user.status === 'active' ? 'inactive' : 'active';

        try {
            const response = await axios.post(`${DEV_API}/api/activeInactiveUser`, {
                userId: user._id,
                status: updatedStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setcustomerList((prevList) =>
                    prevList.map((item) => {
                        if (item._id === user._id) {
                            return { ...item, status: updatedStatus };
                        }
                        return item;
                    })
                );
                loadTotalData();
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to change user status: " + error.response?.data?.message || "Unknown error");
            return;
        } finally {
            setStatusChange(false);
            setUserToChangeStatus(null);
        }
    };

    const handleLoginStatusChangeClick = (user) => {
        setUserToChangeStatus(user);
        setLoginChange(true);
    }

    const confirmLoginStatusChange = async (user) => {
        const token = localStorage.getItem('authToken');
        const DEV_API = process.env.REACT_APP_DEV_API;

        let updatedStatus = false;

        try {
            const response = await axios.post(`${DEV_API}/api/changeLoginStatus`, {
                userId: user._id,
                status: updatedStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setcustomerList((prevList) =>
                    prevList.map((item) => {
                        if (item._id === user._id) {
                            return { ...item, isLoggedIn: updatedStatus };
                        }
                        return item;
                    })
                );
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to change user status: " + error.response?.data?.message || "Unknown error");
            return
        } finally {
            setLoginChange(false);
            setUserToChangeStatus(null);
        }
    };

    const clearSearch = () => {
        setSearch("");
        if (hasSubmittedSearch) {
            // fetchCustomers(1, perPage, false, "");
            setHasSubmittedSearch(false);
        }
    };

    const getEditedData = (user) => {
        setFullName(user.name);
        setEmail(user.email);
        setUserId(user._id);
        setIsEdit(true);
        setAddCategoryPopup(true);
    };


    const viewMatches = (user) => {
        localStorage.setItem('userId', user._id);
        localStorage.setItem('userName', user.name);
        navigate(`/admin/matchList`);
    };

    const columns = [
        {
            name: '#', width: '70px', center: 1,
            cell: (row, index) => (
                <span>{(page - 1) * perPage + index + 1}</span>
            )
        },
        {
            name: 'User Name', wrap: true,
            selector: row => row?.name,
            // sortable: true,
        },
        {
            name: 'Email', selector: row => row.email,
            // sortable: true,
        },
        {
            name:"Plan",
            selector: row => row?.plan ? <span style={{ color: 'orange' }} >{row.plan}</span> : <span>No Plan</span>,
        },
        {
            name: 'Email Verified',
            selector: row => row?.emailVerified ? <span className='text-success'>Yes</span> : <span className='text-danger'>No</span>,
        },

        {
            name: 'No of Matches',
            selector: row => row?.matchCount,
            // sortable: true
        },

        {

            name: 'View Matches',
            selector: row => row?.matches,
            sortable: false,
            cell: (row, index) => (
                <>
                    <div className='pu_datatable_btns '>
                        <a onClick={() => viewMatches(row)} className="pu_dt_btn ps_tooltip_icon">
                            <span className="tooltiptext">Matches List</span>
                            {svg.app.view_icon}
                        </a>
                    </div>
                </>
            )
        },


        {
            name: 'Status',

            // sortable: true,
            cell: (row, index) => (
                <>
                    <div className='d-flex align-items-center gap-2'>
                        <div className='d-flex align-items-center'>
                            <label htmlFor={`status-${row._id}`} className="switch">
                                <input
                                    type="checkbox"
                                    title="Status"
                                    className="tooltiped"
                                    id={`status-${row._id}`}
                                    checked={row.status === 'active'}
                                    onChange={() => handleStatusChangeClick(row)}
                                // onChange={() => UpdateStatus(row, index)}
                                />
                                <span className="switch-status"></span>
                            </label>
                        </div>
                    </div>
                </>
            )
        },

        {
            name: 'Login Status',

            // sortable: true,
            cell: (row, index) => (
                <>
                    <div className='d-flex align-items-center gap-2'>
                        <div className='d-flex align-items-center'>
                            <label htmlFor={`isLoggedIn-${row._id}`} className="switch">
                                <input
                                    type="checkbox"
                                    title="Status"
                                    className="tooltiped"
                                    id={`isLoggedIn-${row._id}`}
                                    checked={row.isLoggedIn === true}
                                    disabled={row.isLoggedIn === false}
                                    onChange={() => handleLoginStatusChangeClick(row)}
                                />
                                <span className="switch-status"></span>
                            </label>
                        </div>
                    </div>
                </>
            )
        },

        {
            name: 'Created At',
            selector: row => moment(row.createdAt).format('Do MMM YYYY'),
            // sortable: true,
        },

        {
            name: 'Actions',
            cell: (row) => (
                <div className="pu_datatable_btns ">
                    <a onClick={() => getEditedData(row)} className="pu_dt_btn ps_tooltip_icon">
                        <span className="tooltiptext">Update User</span>
                        {svg.app.dash_edit}
                    </a>
                </div>
            )
        },
    ];

    const categoryPopupCloseHandler = () => {
        setIsEdit(false);
        setUserId('');
        setFullName('');
        setEmail('');
        setPassword('');
        setUpdatedPassword(false);
        setAddCategoryPopup(!addCategoryPopup)
    };

    const showHidePassword = () => {
        if (showPassword === true) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    }


    return (
        <>

            <AdminLayout />
            <div className='ps_admin_p5'>
                <div className='skipg_dashboard_box_section'>
                    <div className="skipg_dashboard_boxes">
                        <div>
                            <h5>Total Users</h5>
                            <span>{totalData.totalUsers}</span>
                        </div>
                        <div className="skipg_dashboard_boxes_icon">
                            {svg.app.total_user_icon}
                        </div>
                    </div>
                    <div className="skipg_dashboard_boxes">
                        <div>
                            <h5>Active Users</h5>
                            <span>{totalData.ActiveUsers}</span>
                        </div>
                        <div className="skipg_dashboard_boxes_icon">
                            {svg.app.active_user_icon}
                        </div>
                    </div>
                    <div className="skipg_dashboard_boxes">
                        <div>
                            <h5>Inactive Users</h5>
                            <span>{totalData.InActiveUsers}</span>
                        </div>
                        <div className="skipg_dashboard_boxes_icon">
                            {svg.app.inactice_user_icon}
                        </div>
                    </div>
                    <div className="skipg_dashboard_boxes">
                        <div>
                            <h5>Total Matches</h5>
                            <span>{totalData.TotalMatches}</span>
                        </div>
                        <div className="skipg_dashboard_boxes_icon">
                            {svg.app.total_matches_icon}
                        </div>
                    </div>

                    <div className="skipg_dashboard_boxes">
                        <div>
                            <h5>Log In Users</h5>
                            <span>{totalData.LogedInUsers}</span>
                        </div>
                        <div className="skipg_dashboard_boxes_icon">
                            {svg.app.active_user_icon}
                        </div>
                    </div>

                </div>

                <div className='ps_table_box '>
                    <div className="ps-table-design">

                        <div className="pu_datatable_wrapper skipg_dash_table">
                            <div className='page_tittle_head fwrap mb-3'>
                                <div className="box_cric_team_heading">
                                    <h3 className="m-0">Users List</h3>
                                </div>

                                <ul className="pu_pagetitle_right width_100_sc1448">

                                    <li>
                                        <div className='skipg_dropdown_input'>
                                            <label>Filter By Status</label>
                                            <span className="separator">|</span>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable={true}
                                                isSearchable={false}
                                                name="status"
                                                options={statusOption}
                                                onChange={(selectedStatusOption) => {
                                                    setSelectedStatus(selectedStatusOption?.value);
                                                }}
                                            />
                                        </div>
                                    </li>

                                    <li>
                                        <div className="pu_search_wrapper">
                                            <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const trimmedValue = search.trim();
                                                        if (trimmedValue !== '') {
                                                            setHasSubmittedSearch(true);
                                                            loadUserData(page, perPage, SelectedStatus, trimmedValue);
                                                        }
                                                    }
                                                }}

                                            />
                                            {search.length > 0 && (
                                                <span className="pu_clear_icon" onClick={clearSearch}>
                                                    {svg.app.clear_icon}
                                                </span>
                                            )}
                                            <span className="pu_search_icon">{svg.app.dash_search_icon}</span>
                                        </div>
                                    </li>
                                    <li className='skipg_page_header_custm_title_btn_hide'><button className="box_cric_btn" onClick={() => setAddCategoryPopup((prev) => !prev)}>+ Add User</button></li>


                                </ul>
                            </div>
                            <div className=''>
                                <DataTable
                                    columns={columns}
                                    data={customerList}
                                    progressPending={loading}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    onChangeRowsPerPage={handlePerRowsChange}
                                    onChangePage={(newPage) => {
                                        setPage((prevPage) => {
                                            if (prevPage !== newPage) {
                                                return newPage;
                                            }
                                            return prevPage;
                                        });
                                    }}
                                    progressComponent={<PageLoader />}
                                    //  striped={true} 
                                    highlightOnHover={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Popup
                heading={isEdit ? "Update User" : "Add User"}
                show={addCategoryPopup}
                onClose={categoryPopupCloseHandler}
            >
                <form onSubmit={isEdit ? updateUSer : addUSer} autoComplete='off'>
                    <div className="skipg_input_wrapper">
                        <label className='skipg_form_input_label '>Name</label>
                        <input type="text" className="form-control " placeholder="Full Name" name="fullname" value={fullname} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="skipg_input_wrapper">
                        <label className='skipg_form_input_label '>Email</label>
                        <input type="text" className="form-control " disabled={isEdit} placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {isEdit && <div>
                        <input type="checkbox" value={updatedPassword} onChange={(e) => setUpdatedPassword(!updatedPassword)} />
                        <label className='skipg_form_input_label '>Update Password</label>
                    </div>}

                    {(isEdit && !updatedPassword) ? "" : <div className='d-flex align-items-center gap-2 '>
                        <div className="skipg_input_wrapper w-100 ps_position_relative">
                            <label className='skipg_form_input_label '>Password</label>
                            <input
                                type={showPassword === true ? "text" : "password"}
                                className="form-control "
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: 'pointer', position: 'absolute', right: '20px', bottom: '20%' }}
                            >
                                {showPassword ? (
                                    svg.app.open_eye_icon
                                ) : (
                                    svg.app.close_eye_icon
                                )}
                            </span>
                        </div>

                    </div>}
                    <button className="box_cric_btn" type='submit' >{isEdit ? "Update User" : "Add User"}</button>
                </form>
            </Popup>



            <ConfirmationPopup
                shownPopup={!!statusChange}
                closePopup={() => setStatusChange(false)}
                title="Confirm Status Change"
                subTitle={`Are you sure you want to change the status of ${userToChangeStatus?.name}?`}
                type={"User"}
                removeAction={() => userToChangeStatus && confirmStatusChange(userToChangeStatus)}
            />

            <ConfirmationPopup
                shownPopup={!!loginChange}
                closePopup={() => setLoginChange(false)}
                title="Confirm Login Status Change"
                subTitle={`Are you sure you want to change the login status of ${userToChangeStatus?.name}?`}
                type={"User"}
                removeAction={() => userToChangeStatus && confirmLoginStatusChange(userToChangeStatus)}
            />

        </>
    );
}
export default Users;
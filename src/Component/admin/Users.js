
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
import Logout from '../common/logout';

const Users = (props) => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userId, setUserId] = useState('');
    const [addCategoryPopup, setAddCategoryPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();


    const [loading, setLoading] = useState(true);

    const [totalRows, setTotalRows] = useState(10);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [search, setSearch] = useState('');
    const [statusChange, setStatusChange] = useState(false);
    const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);
    const [userToChangeStatus, setUserToChangeStatus] = useState(null);
    const [filterCustomerList, setfilterCustomerList] = useState([])
    const [customerList, setcustomerList] = useState([])
    const [isFilter, setIsFilter] = useState(false)
    const [SelectedStatus, setSelectedStatus] = useState('');

    const statusOption = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'In-Active' },
    ]


    useEffect(() => {
        loadUserData(page, perPage);
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    }, [page, perPage]);

    const loadUserData = async (page, perPage) => {
        setLoading(true)
        try {

            let token = localStorage.getItem('authToken');
            const DEV_API = process.env.REACT_APP_DEV_API;

            let responce = await axios.post(`${DEV_API}/api/getalluser`, { page, perPage }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (responce.data.status === 200) {
                setLoading(false);
                console.log("data", responce?.data?.data);
                let totalUsers = responce?.data?.totalUsers
                let data = responce?.data?.data
                // let pagedata = data.slice((page - 1) * perPage, page * perPage);

                setcustomerList(data);
                setTotalRows(totalUsers);
            }


        } catch (error) {
            console.log("Error", error);
        }

    }


    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setPage(1);
        loadUserData();
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

        // Password validation only for adding user
        if (!isUpdate && !formData.password) {
            newErrors.password = 'Password is required';
            errorMessages.push(newErrors.password);
        } else if (!isUpdate && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            errorMessages.push(newErrors.password);
        }

        if (errorMessages.length > 0) {
            toast.error(errorMessages.join(', ')); // Show all error messages in a single toast
        }

        return Object.keys(newErrors).length === 0; // Return true if there are no errors
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
        if (validateForm(formData, true)) {
            try {
                setLoading(true)
                const token = localStorage.getItem('authToken');
                const DEV_API = process.env.REACT_APP_DEV_API;

                let formData = {
                    name: fullname,
                    email: email
                }

                let responce = await axios.put(`${DEV_API}/api/edituser/${userId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (responce.data.status === 200) {
                    setLoading(false)
                    loadUserData();
                    toast.success(responce?.data?.message);
                }

            } catch (error) {
                console.log("Error", error);
            }
            finally {
                setAddCategoryPopup(false);
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
                // fetchCustomers(1, perPage, false, searchValue);
            }
        }
    };

    const handleStatusChangeClick = (user) => {
        setUserToChangeStatus(user); // Store user data for confirmation
        setStatusChange(true); // Show confirmation popup
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
                setcustomerList(prevState =>
                    prevState.map(u => u._id === user._id ? { ...u, status: updatedStatus } : u)
                );
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to change user status: " + error.response?.data?.message || "Unknown error");
        } finally {
            setStatusChange(false); // Close confirmation popup
            setUserToChangeStatus(null); // Clear user data
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
            sortable: true,
        },
        { name: 'Email', selector: row => row.email, sortable: true, },

        {
            name: 'No of Matches',
            selector: row => row?.matchCount,
            sortable: true
        },

        {

            name: 'View Matches',
            selector: row => row?.matches,
            sortable: false,
            cell: (row, index) => (
                <>
                    <div className='pu_datatable_btns '>
                        <a onClick={() => viewMatches(row)} className="pu_dt_btn ">
                            {svg.app.view_icon}
                        </a>
                    </div>
                </>
            )
        },


        {
            name: 'Status',

            sortable: true,
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
            name: 'Actions',
            cell: (row) => (
                <div className="pu_datatable_btns">
                    <a onClick={() => getEditedData(row)} className="pu_dt_btn ">
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
        setAddCategoryPopup(!addCategoryPopup)
    };

    const showHidePassword = () => {
        if (showPassword === true) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    }



    const applyFilters = () => {
        const username = search.trim().toLowerCase();
        const status = SelectedStatus;

        const filteredData = customerList.filter(user => {
            const matchUsername = username ? user.name.toLowerCase().includes(username) : true;
            const matchStatus = status ? user.status === status : true;

            return matchUsername && matchStatus;
        });

        setfilterCustomerList(filteredData);
        setIsFilter(username || status ? true : false);
    };

    useEffect(() => {
        applyFilters();
    }, [search, SelectedStatus]);


    return (
        <>
            <div className='ps_table_box p-4'>
                <div className="ps-table-design">

                    <div className="pu_datatable_wrapper skipg_dash_table">
                        <div className='page_tittle_head fwrap'>
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
                                        <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target?.value)} onKeyUp={handleSearchKeyupEvent} />
                                        {search.length > 0 && (
                                            <span className="pu_clear_icon" onClick={clearSearch}>
                                                {svg.app.clear_icon}
                                            </span>
                                        )}
                                        <span className="pu_search_icon">{svg.app.dash_search_icon}</span>
                                    </div>
                                </li>
                                <li className='skipg_page_header_custm_title_btn_hide'><button className="box_cric_btn" onClick={() => setAddCategoryPopup((prev) => !prev)}>+ Add User</button></li>
                                <li className='skipg_page_header_custm_title_btn_hide'> <Logout /></li>

                            </ul>
                        </div>
                        <div className=''>
                            <DataTable
                                columns={columns}
                                data={isFilter ? filterCustomerList : customerList}
                                progressPending={loading}
                                pagination
                                paginationServer
                                paginationTotalRows={totalRows}
                                onChangeRowsPerPage={handlePerRowsChange}
                                onChangePage={(page) => setPage(page)}
                                progressComponent={<PageLoader />}
                                //  striped={true} 
                                highlightOnHover={true}
                            />
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
                        <input type="text" className="form-control " placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {isEdit ? "" : <div className='d-flex align-items-center gap-2 '>
                        <div className="skipg_input_wrapper w-100">
                            <label className='skipg_form_input_label '>Password</label>
                            <div className='skipg_password_show' onClick={() => showHidePassword()}>{showPassword ? svg.app.eye_open_icon : svg.app.eye_close_icon}</div>
                            <input
                                type={showPassword === true ? "text" : "password"}
                                className="form-control "
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isEdit}
                            />
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

        </>
    );
}
export default Users;
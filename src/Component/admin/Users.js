"use client";
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import moment from 'moment';
import svg from '../common/svg';
import ConfirmationPopup from '../common/confirmPopup';
import PageLoader from '../common/pageLoader';
import Popup from '../common/Popup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

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
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [statusChange, setStatusChange] = useState(false);
    const [page, setPage] = useState(1);
    const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);

    const [customerList, setcustomerList] = useState([
        { id: 1, name: 'manish', email: 'YV9G2@example.com', matches: 4, status: 'active', createdAt: '2023-01-01' },
        { id: 2, name: 'manish', email: 'YV9G2@example.com', matches: 14, status: 'active', createdAt: '2023-01-01' },
        { id: 3, name: 'manish', email: 'YV9G2@example.com', matches: 5, status: 'active', createdAt: '2023-01-01' },
        { id: 4, name: 'manish', email: 'YV9G2@example.com', matches: 8, status: 'inactive', createdAt: '2023-01-01' },
        { id: 5, name: 'manish', email: 'YV9G2@example.com', matches: 21, status: 'active', createdAt: '2023-01-01' },
    ])

    const statusOption = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'In-Active' },
    ]


    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = () => {
        try {
            let token = localStorage.getItem('authToken');
            const DEV_API = process.env.REACT_APP_DEV_API;

            let responce = axios.get(`${DEV_API}/api/getalluser`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).catch((error) => console.log(error));

            if (responce.status === 200) {
                setcustomerList(responce.data.data);
                setLoading(false);
            }


        } catch (error) {

        }

    }

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
        navigate('/login');
    };


    const handlePageChange = (page) => {
        setPage(page);
        // fetchCustomers(page, perPage, false, search);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setLoading(true);
    };

    const addUSer = () => {

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

    const UpdateStatus = (row, index) => {
        
        const updatedList = customerList.map(user => {
            if (user.id === row.id) {
                return {
                    ...user,
                    status: user.status === 'active' ? 'inactive' : 'active'
                };
            }
            return user;
        });

        
        setcustomerList(updatedList);

        try {
            const token = localStorage.getItem('authToken');
            const DEV_API = process.env.REACT_APP_DEV_API;
            let userId = customerList.id
            let status = customerList.status === 'active' ? 'inactive' : 'active'

            axios.post(`${DEV_API}/api/activeInactiveUser`, {
               userId,
               status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
                if (res.status === 200) {
                    // loadUserData();
                    console.log(res.data.message);
                    
                }
            }).catch((error) => console.log(error));

        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const clearSearch = () => {
        setSearch("");
        if (hasSubmittedSearch) {
            // fetchCustomers(1, perPage, false, "");
            setHasSubmittedSearch(false);
        }
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

            selector: row => row?.matches,
            sortable: false
        },


        {
            name: 'Status',

            sortable: false,
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
                                    onChange={() => UpdateStatus(row, index)}
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
                    <a
                        //  onClick={(e) => getEditedData(row)} 
                        className="pu_dt_btn ">{svg.app.dash_edit}</a>


                    {/* <a
                        onClick={() => setStatusChange(row._id)}
                        className="pu_dt_btn ">
                        {svg.app.dash_delete}
                    </a> */}

                </div>
            )
        },
    ];

    const categoryPopupCloseHandler = () => {
        setIsEdit(false);
        setUserId('');
        setFullName('');
        setEmail('');
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
                                        // onChange={(selectedStatusOption) => {
                                        //     setSelectedStatus(selectedStatusOption); 
                                        // }}
                                        />
                                    </div>
                                </li>

                                <li>
                                    <div className="pu_search_wrapper">
                                        <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} onKeyUp={handleSearchKeyupEvent} />
                                        {search.length > 0 && (
                                            <span className="pu_clear_icon" onClick={clearSearch}>
                                                {svg.app.clear_icon}
                                            </span>
                                        )}
                                        <span className="pu_search_icon">{svg.app.dash_search_icon}</span>
                                    </div>
                                </li>
                                <li className='skipg_page_header_custm_title_btn_hide'><button className="box_cric_btn" onClick={() => setAddCategoryPopup(!addCategoryPopup)}>+ Add User</button></li>
                                <li className='skipg_page_header_custm_title_btn_hide'><button className="box_cric_btn" onClick={() => logout()}>Log out</button></li>

                            </ul>
                        </div>
                        <div className=''>
                            <DataTable
                                columns={columns}
                                data={customerList}
                                progressPending={!loading}
                                pagination
                                paginationServer
                                paginationTotalRows={totalRows}
                                onChangeRowsPerPage={handlePerRowsChange}
                                onChangePage={handlePageChange}
                                progressComponent={<PageLoader />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Popup
                heading={isEdit ? "Update Customer" : "Add Customer"}
                show={addCategoryPopup}
                onClose={categoryPopupCloseHandler}
            >
                <form onSubmit={""} autoComplete='off'>
                    <div className="skipg_input_wrapper">
                        <label className='skipg_form_input_label '>Name</label>
                        <input type="text" className="form-control " placeholder="Full Name" name="fullname" value={fullname} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="skipg_input_wrapper">
                        <label className='skipg_form_input_label '>Email</label>
                        <input type="text" className="form-control " placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className='d-flex align-items-center gap-2 '>
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
                                required={!isEdit}
                            />
                        </div>

                    </div>
                    <li className='skipg_page_header_custm_title_btn_hide'><button className="box_cric_btn" onClick={() => addUSer()}>Add User</button></li>
                </form>
            </Popup>

            <ConfirmationPopup
                shownPopup={!!statusChange}
                closePopup={() => setStatusChange(false)}
                type={"User"}
                removeAction={() => {
                    setStatusChange(false);
                }}
            />

        </>
    );
}
export default Users;
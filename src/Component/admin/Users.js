"use client";
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import moment from 'moment';
import svg from '../common/svg';
import ConfirmationPopup from '../common/confirmPopup';
import PageLoader from '../common/pageLoader';
import Popup from '../common/Popup';

const Users = (props) => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userId, setUserId] = useState('');
    const [addCategoryPopup, setAddCategoryPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    // const [customerList, setCustomerList] = useState('');
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [statusChange, setStatusChange] = useState(false);
    const [page, setPage] = useState(1);
    const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);


    const customerList = [
        { _id: '1', fullname: 'John Doe', email: 'john.doe@example.com', matches: 5, status: 1 },
        { _id: '2', fullname: 'Jane Smith', email: 'jane.smith@example.com', matches: 3, status: 0 },
        { _id: '3', fullname: 'Alice Johnson', email: 'alice.johnson@example.com', matches: 10, status: 1 },
        { _id: '4', fullname: 'Bob Brown', email: 'bob.brown@example.com', matches: 2, status: 0 },
        { _id: '5', fullname: 'Charlie White', email: 'charlie.white@example.com', matches: 7, status: 1 },
    ];
    const statusOption = [
        { value: '1', label: 'Active' },
        { value: '0', label: 'In-Active' },
    ]

    // useEffect(() => {
    //     fetchPaymentPlan(1, "admin");
    // }, []);

    // useEffect(() => {
    //     fetchCustomers(page, perPage, false, search);
    // }, [selectedPlan, selectedStatus, selectedVerifyStatus]);



    const [formData, setFormData] = useState({
        team1: '',
        team2: '',
        totalOvers: '',
        oversPerSkin: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Check for empty values
        if (!formData.team1.trim()) {
            newErrors.team1 = 'Team 1 name is required';
        }
        if (!formData.team2.trim()) {
            newErrors.team2 = 'Team 2 name is required';
        }
        if (!formData.totalOvers) {
            newErrors.totalOvers = 'Total overs is required';
        }
       
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const UpdateStatus = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setBtnLoading(true);
            try {
                const DEV_API = process.env.REACT_APP_DEV_API;
                const token = localStorage.getItem('authToken');

                const response = await axios.post(`${DEV_API}/api/updateStatus`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.status === 401 || response.data.status === 403) {
                    navigate('/login');
                    return
                }
                toast.success(response?.data?.message);
                const matchId = response.data.data._id;

                // Save matchId to localStorage
                localStorage.setItem('matchId', matchId);
                localStorage.setItem('matchInfo', JSON.stringify(formData));

                // Navigate to score table
            } catch (error) {
                console.error('Error creating match:', error);
                // Handle unauthorized access
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setBtnLoading(false);
            }
        }
    };

    const handleUpdateStatus = () => {
        setStatusChange(true);
    };






    const handlePageChange = (page) => {
        setPage(page);
        // fetchCustomers(page, perPage, false, search);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setLoading(true);
        // fetchCustomers(page, newPerPage, true);
        // fetchCustomers(page, newPerPage, true, search);
    };



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
            selector: row => row?.fullname,
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
                                    checked={row.status === 1}
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
                                <li className='skipg_page_header_custm_title_btn_hide'><button className="box_cric_btn" onClick={() => setAddCategoryPopup(!addCategoryPopup)}>+ Add Customer</button></li>

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
                            // required={!isEdit}
                            />
                        </div>

                    </div>
                </form>
            </Popup>

            <ConfirmationPopup
                shownPopup={!!statusChange}
                closePopup={() => setStatusChange(false)}
                type={"User"}
                removeAction={() => {
                    // getDeleteData(statusChange);
                    setStatusChange(false);
                }}
            />

        </>
    );
}
export default Users;
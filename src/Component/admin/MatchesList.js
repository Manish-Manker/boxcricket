"use client";
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import moment from 'moment';
import svg from '../common/svg';
import ConfirmationPopup from '../common/confirmPopup';
import PageLoader from '../common/pageLoader';
import Popup from '../common/Popup';
import Logout from '../common/logout';
import axios from 'axios';
import { toast } from 'react-toastify';

const MatchesList = (props) => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userId, setUserId] = useState('');
    const [addCategoryPopup, setAddCategoryPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [customerList, setCustomerList] = useState('');
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [statusChange, setStatusChange] = useState(false);
    const [page, setPage] = useState(1);
    const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);


    const loadData = async () => {

        let userId = localStorage.getItem('userId')
        let token = localStorage.getItem('authToken');
        const DEV_API = process.env.REACT_APP_DEV_API;

        let responce = await axios.get(`${DEV_API}/api/userwisematch/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (responce.data.status === 200) {
            console.log("data", responce?.data?.data);
            setCustomerList(responce?.data?.data);
        }
    }

    useEffect(() => {
        loadData();
    }, [])




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


    const statusOption = [
        { value: 'completed', label: 'Completed' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'canceled', label: 'Canceled' },
    ]
    const renderMatchStatus = (status) => {
        let statusClass;
        let statustext;

        switch (status) {
            case "completed":
                statusClass = 'ps-complete-bg';
                statustext = 'Completed';
                break;
            case "ongoing":
                statusClass = 'ps-process-bg';
                statustext = 'Ongoing';
                break;
            case 'cancel':
                statusClass = 'ps-cancel-bg';
                statustext = 'Canceled';
                break;
            default:
                statusClass = 'status-unknown';
                statustext = 'Unknown';
        }

        return (<>

            <div className='ps_admin_table_status'>
                <span className={`ps_match_status_bg ${statusClass}`}>{statustext}</span>
            </div>
        </>
        )
    }

    const columns = [
        {
            name: '#', width: '70px', center: 1,
            cell: (row, index) => (
                <span>{(page - 1) * perPage + index + 1}</span>
            )
        },
        {
            name: 'Team 1', wrap: true,
            selector: row => row?.team1,
            sortable: true,
        },

        {
            name: '', wrap: true,
            // selector: row => row?.team1,
            sortable: true,
            cell: (row) => (
                <div className='ps-process'>vs</div>
            )
        },
        { name: 'Team 2', selector: row => row.team2, sortable: true, },
        { name: 'Overs', selector: row => row.totalOvers, sortable: true, },
        { name: 'Overs/Skin', selector: row => row.oversPerSkin, sortable: true, },

        {
            name: 'Status',
            sortable: false,
            cell: (row) => (
                renderMatchStatus(row.status)
            )
        },


        {
            name: 'Date',
            selector: row => moment(row.createdAt).format('Do MMM YYYY'),
            sortable: true,
        },

        // {
        //     name: 'Actions',
        //     cell: (row) => (
        //         <div className="pu_datatable_btns">
        //             <a className="pu_dt_btn ">{svg.app.dash_edit}</a>
        //         </div>
        //     )
        // },
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
                                <h3 className="m-0">Matches List</h3>
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
                                <li className='skipg_page_header_custm_title_btn_hide'> <Logout /></li>

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
export default MatchesList;
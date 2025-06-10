
import { useEffect, useState } from 'react';
import DataTable, { Alignment } from 'react-data-table-component';
import Select from 'react-select';
import moment from 'moment';
import svg from '../common/svg';
import ConfirmationPopup from '../common/confirmPopup';
import PageLoader from '../common/pageLoader';
import Popup from '../common/Popup';
import Logout from '../common/logout';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FullMatchPDF from '../FullMatchPDF';
import { createRoot } from 'react-dom/client';

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

    const [totalRows, setTotalRows] = useState(10);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [statusChange, setStatusChange] = useState(false);

    const [filterCustomerList, setfilterCustomerList] = useState([])
    const [isFilter, setIsFilter] = useState(false);


    const loadData = async (page, perPage) => {

        let userId = localStorage.getItem('userId')
        let token = localStorage.getItem('authToken');
        const DEV_API = process.env.REACT_APP_DEV_API;
        setLoading(true);
        let responce = await axios.post(`${DEV_API}/api/userwisematch/${userId}`, { page, perPage }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (responce.data.status === 200) {
            let data = responce?.data?.data
            let totalData = responce?.data?.totalData
            setCustomerList(data);
            setTotalRows(totalData);
            setLoading(false);
        }
    }



    useEffect(() => {
        loadData(page, perPage);
    }, [page, perPage])





    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setPage(1);
        loadData();
    };

    const viewMatchesPDF = async (data) => {
        let token = localStorage.getItem('authToken');
        const DEV_API = process.env.REACT_APP_DEV_API;
        let matchId = data._id
        let pdfWindow = null;

        try {
            let response = await axios.get(`${DEV_API}/api/match/${matchId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 200) {
                let data = response?.data?.data;
                let matchInfo = data?.matchInfo;
                let team1Data = data?.team1Data;
                let team2Data = data?.team2Data;

                // Create a temporary div to render the PDF
                const tempDiv = document.createElement('div');
                const root = createRoot(tempDiv);

                root.render(
                    <PDFDownloadLink
                        document={
                            <FullMatchPDF
                                matchInfo={matchInfo}
                                team1Data={team1Data}
                                team2Data={team2Data}
                            />
                        }
                        fileName="match-details.pdf"
                    >
                        {({ blob, url, loading, error }) => {
                            if (!loading && url) {
                                // Clean up any previous PDF URL
                                if (pdfWindow && !pdfWindow.closed) {
                                    pdfWindow.close();
                                }
                                // Open new PDF in a tab
                                pdfWindow = window.open(url, '_blank');
                                // Clean up the URL object to free memory
                                URL.revokeObjectURL(url);
                            }
                            return null;
                        }}
                    </PDFDownloadLink>
                );

                // Cleanup function
                return () => {
                    root.unmount();
                    if (tempDiv.parentNode) {
                        tempDiv.parentNode.removeChild(tempDiv);
                    }
                };
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };


    const statusOption = [
        { value: 'completed', label: 'Completed' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'cancel', label: 'Canceled' },
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

        {
            name: 'Scorecard',
            cell: (row) => (
                <div className="pu_datatable_btns">
                    <a className="pu_dt_btn" onClick={() => viewMatchesPDF(row)} >{svg.app.view_icon}</a>
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

    const handleBackClick = () => {
        window.history.go(-1);
    };


    const applyFilters = (selectedStatusOption) => {
        const status = selectedStatusOption?.value;
        const filteredData = customerList.filter(user => {
            const matchStatus = status ? user.status === status : true;
            return matchStatus;
        });
        setfilterCustomerList(filteredData);
        setIsFilter(status ? true : false);
    };

    return (
        <>
            <div className='ps_table_box '>

                <div className=" box_cric_score_all_btn box_cric_btn_score justify-content-between px-4">

                    <div>
                        <div className='box_cric_back_btn' onClick={handleBackClick}>
                            {svg.app.back_icon} Back
                        </div>
                    </div>
                    <div className='box_cric_score_all_btn m-0'>

                        <Logout />
                    </div>
                </div>
                <div className="ps-table-design m-4">

                    <div className="pu_datatable_wrapper skipg_dash_table">
                        <div className='page_tittle_head fwrap'>
                            <div className="box_cric_team_heading">
                                <h3 className="m-0">{localStorage.getItem('userName') || ''} -  Matches List</h3>
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
                                                applyFilters(selectedStatusOption);
                                            }}
                                        />
                                    </div>
                                </li>

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
                                highlightOnHover={true}
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
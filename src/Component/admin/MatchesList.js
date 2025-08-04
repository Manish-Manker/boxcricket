
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import moment from 'moment';
import svg from '../common/svg';
import ConfirmationPopup from '../common/confirmPopup';
import PageLoader from '../common/pageLoader';
import Popup from '../common/Popup';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FullMatchPDF from '../FullMatchPDF';
import { createRoot } from 'react-dom/client';
import { toast } from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom'

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

    const [status, setStatus] = useState('');

    const [filterCustomerList, setfilterCustomerList] = useState([])
    const [isFilter, setIsFilter] = useState(false);
    const DEV_API = process.env.REACT_APP_DEV_API;
    const navigate = useNavigate();


    const [currentStatus, setCurrentStatus] = useState(null); 
    const [statusToChange, setStatusToChange] = useState(null); 
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null); 


    const loadData = async (page, perPage, status) => {

        try {
            let userId = localStorage.getItem('userId')
            let token = localStorage.getItem('authToken');
            const DEV_API = process.env.REACT_APP_DEV_API;
            setLoading(true);
            let responce = await axios.post(`${DEV_API}/api/userwisematch/${userId}`, { page, perPage, status }, {
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

            if (responce.data.status === 401 || responce.data.status === 403) {
                toast.error(responce?.data?.message);
                navigate('/login');
                return
            }

        } catch (error) {
            console.log("Error", error);
            navigate('/admin/users');
        }
    }

    useEffect(() => {
        loadData(page, perPage, status);
    }, [page, perPage, status]);

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setPage(1);
        loadData();
    };

    const viewMatchesPDF = async (data) => {
        let token = localStorage.getItem('authToken');
        const DEV_API = process.env.REACT_APP_DEV_API;
        let matchId = data._id;
        let cleanupFunction = null;

        setLoading(true);

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

                // Clean up previous render if exists
                if (cleanupFunction) {
                    cleanupFunction();
                }

                // Create a temporary div to render the PDF
                const tempDiv = document.createElement('div');
                const root = createRoot(tempDiv);

                let isDownloaded = false;

                root.render(
                    <PDFDownloadLink
                        document={
                            <FullMatchPDF
                                matchInfo={matchInfo}
                                team1Data={team1Data}
                                team2Data={team2Data}
                            />
                        }
                        fileName={`match-details-${matchId}.pdf`}
                    >
                        {({ blob, url, loading, error }) => {
                            if (!loading && url && !isDownloaded) {
                                isDownloaded = true; // Prevent multiple downloads
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `match-details-${matchId}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                                setLoading(false);

                                // Cleanup immediately after download
                                setTimeout(() => {
                                    root.unmount();
                                    if (tempDiv.parentNode) {
                                        tempDiv.parentNode.removeChild(tempDiv);
                                    }
                                }, 100);
                            }
                            return null;
                        }}
                    </PDFDownloadLink>
                );
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
            setLoading(false);
        }
    };


    const statusOption = [
        { value: 'completed', label: 'Completed' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'cancel', label: 'Canceled' },
    ]

   const handleChange = (event, row) => {
        const value = event.target.value;

        setCurrentStatus(value); // Store the new status in state
        setStatusToChange(value); // Store the new status for confirmation
        setSelectedMatch(row); // Store which match is being changed
        setShowConfirmationPopup(true); // Trigger the confirmation popup
    };

    const confirmStatusChange = async () => {
        if (selectedMatch) {
            try {
                setLoading(true);
                let token = localStorage.getItem('authToken');
                let matchId = selectedMatch._id;

                let response = await axios.put(`${DEV_API}/api/chnageStatus`, { matchId, status: statusToChange },
                    { headers: { 'Authorization': `Bearer ${token}` } });

                if (response.status === 200) {
                    setCustomerList((prev) => prev.map((item) => item._id === matchId ? { ...item, status: statusToChange } : item));
                    toast.success(response?.data?.message);
                }
            } catch (error) {
                console.error("Error updating status:", error);
            } finally {
                setLoading(false);
                setShowConfirmationPopup(false); // Close popup irrespective of success/failure
                // Reset states after confirmation
                setCurrentStatus(null);
                setSelectedMatch(null);
                setStatusToChange(null);
            }
        }
    };


    const renderMatchStatus = (status) => {
        let statusClass;
        let statustext;

        switch (status.status) {
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
            {/* 
            <div className='ps_admin_table_status'>
                <span className={`ps_match_status_bg ${statusClass}`}>{statustext}</span>
            </div> */}

            <div className='ps_matches_dropd'>
                <div className='ps_defalt_drop'>
                    <select className={`ps_match_status_box ${statusClass}`} value={status.status} 
                    onChange={(event) => handleChange(event, status)} >
                        <option className='ps_match_status_box_select' value="completed">Complete</option>
                        <option className='ps_match_status_box_select' value="ongoing">Ongoing</option>
                        <option className='ps_match_status_box_select' value="cancel">Cancel</option>
                    </select>
                </div>
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
            // sortable: true,
        },

        {
            name: '', wrap: true,
            // selector: row => row?.team1,
            // sortable: true,
            cell: (row) => (
                <div className='ps-process'>vs</div>
            )
        },
        { name: 'Team 2', selector: row => row.team2, },
        { name: 'Overs', selector: row => row.totalOvers, },
        { name: 'Overs/Skin', selector: row => row.oversPerSkin, },

        {
            name: 'Status',
            width: '200px',
            // sortable: false,
            cell: (row) => (
                renderMatchStatus(row)
            )
        },


        {
            name: 'Date',
            selector: row => moment(row.createdAt).format('Do MMM YYYY'),
            // sortable: true,
        },

        {
            name: 'Action',
            cell: (row) => (
                <div className="pu_datatable_btns ">
                    <a className="pu_dt_btn ps_tooltip_icon" onClick={() => viewMatchesPDF(row)} ><span className="tooltiptext">Download Match PDF</span> {svg.app.pdf_download_icon}</a>
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

    const cancelStatusChange = () => {
        setShowConfirmationPopup(false); // Close popup without action
        setCurrentStatus(null); // Reset current status
        setSelectedMatch(null); // Clear selected match
    };


    return (
        <>

         <AdminLayout showBackButton={true} onBackClick={handleBackClick} />
            <div className='ps_table_box ps_admin_p5'>
                <div className="ps-table-design ">

                    <div className="pu_datatable_wrapper skipg_dash_table">
                        <div className='page_tittle_head fwrap mb-3'>
                            <div className="box_cric_team_heading">
                                <h3 className="m-0"> Matches List - <span>{localStorage.getItem('userName') || ''}</span></h3>
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
                                                setStatus(selectedStatusOption?.value);
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
                            />
                        </div>

                    </div>
                </form>
            </Popup>

           <ConfirmationPopup
                shownPopup={showConfirmationPopup}
                closePopup={cancelStatusChange}
                title="Confirm Status Change"
                subTitle={`Are you sure you want to change the status to "${statusToChange}"?`}
                removeAction={confirmStatusChange}
            />

        </>
    );
}
export default MatchesList;
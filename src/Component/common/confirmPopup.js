import React, { useState, useEffect } from 'react';
import svg from './svg';


function ConfirmationPopup({
    shownPopup,
    closePopup,
    title,
    subTitle,
    type,
    removeAction
}) {
    return shownPopup ? (
        <>
            <div className="modal-backdrop rz_confirmPopup"
                onClick={() => closePopup}
            >
                <div
                    className="confirmation-modal-content"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    <a className="rz_closeIcon" onClick={closePopup}>
                        {svg.app.close_icon}
                    </a>
                    <div className='modal-body '>
                        <div className='rz_confirmModal'>
                           
                            <div className='rz_textCOntent '>
                                <div className="skipg_delete_img"><img src="./images/warning.png" /></div>
                                <h4>{title ? title : `Are you sure you want to delete this ${type ? type : 'item'} ?`}</h4>
                                <p>{subTitle ? subTitle : `This ${type ? type : 'item'} will be deleted immediately.`}<span> You can&apos;t undo this action</span></p>                           

                               
                                <div className="ps_conforms_btns">
                                    <button className="box_cric_btn box_cric_btn_logout" style={{minWidth: "150px"}} onClick={closePopup}  >
                                        No
                                    </button>
                                    <button className="box_cric_btn " style={{minWidth: "160px"}} onClick={removeAction}>
                                        Yes, Delete
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    ) : null;
}

export default ConfirmationPopup;
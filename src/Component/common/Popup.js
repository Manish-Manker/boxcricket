import { useEffect, useState } from 'react';
// import styles from './Popup.module.css';
import PropTypes from "prop-types";
import svg from './svg';
// import svg from '../../svg';

const Popup = (props) => {
    const [show, setShow] = useState(false);
    const closeHandler = (e) => {
        setShow(false);
        props.onClose(false);
    };

    useEffect(() => {
        setShow(props.show);
        document.body.addEventListener('keyup', function (e) {
            if (e.key === "Escape") {
                closeHandler()
            }
        });
    }, [props.show]);


    return (
        <>
            <div id={props.popupid} className={(props?.className || '') + ' ' + "popup_wrapper" + ' ' + (show ? "in" : '')}>
                <div className="popup_inner" style={{ maxWidth: (props.maxWidth ? props.maxWidth : '') }}>
                    <div className="popup_close" onClick={closeHandler}>{svg.app.close_icon}</div>
                    {props.heading ?
                        <div className="popup_heading_wrapper">
                            {props.heading ? <div className="popup_heading">{props.heading}</div> : ''}
                            {props.subHeading ? <div className="popup_subheading">{props.subHeading}</div> : ''}

                        </div>
                        : null}
                    {props.children}
                </div>
                <div className="popup_overlay_close" onClick={closeHandler}></div>
            </div>
        </>
    );
}

Popup.propTypes = {
    heading: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Popup;
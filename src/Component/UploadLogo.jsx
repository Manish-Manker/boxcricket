import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // You'll likely need to configure axios for your backend
import PageLoader from '../Component/common/pageLoader';
import svg from '../Component/common/svg';
import { toast } from 'react-toastify';

const UploadLogo = () => {
    const [mainLogo, setMainLogo] = useState(null);
    const [mainLogoPreview, setMainLogoPreview] = useState(null);
    const [ads, setAds] = useState([{ image: null, preview: null }]); // Start with one ad slot

    const handleMainLogoChange = (e) => {
        const file = e.target.files[0];
        setMainLogo(file);
        setMainLogoPreview(URL.createObjectURL(file));
    };

    const handleAdChange = (index, e) => {
        const file = e.target.files[0];
        const updatedAds = [...ads];
        updatedAds[index].image = file;
        updatedAds[index].preview = URL.createObjectURL(file);
        setAds(updatedAds);
    };

    const addAd = () => {
        setAds([...ads, { image: null, preview: null }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //  Here you would handle the upload to your backend using axios.  This is a placeholder.
        try {
            const formData = new FormData();
            formData.append('mainLogo', mainLogo);
            ads.forEach((ad, index) => {
                if (ad.image) {
                    formData.append(`ad${index + 1}`, ad.image);
                }
            });

            const response = await axios.post('/api/upload', formData, { // Replace '/api/upload' with your endpoint
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload successful:', response.data);
            toast.success('Upload successful!');

        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed. Please try again.');
        }
    };


    return (
        <div className='ps_setting_'>
            <div className='w-100'>
                <div className='bc_form_head'>
                    <h3 className='text-start'>Upload Logos</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="mainLogo" className="skipg_form_input_label">Main Logo</label>
                    <div className="d-flex justify-content-between align-items-center">

                        {/* <input type="file" className="form-control" id="mainLogo" onChange={handleMainLogoChange} /> */}
                        <div className='d-flex align-items-center gap-4'>
                            <div className='ps_setting_image_name'><label className="form-label">Logo </label></div>
                            <div class="sylb_upload_modal_box">
                                <label for="mainLogo" class="upload-box text-center">
                                    <input type="file" id="mainLogo" onChange={handleMainLogoChange} class="d-none" />
                                    <div class="upload-content"><div class="upload-icon">+</div>

                                    </div>
                                </label>
                            </div>
                        </div>
                        {mainLogoPreview && (
                            <img src={mainLogoPreview} alt="Main Logo Preview" className="ps_setting_logos_img img-fluid mt-2" />
                        )}
                    </div>

                    <div className='ps_setting_info_cp d-flex justify-content-between '>
                        <h4>Ads</h4>
                        <button type="button" className="box_cric_btn box_cric_btn_sm" onClick={addAd}>+</button>
                    </div>
                    <div>

                        {ads.map((ad, index) => (
                            <div key={index} className="ps_setting_upload_img_flex ">

                                <div className='d-flex align-items-center gap-4'>
                                    <div className='ps_setting_image_name'><label htmlFor={`ad${index + 1}`} className="form-label">Ad {index + 1}</label></div>
                                    <div class="sylb_upload_modal_box">
                                        <label for={`ad${index + 1}`} class="upload-box text-center">
                                            <input type="file" id={`ad${index + 1}`} onChange={(e) => handleAdChange(index, e)} class="d-none" />
                                            <div class="upload-content"><div class="upload-icon">+</div>

                                            </div>
                                        </label>
                                    </div>

                                </div>
                                {/* <div> <input type="file" className="form-control" id={`ad${index + 1}`} onChange={(e) => handleAdChange(index, e)} /></div> */}
                                {ad.preview && (
                                    <img src={ad.preview} alt={`Ad ${index + 1} Preview`} className="ps_setting_logos_img img-fluid mt-2" />
                                )}
                            </div>
                        ))}

                    </div>
                    <button type="submit" style={{ maxWidth: "fit-content", padding: "0px 30px" }} className="box_cric_btn mt-4">Upload</button>
                </form>
            </div>
        </div>
    );
};

export default UploadLogo;
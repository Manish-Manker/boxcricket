import React, { useState, useEffect, use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import svg from './common/svg';
const DEV_API = process.env.REACT_APP_DEV_API;


const UploadLogo = () => {
    const [mainLogo, setMainLogo] = useState(null);
    const [mainLogoPreview, setMainLogoPreview] = useState(null);
    const [ads, setAds] = useState([{ image: null, preview: null }]);

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

    useEffect(() => {
        getimages();
        // Cleanup function to revoke object URLs
        return () => {
            if (mainLogoPreview) {
                URL.revokeObjectURL(mainLogoPreview);
            }
            ads.forEach(ad => {
                if (ad.preview) {
                    URL.revokeObjectURL(ad.preview);
                }
            });
        };
    }, []);

    const getimages = async () => {
        try {
            const response = await axios.get(`${DEV_API}/api/getimages`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            const { mainLogo, ads } = response.data.data;

            if (mainLogo) {
                setMainLogoPreview(DEV_API + mainLogo);
                console.log('Main Logo URL:', DEV_API + mainLogo);
            }
            if (ads && ads.length > 0) {
                const updatedAds = ads.map(ad => ({
                    image: ad.field,
                    preview: DEV_API + ad.path
                }));
                setAds(updatedAds);
            } else {
                setAds([{ image: null, preview: null }]);
            }

        } catch (error) {
            console.log('Error fetching images:', error);
            toast.error('Error fetching images. Please try again later.');

        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append('mainLogo', mainLogo);

            ads.forEach((ad, index) => {
                if (ad.image) {
                    formData.append(`ad${index + 1}`, ad.image);
                }
            });

            const response = await axios.post(`${DEV_API}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,

                }
            });
            console.log('Upload successful:', response.data);
            toast.success('Upload successful!', response.data?.message);

        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed. Please try again.');
        }
    };

    const handleDelete = (data) => {
        console.log("---->."+data);

        
        
        if (data === 'mainLogo') {
            setMainLogo(null);
            setMainLogoPreview(null);
        } else {
            const updatedAds = ads.filter((ad, index) => index !== data);
            setAds(updatedAds);
        }
        toast.success('Image deleted successfully!');
    }

    return (
        <div className='ps_setting_'>
            <div className='w-100'>
                <div className='bc_form_head'>
                    <h3 className='text-start'>Upload Logos</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="mainLogo" className="skipg_form_input_label">Main Logo</label>
                    <div className="d-flex justify-content-between align-items-center">

                        <div className='d-flex align-items-center gap-4'>
                            <div className='ps_setting_image_name'><label className="form-label">Logo </label></div>
                            {!mainLogoPreview &&
                                <div className="sylb_upload_modal_box">
                                    <label htmlFor="mainLogo" className="upload-box text-center">
                                        <input type="file" accept=".png, .jpeg, .jpg" id="mainLogo" onChange={handleMainLogoChange} className="d-none" />
                                        <div className="upload-content"><div className="upload-icon">+</div>
                                        </div>
                                    </label>
                                </div>
                            }
                        </div>
                        {mainLogoPreview && (
                            <div className='d-flex align-items-center gap-3'>
                                <img src={mainLogoPreview} alt="Main Logo Preview" className="ps_setting_logos_img img-fluid mt-2" />
                                <button className='box_cric_btn box_cric_btn_sm' onClick={(e)=>{e.preventDefault(); handleDelete('mainLogo')}}>{svg.app.dash_delete} </button>
                            </div>
                        )}
                    </div>

                    <div className='ps_setting_info_cp d-flex justify-content-between '>
                        <h4>Ads</h4>
                        <button  type="button" className="box_cric_btn_light " onClick={addAd}>+ Add</button>
                    </div>
                    <div>
                        {ads.map((ad, index) => (
                            <div key={index} className="ps_setting_upload_img_flex ">
                                <div className='d-flex align-items-center gap-4'>
                                    <div className='ps_setting_image_name'><label htmlFor={`ad${index + 1}`} className="form-label">Ad {index + 1}</label></div>
                                    {!ad.preview &&
                                        <div className="sylb_upload_modal_box">
                                            <label htmlFor={`ad${index + 1}`} className="upload-box text-center">
                                                <input type="file" accept=".png, .jpeg, .jpg" id={`ad${index + 1}`} onChange={(e) => handleAdChange(index, e)} className="d-none" />
                                                <div className="upload-content"><div className="upload-icon">+</div>
                                                </div>
                                            </label>
                                        </div>
                                    }
                                </div>
                                {/* <div> <input type="file" className="form-control" id={`ad${index + 1}`} onChange={(e) => handleAdChange(index, e)} /></div> */}
                                {ad.preview && (
                                    <div className='d-flex align-items-center gap-3'>
                                    <img src={ad.preview} alt={`Ad ${index + 1} Preview`} className="ps_setting_logos_img img-fluid mt-2" />
                                    <button className='box_cric_btn box_cric_btn_sm' onClick={(e)=>{e.preventDefault(); handleDelete(index)}} >{svg.app.dash_delete}</button>
                                    </div>
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
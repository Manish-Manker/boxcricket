import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import PageLoader from '../common/pageLoader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Varifyemail = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

      useEffect(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }, []);

    useEffect(() => {
        const verify = async () => {
            setLoading(true);
            const DEV_API = process.env.REACT_APP_DEV_API;
            const token = window.location.search.split('?')[1];

            try {
                const responce = await axios.post(`${DEV_API}/api/verifyemail`, { token });

                if (responce.data.status === 200) {
                    toast.success(responce?.data?.message);
                    localStorage.setItem('authToken', responce.data.token);
                    localStorage.setItem('userData', JSON.stringify(responce.data.user));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${responce.data.token}`;
                }
                else if (responce.data.status === 202 && responce.data.message === 'Email is already verified') {
                    toast.success(responce?.data?.message);
                    
                }
            } catch (error) {
                console.log(error);
                return;
            } finally {
                setTimeout(() => {
                    navigate('/input');
                }, 1000);
                setLoading(false);
            }
        };

        verify();
    }, []);


    return (
        <>
            {loading && <PageLoader />}
        </>
    )
}

export default Varifyemail
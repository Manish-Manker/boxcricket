
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';

const DEV_API = process.env.REACT_APP_DEV_API;
const PKey = process.env.REACT_APP_DEV_PublishableKey;
const stripePromise = loadStripe(PKey + '');

const CheckoutButton = ({ planeName, btnTheame }) => {

    const navigate = useNavigate();

    const handleCheckout = async () => {

        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('userData');

        if (!token || !user) {
            toast.warning("You need to be logged in to make a purchase.");
            navigate('/login');
            return;
        }

        let priceId;
        if (planeName === "Basic Plan") {
            priceId = process.env.REACT_APP_DEV_Basic_PriceId + '';
        } else if (planeName === "Pro Plan") {
            priceId = process.env.REACT_APP_DEV_Pro_PriceId + '';
        } else {
            toast.error("Invalid plan selected.");
            return;
        }

        if (!priceId) {
            toast.error("Price ID is not available. Please try again later.");
            return;
        }

        let userEmail = JSON.parse(user)?.email;
        let userId = JSON.parse(user)?.id;
        if (!userEmail || !userId) {
            toast.error("User email or ID not found. Please log in again.");
            return;
        }

        try {
            let res = await axios.post(`${DEV_API}/api/createSubscriptionSession`, { priceId , userEmail, userId , planeName }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (res.status !== 200) {
                toast.error("Failed to create checkout session. Please try again.");
                return;
            }

            if (res.data?.status === 401 || res.data?.status === 403) {
                toast.error(res?.data?.message);
                navigate('/login');
                return
            }

            if (res.data.status == 400) {
                toast.error((await res).data.message)
                return;
            }

            const { sessionId } = res.data;
            const stripe = await stripePromise;
            stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            toast.error(error.message || "An error occurred while processing your request.");
            console.log(error);
            return;

        }
    };

    return <button className={`ps_lp_btn ${btnTheame === "dark" ? "ps_lp_btn_dark" : ""} `} style={{ margin: "auto", width: "100%" }} onClick={handleCheckout}>Buy Now</button>;
};

export default CheckoutButton;

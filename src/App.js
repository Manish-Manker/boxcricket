import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputInfo from './Component/InputInfo'
import ScoreTable from './Component/ScoreTable'
import './index.css';
import FinalScore from './Component/FinalScore'
import Display from './Component/Display';
import Signup from './Component/auth/Singup';
import Login from './Component/auth/Login';
import Users from './Component/admin/Users.js'
import NotFound from './NotFound';
import MatchesList from './Component/admin/MatchesList';
import ForgotPassword from './Component/auth/ForgotPassword';
import ProtectedRoute from './Component/ProtectedRoute'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ResetPassword from './Component/auth/ResetPassword.jsx';
import LandingPage from './Component/auth/LandingPage.jsx';

const App = () => {

  return (
    <>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
        limit={1}
      />

      <BrowserRouter>
        <Routes>

          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />


          <Route element={<ProtectedRoute />} >

            <Route path="/input" element={<InputInfo />} />
            <Route path="/scoretable" element={<ScoreTable />} />
            <Route path="/display" element={<Display />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/matchList" element={<MatchesList />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputInfo from './Component/InputInfo'
import ScoreTable from './Component/ScoreTable'
import './index.css';
import FinalScore from './Component/FinalScore'
import Display from './Component/Display';
import Signup from './Component/Singup';
import Login from './Component/Login';
import Users from './Component/admin/Users.js'
import NotFound from './NotFound';
import MatchesList from './Component/admin/MatchesList';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
        limit={1}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<InputInfo />} />
          <Route path="/scoretable" element={<ScoreTable />} />
          <Route path="/display" element={<Display />} />

           <Route path="/admin/users" element={<Users />} />
           <Route path="/admin/matchList" element={<MatchesList />} />

           <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
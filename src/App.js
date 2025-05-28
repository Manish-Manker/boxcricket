import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputInfo from './Component/InputInfo'
import ScoreTable from './Component/ScoreTable'
import './index.css';
import FinalScore from './Component/FinalScore'
import Display from './Component/Display';
import Signup from './Component/Singup';
import Login from './Component/Login';
const App = () => {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<InputInfo />} />
          <Route path="/scoretable" element={<ScoreTable />} />
          <Route path="/display" element={<Display />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
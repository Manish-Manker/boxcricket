import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputInfo from './Component/InputInfo'
import ScoreTable from './Component/ScoreTable'
import './index.css';
import FinalScore from './Component/FinalScore'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputInfo />} />
        <Route path="/scoretable" element={<ScoreTable />} />
        <Route path="/finalscore" element={<FinalScore />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
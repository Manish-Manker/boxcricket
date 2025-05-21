import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputInfo from './Component/InputInfo'
import ScoreTable from './Component/ScoreTable'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputInfo />} />
        <Route path="/scoretable" element={<ScoreTable />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
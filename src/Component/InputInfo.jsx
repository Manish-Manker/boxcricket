import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const InputInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    totalOvers: '',
    oversPerSkin: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Save to localStorage
    localStorage.setItem('matchInfo', JSON.stringify(formData))
    
    // Navigate to score table
    navigate('/scoretable')
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Team 1 Name</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.team1}
                onChange={(e) => setFormData({...formData, team1: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Team 2 Name</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.team2}
                onChange={(e) => setFormData({...formData, team2: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Number of Overs</label>
              <input 
                type="number" 
                className="form-control"
                value={formData.totalOvers}
                onChange={(e) => setFormData({...formData, totalOvers: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Overs per Skin</label>
              <input 
                type="number" 
                className="form-control"
                value={formData.oversPerSkin}
                onChange={(e) => setFormData({...formData, oversPerSkin: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InputInfo
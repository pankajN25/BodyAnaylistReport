// BodyAnalysisForm3.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BodyAnalysisForm3.css';

const BodyAnalysisForm3 = ({ onSubmit }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    wholeBodySubFat: '',
    trunkSubFat: '',
    armSubFat: '',
    legSubFat: '',
    skeletalMuscle: '',
    trunkMuscle: '',
    armsMuscle: '',
    legsMuscle: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };
  
  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Body Analysis Report</h2>
      <p className="form-subtitle">Form 3 - Fat and Muscle Analysis</p>

      <form onSubmit={handleSubmit} className="body-analysis-form">
        <div className="analysis-table">
          {/* Header Row */}
          <div className="table-header-row">
            <div className="header-cell"></div>
            <div className="header-cell" style={{color:'black'}}>Male </div>
            <div className="header-cell" style={{color:'black'}}>Female </div>
            <div className="header-cell" style={{color:'black'}}>Your Analysis</div>
          </div>

          {/* Subcutaneous Fat Section */}
          <div className="table-section-title">Subcutaneous Fat Analysis (%)</div>

          <div className="table-row">
            <div className="metric-cell">Whole Body Subcutaneous Fat</div>
            <div className="value-cell">15 %</div>
            <div className="value-cell">20 %</div>
            <div className="input-cell">
              <input name="wholeBodySubFat" onChange={handleChange} value={formData.wholeBodySubFat} />
            </div>
          </div>

          <div className="table-row">
            <div className="metric-cell">Trunk</div>
            <div className="value-cell">15 %</div>
            <div className="value-cell">20 %</div>
            <div className="input-cell">
              <input name="trunkSubFat" onChange={handleChange} value={formData.trunkSubFat} />
            </div>
          </div>
          
          <div className="table-row">
            <div className="metric-cell">Arm</div>
            <div className="value-cell">20 %</div>
            <div className="value-cell">25 %</div>
            <div className="input-cell">
              <input name="armSubFat" onChange={handleChange} value={formData.armSubFat} />
            </div>
          </div>

          <div className="table-row">
            <div className="metric-cell">Legs</div>
            <div className="value-cell">20 %</div>
            <div className="value-cell">25 %</div>
            <div className="input-cell">
              <input name="legSubFat" onChange={handleChange} value={formData.legSubFat} />
            </div>
          </div>

          {/* Skeletal Muscle Section */}
          <div className="table-section-title blue-section-title">Skeletal Muscle Analysis (%)</div>

          <div className="table-row">
            <div className="metric-cell">Skeletal </div>
            <div className="value-cell">37 %</div>
            <div className="value-cell">33 %</div>
            <div className="input-cell">
              <input name="skeletalMuscle" onChange={handleChange} value={formData.skeletalMuscle} />
            </div>
          </div>

          <div className="table-row">
            <div className="metric-cell">Trunk</div>
            <div className="value-cell">30 %</div>
            <div className="value-cell">35 %</div>
            <div className="input-cell">
              <input name="trunkMuscle" onChange={handleChange} value={formData.trunkMuscle} />
            </div>
          </div>
          
          <div className="table-row">
            <div className="metric-cell">Arms </div>
            <div className="value-cell">45 %</div>
            <div className="value-cell">40 %</div>
            <div className="input-cell">
              <input name="armsMuscle" onChange={handleChange} value={formData.armsMuscle} />
            </div>
          </div>
          
          <div className="table-row">
            <div className="metric-cell">Legs </div>
            <div className="value-cell">50 %</div>
            <div className="value-cell">45 %</div>
            <div className="input-cell">
              <input name="legsMuscle" onChange={handleChange} value={formData.legsMuscle} />
            </div>
          </div>

        </div>

        <div className="button-container">
          <button type='button' onClick={handleBack} className='back-button'>← Back</button>
          <button type="submit" className="submit-button">Submit All Data</button>
        </div>
      </form>
    </div>
  );
};

export default BodyAnalysisForm3;
// BodyAnalysisForm2.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BodyAnalysisForm2.css';

const BodyAnalysisForm2 = ({ onSubmit }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bodyFat: '',
    visceralFat: '',
    restingMetabolism: '',
    bmi: '',
    bodyAge: '',
  });

  const getStatus = (metric, value, gender) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue === 0) return '';
    
    // We'll assume Male for this simplified example
    const actualGender = gender || 'male';

    const ranges = {
      bodyFat: { male: { normal: [10, 20], high: [20, 24] }, female: { normal: [20, 28], high: [28, 34] } },
      visceralFat: { male: { normal: [0, 9], high: [10, 14] }, female: { normal: [0, 9], high: [10, 14] } },
      restingMetabolism: { male: { normal: [1800, 2000] }, female: { normal: [1600, 1800] } },
      bmi: { male: { normal: [0, 23], high: [23, 26] }, female: { normal: [0, 22], high: [22, 26] } },
      bodyAge: { normal: 'normal' }
    };
    const metricRanges = ranges[metric][actualGender] || ranges[metric];

    if (metric === 'bodyAge') {
      return 'normal'; // Simplified, no ranges in image
    } else if (metric === 'restingMetabolism' && actualGender) {
      if (numValue >= metricRanges.normal[0] && numValue <= metricRanges.normal[1]) return 'normal';
      return 'high'; // Classified as high if outside normal range
    } else if (actualGender) {
      if (numValue <= metricRanges.normal[1]) return 'normal';
      if (numValue > metricRanges.normal[1] && numValue <= metricRanges.high[1]) return 'high';
      return 'risk';
    } else {
      return '';
    }
  };

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
      <p className="form-subtitle">Form 2 - Detailed Analysis</p>

      <form onSubmit={handleSubmit} className="body-analysis-form">
        <div className="analysis-table">
          {/* Table Header */}
          <div className="table-header-row">
            <div className="header-cell empty-cell"></div>
            <div className="header-cell green-header" style={{ color:'green'}}>Normal</div>
            <div className="header-cell blue-header" style={{ color:'orange'}}>High</div>
            <div className="header-cell red-header" style={{ color:'red'}}>Risk</div>
          </div>
          
          {/* Body Fat Row */}
          <div className="table-row">
            <div className="metric-cell">
              <label>Body Fat %</label>
              {/* <span>पूर्ण शरीरातील चरबी</span> */}
              <input name="bodyFat" onChange={handleChange} value={formData.bodyFat} placeholder="Enter value" />
            </div>
            <div className={`range-cell normal-bg ${getStatus('bodyFat', formData.bodyFat) === 'normal' ? 'highlighted' : ''}`}>
              <span>Male : 10-20%</span>
              <span>Female: 20-28%</span>
            </div>
            <div className={`range-cell high-bg ${getStatus('bodyFat', formData.bodyFat) === 'high' ? 'highlighted' : ''}`}>
              <span>Male : 20-24%</span>
              <span>Female: 28-34%</span>
            </div>
            <div className={`range-cell risk-bg ${getStatus('bodyFat', formData.bodyFat) === 'risk' ? 'highlighted' : ''}`}>
              <span>Male : &gt; 24%</span>
              <span>Female : &gt; 34%</span>
            </div>
          </div>
          
          {/* Visceral Fat Row */}
          <div className="table-row">
            <div className="metric-cell">
              <label>Visceral Fat %</label>
              {/* <span>पोटातील अवयवा भोवतालची चरबी</span> */}
              <input name="visceralFat" onChange={handleChange} value={formData.visceralFat} placeholder="Enter value" />
            </div>
            <div className={`range-cell normal-bg ${getStatus('visceralFat', formData.visceralFat) === 'normal' ? 'highlighted' : ''}`}>
              <span>Male : &lt; 10%</span>
              <span>Female : &lt; 5%</span>
            </div>
            <div className={`range-cell high-bg ${getStatus('visceralFat', formData.visceralFat) === 'high' ? 'highlighted' : ''}`}>
              <span>Male : 10-14%</span>
              <span>Female: 10-14%</span>
            </div>
            <div className={`range-cell risk-bg ${getStatus('visceralFat', formData.visceralFat) === 'risk' ? 'highlighted' : ''}`}>
              <span>Male : &gt; 14%</span>
              <span>Female : &gt; 14%</span>
            </div>
          </div>

          {/* Resting Metabolism Row */}
          <div className="table-row">
            <div className="metric-cell">
              <label>Resting Metabolism</label>
              {/* <span>उष्मांक</span> */}
              <input name="restingMetabolism" onChange={handleChange} value={formData.restingMetabolism} placeholder="Enter value" />
            </div>
            <div className={`range-cell normal-bg ${getStatus('restingMetabolism', formData.restingMetabolism) === 'normal' ? 'highlighted' : ''}`}>
              <span>Male : 1800-2000</span>
              <span>Female : 1600-1800</span>
            </div>
            <div className={`range-cell high-bg ${getStatus('restingMetabolism', formData.restingMetabolism) === 'high' ? 'highlighted' : ''}`}>
              <span>High if outside normal range</span>
            </div>
            <div className={`range-cell risk-bg ${getStatus('restingMetabolism', formData.restingMetabolism) === 'risk' ? 'highlighted' : ''}`}>
               <span>Risk if outside normal range</span>
            </div>
          </div>

          {/* BMI Row */}
          <div className="table-row">
            <div className="metric-cell">
              <label>BMI</label>
              {/* <span>बॉडी मास इंडेक्स</span> */}
              <input name="bmi" onChange={handleChange} value={formData.bmi} placeholder="Enter value" />
            </div>
            <div className={`range-cell normal-bg ${getStatus('bmi', formData.bmi) === 'normal' ? 'highlighted' : ''}`}>
              <span>Male : &lt; 23%</span>
              <span>Female : &lt; 22%</span>
            </div>
            <div className={`range-cell high-bg ${getStatus('bmi', formData.bmi) === 'high' ? 'highlighted' : ''}`}>
              <span>Male : 23-26%</span>
              <span>Female : 22-26%</span>
            </div>
            <div className={`range-cell risk-bg ${getStatus('bmi', formData.bmi) === 'risk' ? 'highlighted' : ''}`}>
              <span>Male : &gt; 26%</span>
              <span>Female : &gt; 26%</span>
            </div>
          </div>

          {/* Body Age Row */}
          <div className="table-row">
            <div className="metric-cell">
              <label>Body Age</label>
              {/* <span>शरीरातील पेशीचे वय</span> */}
              <input name="bodyAge" onChange={handleChange} value={formData.bodyAge} placeholder="Enter value" />
            </div>
            <div className="full-width-cell">
              {/* <p>आपल्या शरीराचे वय इतके झालेले आहे.</p> */}
            </div>
          </div>
        </div>
        
        <div className="button-container">
          <button type="button" onClick={handleBack} className="back-button">← Back</button>
          <button type="submit" className="submit-button">Next</button>
        </div>
      </form>
    </div>
  );
};

export default BodyAnalysisForm2;
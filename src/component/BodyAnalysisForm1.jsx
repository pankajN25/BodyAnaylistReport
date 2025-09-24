// BodyAnalysisForm1.jsx
import React, { useState, useEffect } from 'react';
import './BodyAnalysisForm1.css'; // We'll create a new CSS file

const BodyAnalysisForm1 = ({ onNext }) => {
  const getFormattedCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: '',
    age: '',
    height: '',
    date: getFormattedCurrentDate(),
    dob: '',
    email: '',
    gender: '',
    weight: '',
    idealWeight: '',
    extra: '',
    less: '',
  });

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      date: getFormattedCurrentDate()
    }));
  }, []);

  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const calculateIdealWeight = (height, gender) => {
    const heightNum = parseFloat(height);
    if (!heightNum || !gender) {
      return '';
    }
    if (gender === 'Male') {
      return (heightNum - 100).toFixed(2);
    } else if (gender === 'Female') {
      return (heightNum - 105).toFixed(2);
    }
    return '';
  };

  const calculateExtraWeight = (weight, idealWeight) => {
    const weightNum = parseFloat(weight);
    const idealWeightNum = parseFloat(idealWeight);
    if (!weightNum || !idealWeightNum) {
      return '';
    }
   return (weightNum - idealWeightNum > 0) ? (weightNum - idealWeightNum).toFixed(2) : '';
  };

  const calculateLessWeight = (weight, idealWeight) => {
    const weightNum = parseFloat(weight);
    const idealWeightNum = parseFloat(idealWeight);
    if (!weightNum || !idealWeightNum) {
      return '';
    }
    return (idealWeightNum - weightNum > 0) ? (idealWeightNum - weightNum).toFixed(2) : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevData => {
      let newFormData = { ...prevData, [name]: value };

      if (name === 'dob') {
        newFormData.age = calculateAge(value);
      }
      
      if (name === 'height' || name === 'gender') {
        const heightValue = name === 'height' ? value : prevData.height;
        const genderValue = name === 'gender' ? value : prevData.gender;
        newFormData.idealWeight = calculateIdealWeight(heightValue, genderValue);
      }
      
      if (name === 'weight' || name === 'idealWeight' || 
          (name === 'height' || name === 'gender')) {
        newFormData.extra = calculateExtraWeight(
          name === 'weight' ? value : prevData.weight,
          newFormData.idealWeight || prevData.idealWeight
        );
        newFormData.less = calculateLessWeight(
          name === 'weight' ? value : prevData.weight,
          newFormData.idealWeight || prevData.idealWeight
        );
      }

      return newFormData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onNext(formData);
  };

  return (
    <div className="ba-form-container">
      <div className="ba-form-header">
        <h2 className="ba-form-title">Body Analysis Report</h2>
        <p className="ba-form-subtitle">Form 1 - Personal Details & Body Metrics</p>
      </div>
      
      <form onSubmit={handleSubmit} className="ba-form">
        <div className="ba-form-section">
          <h3 className="ba-section-title">Personal Information</h3>
          <div className="ba-form-grid">
            <div className="ba-input-group">
              {/* <label className="ba-input-label">Name <span className="ba-required">*</span></label> */}
              <input 
                className="ba-input-field"
                name="name" 
                onChange={handleChange} 
                value={formData.name} 
                placeholder='Enter full name'
                required 
              />
            </div>
            
            <div className="ba-input-group">
              {/* <label className="ba-input-label">Mobile <span className="ba-required">*</span></label> */}
              <input 
                className="ba-input-field"
                name="mobile" 
                onChange={handleChange} 
                value={formData.mobile} 
                type="tel" 
                required 
                placeholder='📞 Enter mobile number'
              />
            </div>
            
            <div className="ba-input-group">
              {/* <label className="ba-input-label">Email</label> */}
              <input 
                className="ba-input-field"
                name="email" 
                onChange={handleChange} 
                value={formData.email} 
                placeholder=' Enter email address'
                type="email" 
              />
            </div>
            
            <div className="ba-input-group">
              {/* <label className="ba-input-label">City/Location</label> */}
              <input 
                className="ba-input-field"
                name="village" 
                placeholder='📍 Enter city or Location'
                onChange={handleChange} 
                value={formData.village} 
              />
            </div>
            
            <div className="ba-input-group">
              {/* <label className="ba-input-label">Date of Birth</label> */}
              <input 
                className="ba-input-field"
                name="dob" 
                onChange={handleChange} 
                value={formData.dob} 
                placeholder='Enter date of birth'
                type="date" 
              />
            </div>
            
            <div className="ba-input-group">
              {/* <label className="ba-input-label">Age <span className="ba-required">*</span></label> */}
              <input 
                className="ba-input-field ba-readonly"
                name="age" 
                onChange={handleChange} 
                value={formData.age} 
                type="number" 
                required 
                readOnly={!!formData.dob}
                placeholder='Enter age'
              />
            </div>
            
            <div className="ba-input-group">
              {/* <label className="ba-input-label">Gender <span className="ba-required">*</span></label> */}
              <div className="ba-gender-group">
                <label className="ba-gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange}
                    required
                    className="ba-gender-radio"
                    
                  />
                  <span className="ba-gender-custom"></span>
                  <span className="ba-gender-label">Male</span>
                </label>
                <label className="ba-gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleChange}
                    className="ba-gender-radio"
                  />
                  <span className="ba-gender-custom"></span>
                  <span className="ba-gender-label">Female</span>
                </label>
              </div>
            </div>
            
            <div className="ba-input-group">
              {/* <label className="ba-input-label">Height (cm)<span className="ba-required">*</span></label> */}
              <input 
                className="ba-input-field"
                required
                name="height" 
                onChange={handleChange} 
                value={formData.height} 
                type="number" 
                placeholder='Enter height'
              />
            </div>
          </div>
        </div>

        <div className="ba-form-section">
          <h3 className="ba-section-title">Body Metrics</h3>
          <div className="ba-form-grid">
            <div className="ba-input-group">
              {/* <label className="ba-input-label">Your Weight (kg) <span className="ba-required">*</span></label> */}
              <input 
                className="ba-input-field"
                name="weight" 
                onChange={handleChange} 
                value={formData.weight} 
                required 
                placeholder='Enter weight'
                type="number" 
              />
            </div>
            
            <div className="ba-input-group">
              <label className="ba-input-label">Ideal Weight (kg)</label>
              <input 
                className="ba-input-field ba-readonly"
                name="idealWeight" 
                value={formData.idealWeight} 
                readOnly 
              />
            </div>
            
            <div className="ba-input-group">
              <label className="ba-input-label">Extra Weight (kg)</label>
              <input 
                className="ba-input-field ba-readonly"
                name="extra"
                onChange={handleChange}  
                value={formData.extra} 
                type="number" 
                readOnly 
              />
            </div>
            
            <div className="ba-input-group">
              <label className="ba-input-label">Less Weight (kg)</label>
              <input 
                className="ba-input-field ba-readonly"
                name="less" 
                onChange={handleChange} 
                value={formData.less} 
                type="number" 
                readOnly 
              />
            </div>
          </div>
        </div>

        <div className="ba-button-container">
          <button type="submit" className="ba-submit-button">Next →</button>
        </div>
      </form>
    </div>
  );
};

export default BodyAnalysisForm1;
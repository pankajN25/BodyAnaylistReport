// src/components/RegistrationForm.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import './RegistrationForm.css'; // We'll create this CSS file
import { useLocation } from 'react-router-dom';

const RegistrationForm = ({ onRegistrationSuccess }) => {
  const location = useLocation();
  const emailFormLogin =location.state?.email || '';
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    agencyName: '',
    wellnessCenterName: '',
    position: '',
    contactNumber: '',
    nameOfCompany: '',
    experience: '',
    photo: null,
    logoImg: null,
    foodCertification: null,
  });
  useEffect(() =>{
    if(emailFormLogin){
      setForm((prev)=>({...prev,email:emailFormLogin}))
    }
  },[emailFormLogin])
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };
  const [selectedFiles, setSelectedFiles] = useState({
    photo: null,
    logoImg: null,
    foodCertification: null,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const {
      firstName, lastName, email, phone, agencyName,
      wellnessCenterName, position, contactNumber,
      nameOfCompany, experience, photo, logoImg, foodCertification
    } = form;

    if (!firstName || !lastName || !email || !phone || !agencyName ||
      !wellnessCenterName || !position || !nameOfCompany || !experience) {
      setError('Please fill in all *required* text fields.');
      return;
    }
  

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('name', `${firstName} ${lastName}`);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('agencyName', agencyName);
      formData.append('wellnessCenterName', wellnessCenterName);
      formData.append('position', position);
      formData.append('contactNumber', contactNumber);
      formData.append('nameOfCompany', nameOfCompany);
      formData.append('experience', experience);

      if (photo) formData.append('photo', photo);
      if (logoImg) formData.append('logoImg', logoImg);
      if (foodCertification) formData.append('foodCertification', foodCertification);

      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
        // ✅ Save agent data
      localStorage.setItem("agent", JSON.stringify(data.agent));

    // ✅ Pass agentData to parent
      onRegistrationSuccess(data.agent);

      // onRegistrationSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="registration-card">
        <div className="welcome-section">
          <div className="welcome-content">

            <h1 className="welcome-title">WELLNESS COACH</h1>
            <p className="welcome-subtitle" style={{ color: 'black' }}>-- Join our network of wellness professionals and start your journey to better health and business success.--</p>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">🌟</span>
                <span>Access exclusive products</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🤝</span>
                <span>Join a supportive community</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📊</span>
                <span>Grow your wellness business</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💼</span>
                <span>Professional development resources</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-header">
            <h2>Wellness Coach Registration</h2>
            <p>Complete your profile to get started</p>
          </div>

          {error && (
            <Alert variant="danger" className="error-alert">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleRegister} className="registration-form">
            <Row>
              <Col md={6}>
                <Form.Group className="input-group">
                  <Form.Label>First Name <span className="required">*</span></Form.Label>
                  <div className="input-container">

                    <Form.Control
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="input-group">
                  <Form.Label>Last Name <span className="required">*</span></Form.Label>
                  <div className="input-container">

                    <Form.Control
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="input-group">
              <Form.Label>Email Address <span className="required">*</span></Form.Label>
              <div className="input-container">

                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  readOnly={!!emailFormLogin}
                />
              </div>
            </Form.Group>

            <Form.Group className="input-group">
              <Form.Label>Phone Number <span className="required">*</span></Form.Label>
              <div className="input-container">

                <Form.Control
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
            </Form.Group>
            <Form.Group className="input-group">
              <Form.Label>Alternative Contact Number</Form.Label>
              <div className="input-container">

                <Form.Control
                  type="tel"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter alternative contact number"
                />
              </div>
            </Form.Group>
              <Form.Group className="input-group">
              <Form.Label>Adress <span className="required">*</span></Form.Label>
              <div className="input-container">

                <Form.Control
                  type="text"
                  name="nameOfCompany"
                  value={form.nameOfCompany}
                  onChange={handleChange}
                  required
                  placeholder="Enter Adress"
                />
              </div>
            </Form.Group>

            <Form.Group className="input-group">
              <Form.Label>Wellness Center Name <span className="required">*</span></Form.Label>
              <div className="input-container">

                <Form.Control
                  type="text"
                  name="wellnessCenterName"
                  value={form.wellnessCenterName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your wellness center name"
                />
              </div>
            </Form.Group>

            <Form.Group className="input-group">
              <Form.Label>Position <span className="required">*</span></Form.Label>
              <div className="input-container">

                <Form.Control
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                  placeholder="Enter your position"
                />
              </div>
            </Form.Group>

            <Form.Group className="input-group">
              <Form.Label>Herbalife Member ID <span className="required">*</span></Form.Label>
              <div className="input-container">

                <Form.Control
                  type="text"
                  name="agencyName"
                  value={form.agencyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter agency name"
                />
              </div>
            </Form.Group>

            <Form.Group className="input-group">
              <Form.Label>Experience (Years) <span className="required">*</span></Form.Label>
              <div className="input-container">

                <Form.Control
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                  placeholder="Enter years of experience"
                />
              </div>
            </Form.Group>

            <Form.Group className="input-group">
              <Form.Label> Herbalife Member Photo</Form.Label>
              <div className="file-input-container">
                <Form.Control
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="file-input"
                />
                <label htmlFor="photo" className="file-label">
                  Drag & drop or <span className="highlight">Choose profile photo</span>
                </label>
              </div>
              {selectedFiles.photo && <div className="file-preview">Selected: {selectedFiles.photo.name}</div>}
            </Form.Group>

            <Form.Group className="input-group">
              <Form.Label>Herbalife wellness center Logo Image</Form.Label>
              <div className="file-input-container">
                <Form.Control
                  type="file"
                  id="logoImg"
                  name="logoImg"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="file-input"
                />
                <label htmlFor="logoImg" className="file-label">
                  Drag & drop or <span className="highlight">Upload company logo</span>
                </label>
              </div>
              {selectedFiles.logoImg && <div className="file-preview">Selected: {selectedFiles.logoImg.name}</div>}
            </Form.Group>

            <Form.Group className="input-group">
              <Form.Label>Food Certification Document</Form.Label>
              <div className="file-input-container">
                <Form.Control
                  type="file"
                  id="foodCertification"
                  name="foodCertification"
                  onChange={handleFileChange}
                  accept=".pdf,image/*"
                  className="file-input"
                />
                <label htmlFor="foodCertification" className="file-label">
                  Drag & drop or <span className="highlight">Upload certification</span>
                </label>
              </div>
              {selectedFiles.foodCertification && <div className="file-preview">Selected: {selectedFiles.foodCertification.name}</div>}
            </Form.Group>

            <Button
              type="submit"
              className="register-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner"></span>
                  Registering...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
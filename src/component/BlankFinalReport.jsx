// src/component/BlankFinalReport.jsx
import React from 'react';
import './FinalReport.css'; // Reuse your existing CSS
import '../index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import wellnessCenterLogo from './wellness-center-logo.png'; // Default fallback
import reportImage from './blank-report11.jpg';
import reportImg2 from './blank-report2.PNG';
import reportImg3 from './blank-report3.PNG'; // New image for the second page
import reportImg4 from './blank-report4.jpg'; // New image for the second page
const BlankFinalReport = ({ agentData }) => {
  if (!agentData) {
    return <div className="no-data-message">No agent data available.</div>;
  }

  // Extract agent data (removed unused variables like agentExperience, agentLanguages)
  const [agentFirstName, agentLastName] = agentData?.name
    ? agentData.name.split(' ')
    : ['', ''];
  const agentEmail = agentData?.email || 'N/A';
  const agentPhone = agentData?.phone || '1234567890';
  const agentWellnessCenterName = agentData?.wellness_center_name || 'N/A';
  const agentPosition = agentData?.position || '';
  const agentContactNumber = agentData?.contact_number || 'N/A';
  const agentLogoImg = agentData?.logo_img_path || wellnessCenterLogo;
  const agentPhoto = agentData?.photo_path || wellnessCenterLogo;
  const agentAddress = agentData?.name_of_company || 'N/A';
  const agentConsultationHours = agentData?.consultationHours || 'Mon-Sat, 10 AM - 6 PM';
  const agentSpecialization = agentData?.specialization || 'Ayurveda, Yoga Therapy';
  const herbalifeId = agentData?.agencyName || 'MY-123456';
  const dateOfJoining = agentData?.dateOfJoining || '2025-01-01';
  const facebookLink = agentData?.facebook || '#';
  const instagramLink = agentData?.instagram || '#';
  const linkedinLink = agentData?.linkedin || '#';
  const twitterLink = agentData?.twitter || '#';
  const youtubeLink = agentData?.youtube || '#';

  const BACKEND_URL = "http://localhost:5000";

  const normalizePath = (path) => {
    if (!path) return '';
    return path.replace(/\\/g, '/');
  };

  const agentPhotoUrl = agentPhoto
    ? `${BACKEND_URL}/uploads/${normalizePath(agentPhoto)}`
    : '/default-avatar.png';

  const agentLogoUrl = agentLogoImg
    ? `${BACKEND_URL}/uploads/${normalizePath(agentLogoImg)}`
    : wellnessCenterLogo;

  return (
    <>
      {/* Page 1: Agent Branding */}
      <div className="pdf-page" data-page="1">
        <div className="charming-container">
          <div className="container-fluid p-0">
            <div className="row no-gutters">
              {/* Left green section - Agent info (same as FinalReport) */}
              <div className="col-lg-5 green-section">
                <div className="rotated-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2940&auto=format&fit=crop"
                    alt="Wellness Background"
                    className="rotated-image"
                    loading="lazy"
                  />
                </div>

                <div className="supervisor-info text-center">
                  <p>Joining Date</p>
                  <p>{dateOfJoining}</p>
                  <h2>{agentPosition}</h2>
                  <p>{herbalifeId}</p>
                </div>

                <div className="coach-profiles">
                  <div className="coach-card">
                    <div className="coach-image-container">
                      <img
                        src={agentPhotoUrl}
                        alt={`${agentFirstName} ${agentLastName}`}
                        className="coach-image"
                        loading="lazy"
                      />
                    </div>
                    <p>Wellness Coach</p>
                    <h3>{agentFirstName} {agentLastName}</h3>
                  </div>
                </div>
              </div>

              {/* Right white section - Agent branding only (adapted from FinalReport) */}
              <div className="col-lg-7 white-section">
                <div className="header-section">
                  <div className="logo-container">
                    <img
                      src={agentLogoUrl}
                      alt="Agent Logo"
                      className="logo-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="header-text">
                    <h1>{agentWellnessCenterName}</h1>
                  </div>
                </div>

                <p className="tagline">Join us for a day of healing, harmony, and holistic wellness!</p>

                <div className="services-section">
                  <div className="service-tags">
                    <span className="service-tag weight-loss">Weight Loss</span>
                    <span className="service-tag weight-gain">Weight Gain</span>
                    <span className="service-tag lifestyle">Lifestyle Disorders</span>
                  </div>

                  <div className="service-features">
                    <div className="feature-item">
                      <span className="checkmark">✓</span>
                      <span>Stress Reduction Techniques</span>
                    </div>
                    <div className="feature-item">
                      <span className="checkmark">✓</span>
                      <span>Improved Mental Wellness</span>
                    </div>
                    <div className="feature-item">
                      <span className="checkmark">✓</span>
                      <span>Take-Home ZOOM Call 365 days</span>
                    </div>
                    <div className="feature-item">
                      <span className="checkmark">✓</span>
                      <span>One to one Guidance</span>
                    </div>
                  </div>
                </div>

                <div className="contact-section">
                  <div className="contact-info">
                    <div className="contact-item">
                      <span className="contact-icon">🌐</span>
                      <span>www.charmingaurawellness.com</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <span>+91 {agentPhone}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <span>+91 {agentContactNumber}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <span>{agentEmail}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                    <a href={facebookLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                    <a href={twitterLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                    <a href={instagramLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                    <a href={linkedinLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                    <a href={youtubeLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                  </div>
                  <p className="address">{agentAddress}</p>
                  <p className="consultation">Consultation Hours: {agentConsultationHours}</p>
                  <p className="specialization">Specialization: {agentSpecialization}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* Page 2: First User Information Image */}
      <div className="pdf-page" data-page="2">
        <img 
          src={reportImage} 
          alt="User  Information Page 1" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          loading="lazy" 
        />
        <img 
          src={reportImg2} 
          alt="User  Information Page 2" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          loading="lazy" 
        />
          <img 
          src={reportImg3} 
          alt="User  Information Page 3" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          loading="lazy" 
        />
      </div>
        <div className="pdf-page" data-page="3">
      
          <img 
          src={reportImg4} 
          alt="User  Information Page 3" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          loading="lazy" 
        />
      </div>

      
     

    
    </>
  );
};

export default BlankFinalReport;

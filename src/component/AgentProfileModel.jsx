import React, { useState, useEffect } from 'react';
import {
  Camera, Edit2, Save, X, Mail, Phone, Clock, MapPin,
  Building, Award, Languages, Facebook, Twitter, Instagram,
  Linkedin, CheckCircle
} from 'lucide-react';
import { useLocation, Navigate } from 'react-router-dom';
import './AgentProfileModel.css';

const AgentProfileModel = () => {
  const location = useLocation();
  const agentFromLocation = location.state?.agent;

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setLoading(true);

        if (agentFromLocation) {
          setAgent(agentFromLocation);
          setLoading(false);
          return;
        }

        const savedAgent = localStorage.getItem("agent");
        if (savedAgent) {
          setAgent(JSON.parse(savedAgent));
        } else {
          setError("No agent data found");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load agent data");
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [agentFromLocation]);

  if (error) {
    return <Navigate to="/home" replace />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="loading-text">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  const toggleEditMode = () => {
    if (editMode) {
      // Save all changes
      if (Object.keys(tempData).length > 0) {
        const updatedAgent = { ...agent, ...tempData };
        setAgent(updatedAgent);
        localStorage.setItem("agent", JSON.stringify(updatedAgent));
      }
      setEditMode(false);
    } else {
      // Initialize tempData with current agent data for editing
      setTempData({
        name: agent.name,
        position: agent.position,
        email: agent.email,
        phone: agent.phone,
        contact_number: agent.contact_number || agent.contactNumber || agent.phone,
        consultation_hours: agent.consultation_hours || 'Mon-Sat, 10 AM - 6 PM',
        wellness_center_name: agent.wellnessCenterName || agent.wellness_center_name,
        address: agent.nameOfCompany || agent.address,
        experience: agent.experience,
        specialization: agent.specialization || agent.position,
        languages: agent.languages || 'English, Hindi',
        facebook: agent.facebook,
        twitter: agent.twitter,
        instagram: agent.instagram,
        linkedin: agent.linkedin
      });
      setEditMode(true);
    }
  };

  const handleInputChange = (field, value) => {
    setTempData({
      ...tempData,
      [field]: value
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        // You might want to save this to tempData as well
        // handleInputChange('photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [firstName, ...lastNameParts] = (agent.name || agent.firstName + ' ' + agent.lastName || '').split(' ');
  const lastName = lastNameParts.join(' ');
  const backendUrl = "http://localhost:5000";
  const imageUrl = agent.photo_path
    ? `${backendUrl}/uploads/${agent.photo_path}`
    : "/default-avatar.png";

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header with Banner */}
        <div className="profile-header">
          <div className="profile-banner"></div>
          <div className="profile-photo-container">
            <div className="relative">
              <img
                src={photoPreview || agent.photo_path || imageUrl}
                alt="Agent Profile"
                className="profile-photo"
              />
              <label htmlFor="photo-upload" className="photo-upload-label">
                <Camera size={16} />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="photo-upload-input"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Single Edit Button at the Top */}
        <div className="profile-edit-top">
          <button
            onClick={toggleEditMode}
            className={`edit-top-button ${editMode ? 'cancel-button' : ''}`}
          >
            {editMode ? (
              <>
                <X size={16} />
                Cancel Editing
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Edit Form (shown only in edit mode) */}
        {editMode && (
          <div className="edit-form-container">
            <h2 className="edit-form-title">Edit Profile Information</h2>

            <div className="edit-form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={tempData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Position</label>
                <input
                  type="text"
                  value={tempData.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={tempData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={tempData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={tempData.contact_number || ''}
                  onChange={(e) => handleInputChange('contact_number', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Consultation Hours</label>
                <input
                  type="text"
                  value={tempData.consultation_hours || ''}
                  onChange={(e) => handleInputChange('consultation_hours', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Wellness Center Name</label>
                <input
                  type="text"
                  value={tempData.wellness_center_name || ''}
                  onChange={(e) => handleInputChange('wellness_center_name', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group full-width">
                <label>Address</label>
                <textarea
                  value={tempData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows="3"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Experience (years)</label>
                <input
                  type="number"
                  value={tempData.experience || ''}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Specialization</label>
                <input
                  type="text"
                  value={tempData.specialization || ''}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Languages</label>
                <input
                  type="text"
                  value={tempData.languages || ''}
                  onChange={(e) => handleInputChange('languages', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Facebook URL</label>
                <input
                  type="url"
                  value={tempData.facebook || ''}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Twitter URL</label>
                <input
                  type="url"
                  value={tempData.twitter || ''}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Instagram URL</label>
                <input
                  type="url"
                  value={tempData.instagram || ''}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  value={tempData.linkedin || ''}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="edit-form-actions">
              <button
                onClick={toggleEditMode}
                className="save-button"
              >
                <Save size={16} />
                Save All Changes
              </button>
            </div>
          </div>
        )}

        <div className="profile-content">
          {/* Name and Verification */}
          <div id="profile-name-section" className="profile-name-section">
            <div>
              <h1 className="profile-name">
                {firstName} <span className="profile-name-last">{lastName}</span>
              </h1>
              <div className="profile-position-container">
                <p className="profile-position">{agent.position}</p>
                {agent.verified && (
                  <span className="profile-verified-badge">
                    <CheckCircle size={14} />
                    Verified Wellness Professional
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <ProfileSection
            id="personal-info-section"
            title="Personal Information"
            icon={<Award size={18} />}
          >
            <div className="profile-section-content">
              <p><span className="font-semibold">Full Name:</span> {agent.name || `${agent.firstName} ${agent.lastName}`}</p>
              <p className="mt-2"><span className="font-semibold">Position:</span> {agent.position}</p>
            </div>
          </ProfileSection>

          {/* Contact Information Section */}
          <ProfileSection
            id="contact-info-section"
            title="Contact Information"
            icon={<Mail size={18} />}
          >
            <div className="profile-info two-columns">
              <div className="profile-info-item">
                <Mail size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Email</p>
                  <p>{agent.email}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <Phone size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>{agent.phone}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <Phone size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Contact Number</p>
                  <p>{agent.contact_number || agent.contactNumber || agent.phone}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <Clock size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Consultation Hours</p>
                  <p>{agent.consultation_hours || 'Mon-Sat, 10 AM - 6 PM'}</p>
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Wellness Center Section */}
          <ProfileSection
            id="wellness-center-section"
            title="Wellness Center"
            icon={<Building size={18} />}
          >
            <div className="profile-info">
              <div className="profile-info-item">
                <Building size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Wellness Center Name</p>
                  <p>{agent.wellnessCenterName || agent.wellness_center_name}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <MapPin size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Address</p>
                  <p>{agent.nameOfCompany || agent.address}</p>
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Experience & Specialization Section */}
          <ProfileSection
            id="experience-section"
            title="Experience & Specialization"
            icon={<Award size={18} />}
          >
            <div className="profile-info two-columns">
              <div className="profile-info-item">
                <Award size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Experience</p>
                  <p>{agent.experience} years</p>
                </div>
              </div>
              <div className="profile-info-item">
                <Award size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Specialization</p>
                  <p>{agent.specialization || agent.position}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <Languages size={18} className="icon-left" />
                <div>
                  <p className="font-medium">Languages</p>
                  <p>{agent.languages || 'English, Hindi'}</p>
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Social Media Section */}
          <ProfileSection
            id="social-media-section"
            title="Social Media"
          >
            <div className="social-links">
              {agent.facebook && (
                <a href={agent.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook">
                  <Facebook size={24} />
                </a>
              )}
              {agent.twitter && (
                <a href={agent.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  <Twitter size={24} />
                </a>
              )}
              {agent.instagram && (
                <a href={agent.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                  <Instagram size={24} />
                </a>
              )}
              {agent.linkedin && (
                <a href={agent.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                  <Linkedin size={24} />
                </a>
              )}
              {!agent.facebook && !agent.twitter && !agent.instagram && !agent.linkedin && (
                <p className="text-gray-500">No social media links added</p>
              )}
            </div>
          </ProfileSection>
        </div>

      </div>
    </div>
  );
};

// Simplified Profile Section Component (no edit buttons)
const ProfileSection = ({ id, title, children, icon }) => {
  return (
    <div id={id} className="profile-section">
      <div className="profile-section-header">
        <div className="profile-section-title">
          {icon}
          <h2>{title}</h2>
        </div>
      </div>
      <div className="profile-section-content">
        {children}
      </div>
    </div>
  );
};


export default AgentProfileModel;
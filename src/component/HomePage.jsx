// src/component/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentProfileModal from './AgentProfileModel';
import './HomePage.css'; // We'll create this CSS file

const HomePage = ({agentData, agentName, onLogout,onStartNewAnalysis }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({ clients: 0, analyses: 0, successRate: 0 });
  

   const handleLogout = () => {
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    } else {
      // Fallback logout behavior
      console.log('Logging out...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('agentData');
      navigate('/login');
    }
  };
  // Simulate loading agent data
  // useEffect(() => {
  //   // In a real app, this would come from an API
  //   const loadAgentData = () => {
  //     setRecentActivity([
  //       { id: 1, client: 'Sarah Johnson', date: '2 hours ago', type: 'Analysis' },
  //       { id: 2, client: 'Michael Chen', date: '1 day ago', type: 'Follow-up' },
  //       { id: 3, client: 'Emma Williams', date: '2 days ago', type: 'New Client' }
  //     ]);
      
  //     setStats({
  //       clients: 0,
  //       analyses: 0,
  //       successRate: 0
  //     });
  //   };
    
  //   loadAgentData();
  // }, []);
 

  const openProfile = () =>{
    navigate('/profile',{state:{agentData}});
  };
  const handleStartAnalysis = () => {
    if(onStartNewAnalysis){
      onStartNewAnalysis();
    }
    navigate('/body-analysis');
  };

  const handleViewHistory = () => {
    navigate('/analysis-history');
  };

  const handleViewClients = () => {
    navigate('/clients');
  };
  const handleDownloadBlankReport = () => {
    if (!agentData) {
      console.warn('No agentData available for blank report.');
      alert('Agent data not loaded. Please refresh or log in again.');
      return;
    }
    navigate('/blank-report', { state: { agentData } });
  };


  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="header-content">
          <div className="brand">
            <h1>HerbalLife Wellness</h1>
          </div>
          <div className="user-menu">
            <div className="user-info" onClick={openProfile} style={{cursor: 'pointer'}} title="View Profile">
              <div className="user-avatar">
                {agentName ? agentName.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="user-name">{agentName || 'Agent'}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      {/* {profileOpen && (
        <AgentProfileModal agent={agentData} onClose={closeProfile} />
      )} */}

      <main className="homepage-main">
        <div className="welcome-section">
          <h2>Welcome back, {agentName || 'Agent'}!</h2>
          <p style={{ color: 'white' }}>Ready to help your clients achieve their wellness goals today?</p>
        </div>
        ``

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon clients-icon">👥</div>
            <div className="stat-data">
              <h3>{stats.clients}</h3>
              <p>Total Clients</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon analyses-icon">📊</div>
            <div className="stat-data">
              <h3>{stats.analyses}</h3>
              <p>Analyses Done</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success-icon">⭐</div>
            <div className="stat-data">
              <h3>{stats.successRate}%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <div className="action-card primary-action" onClick={handleStartAnalysis}>
            <div className="action-icon">➕</div>
            <h3>Start New Analysis</h3>
            <p>Create a new body analysis form for a client</p>
            <button className="action-button">Get Started</button>
          </div>
          
          <div className="action-card" onClick={handleViewHistory}>
            <div className="action-icon">📋</div>
            <h3>View History</h3>
            <p>Review previous client analyses and results</p>
            <button className="action-button">View History</button>
          </div>
          
          <div className="action-card" onClick={handleViewClients}>
            <div className="action-icon">👥</div>
            <h3>Client Management</h3>
            <p>Manage your client list and their progress</p>
            <button className="action-button">Manage Clients</button>
          </div>
           <div className="action-card" onClick={handleDownloadBlankReport}>
            <div className="action-icon">📄</div>
            <h3>Download Blank Report</h3>
            <p>Go to blank body analysis template and download as PDF</p>
            <button className="action-button">Download Blank</button>
          </div>
          
        </div>
        

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-details">
                    <h4>{activity.client}</h4>
                    <p>{activity.type} • {activity.date}</p>
                  </div>
                  <div className="activity-arrow">→</div>
                </div>
              ))
            ) : (
              <p className="no-activity">No recent activity</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
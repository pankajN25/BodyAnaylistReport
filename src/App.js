// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginForm from './component/LoginForm';
import RegistrationForm from './component/RegistrationForm';
import HomePage from './component/HomePage';
import BodyAnalysisForm1 from './component/BodyAnalysisForm1';
import BodyAnalysisForm2 from './component/BodyAnalysisForm2';
import BodyAnalysisForm3 from './component/BodyAnalysisForm3';
import FinalReport from './component/FinalReport';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AgentProfilePage from './component/AgentProfileModel';
import AnalysisHistory from './component/AnalysisHistory';
import BlankReportPage from './component/BlankReportPage';

function App() {
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFullyRegistered, setIsFullyRegistered] = useState(false);
  const [agent, setAgent] = useState(null);
  const [formData, setFormData] = useState({ form1: {}, form2: {}, form3: {} });
  const [isLoding, setIsLoading] = useState(true);

  // 🔑 NEW: Rehydrate state from localStorage on first render
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedAgent = localStorage.getItem('agent');

        const authToken = localStorage.getItem('authToken');

        if (savedAgent && authToken) {
          const agentData = JSON.parse(savedAgent);
          setAgent(agentData);
          setIsLoggedIn(true);
          // Make sure isFullyRegistered is properly set from agent data
          setIsFullyRegistered(!!agentData.isFullyRegistered);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('agent');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);
  if (isLoding) {
    return <div>Loading...</div>;
  }

  // function to reset all form data

  const resetFormData = () => {
    setFormData({ form1: {}, form2: {}, form3: {} });
    setStep(1); // Also reset step to first form
  };


  // ✅ Called by LoginForm with the full agent object from backend (must include isFullyRegistered)
  const handleLoginSuccess = (agentData, token) => {
    // Ensure isFullyRegistered is properly set
    const updatedAgent = {
      ...agentData,
      isFullyRegistered: agentData.isFullyRegistered || false
    };

    setAgent(updatedAgent);
    setIsLoggedIn(true);
    setIsFullyRegistered(!!updatedAgent.isFullyRegistered);

    // Persist to localStorage
    localStorage.setItem('agent', JSON.stringify(updatedAgent));
    localStorage.setItem('authToken', token); // Set actual token
  };
  const handleRegistrationSuccess = (agentData) => {
    const updatedAgent = {
      ...agentData,
      isFullyRegistered: true,
    };
    setAgent(updatedAgent);
    setIsFullyRegistered(true);
    localStorage.setItem('agent', JSON.stringify(updatedAgent));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsFullyRegistered(false);
    setAgent(null);
    setStep(1);
    localStorage.removeItem('agent');
    localStorage.removeItem('authToken');
  };

  const handleNext = (data, formNumber) => {
    setFormData(prev => ({ ...prev, [`form${formNumber}`]: data }));
    setStep(prev => prev + 1);
  };

  const handleFinalSubmit = async (form3Data) => {
    const combinedReport = {
      agent: agent, // ✅ include agent info
      client: {
        form1: formData.form1,
        form2: formData.form2,
        form3: form3Data
      }
    };
    console.log("Submitting finalData:", combinedReport);


    try {
      const res = await fetch("http://localhost:5000/api/submit-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedReport), // ✅ send full report
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit report to backend");
      }

      await res.json();

      // save latest form data in state
      setFormData(prev => ({
        ...prev,
        form3: form3Data
      }));

      // maybe also save agent + client in one place
      setStep(4); // go to FinalReport
    } catch (e) {
      console.error("Error submitting report to backend:", e.message);
      alert(`Error submitting report: ${e.message}. Please try again.`);
    }
  };

  const downloadPDF = () => {
    const input = document.getElementById('pdf-content');
    if (!input) return;
    const button = document.getElementById('download-button');
    if (button) button.style.display = 'none';
    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save('body_analysis_report.pdf');
        if (button) button.style.display = 'block';
      })
      .catch(() => {
        if (button) button.style.display = 'block';
      });
  };

  const renderForms = () => {
    if (step === 1) return <BodyAnalysisForm1 onNext={(data) => handleNext(data, 1)} />;
    if (step === 2) return <BodyAnalysisForm2 onSubmit={(data) => handleNext(data, 2)} />;
    if (step === 3) return <BodyAnalysisForm3 onSubmit={handleFinalSubmit} />;
    if (step === 4)
      return (
        <>
          <FinalReport allData={formData} agentData={agent} />
          <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
            <button id="download-button" onClick={downloadPDF} className="btn btn-primary">
              Download PDF Report
            </button>
          </div>
        </>
      );
    return null;
  };


  return (
    <Router>
      <div className="App">
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="fixed top-4 right-4 bg-danger text-white py-2 px-4 rounded"
            title="Logout"
          >
            Logout
          </button>
        )}

        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn
                ? <LoginForm onLoginSuccess={handleLoginSuccess} />
                : isFullyRegistered
                  ? <Navigate to="/home" replace />
                  : <Navigate to="/registration" replace />
            }
          />

          <Route
            path="/registration"
            element={
              isLoggedIn && !isFullyRegistered
                ? <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
                : isFullyRegistered
                  ? <Navigate to="/home" replace />
                  : <Navigate to="/" replace />
            }
          />

          <Route
            path="/home"
            element={
              isLoggedIn && isFullyRegistered
                ? <HomePage agentName={agent?.name} agentData={agent} onLogout={handleLogout} onStartNewAnalysis={resetFormData} />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/body-analysis"
            element={
              isLoggedIn && isFullyRegistered
                ? <div className="container py-4">{renderForms()}</div>
                : <Navigate to="/" replace />
            }
          />
          <Route
            path='/profile'
            element={
              isLoggedIn && isFullyRegistered
                ? <AgentProfilePage />
                : <Navigate to='/' replace />
            }
          />
          <Route
            path="/analysis-history"
            element={
              isLoggedIn && isFullyRegistered
                ? <AnalysisHistory />
                : <Navigate to="/" replace />
            }
          />
        <Route path='blank-report' element={<BlankReportPage/>}/>
          <Route
            path="*"
            element={
              isLoggedIn
                ? isFullyRegistered
                  ? <Navigate to="/home" replace />
                  : <Navigate to="/registration" replace />
                : <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

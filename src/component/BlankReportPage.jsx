// src/component/BlankReportPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; // For converting HTML to image in PDF
import BlankFinalReport from './BlankFinalReport'; // Import the new blank report component
import './BlankReportPage.css';

const BlankReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const agentData = location.state?.agentData; // Receive agentData from navigation state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); // Loading state for PDF
  const [imagesLoaded, setImagesLoaded] = useState(false); // Track if all images are loaded
  const [isLoading, setIsLoading] = useState(true); // Handle initial loading (for agentData check)
  const reportRef = useRef(null); // Ref for the report container

  // Fallback if no agentData (e.g., direct navigation) - now using state, not early return
  useEffect(() => {
    if (!agentData) {
      console.warn('No agentData provided. Redirecting to dashboard.');
      navigate('/');
    } else {
      setIsLoading(false); // Proceed once agentData is available
    }
  }, [agentData, navigate]);

  // Check if all images are loaded (delay PDF until ready) - now unconditional
  useEffect(() => {
    if (isLoading) return; // Skip if still loading agentData

    const checkImagesLoaded = () => {
      const images = document.querySelectorAll('#blank-pdf-content img');
      if (images.length > 0) {
        const loadedImages = Array.from(images).filter(img => img.complete && img.naturalHeight !== 0);
        if (loadedImages.length === images.length) {
          console.log('All images loaded for PDF.');
          setImagesLoaded(true);
        } else {
          // Retry after 500ms if not all loaded
          setTimeout(checkImagesLoaded, 500);
        }
      } else {
        setImagesLoaded(true); // No images, proceed
      }
    };
    checkImagesLoaded();
  }, [isLoading]); // Depend on isLoading to ensure it runs after agentData is ready

  // Conditional render: Show loading if no agentData or still initializing
  if (isLoading || !agentData) {
    return <div>Loading Coach data...</div>; // Now after all hooks
  }

  // Function to generate PDF: Capture each page section separately for clean pages
  const downloadBlankPDF = async () => {
    if (!imagesLoaded) {
      alert('Please wait for images to load before downloading.');
      return;
    }

    const reportElement = document.getElementById('blank-pdf-content');
    if (!reportElement) {
      alert('Report not ready for download.');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Scroll to top and wait for reflow
      reportElement.scrollIntoView({ behavior: 'instant' });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for rendering

      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, A4 size
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm

      // Find all page sections (data-page attributes)
      const pageSections = reportElement.querySelectorAll('.pdf-page');
      if (pageSections.length === 0) {
        throw new Error('No page sections found.');
      }

      // Capture and add each section as a separate full page
      for (let i = 0; i < pageSections.length; i++) {
        const section = pageSections[i];
        console.log(`Capturing page ${i + 1}...`);

        // Temporarily hide other sections to capture only this one cleanly
        pageSections.forEach((s, index) => {
          if (index !== i) s.style.display = 'none';
        });

        // Capture this section (force A4 dimensions for perfect fit)
        const canvas = await html2canvas(section, {
          scale: 3, // High resolution for crispness
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: section.scrollWidth,
          height: section.scrollHeight,
          logging: false,
          scrollX: 0,
          scrollY: 0,
        });

        const imgData = canvas.toDataURL('image/png', 1.0); // No compression

        // Add as full A4 page (scale to fit exactly)
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        let positionY = 0;
        pdf.addImage(imgData, 'PNG', 0, positionY, pageWidth, imgHeight);

        // If this isn't the last page, add a new page
        if (i < pageSections.length - 1) {
          pdf.addPage();
        }

        // Restore visibility of other sections
        pageSections.forEach(s => (s.style.display = 'block'));
      }

      // Save the PDF
      pdf.save(`Blank-Agent-Report-${agentData.name || 'Agent'}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please check console for details and try again.');
    } finally {
      // Ensure all sections are visible again
      const pageSections = reportElement.querySelectorAll('.pdf-page');
      pageSections.forEach(s => (s.style.display = 'block'));
      setIsGeneratingPDF(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="blank-report-container">
      <header className="blank-report-header">
        <h1>Blank Agent-Branded Report Template</h1>
        <button onClick={handleBackToDashboard} className="back-btn">← Back to Dashboard</button>
      </header>

      <main className="blank-report-main">
        <div className="report-preview">
          <h2>Preview (Agent Data Only)</h2>
          <p>This template includes only your agent branding and details, plus additional pages with user information images. Download as PDF for printing as a professional intro or letterhead. (Dotted borders show page edges.)</p>
          {isGeneratingPDF && <div className="loading-spinner">Generating high-quality PDF... Please wait.</div>}
          {!imagesLoaded && <p style={{ color: 'orange' }}>Loading images for preview...</p>}
          
          {/* Render the blank report component for preview */}
          <div id="blank-pdf-content" ref={reportRef} className="blank-report-render">
            <BlankFinalReport agentData={agentData} />
          </div>
        </div>

        <div className="download-section">
          <button 
            onClick={downloadBlankPDF} 
            className="download-pdf-btn"
            disabled={!imagesLoaded || isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download as PDF'}
          </button>
          <p>Generates a high-quality printable PDF with separate pages (no overlaps).</p>
        </div>
      </main>
    </div>
  );
};

export default BlankReportPage;

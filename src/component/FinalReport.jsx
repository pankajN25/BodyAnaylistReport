// FinalReport.jsx
import React from 'react';
import './FinalReport.css';
import charmingAuraLogo from './logo.png'; // Path to your logo
import qrCodePlaceholder from './qr-code.png'; // Path to your QR code image
import bodySilhouette from './body-silhouette1.jpg'; // Path to the body silhouette image
import wellnessCenterLogo from './wellness-center-logo.png';
import '../index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import the consistent helper functions from utils.js
import { getStatusTagText, getStatusTagColor } from './utils'; // Adjusted path to './utils'
import ValueBadge from './utils1'; // Importing ValueBadge from utils1.jsx

// Helper function to determine body type (kept local as it's specific to this report)
const getBodyType = (bmi, bodyFat) => {
    // Simplified logic based on the provided image and common formulas
    if (bmi < 18.5) return 'thin';
    if (bmi >= 18.5 && bmi < 25) {
        if (bodyFat < 20) return 'standard-muscular';
        return 'standard';
    }
    if (bmi >= 25 && bodyFat < 25) return 'muscular-overweight';
    if (bmi >= 25) return 'overweight';
    return 'standard';
};

// Calculate total extra fat percentage
const calculateTotalExtraFat = (reportData, gender) => {
    const standards = {
        whole_body_sub_fat: gender === "Male" ? 15 : 20,
        trunk_sub_fat: gender === "Male" ? 15 : 20,
        arm_sub_fat: gender === "Male" ? 20 : 25,
        leg_sub_fat: gender === "Male" ? 20 : 25,
    };

    let totalExtra = 0;
    let count = 0;

    Object.keys(standards).forEach(key => {
        const customerVal = Number(reportData[key]) || 0;
        if (customerVal > standards[key]) {
            totalExtra += (customerVal - standards[key]);
            count++;
        }
    });

    return count > 0 ? (totalExtra / count).toFixed(1) : 0;
};

// Generate personalized recommendation
const generateFatRecommendation = (reportData, gender) => {
    const standards = {
        whole_body_sub_fat: gender === "Male" ? 15 : 20,
        trunk_sub_fat: gender === "Male" ? 15 : 20,
        arm_sub_fat: gender === "Male" ? 20 : 25,
        leg_sub_fat: gender === "Male" ? 20 : 25,
    };

    let highestExtra = 0;
    let problemArea = "";

    Object.keys(standards).forEach(key => {
        const customerVal = Number(reportData[key]) || 0;
        const extra = customerVal - standards[key];
        if (extra > highestExtra) {
            highestExtra = extra;
            problemArea = key;
        }
    });

    if (highestExtra <= 0) {
        return "Your fat levels are within healthy ranges. Maintain your current lifestyle with regular exercise and balanced nutrition.";
    }

    const areaMap = {
        whole_body_sub_fat: "whole body",
        trunk_sub_fat: "trunk area",
        arm_sub_fat: "arms",
        leg_sub_fat: "legs"
    };

    return `Focus on reducing fat in your ${areaMap[problemArea]} through targeted exercises and a calorie-controlled diet. Consider consulting with a nutritionist for a personalized plan.`;
};

const FinalReport = ({ allData, agentData }) => {
    if (!allData || Object.keys(allData.form1).length === 0) {
        return <div className="no-data-message">No report data available. Please complete the forms.</div>;
    }

    const { form1, form2, form3 } = allData;


    // Extracting data with fallbacks
    const name = form1.name || 'N/A';
    const gender = form1.gender || 'Male'; // Ensure gender is captured from form data
    const mobile = form1.mobile || '1234567890';
    const village = form1.village || 'Default Village';
    const email = form1.email || '6E2oP@example.com'; // Corrected variable name from 'emil' to 'email'
    const height = form1.height || '172';
    const age = form1.age || '32';
    const reportDate = form1.date || '2025-04-11';

    const weight = parseFloat(form1.weight) || 0;
    const bmi = parseFloat(form2.bmi) || 0;
    const rmi = parseFloat(form2.restingMetabolism) || 0;
    const bodyFat = parseFloat(form2.bodyFat) || 0;
    const muscleRate = parseFloat(form3.skeletalMuscle) || 0;
    const visceralFat = parseFloat(form2.visceralFat) || 0;
    const bmr = parseFloat(form2.restingMetabolism) || 0;
    const subcutaneousFat = parseFloat(form3.wholeBodySubFat) || 0;
    const bodyAge = parseInt(form2.bodyAge) || 0;
    const idealWeight = parseFloat(form1.idealWeight) || 0;


    // gender checkup for health metrics-----
    const normalRanges = {
        male: {
            bodyFat: '17 - 24%',
            visceralFat: '5 - 9',
            bmi: '18- 23',
        },
        female: {
            bodyFat: '24 - 31%',
            visceralFat: '7 - 12',
            bmi: '18.5 - 22',
        }
    };
    const genderKey = gender.toLowerCase();
    const currentNormalRanges = normalRanges[genderKey] || { bodyFat: '-', visceralFat: '-', bmi: '-' };
    // 


    // Simplified body composition data (hardcoded for example based on image)
    // Calculate fatMass based on current weight and bodyFat percentage
    const fatMass = ((weight * bodyFat) / 100).toFixed(2);
    const moisture = 47.5; // Placeholder, ideally from form data
    const proteinAmount = 13.92; // Placeholder, ideally from form data
    const boneMass = 3.2; // Placeholder, ideally from form data

    const currentBodyType = getBodyType(bmi, bodyFat);

    // Dynamically determine obesity rating using the imported helper function
    const obesityRating = getStatusTagText(bmi, 'bmi');
    const proteinRate = 13.7; // Placeholder, ideally from form data

    // Placeholder for last increase/decrease in weight (you'll need to calculate this from historical data)
    const lastIncrease = 0; // Example: weight - previousWeight;
    const lastWeight = 0; // Example: previousWeight;
    const reportData = {
        whole_body_sub_fat: form3.wholeBodySubFat || '00',
        trunk_sub_fat: form3.trunkSubFat || '00',
        arm_sub_fat: form3.armSubFat || '00',
        leg_sub_fat: form3.legSubFat || '00',
        skeletal_muscle: form3.skeletalMuscle || '00',
        trunk_muscle: form3.trunkMuscle || '00',
        arms_muscle: form3.armsMuscle || '00',
        legs_muscle: form3.legsMuscle || '00',
    };
    //  extra body age ya less body age show
    const bage = bodyAge - age;

    //  const bage=()=>{
    // if(bodyAge>age){
    //     return bodyAge-age;
    // }else if(bodyAge<age){
    //     return age-bodyAge;
    // }
    // 
    // 
    // 
    // agent data
    const [agentFirstName, agentLastName] = agentData?.name
        ? agentData.name.split(' ')
        : ['', ''];
    const agentEmail = agentData?.email || 'N/A';
    const agentPhone = agentData?.phone || '1234567890';
    // const agentAgencyName = agentData?.agencyName || '';
    const agentWellnessCenterName = agentData?.wellness_center_name || ' N/A';
    const agentPosition = agentData?.position || '';
    const agentContactNumber = agentData?.contact_number || 'N/A';
    const agentExperience = agentData?.experience || '00';
    const agentLogoImg = agentData?.logo_img_path || wellnessCenterLogo;
    const agentPhoto = agentData?.photo_path || wellnessCenterLogo;
    const agentAddress = agentData?.name_of_company || 'N/A';
    const agentConsultationHours = agentData?.consultationHours || 'Mon-Sat, 10 AM - 6 PM';
    const agentLanguages = agentData?.languages || 'English, Hindi, Marathi';
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


    console.log('Agent photo URL:', agentPhotoUrl);
    console.log('Agent logo URL:', agentLogoUrl);


    // Helper to render range segments dynamically
    const renderRangeSegments = (ranges, maxVal) => {
        const segments = [];

        if (ranges.healthy.min > 0) {
            segments.push(
                <div
                    key="low"
                    className="range-segment-exact gray-range"
                    style={{
                        left: '0%',
                        width: `${(ranges.healthy.min / maxVal) * 100}%`
                    }}
                />
            );
        }

        segments.push(
            <div
                key="healthy"
                className="range-segment-exact green-range"
                style={{
                    left: `${(ranges.healthy.min / maxVal) * 100}%`,
                    width: `${((ranges.healthy.max - ranges.healthy.min) / maxVal) * 100}%`
                }}
            />
        );

        segments.push(
            <div
                key="risk"
                className="range-segment-exact red-range"
                style={{
                    left: `${(ranges.risk.min / maxVal) * 100}%`,
                    width: `${((ranges.risk.max - ranges.risk.min) / maxVal) * 100}%`
                }}
            />
        );

        if (ranges.risk.max < maxVal) {
            segments.push(
                <div
                    key="high"
                    className="range-segment-exact gray-range"
                    style={{
                        left: `${(ranges.risk.max / maxVal) * 100}%`,
                        width: `${((maxVal - ranges.risk.max) / maxVal) * 100}%`
                    }}
                />
            );
        }

        return segments;
    };

    const maxValues = {
        bmi: 40,        // Max value for BMI scale
        bodyFat: 50,    // Max value for Body Fat scale
        visceralFat: 20 // Max value for Visceral Fat scale
    };

    // Define the ranges for each metric based on your visual reference and common standards
    const bmiRanges = {
        healthy: { min: 18.5, max: 24.9, color: 'green' },
        risk: { min: 25.0, max: 29.9, color: 'red' }
    };

    const bodyFatRanges = {
        healthy: { min: 17.0, max: 24.0, color: 'green' },
        risk: { min: 25.0, max: 31.0, color: 'red' }
    };

    const visceralFatRanges = {
        healthy: { min: 1, max: 9, color: 'green' },
        risk: { min: 10, max: 15, color: 'red' }
    };



    return (
        <div className="report-page1" id="pdf-content">
            <div className="charming-container">
                <div className="container-fluid p-0">
                    <div className="row no-gutters">
                        {/* Left green section */}
                        <div className="col-lg-5 green-section">
                            <div className="rotated-image-container">
                                <img
                                    src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2940&auto=format&fit=crop"
                                    alt="Wellness"
                                    className="rotated-image"
                                />
                            </div>

                            <div className="supervisor-info text-center">
                                <p>Joining Date</p>
                                <p>{dateOfJoining}</p>
                                <h2>{agentPosition}</h2>
                                <p>{herbalifeId}</p>
                            </div>

                            <div className="coach-profiles">
                                {/* <div className="coach-card">
                                    <div className="coach-image-container">
                                        <img
                                            src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2680&auto=format&fit=crop"
                                            alt="Poonam Yadav"
                                            className="coach-image"
                                        />
                                    </div>
                                    <h3>Poonam Yadav</h3>
                                    <p>Wellness Coach</p>
                                </div> */}

                                <div className="coach-card">
                                    <div className="coach-image-container">
                                        <img
                                            src={agentPhotoUrl}
                                            alt="Manoj Yadav"
                                            className="coach-image"
                                        />
                                    </div>
                                    <p>Wellness Coach</p>
                                    <h3>{agentFirstName} {agentLastName}</h3>

                                </div>

                            </div>
                        </div>

                        {/* Right white section */}
                        <div className="col-lg-7 white-section">
                            <div className="header-section">
                                <div className="logo-container">
                                    <img
                                        src={agentLogoUrl || wellnessCenterLogo}
                                        alt="Charming Aura Logo"
                                        className="logo-image"
                                    />
                                </div>
                            </div>
                            <div className="header-section">

                                <div className="header-text">
                                    <h1>{agentWellnessCenterName}</h1>
                                    {/* <h2>Wellness & Nutrition Center</h2> */}
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
                                </div>

                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>

                                    <a href={facebookLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                                    <a href={instagramLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                                    <a href={linkedinLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                                    <a href={linkedinLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                                    <a href={youtubeLink} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                                </div>
                                <p className="address">
                                    {agentAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 1. Header */}
            <div className="report-header-modern">
                <div className="header-gradient">
                    <h1 className="report-title-modern">Body Composition Analysis Report</h1>
                </div>

                <div className="user-details-grid-modern">
                    <div className="detail-card-modern">
                        {/* <div className="detail-icon">👤</div> */}
                        <div className="detail-content">
                            <div className="detail-label-modern">NAME</div>
                            <div className="detail-value-modern">{name}</div>
                        </div>
                    </div>

                    <div className="detail-card-modern">
                        {/* <div className="detail-icon">📧</div> */}
                        <div className="detail-content">
                            <div className="detail-label-modern">EMAIL</div>
                            <div className="detail-value-modern">{email}</div>
                        </div>
                    </div>

                    <div className="detail-card-modern">
                        {/* <div className="detail-icon">📍</div> */}
                        <div className="detail-content">
                            <div className="detail-label-modern">LOCATION</div>
                            <div className="detail-value-modern">{village}</div>
                        </div>
                    </div>

                    <div className="detail-card-modern">
                        {/* <div className="detail-icon">📱</div> */}
                        <div className="detail-content">
                            <div className="detail-label-modern">MOBILE</div>
                            <div className="detail-value-modern">{mobile}</div>
                        </div>
                    </div>

                    <div className="detail-card-modern">
                        {/* <div className="detail-icon">⚤</div> */}
                        <div className="detail-content">
                            <div className="detail-label-modern">GENDER</div>
                            <div className="detail-value-modern">{gender}</div>
                        </div>
                    </div>

                    <div className="detail-card-modern">
                        {/* <div className="detail-icon">📅</div> */}
                        <div className="detail-content">
                            <div className="detail-label-modern">DATE & TIME</div>
                            <div className="detail-value-modern">{reportDate} | {new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="weight-metrics-modern">
                <h2 className="wm-title-modern">Weight Metrics</h2>

                <div className="wm-grid-modern">
                    {/* Age Card */}
                    <div className="wm-card-modern">
                        <div className="wm-card-value">{age}</div>
                        <div className="wm-card-header">
                            <div className="wm-card-title">AGE</div>
                            <p>(Years)</p>
                        </div>
                    </div>

                    {/* Height Card */}
                    <div className="wm-card-modern">
                        <div className="wm-card-value">{height}</div>
                        <div className="wm-card-header">
                            <div className="wm-card-title">HEIGHT</div>
                            <p>(CM)</p>
                        </div>
                    </div>

                    {/* Current Weight Card */}
                    {/* This card now has a dynamic class for styling */}
                    <div className={`wm-card-modern ${weight > idealWeight ? 'extra-weight' : weight < idealWeight ? 'less-weight' : ''}`}>
                        <div className="wm-card-value">
                            <span>{weight.toFixed(2)}</span>
                        </div>
                        {/* The arrow and text are now below the main value */}
                        {weight !== idealWeight && (
                            <div className="wm-card-diff">
                                {weight > idealWeight && <span className="extra-weight-text">▲ +{(weight - idealWeight).toFixed(2)} kg</span>}
                                {weight < idealWeight && <span className="less-weight-text">▼ {(weight - idealWeight).toFixed(2)} kg</span>}
                            </div>
                        )}
                        <div className="wm-card-header">
                            <div className="wm-card-title">CURRENT WEIGHT</div>
                            <p>(Kg)</p>
                        </div>
                    </div>

                    {/* Ideal Weight Card */}
                    <div className="wm-card-modern">
                        <div className="wm-card-value">{idealWeight.toFixed(2)}</div>
                        <div className="wm-card-header">
                            <div className="wm-card-title">IDEAL WEIGHT</div>
                            <p>(kg)</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="main-report-grid">
                {/* Subcutaneous Fat Analysis */}
                <div className="grid-column">
                    <div className="analysis-card">
                        <div className="analysis-header green-bg">
                            <h3 className="analysis-title">Subcutaneous Fat Analysis (%)</h3>
                        </div>

                        <div className="analysis-grid">
                            <div className="analysis-row header">
                                <div className="analysis-metric">Body Area</div>
                                <div className="analysis-value">Normal</div>
                                <div className="analysis-value your-value">Value</div>
                            </div>

                            {[
                                { label: "Whole Body", male: 15, female: 20, value: reportData.whole_body_sub_fat },
                                { label: "Trunk", male: 15, female: 20, value: reportData.trunk_sub_fat },
                                { label: "Arm", male: 20, female: 25, value: reportData.arm_sub_fat },
                                { label: "Legs", male: 20, female: 25, value: reportData.leg_sub_fat },
                            ].map((item, idx) => {
                                const standard = gender === "Male" ? item.male : item.female;
                                const customerVal = Number(item.value);
                                const isValid = !isNaN(customerVal) && customerVal > 0;
                                const diff = isValid ? (customerVal - standard).toFixed(1) : null;

                                let statusClass = "badge-green"; // default = normal
                                if (isValid && customerVal > standard) {
                                    if (customerVal <= standard + 5) statusClass = "badge-amber"; // slightly high
                                    if (customerVal > standard + 5) statusClass = "badge-red";   // risky high
                                }

                                return (
                                    <div className="analysis-row" key={idx}>
                                        <div className="analysis-metric">{item.label}</div>
                                        <div className="analysis-value">{standard}%</div>
                                        <div className="analysis-value your-value">
                                            {isValid ? (
                                                <div className={`value-badge ${statusClass}`}>
                                                    <div className="value-text">{customerVal}%</div>
                                                    {customerVal > standard && <div className="value-diff">+{diff}%</div>}
                                                </div>
                                            ) : "-"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Skeletal Muscle Analysis */}
                <div className="grid-column">
                    <div className="analysis-card">
                        <div className="analysis-header blue-bg">
                            <h3 className="analysis-title">Skeletal Muscle Analysis (%)</h3>
                        </div>

                        <div className="analysis-grid">
                            <div className="analysis-row header">
                                <div className="analysis-metric">Body Area</div>
                                <div className="analysis-value">Normal</div>
                                <div className="analysis-value your-value">Value</div>
                            </div>

                            {[
                                { label: "Whole Body", male: 37, female: 33, value: reportData.skeletal_muscle },
                                { label: "Trunk", male: 30, female: 25, value: reportData.trunk_muscle },
                                { label: "Arms", male: 45, female: 40, value: reportData.arms_muscle },
                                { label: "Legs", male: 50, female: 45, value: reportData.legs_muscle },
                            ].map((item, idx) => {
                                const standard = gender === "Male" ? item.male : item.female;
                                const customerVal = Number(item.value);
                                const isValid = !isNaN(customerVal) && customerVal > 0;
                                const diff = isValid ? (standard - customerVal).toFixed(1) : null;

                                let statusClass = "badge-green"; // default = normal
                                if (isValid && customerVal < standard) {
                                    if (customerVal >= standard - 5) statusClass = "badge-amber"; // slightly low
                                    if (customerVal < standard - 5) statusClass = "badge-red";   // risky low
                                }

                                return (
                                    <div className="analysis-row" key={idx}>
                                        <div className="analysis-metric">{item.label}</div>
                                        <div className="analysis-value">{standard}%</div>
                                        <div className="analysis-value your-value">
                                            {isValid ? (
                                                <div className={`value-badge ${statusClass}`}>
                                                    <div className="value-text">{customerVal}%</div>
                                                    {customerVal < standard && <div className="value-diff">-{diff}%</div>}
                                                </div>
                                            ) : "-"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-column">
                <div className="section-card basic-data-card">
                    <h2 className="card-title">Health Metrics</h2>
                    <div className="health-metrics-grid">
                        {/* BMI Card */}
                        <div className="health-metric-card-exact">
                            <div className="metric-header-exact">
                                <span className="metric-title-exact">BMI</span>
                                <div className="metric-value-group-exact">
                                    <span className="metric-value-exact">{bmi.toFixed(1)}</span>
                                    <span className="metric-unit-exact">kg/m²</span>
                                </div>
                            </div>
                            <div className="progress-area-exact">
                                <div className="progress-bar-exact">
                                    {renderRangeSegments(bmiRanges, maxValues.bmi)}
                                    {/* Pointer - Now inside progress-bar-exact */}
                                    <div
                                        className="value-pointer-exact"
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            left: `${(bmi / maxValues.bmi) * 100}%`,
                                            width: '2px',
                                            height: '18px',
                                            backgroundColor: 'black',
                                            transform: 'translateX(-50%)',
                                            zIndex: 10
                                        }}
                                    />
                                </div>
                                {/* Optional Trend Indicator */}
                                <div className="trend-line-exact">
                                    <span className="trend-diff-exact green-text">
                                        ▼ 0.5 {/* Replace with dynamic diff */}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Body Fat Card */}
                        <div className="health-metric-card-exact">
                            <div className="metric-header-exact">
                                <span className="metric-title-exact">Percent Body Fat</span>
                                <div className="metric-value-group-exact">
                                    <span className="metric-value-exact">{bodyFat.toFixed(1)}</span>
                                    <span className="metric-unit-exact">%</span>
                                </div>
                            </div>
                            <div className="progress-area-exact">
                                <div className="progress-bar-exact">
                                    {renderRangeSegments(bodyFatRanges, maxValues.bodyFat)}
                                    <div
                                        className="value-pointer-exact"
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            left: `${(bodyFat / maxValues.bodyFat) * 100}%`,
                                            width: '2px',
                                            height: '18px',
                                            // backgroundColor: 'black',
                                            transform: 'translateX(-50%)',
                                            zIndex: 10
                                        }}
                                    />
                                </div>
                                <div className="trend-line-exact">
                                    <span className="trend-diff-exact red-text">
                                        ▲ 17.9 {/* Replace with dynamic diff */}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Visceral Fat Card */}
                        <div className="health-metric-card-exact">
                            <div className="metric-header-exact">
                                <span className="metric-title-exact">Visceral Fat Level</span>
                                <div className="metric-value-group-exact">
                                    <span className="metric-value-exact">{visceralFat}</span>
                                    <span className="metric-unit-exact">LV</span>
                                </div>
                            </div>
                            <div className="progress-area-exact">
                                <div className="progress-bar-exact">
                                    {renderRangeSegments(visceralFatRanges, maxValues.visceralFat)}
                                    <div
                                        className="value-pointer-exact"
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            left: `${(visceralFat / maxValues.visceralFat) * 100}%`,
                                            width: '2px',
                                            height: '18px',
                                            backgroundColor: 'black',
                                            transform: 'translateX(-50%)',
                                            zIndex: 10
                                        }}
                                    />
                                </div>
                                <div className="trend-line-exact">
                                    <span className="trend-diff-exact red-text">
                                        ▲ 6
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RMR - Use health-metric-row for proper layout */}
                        <div className="health-metric-row">
                            <div className="health-metric-info">
                                <div className="health-metric-value large">{rmi.toFixed(1)}</div>
                                <div className="metric-left">
                                    <div className="health-metric-name">RMR-Kcal</div>
                                </div>
                                <div className="metric-right"></div>
                            </div>
                        </div>

                        {/* Body Age - Use health-metric-row for proper layout */}
                        <div className="health-metric-row">
                            <div className="health-metric-info">
                                <div className={`health-metric-value large ${bodyAge > age ? 'red' : ''}`}>
                                    {bodyAge} Years
                                </div>
                                <div className="metric-left">
                                    <div className="health-metric-name">Body Age</div>
                                </div>
                                <div className="metric-right">
                                    {bodyAge > age ? (
                                        <div className="extra-age-note">(+ {bage} Years)</div>
                                    ) : (
                                        <div ></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="report-footer-advanced">
                <div className="footer-inner">
                    {/* Left: Logo */}
                    <div className="footer-left">
                        <img src={agentLogoUrl || wellnessCenterLogo} alt="Charming Aura Logo" className="footer-logo" />
                    </div>

                    {/* Center: Clinic Info */}
                    <div className="footer-center">
                        <h2 className="footer-title">{agentWellnessCenterName}</h2>
                        <p className="footer-address">
                            {agentAddress}
                        </p>
                    </div>

                    {/* Right: Coach Info */}
                    <div className="footer-right">
                        <p className="footer-coach">Wellness Coach</p>
                        <p className="footer-name">{agentFirstName} {agentLastName}</p>
                        <a href="tel:8446418611" className="footer-phone">📞 {agentPhone}</a>
                    </div>
                </div>
            </div>


            <div className="footer-tagline">
                <p className="tagline-text">🌿 Your journey to better health starts today! 💪</p>
            </div>
        </div>
    );
};

export default FinalReport;


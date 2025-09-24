import React from 'react';
import './HealthMetricsExact.css'; // Make sure to use a new CSS file for exact design

const HealthMetricsExact = ({ bmi, bodyFat, visceralFat }) => {
    // These values are taken directly from your screenshot for demonstration.
    // In a real application, you'd calculate or fetch these based on 'bmi', 'bodyFat', 'visceralFat' props.
    const bmiDiff = "0.5"; // Assuming this is a static representation for now, or you can calculate
    const bodyFatDiff = "17.9";
    const visceralFatDiff = "6";

    // Helper to determine the color for the diff indicator (e.g., green for down, red for up)
    const getDiffColor = (diffValue) => {
        // Based on the screenshot, BMI is down (blue/greenish), others are up (red)
        if (diffValue === "0.5") { // Special case for BMI in the screenshot
            return 'diff-down-color';
        } else if (parseFloat(diffValue) > 0) {
            return 'diff-up-color';
        }
        return '';
    };

    // Calculate progress bar and pointer positions
    // These values are specific to the screenshot's representation.
    // You might need to adjust the 'max' values (e.g., 40 for BMI, 50 for Body Fat, 20 for Visceral Fat)
    // to map your actual data range to the 0-100% width of the bar.
    const bmiProgress = (bmi / 40) * 100; // Assuming max BMI for the bar is 40
    const bodyFatProgress = (bodyFat / 50) * 100; // Assuming max Body Fat for the bar is 50
    const visceralFatProgress = (visceralFat / 20) * 100; // Assuming max Visceral Fat for the bar is 20

    return (
        <div className="health-metrics-container">
            {/* BMI Metric Card */}
            <div className="metric-card">
                <div className="metric-header">
                    <span className="metric-title">BMI</span>
                    <div className="metric-value-group">
                        <span className="metric-value">{bmi.toFixed(1)}</span>
                        <span className="metric-unit">kg/m²</span>
                    </div>
                </div>
                <div className="metric-progress-area">
                    <div className="progress-bar-base">
                        {/* Static ranges as seen in the screenshot */}
                        <div className="progress-range green-range" style={{ width: '25%', left: '10%' }}></div>
                        <div className="progress-range red-range" style={{ width: '25%', left: '35%' }}></div>
                        {/* Pointer for current value */}
                        <div className="progress-indicator" style={{ left: `${bmiProgress}%` }}></div>
                    </div>
                    <div className="metric-trend">
                        {/* Placeholder for the trend line, if needed to be visual */}
                        <div className="trend-line-placeholder"></div>
                        <span className={`trend-indicator ${getDiffColor(bmiDiff)}`}>
                            ▼{bmiDiff}
                        </span>
                    </div>
                </div>
            </div>

            {/* Percent Body Fat Metric Card */}
            <div className="metric-card">
                <div className="metric-header">
                    <span className="metric-title">Percent Body Fat</span>
                    <div className="metric-value-group">
                        <span className="metric-value">{bodyFat.toFixed(1)}</span>
                        <span className="metric-unit">%</span>
                    </div>
                </div>
                <div className="metric-progress-area">
                    <div className="progress-bar-base">
                        {/* Static ranges as seen in the screenshot */}
                        <div className="progress-range green-range" style={{ width: '20%', left: '15%' }}></div>
                        <div className="progress-range red-range" style={{ width: '30%', left: '35%' }}></div>
                        {/* Pointer for current value */}
                        <div className="progress-indicator" style={{ left: `${bodyFatProgress}%` }}></div>
                    </div>
                    <div className="metric-trend">
                        <div className="trend-line-placeholder"></div>
                        <span className={`trend-indicator ${getDiffColor(bodyFatDiff)}`}>
                            ▲{bodyFatDiff}
                        </span>
                    </div>
                </div>
            </div>

            {/* Visceral Fat Level Metric Card */}
            <div className="metric-card">
                <div className="metric-header">
                    <span className="metric-title">Visceral Fat Level</span>
                    <div className="metric-value-group">
                        <span className="metric-value">{visceralFat}</span>
                        <span className="metric-unit">LV</span>
                    </div>
                </div>
                <div className="metric-progress-area">
                    <div className="progress-bar-base">
                        {/* Static ranges as seen in the screenshot */}
                        <div className="progress-range green-range" style={{ width: '30%', left: '0%' }}></div>
                        <div className="progress-range red-range" style={{ width: '40%', left: '30%' }}></div>
                        {/* Pointer for current value */}
                        <div className="progress-indicator" style={{ left: `${visceralFatProgress}%` }}></div>
                    </div>
                    <div className="metric-trend">
                        <div className="trend-line-placeholder"></div>
                        <span className={`trend-indicator ${getDiffColor(visceralFatDiff)}`}>
                            ▲{visceralFatDiff}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthMetricsExact;
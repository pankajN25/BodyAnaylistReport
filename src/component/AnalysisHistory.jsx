import React, { useEffect, useState } from 'react';

const AnalysisHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
  .then(res => {
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }
    return res.json();
  })
  .then(data => {
    if (data.reports) setReports(data.reports);
    else setError('Failed to load reports');
  })
  .catch(err => setError(err.message))
  .finally(() => setLoading(false));

  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Past Body Analysis Reports</h2>
      <h6>total report are {reports.length}   </h6>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Client Name</th>
              <th>Mobile</th>
              <th>Report Date</th>
              <th>Age</th>
              <th>BMI</th>
              <th>Body Fat %</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id || report.report_id}>
                <td>{report.id || report.report_id}</td>
                <td>{report.name}</td>
                <td>{report.mobile}</td>
                <td>{report.report_date}</td>
                <td>{report.age}</td>
                <td>{report.bmi}</td>
                <td>{report.body_fat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnalysisHistory;
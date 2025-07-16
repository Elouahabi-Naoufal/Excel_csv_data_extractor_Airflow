import React from 'react';
import './PageStyles.css';

const CompliancePage: React.FC = () => {
  const handleDownloadReport = () => {
    alert('Compliance report download initiated. Contact compliance@expleo.com for access.');
  };

  const handleAuditRequest = () => {
    window.open('mailto:audit@expleo.com?subject=Audit Documentation Request');
  };

  const handleContactCompliance = () => {
    window.open('mailto:compliance@expleo.com?subject=Compliance Inquiry');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>EXPLEO Compliance & Governance</h1>
        <p>Enterprise data processing compliance standards for global operations</p>
      </div>

      <div className="compliance-grid">
        <div className="compliance-card clickable" onClick={() => window.open('https://gdpr.eu/', '_blank')}>
          <h3>🔒 GDPR Data Protection</h3>
          <ul>
            <li>EU General Data Protection Regulation compliant</li>
            <li>AES-256 encryption at rest and TLS 1.3 in transit</li>
            <li>Automated 30-day data retention policies</li>
            <li>Right to erasure and data portability</li>
          </ul>
          <p className="click-hint">Click to learn more about GDPR</p>
        </div>

        <div className="compliance-card clickable" onClick={() => window.open('https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html', '_blank')}>
          <h3>📋 SOC 2 Type II Certification</h3>
          <ul>
            <li>Annual SOC 2 Type II audits by certified CPAs</li>
            <li>Security, availability, and confidentiality controls</li>
            <li>Continuous monitoring and logging</li>
            <li>Incident response procedures</li>
          </ul>
          <p className="click-hint">Click to learn more about SOC 2</p>
        </div>

        <div className="compliance-card clickable" onClick={() => window.open('https://www.iso.org/isoiec-27001-information-security.html', '_blank')}>
          <h3>🏢 ISO 27001 Compliance</h3>
          <ul>
            <li>Information Security Management System (ISMS)</li>
            <li>Risk assessment and treatment procedures</li>
            <li>Employee security awareness training</li>
            <li>Annual certification audits</li>
          </ul>
          <p className="click-hint">Click to learn more about ISO 27001</p>
        </div>

        <div className="compliance-card">
          <h3>🌍 Global EXPLEO Standards</h3>
          <ul>
            <li>30+ countries compliance coverage</li>
            <li>CCPA compliance for California</li>
            <li>PIPEDA compliance for Canada</li>
            <li>Data residency in EU, US, APAC</li>
            <li>Local data sovereignty support</li>
          </ul>
        </div>
      </div>

      <div className="compliance-actions">
        <button className="action-btn primary" onClick={handleDownloadReport}>Download Compliance Report</button>
        <button className="action-btn secondary" onClick={handleAuditRequest}>Request Audit Documentation</button>
        <button className="action-btn secondary" onClick={handleContactCompliance}>Contact Compliance Team</button>
      </div>

      <div className="expleo-info">
        <h3>About EXPLEO Compliance</h3>
        <p>EXPLEO is a global engineering, technology and consulting service provider committed to the highest standards of data protection and regulatory compliance. Our Excel Data Explorer platform serves clients across automotive, aerospace, defense, energy, and technology sectors worldwide.</p>
      </div>
    </div>
  );
};

export default CompliancePage;
import React from 'react';
import './PageStyles.css';

const CompliancePage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Compliance & Governance</h1>
        <p>Enterprise data processing compliance standards</p>
      </div>

      <div className="compliance-grid">
        <div className="compliance-card">
          <h3>🔒 Data Protection</h3>
          <ul>
            <li>GDPR Compliant data processing</li>
            <li>Data encryption at rest and in transit</li>
            <li>Automated data retention policies</li>
            <li>Right to erasure implementation</li>
          </ul>
        </div>

        <div className="compliance-card">
          <h3>📋 Audit & Logging</h3>
          <ul>
            <li>Complete audit trail for all operations</li>
            <li>User access logging</li>
            <li>Data processing activity logs</li>
            <li>Compliance reporting dashboard</li>
          </ul>
        </div>

        <div className="compliance-card">
          <h3>🏢 Enterprise Standards</h3>
          <ul>
            <li>SOC 2 Type II certified</li>
            <li>ISO 27001 compliance</li>
            <li>HIPAA ready architecture</li>
            <li>PCI DSS Level 1 compliant</li>
          </ul>
        </div>

        <div className="compliance-card">
          <h3>🌍 Regional Compliance</h3>
          <ul>
            <li>EU data residency options</li>
            <li>CCPA compliance for California</li>
            <li>PIPEDA compliance for Canada</li>
            <li>Local data sovereignty support</li>
          </ul>
        </div>
      </div>

      <div className="compliance-actions">
        <button className="action-btn primary">Download Compliance Report</button>
        <button className="action-btn secondary">Request Audit Documentation</button>
        <button className="action-btn secondary">Contact Compliance Team</button>
      </div>
    </div>
  );
};

export default CompliancePage;
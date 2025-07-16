import React from 'react';
import './PageStyles.css';

const SecurityPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Security & Data Protection</h1>
        <p>Enterprise-grade security measures and protocols</p>
      </div>

      <div className="security-overview">
        <div className="security-status">
          <div className="status-item">
            <span className="status-indicator green"></span>
            <span>System Security: Active</span>
          </div>
          <div className="status-item">
            <span className="status-indicator green"></span>
            <span>Data Encryption: Enabled</span>
          </div>
          <div className="status-item">
            <span className="status-indicator green"></span>
            <span>Access Control: Enforced</span>
          </div>
        </div>
      </div>

      <div className="security-grid">
        <div className="security-card">
          <h3>🔐 Authentication & Access</h3>
          <ul>
            <li>Multi-factor authentication (MFA)</li>
            <li>Single Sign-On (SSO) integration</li>
            <li>Role-based access control (RBAC)</li>
            <li>Session management and timeout</li>
          </ul>
        </div>

        <div className="security-card">
          <h3>🛡️ Data Encryption</h3>
          <ul>
            <li>AES-256 encryption at rest</li>
            <li>TLS 1.3 for data in transit</li>
            <li>End-to-end encryption pipeline</li>
            <li>Key management and rotation</li>
          </ul>
        </div>

        <div className="security-card">
          <h3>🔍 Monitoring & Detection</h3>
          <ul>
            <li>Real-time threat detection</li>
            <li>Anomaly detection algorithms</li>
            <li>Security incident response</li>
            <li>24/7 security operations center</li>
          </ul>
        </div>

        <div className="security-card">
          <h3>🏗️ Infrastructure Security</h3>
          <ul>
            <li>Zero-trust network architecture</li>
            <li>Container security scanning</li>
            <li>Regular penetration testing</li>
            <li>Vulnerability management program</li>
          </ul>
        </div>
      </div>

      <div className="security-actions">
        <button className="action-btn primary">Security Assessment Report</button>
        <button className="action-btn secondary">Incident Response Plan</button>
        <button className="action-btn secondary">Contact Security Team</button>
      </div>
    </div>
  );
};

export default SecurityPage;
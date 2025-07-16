import React from 'react';
import './PageStyles.css';

const PrivacyPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: January 2024</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Data Collection</h2>
          <p>We collect only the data necessary to provide our Excel and CSV processing services:</p>
          <ul>
            <li>File metadata (name, size, format)</li>
            <li>Processing logs for audit purposes</li>
            <li>User authentication information</li>
            <li>System performance metrics</li>
          </ul>
        </section>

        <section>
          <h2>Data Processing</h2>
          <p>Your data is processed according to enterprise security standards:</p>
          <ul>
            <li>All data encrypted in transit and at rest</li>
            <li>Processing occurs in secure, isolated environments</li>
            <li>No data is shared with third parties</li>
            <li>Automatic data purging after processing completion</li>
          </ul>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>We maintain minimal data retention policies:</p>
          <ul>
            <li>Processed files: Deleted after 30 days</li>
            <li>Audit logs: Retained for 1 year</li>
            <li>User preferences: Retained until account deletion</li>
            <li>System logs: Retained for 90 days</li>
          </ul>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>Under GDPR and other privacy regulations, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request data deletion</li>
            <li>Data portability</li>
            <li>Object to processing</li>
          </ul>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>For privacy-related inquiries:</p>
          <p>Email: privacy@expleo.com</p>
          <p>Data Protection Officer: dpo@expleo.com</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
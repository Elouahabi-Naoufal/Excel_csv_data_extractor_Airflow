import React from 'react';
import './PageStyles.css';

const TermsPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Terms of Service</h1>
        <p>Last updated: January 2024</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Service Description</h2>
          <p>EXPLEO Excel Data Explorer provides enterprise-grade data processing services for Excel and CSV files, including:</p>
          <ul>
            <li>Secure file upload and processing</li>
            <li>Data extraction and transformation</li>
            <li>Advanced search and analytics</li>
            <li>Compliance reporting and audit trails</li>
          </ul>
        </section>

        <section>
          <h2>Acceptable Use</h2>
          <p>Users must comply with the following guidelines:</p>
          <ul>
            <li>Use the service only for legitimate business purposes</li>
            <li>Do not upload malicious or corrupted files</li>
            <li>Respect intellectual property rights</li>
            <li>Maintain confidentiality of access credentials</li>
            <li>Report security vulnerabilities responsibly</li>
          </ul>
        </section>

        <section>
          <h2>Service Availability</h2>
          <p>We strive to provide reliable service with:</p>
          <ul>
            <li>99.9% uptime SLA for enterprise customers</li>
            <li>24/7 monitoring and support</li>
            <li>Scheduled maintenance windows</li>
            <li>Disaster recovery procedures</li>
          </ul>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>EXPLEO's liability is limited to the extent permitted by law. We are not liable for:</p>
          <ul>
            <li>Data loss due to user error</li>
            <li>Business interruption</li>
            <li>Indirect or consequential damages</li>
            <li>Third-party service failures</li>
          </ul>
        </section>

        <section>
          <h2>Termination</h2>
          <p>Either party may terminate the service agreement:</p>
          <ul>
            <li>With 30 days written notice</li>
            <li>Immediately for breach of terms</li>
            <li>Upon expiration of subscription</li>
          </ul>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>For terms-related questions:</p>
          <p>Email: legal@expleo.com</p>
          <p>Phone: +1-800-EXPLEO-1</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
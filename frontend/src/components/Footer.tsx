import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="enterprise-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Data Processing</h4>
          <p>Secure Excel & CSV data extraction</p>
          <p>Enterprise-grade data pipeline</p>
        </div>
        
        <div className="footer-section">
          <h4>Compliance</h4>
          <p>GDPR Compliant</p>
          <p>SOC 2 Type II</p>
          <p>ISO 27001 Certified</p>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <p>24/7 Enterprise Support</p>
          <p>Documentation</p>
          <p>Training Resources</p>
        </div>
        
        <div className="footer-section">
          <h4>Legal</h4>
          <p><button className="footer-link" onClick={() => window.location.hash = 'privacy'}>Privacy Policy</button></p>
          <p><button className="footer-link" onClick={() => window.location.hash = 'terms'}>Terms of Service</button></p>

        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; 2024 EXPLEO. All rights reserved. | Version 1.0.0</p>
          <p>For enterprise inquiries: <a href="mailto:enterprise@expleo.com">enterprise@expleo.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
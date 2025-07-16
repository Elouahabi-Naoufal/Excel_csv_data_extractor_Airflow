import React from 'react';
import './PageStyles.css';

const HelpPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Help & Support</h1>
        <p>Enterprise support and documentation resources</p>
      </div>

      <div className="help-grid">
        <div className="help-card">
          <h3>📚 Documentation</h3>
          <ul>
            <li><a href="#api-docs">API Documentation</a></li>
            <li><a href="#user-guide">User Guide</a></li>
            <li><a href="#admin-guide">Administrator Guide</a></li>
            <li><a href="#integration">Integration Examples</a></li>
          </ul>
        </div>

        <div className="help-card">
          <h3>🎓 Training Resources</h3>
          <ul>
            <li><a href="#video-tutorials">Video Tutorials</a></li>
            <li><a href="#webinars">Live Webinars</a></li>
            <li><a href="#certification">Certification Program</a></li>
            <li><a href="#best-practices">Best Practices Guide</a></li>
          </ul>
        </div>

        <div className="help-card">
          <h3>🔧 Technical Support</h3>
          <ul>
            <li><a href="#troubleshooting">Troubleshooting Guide</a></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
            <li><a href="#system-status">System Status</a></li>
            <li><a href="#release-notes">Release Notes</a></li>
          </ul>
        </div>

        <div className="help-card">
          <h3>📞 Contact Support</h3>
          <div className="contact-info">
            <p><strong>Enterprise Support:</strong></p>
            <p>📧 support@expleo.com</p>
            <p>📱 +1-800-EXPLEO-1</p>
            <p>🕒 24/7 Support Available</p>
            <p><strong>Response Time:</strong> &lt; 2 hours</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">Open Support Ticket</button>
          <button className="action-btn secondary">Schedule Training</button>
          <button className="action-btn secondary">Download Documentation</button>
          <button className="action-btn secondary">System Health Check</button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
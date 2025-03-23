import React from 'react';

// Define props interface
interface VerificationEmailProps {
  username: string;
  otp: string;
}

// Define email styling as separate object
const emailStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    color: '#333333',
    margin: '0',
    padding: '0',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    marginBottom: '20px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  logo: {
    height: '50px',
    width: 'auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333333',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '20px',
    color: '#555555',
  },
  codeContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: '6px',
    padding: '16px',
    margin: '24px 0',
    textAlign: 'center' as const,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '5px',
    color: '#000000',
  },
  footer: {
    textAlign: 'center' as const,
    margin: '20px 0',
    fontSize: '14px',
    color: '#888888',
  },
};

// Create the component
function VerificationEmail({ username, otp }: VerificationEmailProps): React.ReactElement {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.card}>
          <div style={emailStyles.header}>
            <img 
              src="https://via.placeholder.com/150x50" 
              alt="Company Logo" 
              style={emailStyles.logo} 
            />
          </div>
          
          <h1 style={emailStyles.title}>Email Verification</h1>
          
          <p style={emailStyles.paragraph}>Hello {username},</p>
          
          <p style={emailStyles.paragraph}>
            Thank you for creating an account. To complete your registration, please use the verification code below:
          </p>
          
          <div style={emailStyles.codeContainer}>
            <span style={emailStyles.code}>{otp}</span>
          </div>
          
          <p style={emailStyles.paragraph}>
            This code will expire in 10 minutes. If you did not request this verification, please disregard this email.
          </p>
          
          <p style={emailStyles.paragraph}>
            Thanks,<br />
            The Team
          </p>
        </div>
        
        <div style={emailStyles.footer}>
          <p>© 2025 Your Company. All rights reserved.</p>
          <p>123 Main Street, Your City, ST 12345</p>
        </div>
      </div>
    </div>
  );
}

export default VerificationEmail;
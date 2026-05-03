import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, phone } = location.state || { email: 'your email', phone: 'your number' };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate verification
    navigate('/');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-slide-up flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <div style={{ background: '#fff', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span></h2>
        </div>

        <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Verify Your Account</h1>
        <p style={{ fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          Enter the 6-digit code sent to<br /><strong>{phone || email}</strong>
        </p>
        
        <div className="flex gap-4 justify-center mb-8">
          <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '1rem' }}>📱</span> SMS Sent
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '1rem' }}>💬</span> WhatsApp Sent
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="input"
                style={{ width: '45px', height: '54px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>

          <p style={{ fontSize: '0.8125rem', textAlign: 'center', marginBottom: '2rem' }}>
            Resend code in <span style={{ color: 'var(--brand-primary)' }}>00:45</span>
          </p>

          <button type="submit" className="btn btn-primary w-full py-3">
            Verify & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;

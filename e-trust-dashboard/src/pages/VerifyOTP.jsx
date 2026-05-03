import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

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
          <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', background: 'var(--brand-primary)', borderRadius: '8px' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>E</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.125rem' }}>E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span></h2>
        </div>

        <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Verify Your Account</h1>
        <p style={{ fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
          Enter the 6-digit code sent to<br /><strong>0300 1234567</strong>
        </p>

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

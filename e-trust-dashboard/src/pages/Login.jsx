import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [require2FA, setRequire2FA] = useState(false);
  const [partialToken, setPartialToken] = useState('');
  const { login, verify2FA } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (require2FA) {
        await verify2FA(partialToken, otp);
        navigate('/');
      } else {
        const data = await login(email, password);
        if (data.require2FA) {
          setRequire2FA(true);
          setPartialToken(data.partialToken);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-slide-up">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>

        <div className="flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <img src="/logo.png" alt="E-Trust" style={{ height: '36px', objectFit: 'contain' }} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span>
            </h2>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Sign in to your store account</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.875rem', borderRadius: '10px', fontSize: '0.8125rem', marginBottom: '1.5rem', border: '1px solid var(--danger-border)', fontWeight: 500 }}>
             ⚠️ {error}
          </div>
        )}

        <form className="flex-col gap-2" onSubmit={handleSubmit}>
          {!require2FA ? (
            <>
              <div className="input-group">
                <label className="input-label">Email / Store ID</label>
                <input
                  type="email"
                  className="input"
                  placeholder="name@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Forgot password?</Link>
                </div>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="animate-slide-up">
              <div className="input-group">
                <label className="input-label">Security Code</label>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  We've sent a 6-digit verification code to your registered device.
                </p>
                <input
                  type="text"
                  className="input text-center"
                  placeholder="000000"
                  maxLength="6"
                  style={{ letterSpacing: '0.5rem', fontSize: '1.5rem', fontWeight: 800, padding: '1rem' }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="button" className="btn btn-outline w-full mb-4" onClick={() => setRequire2FA(false)}>
                ← Change Email
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full py-3.5 mt-2" disabled={isLoading} style={{ fontSize: '0.9375rem' }}>
            {isLoading ? <div className="spinner"></div> : (require2FA ? 'Verify Access' : 'Sign In')}
          </button>
        </form>

        <div className="text-center mt-10">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            New to E-Trust? <Link to="/register" style={{ fontWeight: 700, color: 'var(--brand-primary)', textDecoration: 'none' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-slide-up">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>

        <div className="flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
              <img src="/logo.png" alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span></h2>
          </div>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1.5rem', border: '1px solid #FEE2E2', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="flex-col gap-5" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email / Store ID</label>
            <input
              type="email"
              className="input"
              placeholder="enter@store.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="flex-between">
              <label className="input-label">Password</label>
              <a href="#" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Forgot Password?</a>
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

          <button type="submit" className="btn btn-primary w-full py-3" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Login'}
          </button>
        </form>

        <div className="flex-center mt-8 gap-1">
          <p style={{ fontSize: '0.8125rem' }}>Don't have an account?</p>
          <Link to="/register" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

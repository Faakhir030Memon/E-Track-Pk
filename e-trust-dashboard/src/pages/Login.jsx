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
        <div className="flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: '48px', height: '48px' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="#10B981"/>
                <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="10" fontFamily="Arial" fontWeight="bold">E</text>
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.125rem' }}>E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span></h2>
          </div>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1.5rem', border: '1px solid var(--danger-border)', textAlign: 'center' }}>
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

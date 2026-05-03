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
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base" style={{ padding: '2rem' }}>
      <div className="card w-full animate-fade-in" style={{ maxWidth: '420px', padding: '3rem 2.5rem' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4" style={{ width: '48px', height: '48px', background: 'var(--brand-primary)', borderRadius: '12px', boxShadow: '0 0 20px var(--brand-glow)' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '24px' }}>E</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.9rem' }}>Sign in to manage your trust scores</p>
        </div>

        {error && (
          <div className="badge badge-red w-full mb-6 py-3" style={{ borderRadius: '8px', justifyContent: 'center' }}>
            {error}
          </div>
        )}

        <form className="flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="name@store.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Sign In'}
          </button>
        </form>

        <div className="divider"></div>

        <p className="text-center" style={{ fontSize: '0.85rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Create Store</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

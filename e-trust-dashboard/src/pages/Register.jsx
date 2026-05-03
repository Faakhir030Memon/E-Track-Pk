import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setIsLoading(true);

    try {
      await register({
        storeName: formData.storeName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      navigate('/verify-otp', { state: { email: formData.email, phone: formData.phone } });
    } catch (err) {
      const serverError = err.response?.data?.error || err.response?.data?.errors?.[0]?.message || 'Registration failed.';
      const debugInfo = err.response?.data?.debug ? ` (${err.response.data.debug})` : '';
      setError(`${serverError}${debugInfo}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-slide-up">
        <div className="flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', background: 'var(--brand-primary)', borderRadius: '8px' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>E</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.125rem' }}>E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span></h2>
          </div>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Create Your Store Account</h1>
          <p style={{ fontSize: '0.875rem' }}>Join hundreds of smart stores</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1rem', border: '1px solid var(--danger-border)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="flex-col gap-4" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Store Name</label>
            <input
              type="text"
              name="storeName"
              className="input"
              placeholder="My Awesome Store"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="seller@store.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="input"
              placeholder="0300 1234567"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-2 items-center mb-2">
            <input type="checkbox" style={{ accentColor: 'var(--brand-primary)' }} required />
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              I agree to the <a href="#">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full py-3" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Create Account'}
          </button>
        </form>

        <div className="flex-center mt-6 gap-1">
          <p style={{ fontSize: '0.8125rem' }}>Already have an account?</p>
          <Link to="/login" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    securityQuestion: 'What was your first number?',
    securityAnswer: ''
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
        password: formData.password,
        securityQuestion: {
          question: formData.securityQuestion,
          answer: formData.securityAnswer
        }
      });
      navigate('/');
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
      <div className="auth-card animate-slide-up" style={{ maxWidth: '480px' }}>
        <button className="back-btn" onClick={() => navigate('/login')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>

        <div className="flex-col items-center mb-8">
          <div className="flex-col items-center gap-2 mb-6">
            <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: '0.75rem' }}>
              <img src="/logo.png" alt="E-Trust" style={{ height: '48px', objectFit: 'contain' }} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', textAlign: 'center' }}>
              E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span>
            </h2>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', textAlign: 'center' }}>Create Store</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', textAlign: 'center' }}>Start protecting your business today</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.875rem', borderRadius: '10px', fontSize: '0.8125rem', marginBottom: '1.5rem', border: '1px solid var(--danger-border)', fontWeight: 500 }}>
             ⚠️ {error}
          </div>
        )}

        <form className="flex-col gap-1" onSubmit={handleSubmit}>
          <div className="grid-2 gap-4">
            <div className="input-group">
              <label className="input-label">Store Name</label>
              <input type="text" name="storeName" className="input" placeholder="My Awesome Store" value={formData.storeName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" name="email" className="input" placeholder="name@store.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input type="text" name="phone" className="input" placeholder="0300 1234567" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="grid-2 gap-4">
            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" name="password" className="input" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Confirm</label>
              <input type="password" name="confirmPassword" className="input" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-main)', padding: '1.25rem', border: '1px dashed var(--border)', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Security Recovery Setup</p>
            <div className="input-group mb-4">
              <label className="input-label">Security Question</label>
              <select name="securityQuestion" className="input" value={formData.securityQuestion} onChange={handleChange} style={{ appearance: 'none', background: '#fff' }}>
                <option>What was your first number?</option>
                <option>What is your pet's name?</option>
                <option>Your birthplace?</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Your Secret Answer</label>
              <input type="text" name="securityAnswer" className="input" placeholder="Enter answer here" value={formData.securityAnswer} onChange={handleChange} required />
            </div>
          </div>

          <div className="flex gap-2 items-center mb-6 mt-4">
            <input type="checkbox" style={{ accentColor: 'var(--brand-primary)', width: '16px', height: '16px' }} required />
            <label style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              I agree to the <a href="#" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full py-3.5" disabled={isLoading} style={{ fontSize: '0.9375rem' }}>
            {isLoading ? <div className="spinner"></div> : 'Create Store Account'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 700, color: 'var(--brand-primary)', textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

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
      navigate('/verify-otp', { state: { email: formData.email, phone: formData.phone } });
    } catch (err) {
// ... existing catch block ...
      setError(`${serverError}${debugInfo}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
// ... existing header ...
        <form className="flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid-2 gap-4">
            <div className="input-group">
              <label className="input-label">Store Name</label>
              <input type="text" name="storeName" className="input" placeholder="My Awesome Store" value={formData.storeName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" name="email" className="input" placeholder="seller@store.com" value={formData.email} onChange={handleChange} required />
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
              <label className="input-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="input" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-elevated)', padding: '1rem', border: '1px dashed var(--border)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '0.75rem' }}>Security Recovery Setup</p>
            <div className="input-group mb-3">
              <label className="input-label">Security Question</label>
              <select name="securityQuestion" className="input" value={formData.securityQuestion} onChange={handleChange}>
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

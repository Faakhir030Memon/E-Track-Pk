import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: '',
    platform: 'shopify'
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
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base" style={{ padding: '2rem' }}>
      <div className="card w-full animate-fade-in" style={{ maxWidth: '480px', padding: '3rem 2.5rem' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4" style={{ width: '48px', height: '48px', background: 'var(--brand-primary)', borderRadius: '12px', boxShadow: '0 0 20px var(--brand-glow)' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '24px' }}>E</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Register Store</h1>
          <p style={{ fontSize: '0.9rem' }}>Join the global trust network in Pakistan</p>
        </div>

        {error && (
          <div className="badge badge-red w-full mb-6 py-3" style={{ borderRadius: '8px', justifyContent: 'center' }}>
            {error}
          </div>
        )}

        <form className="flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Store Name</label>
            <input
              type="text"
              name="storeName"
              className="input"
              placeholder="e.g. Urban Style PK"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email Address</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="admin@store.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Platform</label>
            <select
              name="platform"
              className="input"
              value={formData.platform}
              onChange={handleChange}
              style={{ appearance: 'none' }}
            >
              <option value="shopify">Shopify</option>
              <option value="woocommerce">WooCommerce</option>
              <option value="custom">Custom MERN/Other</option>
              <option value="instagram">Instagram Seller</option>
              <option value="facebook">Facebook Marketplace</option>
            </select>
          </div>

          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
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

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Create Account'}
          </button>
        </form>

        <div className="divider"></div>

        <p className="text-center" style={{ fontSize: '0.85rem' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

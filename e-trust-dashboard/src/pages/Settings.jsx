import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Store Settings');
  const { user } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactor?.enabled || false);
  const [loading, setLoading] = useState(false);

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/toggle-2fa');
      setIs2FAEnabled(res.data.data.enabled);
      alert(res.data.message);
    } catch (err) {
      alert('Failed to toggle 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { name: 'Profile', icon: '👤' },
    { name: 'Store Settings', icon: '🏪' },
    { name: 'Security', icon: '🛡️' },
    { name: 'API Keys', icon: '🔑' },
    { name: 'Billing', icon: '💳' },
  ];

  return (
    <DashboardLayout>
      <div className="animate-slide-up" style={{ maxWidth: '900px' }}>
        <header className="mb-8">
          <h1 style={{ fontSize: '1.5rem' }}>Settings</h1>
          <p style={{ fontSize: '0.875rem' }}>Manage your store configuration and preferences</p>
        </header>

        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className="flex-col gap-2">
            {tabs.map((item) => (
              <button 
                key={item.name} 
                className="btn btn-ghost" 
                onClick={() => setActiveTab(item.name)}
                style={{ 
                  justifyContent: 'flex-start', 
                  background: activeTab === item.name ? 'var(--bg-card)' : 'transparent',
                  color: activeTab === item.name ? 'var(--brand-primary)' : 'var(--text-secondary)'
                }}
              >
                <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>

          <div className="card flex-col gap-6">
            <h3 style={{ fontSize: '1.125rem' }}>{activeTab}</h3>
            
            {activeTab === 'Store Settings' && (
              <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="input-group">
                  <label className="input-label">Store Name</label>
                  <input type="text" className="input" defaultValue={user?.storeName} />
                </div>
                <div className="input-group">
                  <label className="input-label">Store Email</label>
                  <input type="email" className="input" defaultValue={user?.email} />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input type="text" className="input" defaultValue={user?.phone} />
                </div>
                <div className="flex justify-end mt-4">
                  <button className="btn btn-primary" style={{ padding: '0.75rem 2.5rem' }}>Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="flex-col gap-6">
                <div className="flex-between p-4 rounded-xl border border-border" style={{ background: 'var(--bg-sidebar)' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>2-Step Verification (2FA)</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Secure your account by requiring an OTP on every login.
                    </p>
                  </div>
                  <button 
                    className={`btn ${is2FAEnabled ? 'btn-outline' : 'btn-primary'}`} 
                    onClick={handleToggle2FA}
                    disabled={loading}
                    style={{ minWidth: '120px', color: is2FAEnabled ? '#EF4444' : '' }}
                  >
                    {loading ? '...' : (is2FAEnabled ? 'Disable' : 'Enable')}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-border">
                  <h4 style={{ marginBottom: '0.25rem' }}>Password Management</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    It's a good practice to use a strong password that you're not using elsewhere.
                  </p>
                  <button className="btn btn-outline" style={{ fontSize: '0.8125rem' }}>Change Password</button>
                </div>

                <div className="p-4 rounded-xl border border-border">
                  <h4 style={{ marginBottom: '0.25rem' }}>Recovery Question</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Current Question: <strong>{user?.securityQuestion?.question || 'Not set'}</strong>
                  </p>
                  <button className="btn btn-outline" style={{ fontSize: '0.8125rem' }}>Update Question</button>
                </div>
              </div>
            )}

            {activeTab === 'API Keys' && (
              <div className="flex-col gap-4">
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Your private API key for integrations.</p>
                <div className="flex gap-2">
                  <input type="text" className="input flex-grow mono" value={user?.apiKey} readOnly />
                  <button className="btn btn-primary">Copy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

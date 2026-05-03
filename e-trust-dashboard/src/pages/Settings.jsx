import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Settings = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState(user?.apiKey || '••••••••••••••••••••••••••••••');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRegenerate = async () => {
    if (!window.confirm('Are you sure? Your existing API integrations will stop working until you update the key.')) return;
    
    setIsRegenerating(true);
    try {
      const res = await api.post('/auth/regenerate-key');
      setApiKey(res.data.data.apiKey);
    } catch (err) {
      alert('Failed to regenerate API key');
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
        <header className="mb-8">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Settings</h1>
          <p>Manage your store profile and API configurations.</p>
        </header>

        <div className="flex-col gap-6">
          {/* Profile Section */}
          <div className="card">
            <h3 className="mb-6" style={{ fontSize: '1.1rem' }}>Store Profile</h3>
            <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="flex-col gap-1">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Store Name</span>
                <span style={{ fontWeight: 500 }}>{user?.storeName}</span>
              </div>
              <div className="flex-col gap-1">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</span>
                <span style={{ fontWeight: 500 }}>{user?.email}</span>
              </div>
              <div className="flex-col gap-1">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Platform</span>
                <span className="badge badge-blue" style={{ width: 'fit-content' }}>{user?.platform?.toUpperCase()}</span>
              </div>
              <div className="flex-col gap-1">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</span>
                <span className="badge badge-green" style={{ width: 'fit-content' }}>ACTIVE</span>
              </div>
            </div>
          </div>

          {/* API Access Section */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: '1.1rem' }}>API Configuration</h3>
              <div className="badge badge-yellow">V1 Protocol</div>
            </div>
            
            <p className="mb-6" style={{ fontSize: '0.9rem' }}>
              Use this key to integrate E-Trust PK with your Shopify, WooCommerce, or custom backend.
            </p>

            <div className="flex-col gap-4">
              <div className="flex-col gap-2">
                <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>API Key</label>
                <div className="flex gap-2">
                  <div className="input flex items-center justify-between mono" style={{ background: 'var(--bg-base)', borderStyle: 'dashed' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{apiKey}</span>
                  </div>
                  <button className="btn btn-ghost" onClick={copyToClipboard}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex-col gap-4 p-4 mt-2" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid var(--yellow-border)', borderRadius: '8px' }}>
                <div className="flex gap-3">
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <div className="flex-col gap-1">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Security Warning</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Keep your API key private. Anyone with this key can access your store data and check trust scores.
                    </p>
                  </div>
                </div>
                <button 
                  className="btn btn-danger w-fit" 
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                >
                  {isRegenerating ? 'Regenerating...' : 'Regenerate Key'}
                </button>
              </div>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="card flex items-center justify-between" style={{ background: 'var(--brand-glow)', borderColor: 'var(--brand-primary)' }}>
            <div className="flex gap-4 items-center">
              <div style={{ fontSize: '1.5rem' }}>📖</div>
              <div className="flex-col gap-1">
                <p style={{ fontWeight: 600 }}>Integration Docs</p>
                <p style={{ fontSize: '0.8rem' }}>Learn how to install our Shopify and WooCommerce plugins.</p>
              </div>
            </div>
            <a href="#" className="btn btn-primary" style={{ boxShadow: 'none' }}>Read Docs</a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

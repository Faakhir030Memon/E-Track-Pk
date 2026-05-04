import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Integrations = () => {
  const [apiKey] = useState('et_live_' + Math.random().toString(36).substring(7));
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Store Integrations</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Connect your e-commerce store to track orders and reduce returns in real-time.</p>
        </header>

        <div className="grid-2">
          <div className="flex flex-col gap-6" style={{ gridColumn: 'span 2' }}>
            {/* API Key Card */}
            <div className="card" style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '2rem' }}>
              <h3 style={{ color: '#1E293B', marginBottom: '1rem', fontSize: '1.1rem' }}>Your API Key</h3>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 flex-wrap">
                <code style={{ flexGrow: 1, color: '#0F172A', fontWeight: 600, wordBreak: 'break-all' }}>{apiKey}</code>
                <button 
                  onClick={copyToClipboard}
                  className="btn btn-primary" 
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem' }}
                >
                  {copied ? 'Copied!' : 'Copy Key'}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1rem' }}>
                Keep this key secret. Use it to authenticate your API requests for order tracking.
              </p>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="card" style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '2rem' }}>
            <h3 style={{ color: '#1E293B', marginBottom: '1.5rem', fontSize: '1.1rem' }}>How to Track Orders & Returns</h3>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ color: '#1E293B', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Send Order Data</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>When a new order is placed, send the customer's phone number and order details to our /check-user API.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ color: '#1E293B', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Get Risk Score</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>We return a trust score (0-100). If the score is low, flag the order as "High Risk" in your store admin.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ color: '#1E293B', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Update Order Status</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>Once the order is delivered or returned, update the status via our /update-status API to improve global accuracy.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
            <h3 style={{ color: '#1E293B', marginBottom: '1.5rem', fontSize: '1rem' }}>Platform Plugins</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div style={{ width: '32px', height: '32px', background: '#9575CD', borderRadius: '8px' }}></div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Shopify</span>
                </div>
                <span style={{ fontSize: '0.7rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: '10px' }}>Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div style={{ width: '32px', height: '32px', background: '#5C6BC0', borderRadius: '8px' }}></div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>WooCommerce</span>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>Download</button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div style={{ width: '32px', height: '32px', background: '#EF5350', borderRadius: '8px' }}></div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Custom API</span>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>Docs</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;

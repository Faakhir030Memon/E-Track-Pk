import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Integrations = () => {
  const platforms = [
    { name: 'Shopify', status: 'Connected', lastSync: '2 min ago', icon: '🛍️' },
    { name: 'WooCommerce', status: 'Connected', lastSync: '5 min ago', icon: '🛒' },
    { name: 'WhatsApp', status: 'Connected', lastSync: 'Sync enabled', icon: '💬' },
    { name: 'TCS Courier', status: 'Connected', lastSync: '10 min ago', icon: '🚚' },
    { name: 'Leopards Courier', status: 'Connected', lastSync: 'Active', icon: '📦' },
    { name: 'Custom API', status: 'Connected', lastSync: 'View Docs', icon: '🔗' },
  ];

  return (
    <DashboardLayout>
      <div className="animate-slide-up">
        <header className="mb-8">
          <h1 style={{ fontSize: '1.5rem' }}>Integrations</h1>
          <p style={{ fontSize: '0.875rem' }}>Connect your store and courier services for automated tracking</p>
        </header>

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {platforms.map((p, i) => (
            <div key={i} className="card flex items-start gap-5">
              <div style={{ fontSize: '2.5rem' }}>{p.icon}</div>
              <div className="flex-grow flex-col gap-1">
                <div className="flex-between">
                  <h3 style={{ fontSize: '1rem' }}>{p.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 600 }}>{p.status}</span>
                </div>
                <p style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>Last sync: {p.lastSync}</p>
                <div className="flex gap-2">
                  <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.7rem', padding: '0.4rem' }}>{p.name === 'Custom API' ? 'Get API Key' : 'Disconnect'}</button>
                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: '0.7rem', padding: '0.4rem', background: 'var(--bg-elevated)' }}>Settings</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;

import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="animate-slide-up" style={{ maxWidth: '900px' }}>
        <header className="mb-8">
          <h1 style={{ fontSize: '1.5rem' }}>Settings</h1>
          <p style={{ fontSize: '0.875rem' }}>Manage your store configuration and preferences</p>
        </header>

        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className="flex-col gap-2">
            {[
              { name: 'Profile', icon: '👤' },
              { name: 'Store Settings', icon: '🏪', active: true },
              { name: 'Team Members', icon: '👥' },
              { name: 'Notification', icon: '🔔' },
              { name: 'Security', icon: '🛡️' },
              { name: 'API Keys', icon: '🔑' },
              { name: 'Billing', icon: '💳' },
            ].map((item) => (
              <button 
                key={item.name} 
                className="btn btn-ghost" 
                style={{ 
                  justifyContent: 'flex-start', 
                  background: item.active ? 'var(--bg-card)' : 'transparent',
                  color: item.active ? 'var(--brand-primary)' : 'var(--text-secondary)'
                }}
              >
                <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>

          <div className="card flex-col gap-6">
            <h3 style={{ fontSize: '1.125rem' }}>Store Settings</h3>
            
            <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="input-group">
                <label className="input-label">Store Name</label>
                <input type="text" className="input" defaultValue="Ali Store" />
              </div>
              <div className="input-group">
                <label className="input-label">Store Email</label>
                <input type="email" className="input" defaultValue="ali@store.com" />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="text" className="input" defaultValue="0300 1234567" />
              </div>
              <div className="input-group">
                <label className="input-label">Store Address</label>
                <input type="text" className="input" defaultValue="House 12, Street 5, Karachi" />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="btn btn-primary" style={{ padding: '0.75rem 2.5rem' }}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

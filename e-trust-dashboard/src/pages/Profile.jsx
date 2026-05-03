import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="animate-slide-up" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header className="mb-8">
          <h1 style={{ fontSize: '1.5rem' }}>Profile</h1>
          <p style={{ fontSize: '0.875rem' }}>Manage your personal details and account activity</p>
        </header>

        <div className="card flex-col items-center gap-6" style={{ padding: '3rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#374151', overflow: 'hidden' }}>
              {/* Placeholder for Ali Store avatar */}
              <div className="flex-center h-full" style={{ background: 'var(--bg-elevated)', fontSize: '2rem' }}>👤</div>
            </div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--brand-primary)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', cursor: 'pointer' }}>✎</button>
          </div>

          <div className="text-center">
            <h2 style={{ marginBottom: '0.25rem' }}>Ali Store</h2>
            <p style={{ fontSize: '1rem', color: 'var(--brand-primary)' }}>admin@store.com</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Role: Administrator</p>
          </div>

          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Joined on</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>01 Jan 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Store ID</span>
              <span className="mono" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--brand-primary)' }}>store_123</span>
            </div>
          </div>

          <div className="divider w-full"></div>

          <div className="grid gap-10 w-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="text-center">
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Orders</p>
              <h3 style={{ fontSize: '1.5rem' }}>12,540</h3>
            </div>
            <div className="text-center">
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>High Risk Detected</p>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--danger)' }}>1,257</h3>
            </div>
            <div className="text-center">
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Saved Revenue</p>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--brand-primary)' }}>PKR 1,85,000</h3>
            </div>
          </div>

          <button className="btn btn-primary mt-6" style={{ padding: '0.75rem 4rem' }}>Edit Profile</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Blacklist = () => {
  const blacklistedUsers = [
    { id: '5e884898...', reason: 'Fake Address', reportedBy: 'Store_123', date: '06 May 2026' },
    { id: 'b1946ac9...', reason: 'Refused Delivery', reportedBy: 'Store_456', date: '05 May 2026' },
    { id: 'c81e72bd...', reason: 'No Pick Up', reportedBy: 'Store_789', date: '05 May 2026' },
    { id: 'a8171187...', reason: 'Fraudulent Order', reportedBy: 'Store_101', date: '04 May 2026' },
    { id: 'e4d3b71...', reason: 'Fake Address', reportedBy: 'Store_202', date: '04 May 2026' },
  ];

  return (
    <DashboardLayout>
      <div className="animate-slide-up">
        <header className="mb-8">
          <h1 style={{ fontSize: '1.5rem' }}>Reports / Blacklist</h1>
          <p style={{ fontSize: '0.875rem' }}>Global shared records of verified high-risk customers</p>
        </header>

        <div className="card" style={{ padding: 0 }}>
          <div className="px-6 py-4 flex gap-6 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
            <button className="btn btn-ghost" style={{ background: 'var(--bg-elevated)', color: 'var(--brand-primary)', fontSize: '0.875rem' }}>Blacklisted Users</button>
            <button className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>Reports</button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Hashed ID</th>
                <th>Reason</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blacklistedUsers.map((user, i) => (
                <tr key={i}>
                  <td className="mono" style={{ color: 'var(--brand-primary)' }}>{user.id}</td>
                  <td>{user.reason}</td>
                  <td>{user.reportedBy}</td>
                  <td>{user.date}</td>
                  <td>
                    <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex-center py-6">
            <button className="btn btn-outline" style={{ padding: '0.5rem 2rem', fontSize: '0.8125rem' }}>Export Report</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Blacklist;

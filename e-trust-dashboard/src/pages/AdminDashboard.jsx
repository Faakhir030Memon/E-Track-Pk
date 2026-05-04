import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [storesRes, reportsRes] = await Promise.all([
          api.get('/admin/stores'),
          api.get('/admin/reports')
        ]);
        setStores(storesRes.data.data);
        setReports(reportsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleApproveStore = async (storeId) => {
    try {
      await api.patch(`/admin/stores/${storeId}`, { isApproved: true });
      setStores(stores.map(s => s._id === storeId ? { ...s, isApproved: true, subscription: { ...s.subscription, status: 'active' } } : s));
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleDeactivateStore = async (storeId, currentStatus) => {
    try {
      await api.patch(`/admin/stores/${storeId}`, { isActive: !currentStatus });
      setStores(stores.map(s => s._id === storeId ? { ...s, isActive: !currentStatus } : s));
    } catch (err) {
      alert('Action failed.');
    }
  };

  if (loading) return <div className="flex-center h-screen"><div className="spinner"></div></div>;

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <header className="flex-between mb-10">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Admin Control Center</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Central management for store lifecycle and global security.</p>
          </div>
          <div className="flex gap-4">
            <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--brand-primary)' }}>
              <div style={{ color: 'var(--brand-primary)', fontWeight: 800, fontSize: '1.25rem' }}>{stores.filter(s => !s.isApproved).length}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>New Approvals <br/> Pending</div>
            </div>
          </div>
        </header>

        {/* Store Management Table */}
        <div className="card mb-10">
          <h3 className="mb-6">Pending & Active Stores</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Plan</th>
                  <th>Payment Details</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(store => (
                  <tr key={store._id}>
                    <td>
                      <div className="flex flex-col">
                        <span style={{ fontWeight: 600 }}>{store.storeName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{store.email}</span>
                      </div>
                    </td>
                    <td><span className="badge">{store.subscription?.plan?.toUpperCase()}</span></td>
                    <td>
                      {store.subscription?.paymentDetails?.transactionId ? (
                        <div className="flex flex-col gap-1">
                          <span style={{ fontSize: '0.75rem' }}>ID: {store.subscription.paymentDetails.transactionId}</span>
                          <a href={store.subscription.paymentDetails.screenshotUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-primary)', fontSize: '0.75rem' }}>View Proof</a>
                        </div>
                      ) : <span style={{ color: 'var(--text-muted)' }}>No payment</span>}
                    </td>
                    <td>
                      <span className={`badge ${store.isApproved ? 'badge-success' : 'badge-warning'}`}>
                        {store.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem' }}>
                        {store.subscription?.expiryDate ? new Date(store.subscription.expiryDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {!store.isApproved && (
                          <button className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleApproveStore(store._id)}>Approve</button>
                        )}
                        <button 
                          className={`btn ${store.isActive ? 'btn-outline' : 'btn-primary'}`} 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: store.isActive ? '#EF4444' : '' }}
                          onClick={() => handleDeactivateStore(store._id, store.isActive)}
                        >
                          {store.isActive ? 'Ban' : 'Unban'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Reports */}
        <div className="card">
          <h3 className="mb-6">Global Fraud Reports Feed</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hashed ID</th>
                  <th>Store</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.flatMap(r => r.reportedByStores.map(report => ({ ...report, hashedId: r.hashedId }))).map((rep, idx) => (
                  <tr key={idx}>
                    <td className="mono" style={{ fontSize: '0.75rem' }}>{rep.hashedId.substring(0, 15)}...</td>
                    <td>{rep.storeId}</td>
                    <td>{rep.reason}</td>
                    <td>{new Date(rep.reportedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

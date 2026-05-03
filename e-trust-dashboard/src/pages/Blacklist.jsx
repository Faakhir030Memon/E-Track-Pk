import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const Blacklist = () => {
  const [blacklist, setBlacklist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const fetchBlacklist = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/trust/blacklist?page=${page}`);
      setBlacklist(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error('Error fetching blacklist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Global Blacklist</h1>
          <p>Verified high-risk users reported by multiple stores across the network.</p>
        </header>

        <div className="card" style={{ padding: 0 }}>
          <div className="overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>User Hash ID</th>
                  <th>Global Score</th>
                  <th>Reports</th>
                  <th>Main Reason</th>
                  <th>Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-20">
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : blacklist.length > 0 ? (
                  blacklist.map((user) => (
                    <tr key={user._id}>
                      <td className="mono" style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--brand-primary)' }}>{user.hashedId.substring(0, 16)}...</span>
                      </td>
                      <td>
                        <span className="badge badge-red" style={{ fontWeight: 700 }}>{user.globalScore}</span>
                      </td>
                      <td>
                        <span className="badge badge-yellow">{user.reportedByStores.length} Stores</span>
                      </td>
                      <td>
                        {user.flags[0] ? (
                          <span className="badge badge-ghost" style={{ border: '1px solid var(--border)' }}>
                            {user.flags[0].toUpperCase().replace('_', ' ')}
                          </span>
                        ) : 'RTO ABUSE'}
                      </td>
                      <td>{new Date(user.lastActivity).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-20 text-muted">No blacklisted users found yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button 
                key={p} 
                className={`btn ${p === pagination.page ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '0.5rem 1rem' }}
                onClick={() => fetchBlacklist(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="card mt-8" style={{ borderStyle: 'dashed', background: 'transparent' }}>
          <div className="flex items-center gap-4">
            <div style={{ fontSize: '1.5rem' }}>🛡️</div>
            <p style={{ fontSize: '0.85rem' }}>
              <strong>How it works:</strong> Users only appear on this global blacklist if they have a trust score below 30 <strong>and</strong> have been reported by at least 2 different stores. This prevents false positives and ensures the highest level of accuracy.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Blacklist;

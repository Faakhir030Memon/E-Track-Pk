import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const CheckUser = () => {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await api.post('/trust/check', { phone });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to check user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header className="mb-10 text-center">
          <h1 style={{ fontSize: '1.75rem' }}>Check Customer</h1>
          <p>Enter phone number to check trust score across the network</p>
        </header>

        <div className="card mb-10" style={{ padding: '1rem' }}>
          <form className="flex gap-3" onSubmit={handleCheck}>
            <div className="flex-grow">
              <input
                type="text"
                className="input w-full"
                placeholder="0300 1234567"
                style={{ background: 'var(--bg-sidebar)' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ minWidth: '140px' }}>
              {isLoading ? <div className="spinner"></div> : 'Check Score'}
            </button>
          </form>
        </div>

        {error && (
          <div className="card mb-10" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', textAlign: 'center' }}>
            <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        {result ? (
          <div className="flex-col gap-10 animate-fade-in">
            {/* Private Blacklist Warning */}
            {result.isPrivateBlacklisted && (
              <div className="card" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🚫</span>
                <div>
                  <p style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.9375rem' }}>Private Blacklist Alert</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>This customer is in YOUR store's private blacklist.</p>
                </div>
              </div>
            )}

            {/* Risk Meter Section */}
            <div className="glass-card flex-center flex-col gap-4 py-12 relative rounded-3xl">
              <div style={{ width: '240px', height: '240px', position: 'relative' }}>
                <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', filter: `drop-shadow(0 0 15px ${result.score < 50 ? 'rgba(255,75,75,0.3)' : result.score < 80 ? 'rgba(251,191,36,0.3)' : 'rgba(16,185,129,0.3)'})` }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--bg-elevated)" strokeWidth="2.5" />
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke={result.score < 50 ? 'var(--danger)' : result.score < 80 ? 'var(--warning)' : 'var(--success)'} 
                    strokeWidth="2.5" 
                    strokeDasharray={`${result.score}, 100`} 
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                  />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>{result.score}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Trust Score</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: result.score < 50 ? 'var(--danger)' : result.score < 80 ? 'var(--warning)' : 'var(--success)', margin: 0 }}>
                  {result.riskLevel.toUpperCase().replace('_', ' ')}
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>Risk assessment based on network-wide behavior.</p>
              </div>
            </div>

            {/* Bottom Stats Grid */}
            <div className="grid-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="card text-center flex-col gap-1">
                <span className="stat-label">Total History</span>
                <span className="stat-value" style={{ fontSize: '1.5rem' }}>{result.history.totalOrders}</span>
              </div>
              <div className="card text-center flex-col gap-1">
                <span className="stat-label">Successful</span>
                <span className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{result.history.successfulDeliveries}</span>
              </div>
              <div className="card text-center flex-col gap-1">
                <span className="stat-label">Returned/Canceled</span>
                <span className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--danger)' }}>{result.history.returns}</span>
              </div>
            </div>

            {/* Risk Reasons */}
            <div className="card">
              <h3 style={{ fontSize: '0.9375rem', marginBottom: '1.25rem' }}>Risk Reasons</h3>
              <div className="flex-col gap-3">
                {result.breakdown.addressFlags.length > 0 ? result.breakdown.addressFlags.map((flag, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)' }}></div>
                    <span style={{ fontSize: '0.875rem' }}>{flag.replace('_', ' ')}</span>
                  </div>
                )) : (
                  <div className="flex items-center gap-3">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
                    <span style={{ fontSize: '0.875rem' }}>No specific risk flags detected in address.</span>
                  </div>
                )}
                {result.history.returns > 2 && (
                  <div className="flex items-center gap-3">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)' }}></div>
                    <span style={{ fontSize: '0.875rem' }}>High return rate on other stores</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-center flex-col gap-6 py-20 opacity-30">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p>Waiting for search query...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CheckUser;

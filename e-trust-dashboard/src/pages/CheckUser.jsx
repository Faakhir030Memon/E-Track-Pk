import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const CheckUser = () => {
  const [phone, setPhone] = useState('');
  const [orderValue, setOrderValue] = useState('');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await api.post('/trust/check', { 
        phone, 
        orderValue: Number(orderValue) || 0,
        address 
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to check user trust score.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'score-safe';
    if (score >= 50) return 'score-warning';
    return 'score-danger';
  };

  const getBadgeClass = (riskLevel) => {
    if (riskLevel === 'safe') return 'badge-green';
    if (riskLevel === 'warning') return 'badge-yellow';
    return 'badge-red';
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
        <header className="mb-8">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Manual Check</h1>
          <p>Verify a customer before packing their order.</p>
        </header>

        <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Input Form */}
          <div className="card h-fit">
            <h3 className="mb-6" style={{ fontSize: '1.1rem' }}>Customer Details</h3>
            <form className="flex-col gap-4" onSubmit={handleCheck}>
              <div className="flex-col gap-2">
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Phone Number (Pakistan)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex-col gap-2">
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Order Value (Optional)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g. 5000"
                  value={orderValue}
                  onChange={(e) => setOrderValue(e.target.value)}
                />
              </div>

              <div className="flex-col gap-2">
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Delivery Address (Optional)</label>
                <textarea
                  className="input"
                  placeholder="For AI address verification..."
                  style={{ minHeight: '100px', resize: 'none' }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : 'Check Trust Score'}
              </button>
            </form>
          </div>

          {/* Result Card */}
          <div className="flex-col gap-6">
            {!result && !error && !isLoading && (
              <div className="card h-full flex items-center justify-center empty-state">
                <div className="flex-col items-center text-center gap-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                  <p>Enter details on the left to see the trust analysis.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="card border-red bg-red-bg" style={{ borderColor: 'var(--red-border)' }}>
                <p style={{ color: 'var(--red)', fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {result && (
              <div className="card flex-col gap-6 animate-fade-in shadow-glow" style={{ borderTop: `4px solid ${result.score >= 80 ? 'var(--green)' : result.score >= 50 ? 'var(--yellow)' : 'var(--red)'}` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={getScoreColorClass(result.score)} style={{ fontSize: '3rem', fontWeight: 800 }}>{result.score}</h2>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Trust Score</p>
                  </div>
                  <span className={`badge ${getBadgeClass(result.riskLevel)}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    {result.riskLevel.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                <div className="card" style={{ background: 'var(--bg-elevated)', border: 'none' }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>💡</span> Verdict
                  </h4>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{result.action.message}</p>
                </div>

                <div className="flex-col gap-3">
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analysis Breakdown</h4>
                  <div className="flex-col gap-2">
                    <div className="flex justify-between items-center py-2 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem' }}>Behavior History</span>
                      <span className={getScoreColorClass(result.breakdown.behaviorScore)} style={{ fontWeight: 600 }}>{result.breakdown.behaviorScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem' }}>Address Integrity</span>
                      <span className={getScoreColorClass(result.breakdown.addressScore)} style={{ fontWeight: 600 }}>{result.breakdown.addressScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem' }}>Order Value Risk</span>
                      <span className={getScoreColorClass(result.breakdown.valueScore)} style={{ fontWeight: 600 }}>{result.breakdown.valueScore}/100</span>
                    </div>
                  </div>
                </div>

                {result.breakdown.addressFlags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {result.breakdown.addressFlags.map(flag => (
                      <span key={flag} className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>
                        {flag.toUpperCase().replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex-col gap-2 p-4" style={{ background: 'var(--bg-base)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hashed Identifier:</p>
                  <code className="mono" style={{ fontSize: '0.7rem', wordBreak: 'break-all' }}>{result.hashedId}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckUser;

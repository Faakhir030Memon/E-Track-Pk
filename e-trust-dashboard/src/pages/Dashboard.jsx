import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, feedRes] = await Promise.all([
          api.get('/trust/analytics?days=7'),
          api.get('/trust/feed?limit=5')
        ]);
        setAnalytics(analyticsRes.data.data);
        setFeed(feedRes.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-center h-full" style={{ minHeight: '60vh' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: 'Total Lookups', value: analytics?.summary?.totalOrders || '0', trend: '+12.5%', isUp: true, icon: '🔍', color: '#3B82F6' },
    { label: 'High Risk Flagged', value: analytics?.summary?.highRiskCount || '0', trend: '+2.4%', isUp: false, icon: '⚠️', color: '#FF4B4B' },
    { label: 'Avg Trust Score', value: analytics?.summary?.avgTrustScore?.toFixed(1) || '85.2', trend: '+5.1%', isUp: true, icon: '⭐', color: '#10B981' },
    { label: 'Revenue Protected', value: `PKR ${((analytics?.summary?.highRiskCount || 0) * 1200).toLocaleString()}`, trend: '+15.3%', isUp: true, icon: '🛡️', color: '#FBBF24' },
  ];

  const COLORS = ['#FF4B4B', '#FBBF24', '#10B981'];
  const pieData = [
    { name: 'High Risk', value: analytics?.summary?.highRiskCount || 10 },
    { name: 'Risky', value: 20 },
    { name: 'Safe', value: 70 },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <header className="flex-between mb-10">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Hello, {user?.storeName || 'Store'}!</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Here's what's happening with your fraud monitoring today.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <span className="badge badge-success">Live Protection Active</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>Last updated: Just now</span>
            </div>
          </div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid-4 mb-10">
          {statCards.map((stat, i) => (
            <div key={i} className="card stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
              <div className="flex-between mb-2">
                <span className="stat-label">{stat.label}</span>
                <span style={{ fontSize: '1.25rem' }}>{stat.icon}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-trend ${stat.isUp ? 'trend-up' : 'trend-down'}`} style={{ fontSize: '0.7rem' }}>
                  {stat.isUp ? '↑' : '↓'} {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid-2 mb-8">
          <div className="card">
            <div className="flex-between mb-6">
              <h3 style={{ fontSize: '0.9375rem' }}>Orders Trend</h3>
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2"><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div><span style={{ fontSize: '0.7rem' }}>Delivered</span></div>
                <div className="flex items-center gap-2"><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></div><span style={{ fontSize: '0.7rem' }}>Returned</span></div>
                <div className="flex items-center gap-2"><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></div><span style={{ fontSize: '0.7rem' }}>High Risk</span></div>
              </div>
            </div>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.dailyBreakdown || []}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="total" stroke="var(--brand-primary)" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card flex flex-col items-center">
            <h3 style={{ fontSize: '0.9375rem', alignSelf: 'flex-start', marginBottom: '1.5rem' }}>Risk Distribution</h3>
            <div style={{ position: 'relative', width: '100%', maxWidth: '200px', height: '200px', margin: '0 auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>12,540</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Orders</div>
              </div>
            </div>
            <div className="w-full mt-4 flex justify-between px-4 flex-wrap gap-2">
              <div className="flex items-center gap-2"><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></div><span style={{ fontSize: '0.75rem' }}>High Risk (18%)</span></div>
              <div className="flex items-center gap-2"><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></div><span style={{ fontSize: '0.75rem' }}>Risky (30%)</span></div>
            </div>
          </div>
        </div>

        {/* Lists Row */}
        <div className="grid-2">
          <div className="card">
            <div className="flex-between mb-6">
              <h3 style={{ fontSize: '0.9375rem' }}>Recent Alerts</h3>
              <a href="/fraud-feed" style={{ fontSize: '0.75rem', color: 'var(--brand-primary)' }}>View All</a>
            </div>
            <div className="flex flex-col gap-4">
              {feed && feed.length > 0 ? feed.map((item, i) => (
                <div key={item._id} className="flex items-start gap-3 p-3 bg-dark rounded-lg border border-border">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.riskScore > 70 ? '#EF4444' : '#F59E0B', marginTop: '6px' }}></div>
                  <div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>Risk Detected: {item.customerPhoneHash.substring(0, 10)}...</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Score: {item.riskScore} • {new Date(item.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 color-muted" style={{ fontSize: '0.8rem' }}>No recent alerts</div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Top Risky Customers</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Hashed ID</th>
                    <th>Risk Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.riskSegments?.highRisk ? [analytics.riskSegments.highRisk].map((c, i) => (
                    <tr key={i}>
                      <td className="mono" style={{ fontSize: '0.75rem' }}>{c._id || 'unknown_hash'}</td>
                      <td><span className="badge badge-danger">{c.count} Reports</span></td>
                      <td><span className="badge badge-warning">High Risk</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No high-risk data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

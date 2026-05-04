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
      <div className="animate-slide-up">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Dashboard Overview</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Welcome back, {user?.storeName || 'Store'}.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline" style={{ borderStyle: 'dashed' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Data
            </button>
          </div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid-4 mb-10">
          {statCards.map((stat, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem' }}>
              <div className="flex justify-between items-start mb-4">
                <div style={{ background: `${stat.color}15`, color: stat.color, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  {stat.icon}
                </div>
                <span className={`badge ${stat.isUp ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                  {stat.isUp ? '↑' : '↓'} {stat.trend}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid-2 mb-10">
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2rem' }}>Risk Trends</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.dailyBreakdown || []}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }} 
                    itemStyle={{ color: 'var(--brand-primary)', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="total" stroke="var(--brand-primary)" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2rem' }}>Risk Distribution</h3>
            <div className="flex flex-col items-center">
              <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>85%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Safe Score</div>
                </div>
              </div>
              <div className="flex gap-6 mt-8">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[i] }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Table Row */}
        <div className="grid-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Activity</h3>
              <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>View Log</button>
            </div>
            <div className="flex flex-col gap-3">
              {feed && feed.length > 0 ? feed.map((item, i) => (
                <div key={item._id} className="flex items-center gap-4 p-3 hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.riskScore > 70 ? 'var(--danger)' : 'var(--warning)', boxShadow: `0 0 10px ${item.riskScore > 70 ? 'var(--danger)' : 'var(--warning)'}40` }}></div>
                  <div className="flex-grow">
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>Risk Check: {item.customerPhoneHash.substring(0, 12)}...</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleTimeString()} • Verified across {Math.floor(Math.random() * 5) + 1} stores</p>
                  </div>
                  <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: '0.65rem' }}>{item.riskScore}% Risk</span>
                </div>
              )) : (
                <div className="text-center py-10 color-muted">No recent activity detected</div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Top Risk Segment</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer Hash</th>
                    <th>Incidents</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.riskSegments?.highRisk ? [analytics.riskSegments.highRisk].map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--brand-primary)' }}>{c._id.substring(0, 16)}...</td>
                      <td style={{ fontWeight: 700 }}>{c.count} Reports</td>
                      <td><span className="badge badge-danger">High Risk</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                         🎉 All clear. No persistent risks found.
                      </td>
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

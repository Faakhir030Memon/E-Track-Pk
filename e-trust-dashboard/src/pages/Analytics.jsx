import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const lineData = [
    { date: '01 May', rate: 10 },
    { date: '02 May', rate: 12 },
    { date: '03 May', rate: 8 },
    { date: '04 May', rate: 15 },
    { date: '05 May', rate: 10 },
    { date: '06 May', rate: 11 },
    { date: '07 May', rate: 9 },
  ];

  const barData = [
    { city: 'Karachi', value: 62 },
    { city: 'Lahore', value: 48 },
    { city: 'Rawalpindi', value: 41 },
  ];

  const pieData = [
    { name: 'High Risk', value: 20 },
    { name: 'Risky', value: 30 },
    { name: 'Safe', value: 50 },
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#10B981'];

  return (
    <DashboardLayout>
      <div className="animate-slide-up">
        <header className="mb-8">
          <h1 style={{ fontSize: '1.5rem' }}>Analytics Overview</h1>
          <p style={{ fontSize: '0.875rem' }}>Comprehensive breakdown of store performance and risk trends</p>
        </header>

        {/* Top Analytics Stats */}
        <div className="grid-4 mb-8">
          {[
            { label: 'Return Rate', value: '10.2%', trend: '+2.3%', isUp: false },
            { label: 'Fraud Attempts', value: '184', trend: '+8.7%', isUp: false },
            { label: 'Delivery Success', value: '89.8%', trend: '+4.2%', isUp: true },
            { label: 'Saved Revenue', value: 'PKR 1,85,000', trend: '+15.2%', isUp: true },
          ].map((stat, i) => (
            <div key={i} className="card">
              <span className="stat-label">{stat.label}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="stat-value" style={{ fontSize: '1.5rem' }}>{stat.value}</span>
                <span className={`stat-trend ${stat.isUp ? 'trend-up' : 'trend-down'}`}>
                  {stat.isUp ? '↑' : '↓'} {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="card mb-8">
          <h3 style={{ fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Return Rate Over Time</h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="rate" stroke="var(--brand-primary)" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} dot={{ fill: 'var(--brand-primary)', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: '1.2fr 1.8fr' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Top Risky Areas</h3>
            <div className="flex-col gap-6">
              {barData.map((item, i) => (
                <div key={i} className="flex-col gap-2">
                  <div className="flex-between">
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{i + 1}. {item.city}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{item.value}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.value}%`, background: 'var(--brand-primary)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card flex items-center gap-10">
            <div className="flex-grow">
              <h3 style={{ fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Order Value vs Risk</h3>
              <div className="flex-col gap-3">
                <div className="flex items-center gap-3"><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></div><span style={{ fontSize: '0.875rem' }}>High Risk (20%)</span></div>
                <div className="flex items-center gap-3"><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></div><span style={{ fontSize: '0.875rem' }}>Risky (30%)</span></div>
                <div className="flex items-center gap-3"><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></div><span style={{ fontSize: '0.875rem' }}>Safe (50%)</span></div>
              </div>
            </div>
            <div style={{ width: '180px', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;

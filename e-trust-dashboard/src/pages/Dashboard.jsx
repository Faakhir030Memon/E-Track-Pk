import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, feedRes] = await Promise.all([
          api.get('/trust/analytics?days=7'),
          api.get('/trust/feed?limit=10')
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
        <div className="flex items-center justify-center h-full py-20">
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { name: 'Total Checks', value: analytics?.overview.totalOrders || 0, icon: '🔍' },
    { name: 'RTO Prevented', value: analytics?.overview.returned || 0, icon: '🚫' },
    { name: 'Money Saved', value: `Rs. ${(analytics?.revenue.potentialSavings || 0).toLocaleString()}`, icon: '💰' },
    { name: 'Delivery Rate', value: `${analytics?.overview.deliveryRate || 0}%`, icon: '🚚' },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <header className="mb-10">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Store Overview</h1>
          <p>Real-time trust metrics and fraud prevention data.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {stats.map((stat) => (
            <div key={stat.name} className="card flex-col gap-2" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05 }}>{stat.icon}</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.name}</span>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: '1.8fr 1.2fr' }}>
          {/* Activity Chart */}
          <div className="card flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 style={{ fontSize: '1.1rem' }}>Order Activity</h3>
              <div className="flex gap-2">
                <div className="badge badge-green">Delivered</div>
                <div className="badge badge-red">Returned</div>
              </div>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.dailyBreakdown || []}>
                  <defs>
                    <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--green)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--red)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--red)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '0.8rem' }}
                  />
                  <Area type="monotone" dataKey="delivered" stroke="var(--green)" fillOpacity={1} fill="url(#colorDelivered)" strokeWidth={2} />
                  <Area type="monotone" dataKey="returned" stroke="var(--red)" fillOpacity={1} fill="url(#colorReturned)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Profile */}
          <div className="card flex-col gap-6">
            <h3 style={{ fontSize: '1.1rem' }}>Risk Distribution</h3>
            <div className="flex-col gap-4">
              {[
                { label: 'Safe Customers', count: analytics?.riskDistribution.safe || 0, color: 'var(--green)' },
                { label: 'Warning', count: analytics?.riskDistribution.warning || 0, color: 'var(--yellow)' },
                { label: 'High Risk', count: analytics?.riskDistribution.highRisk || 0, color: 'var(--red)' },
              ].map((item) => (
                <div key={item.label} className="flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.count}</span>
                  </div>
                  <div style={{ height: '6px', width: '100%', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${analytics?.overview.totalOrders ? (item.count / analytics.overview.totalOrders) * 100 : 0}%`, 
                      background: item.color 
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="divider" style={{ margin: '0.5rem 0' }}></div>
            <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                "High Risk" orders were flagged automatically based on past return behavior in other stores.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Feed */}
        <div className="card mt-6" style={{ padding: 0 }}>
          <div className="flex justify-between items-center px-6 py-4 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Activities</h3>
            <button className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>View All</button>
          </div>
          <div className="overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Hashed User</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feed.length > 0 ? feed.map((item) => (
                  <tr key={item._id}>
                    <td className="mono" style={{ fontWeight: 600 }}>{item.orderId}</td>
                    <td className="mono" style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.hashedId.substring(0, 12)}...</td>
                    <td>
                      <span className={`badge ${
                        item.status === 'delivered' ? 'badge-green' : 
                        item.status === 'pending' ? 'badge-yellow' : 'badge-red'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td>Rs. {item.orderValue?.toLocaleString()}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-muted">No recent activity found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

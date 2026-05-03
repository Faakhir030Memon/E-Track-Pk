import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const OrdersMonitoring = () => {
  const orders = [
    { id: '#ORD-101', customer: '0300 1234567', score: 45, status: 'High Risk', value: 'PKR 45,000', date: '07 May' },
    { id: '#ORD-102', customer: '0345 7654321', score: 72, status: 'Risky', value: 'PKR 32,000', date: '07 May' },
    { id: '#ORD-103', customer: '0321 1112222', score: 88, status: 'Safe', value: 'PKR 16,500', date: '06 May' },
    { id: '#ORD-104', customer: '0333 3334444', score: 30, status: 'High Risk', value: 'PKR 65,000', date: '05 May' },
    { id: '#ORD-105', customer: '0300 5556666', score: 65, status: 'Risky', value: 'PKR 28,000', date: '05 May' },
    { id: '#ORD-106', customer: '0310 7778888', score: 92, status: 'Safe', value: 'PKR 12,400', date: '05 May' },
    { id: '#ORD-107', customer: '0305 9990000', score: 20, status: 'High Risk', value: 'PKR 75,000', date: '05 May' },
  ];

  return (
    <DashboardLayout>
      <div className="animate-slide-up">
        <header className="flex-between mb-8">
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Orders Monitoring</h1>
            <p style={{ fontSize: '0.875rem' }}>Track all orders and their real-time trust analysis</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filter
            </button>
          </div>
        </header>

        <div className="card" style={{ padding: 0 }}>
          <div className="px-6 py-4 flex gap-4 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
            {['All Orders', 'High Risk', 'Risky', 'Safe'].map((tab, i) => (
              <button 
                key={tab} 
                className={`btn ${i === 0 ? 'btn-ghost' : 'btn-ghost'}`} 
                style={{ 
                  fontSize: '0.8125rem', 
                  padding: '0.4rem 0.75rem',
                  background: i === 0 ? 'var(--bg-elevated)' : 'transparent',
                  color: i === 0 ? 'var(--brand-primary)' : 'var(--text-secondary)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Score</th>
                <th>Status</th>
                <th>Order Value</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{order.id}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{order.customer}</td>
                  <td>
                    <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                      <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--bg-elevated)" strokeWidth="2" />
                        <path 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" 
                          stroke={order.score < 50 ? 'var(--danger)' : order.score < 80 ? 'var(--warning)' : 'var(--success)'} 
                          strokeWidth="2" 
                          strokeDasharray={`${order.score}, 100`} 
                        />
                      </svg>
                      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.65rem', fontWeight: 700 }}>{order.score}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      order.status === 'High Risk' ? 'badge-danger' : 
                      order.status === 'Risky' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{order.value}</td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex-between px-6 py-4">
            <p style={{ fontSize: '0.75rem' }}>Showing 1 to 7 of 130 orders</p>
            <div className="flex gap-2">
              <button className="btn btn-outline" style={{ padding: '0.4rem' }}>&lsaquo;</button>
              {[1, 2, 3, 4].map(p => (
                <button key={p} className={`btn ${p === 1 ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>{p}</button>
              ))}
              <button className="btn btn-outline" style={{ padding: '0.4rem' }}>&rsaquo;</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersMonitoring;

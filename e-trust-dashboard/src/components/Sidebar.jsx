import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, 
  FiShield, 
  FiFileText, 
  FiSettings, 
  FiLogOut,
  FiTrendingUp
} from 'react-icons/fi';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <FiGrid />, path: '/' },
    { name: 'Analytics', icon: <FiTrendingUp />, path: '/analytics' },
    { name: 'Fraud Feed', icon: <FiShield />, path: '/fraud-feed' },
    { name: 'Order Logs', icon: <FiFileText />, path: '/orders' },
    { name: 'Settings', icon: <FiSettings />, path: '/settings' },
  ];

  return (
    <aside className="sidebar animate-fade-in">
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <img src="/logo.png" alt="E-Trust PK" style={{ height: '36px', objectFit: 'contain' }} />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span>
        </h2>
      </div>

      <nav className="flex-col gap-1 flex-grow">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2">
        <div className="card" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: 'none', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Store Account</p>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.storeName || 'Store'}</p>
        </div>
        <button className="btn btn-ghost w-full" onClick={logout} style={{ justifyContent: 'flex-start', color: '#EF4444' }}>
          <FiLogOut />
          <span style={{ marginLeft: '0.75rem' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

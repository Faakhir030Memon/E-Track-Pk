import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    )},
    { name: 'Check User', path: '/check', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
    )},
    { name: 'Analytics', path: '/analytics', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    )},
    { name: 'Blacklist', path: '/blacklist', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    )},
    { name: 'Settings', path: '/settings', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    )},
  ];

  return (
    <div className="sidebar flex-col h-full card" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', width: '260px', padding: '1.5rem 0' }}>
      <div className="flex items-center gap-3 px-6 mb-10">
        <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', background: 'var(--brand-primary)', borderRadius: '8px' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>E</span>
        </div>
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span></h2>
      </div>

      <nav className="flex-col gap-1 flex-grow">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `flex items-center gap-3 px-6 py-3 transition ${isActive ? 'active-nav' : 'text-secondary hover:text-primary'}`}
            style={({ isActive }) => ({
              borderLeft: isActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
              background: isActive ? 'var(--bg-elevated)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
            })}
          >
            <span style={{ opacity: 0.8 }}>{item.icon}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto">
        <div className="card" style={{ background: 'var(--bg-elevated)', padding: '1rem', border: 'none', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Store ID</p>
          <code className="mono" style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.storeId}</code>
        </div>
        <button className="btn btn-ghost w-full justify-center" onClick={logout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

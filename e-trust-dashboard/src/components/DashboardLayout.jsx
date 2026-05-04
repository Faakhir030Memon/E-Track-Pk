import React, { useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar isOpen={isSidebarOpen} />

      <div className="main-content">
        <header className="mobile-header">
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost" onClick={toggleSidebar} style={{ padding: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>E-Trust <span style={{ color: 'var(--brand-primary)' }}>PK</span></span>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#374151' }}></div>
        </header>

        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

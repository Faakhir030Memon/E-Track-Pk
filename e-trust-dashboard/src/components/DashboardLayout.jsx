import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-base overflow-hidden">
      <Sidebar />
      <main className="flex-grow flex flex-col overflow-y-auto" style={{ padding: '2rem 3rem' }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

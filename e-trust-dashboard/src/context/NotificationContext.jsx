import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const addNotification = useCallback((notif) => {
    const id = Date.now();
    setNotifications((prev) => [{ ...notif, id }, ...prev]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io backend
    const socket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });

    socket.on('connect', () => {
      console.log('Connected to live risk feed');
    });

    socket.on('risk_alert', (data) => {
      addNotification({
        title: 'High Risk Alert',
        message: `Order #${data.orderId} from high-risk customer detected.`,
        type: 'error'
      });
    });

    socket.on('new_report', (data) => {
      addNotification({
        title: 'New Fraud Report',
        message: `A user you checked was reported by another store.`,
        type: 'warning'
      });
    });

    return () => socket.disconnect();
  }, [user, addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50" style={{ pointerEvents: 'none' }}>
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className="animate-slide-up flex items-start gap-4 p-4 rounded-xl shadow-lg border"
            style={{ 
              pointerEvents: 'auto',
              background: 'var(--bg-card)',
              borderColor: n.type === 'error' ? 'var(--danger-border)' : 'var(--warning-border)',
              minWidth: '320px',
              maxWidth: '400px'
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: n.type === 'error' ? 'var(--danger-bg)' : 'var(--warning-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              {n.type === 'error' ? '🚫' : '⚠️'}
            </div>
            <div className="flex-col gap-1">
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{n.title}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{n.message}</p>
            </div>
            <button 
              onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

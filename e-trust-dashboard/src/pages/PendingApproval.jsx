import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PendingApproval = () => {
  const { user, logout } = useAuth();

  return (
    <div className="auth-wrapper">
      <div className="auth-card text-center" style={{ maxWidth: '600px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⏳</div>
        <h1 style={{ marginBottom: '1rem' }}>Account Pending Approval</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Welcome, <strong>{user?.storeName}</strong>! Your account is currently being reviewed by our admin team.
        </p>
        
        <div className="card" style={{ background: 'var(--bg-dark)', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--brand-primary)' }}>What happens next?</h3>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>✓ Registration completed</li>
            <li>{user?.subscription?.status === 'pending_approval' ? '✓ Payment details submitted' : '○ Please submit your payment details'}</li>
            <li>○ Admin verification (2-4 hours)</li>
            <li>○ Dashboard & API Activation</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary py-3"
            style={{ background: 'var(--brand-primary)' }}
          >
            Refresh Status
          </button>
          {user?.subscription?.status !== 'pending_approval' && (
            <Link to="/pricing" className="btn btn-outline py-3">
              Proceed to Payment
            </Link>
          )}
          <button onClick={logout} className="btn btn-ghost py-3">
            Logout
          </button>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Need help? Contact support at support@e-trust.pk
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;

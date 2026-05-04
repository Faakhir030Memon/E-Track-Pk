import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Security Question, 3: New Password
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setQuestion(res.data.data.question);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Account not found.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAnswer = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-security-answer', { email, answer });
      setResetToken(res.data.data.resetToken);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { resetToken, newPassword });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-slide-up">
        <div className="flex-col items-center mb-8">
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Reset Password</h1>
          <p>Recover access to your account</p>
        </div>

        {error && <div className="badge-danger p-3 mb-4 text-center rounded-lg text-sm">{error}</div>}
        {message && <div className="badge-success p-3 mb-4 text-center rounded-lg text-sm">{message}</div>}

        {step === 1 && (
          <form className="flex-col gap-5" onSubmit={handleGetQuestion}>
            <div className="input-group">
              <label className="input-label">Enter your account email</label>
              <input type="email" className="input" placeholder="store@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-full py-3" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="flex-col gap-5" onSubmit={handleVerifyAnswer}>
            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--brand-primary)' }}>Security Question:</label>
              <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{question}</p>
              <input type="text" className="input" placeholder="Your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-full py-3" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : 'Verify Answer'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="flex-col gap-5" onSubmit={handleResetPassword}>
            <div className="input-group">
              <label className="input-label">Enter New Password</label>
              <input type="password" className="input" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength="6" />
            </div>
            <button type="submit" className="btn btn-primary w-full py-3" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : 'Update Password'}
            </button>
          </form>
        )}

        <div className="flex-center mt-8">
          <Link to="/login" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

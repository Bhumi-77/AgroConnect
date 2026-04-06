import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // e.g. /reset-password?token=abc123
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setErr('Passwords do not match');
    if (password.length < 8) return setErr('Password must be at least 8 characters');
    setErr('');
    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (e2) {
      setErr(e2?.response?.data?.error || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'linear-gradient(135deg, #4a7c3b 0%, #6b9c5a 100%)' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '50px',
          maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ color: '#c62828' }}>Invalid Link</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>This reset link is invalid or missing.</p>
          <Link to="/forgot-password" style={{ color: '#4a7c3b', fontWeight: '600' }}>
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'linear-gradient(135deg, #4a7c3b 0%, #6b9c5a 100%)' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '50px',
          maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '50px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ color: '#1a1a1a', marginBottom: '12px' }}>Password Reset!</h2>
          <p style={{ color: '#666' }}>Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #4a7c3b 0%, #6b9c5a 100%)' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '50px',
        maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
            Set New Password
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Must be at least 8 characters.</p>
        </div>

        {err && (
          <div style={{ padding: '12px', background: '#ffebee', border: '1px solid #ffcdd2',
            borderRadius: '8px', color: '#c62828', fontSize: '14px', marginBottom: '20px' }}>
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600',
              color: '#333', marginBottom: '8px' }}>New Password</label>
            <input type="password" placeholder="Enter new password" value={password}
              onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0',
                borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#4a7c3b'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600',
              color: '#333', marginBottom: '8px' }}>Confirm Password</label>
            <input type="password" placeholder="Confirm new password" value={confirm}
              onChange={e => setConfirm(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0',
                borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#4a7c3b'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#999' : '#4a7c3b',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
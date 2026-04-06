import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSubmitted(true); // Show success message regardless (security best practice)
    } catch (e2) {
      setErr(e2?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'linear-gradient(135deg, #4a7c3b 0%, #6b9c5a 100%)' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '50px',
          maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>📧</div>
          <h2 style={{ color: '#1a1a1a', marginBottom: '12px' }}>Check your email</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            If <strong>{email}</strong> is registered, you'll receive a reset link shortly.
          </p>
          <Link to="/login" style={{ color: '#4a7c3b', fontWeight: '600', textDecoration: 'none' }}>
            ← Back to Login
          </Link>
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
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔑</div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
            Forgot Password?
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {err && (
          <div style={{ padding: '12px', background: '#ffebee', border: '1px solid #ffcdd2',
            borderRadius: '8px', color: '#c62828', fontSize: '14px', marginBottom: '20px' }}>
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600',
              color: '#333', marginBottom: '8px' }}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0',
                borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#4a7c3b'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#999' : '#4a7c3b',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#666' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: '#4a7c3b', fontWeight: '600', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
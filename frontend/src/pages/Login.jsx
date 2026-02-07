import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Login() {
  const { t } = useTranslation();
  const { setUser } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [role, setRole] = useState('FARMER');
  const [rememberMe, setRememberMe] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      if (data.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        if (data.user.role === 'FARMER') nav('/farmer');
        else if (data.user.role === 'ADMIN') nav('/admin');
        else nav('/market');
      }
    } catch (e2) {
      setErr(e2?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #4a7c3b 0%, #6b9c5a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        opacity: 0.5
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '15%',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        opacity: 0.4
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '8%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        opacity: 0.6
      }}></div>
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '10%',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        opacity: 0.5
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '40%',
        right: '5%',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        opacity: 0.4
      }}></div>

      {/* Left side - Welcome section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          {/* Icon/Logo placeholder */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 30px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>
            🌾
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Welcome to Krishi Connect
          </h1>
          
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            opacity: 0.95,
            fontWeight: '400'
          }}>
            Connecting farmers directly to markets. Eliminate middlemen, maximize profits, and grow your agricultural business with modern digital solutions.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div style={{
        width: '500px',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Language selector */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px'
        }}>
          <select style={{
            padding: '6px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white'
          }}>
            <option>नेपाली</option>
          </select>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 50px'
        }}>
          {/* Logo and title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#4a7c3b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              K
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              margin: 0
            }}>
              Krishi Connect
            </h2>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>
            Login to Your Account
          </h1>

          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '30px'
          }}>
            Select your role and enter your credentials
          </p>

          {/* Role selection */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => setRole('FARMER')}
              style={{
                flex: 1,
                padding: '12px',
                border: role === 'FARMER' ? '2px solid #4a7c3b' : '1px solid #e0e0e0',
                borderRadius: '8px',
                background: role === 'FARMER' ? '#e8f5e9' : 'white',
                color: role === 'FARMER' ? '#4a7c3b' : '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              🚜 Farmer
            </button>
            <button
              type="button"
              onClick={() => setRole('BUYER')}
              style={{
                flex: 1,
                padding: '12px',
                border: role === 'BUYER' ? '2px solid #4a7c3b' : '1px solid #e0e0e0',
                borderRadius: '8px',
                background: role === 'BUYER' ? '#e8f5e9' : 'white',
                color: role === 'BUYER' ? '#4a7c3b' : '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              🛒 Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              style={{
                flex: 1,
                padding: '12px',
                border: role === 'ADMIN' ? '2px solid #4a7c3b' : '1px solid #e0e0e0',
                borderRadius: '8px',
                background: role === 'ADMIN' ? '#e8f5e9' : 'white',
                color: role === 'ADMIN' ? '#4a7c3b' : '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              👤 Admin
            </button>
          </div>

          {/* Error message */}
          {err && (
            <div style={{
              padding: '12px',
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              color: '#c62828',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {err}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={submit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            {/* Remember me and Forgot password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '14px',
                  color: '#4a7c3b',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: '#4a7c3b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#3d6630'}
              onMouseOut={(e) => e.target.style.background = '#4a7c3b'}
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            gap: '12px'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
            <span style={{ fontSize: '14px', color: '#999' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
          </div>

          {/* Sign up link */}
          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#666',
            margin: 0
          }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#4a7c3b',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
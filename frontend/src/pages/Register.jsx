import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Register() {
  const { t } = useTranslation();
  const { setUser } = useAuth();
  const nav = useNavigate();
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('BUYER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    // ✅ Frontend validation (matches typical backend rules)
    if (!password || password.length < 6) {
      setErr('Password must be at least 6 characters.');
      return;
    }

    try {
      const payload = {
        fullName,
        role,
        email,
        password,
        district,
        municipality,
        phone: '',
        address: '',
        language: localStorage.getItem('lang') || 'en',
      };

      const { data } = await api.post('/api/auth/register', payload);

      if (data.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        if (data.user.role === 'FARMER') nav('/farmer');
        else nav('/market');
      } else {
        setErr(data?.error || data?.message || 'Register failed');
      }
    } catch (e2) {
      const resp = e2?.response?.data;

      // ✅ Clean error extraction (handles express-validator style errors[])
      let msg =
        resp?.error ||
        resp?.message ||
        resp?.details ||
        null;

      if (!msg && Array.isArray(resp?.errors) && resp.errors.length > 0) {
        // if password invalid etc.
        msg = resp.errors.map(er => `${er.path}: ${er.msg}`).join(', ');
      }

      if (!msg) msg = e2?.message || 'Register failed';

      console.log('REGISTER ERROR:', e2?.response?.status, resp);
      setErr(msg);
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
      {/* Add responsive styles */}
      <style>{`
        @media (max-width: 968px) {
          .welcome-section {
            display: none !important;
          }
          .form-section {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .form-container {
            padding: 40px 24px !important;
          }
          .role-buttons {
            flex-direction: column !important;
          }
          .role-buttons button {
            width: 100% !important;
          }
          .form-row {
            flex-direction: column !important;
          }
          .form-row > div {
            width: 100% !important;
          }
        }
      `}</style>

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
      <div className="welcome-section" style={{
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
            Join Krishi Connect
          </h1>

          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            opacity: 0.95,
            fontWeight: '400'
          }}>
            Start your journey with us today. Connect with markets, grow your business, and be part of the agricultural revolution.
          </p>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="form-section" style={{
        width: '550px',
        maxWidth: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10
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

        <div className="form-container" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 50px',
          minHeight: '100vh'
        }}>
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
            Create Your Account
          </h1>

          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '30px'
          }}>
            Fill in your details to get started
          </p>

          <div className="role-buttons" style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '24px'
          }}>
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
              🛒 {t('buyer')}
            </button>
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
              🚜 {t('farmer')}
            </button>
          </div>

          {err && (
            <div style={{
              padding: '12px',
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              color: '#c62828',
              fontSize: '14px',
              marginBottom: '20px',
              whiteSpace: 'pre-wrap'
            }}>
              {err}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                {t('fullName')}
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
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

            <div className="form-row" style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {t('email')}
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
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

              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {t('password')}
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
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
            </div>

            <div className="form-row" style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {t('district')}
                </label>
                <input
                  type="text"
                  placeholder="Enter your district"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  required
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

              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {t('municipality')}
                </label>
                <input
                  type="text"
                  placeholder="Enter your municipality"
                  value={municipality}
                  onChange={e => setMunicipality(e.target.value)}
                  required
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
            </div>

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
              {t('register')}
            </button>
          </form>

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

          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#666',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#4a7c3b',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

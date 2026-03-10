import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './lib/auth';
import BuyerOrders from './pages/BuyerOrders.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentFailure from './pages/PaymentFailure.jsx';
import Checkout from "./pages/Checkout.jsx";
import PricePrediction from "./pages/PricePrediction.jsx";

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Marketplace from './pages/Marketplace.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import FarmerDashboard from './pages/farmer/FarmerDashboard.jsx';
import FarmerOrders from "./pages/farmer/FarmerOrders.jsx";
import AddCrop from './pages/farmer/AddCrop.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Chat from './pages/Chat.jsx';
import Profile from './pages/Profile.jsx';

// ✅ ADD THIS import (adjust path/name to match your file)
import EditCrop from './pages/farmer/EditCrop.jsx';

function NavBar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #4a7c3b 0%, #5d9148 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <style>{`
        .nav-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          display: inline-block;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
        .nav-brand {
          color: white;
          text-decoration: none;
          font-size: 20px;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-brand:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .nav-select {
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
        }
        .nav-select:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .nav-select option {
          background: #4a7c3b;
          color: white;
        }
        .nav-badge {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }
        .nav-badge:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .nav-btn-secondary {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .nav-btn-primary {
          padding: 8px 20px;
          background: white;
          color: #4a7c3b;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .nav-btn-primary:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        @media (max-width: 968px) {
          .nav-container {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: flex-start !important;
          }
          .nav-left, .nav-right {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '12px 24px'
      }}>
        <div className="nav-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          {/* Left side - Brand and Navigation */}
          <div className="nav-left" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <Link to="/" className="nav-brand">
              <span style={{ fontSize: '24px' }}>🌾</span>
              {t('appName')}
            </Link>
            
            <Link to="/market" className="nav-link">{t('marketplace')}</Link>

            {/* ✅ Buyer nav */}
            {user?.role === 'BUYER' && <Link to="/buyer/orders" className="nav-link">My Orders</Link>}

            {/* ✅ Farmer nav */}
            {user?.role === 'FARMER' && <Link to="/farmer" className="nav-link">{t('dashboard')}</Link>}
            {user?.role === 'FARMER' && <Link to="/farmer/orders" className="nav-link">Customer Orders</Link>}
            {user && <Link to="/price" className="nav-link">AI Price</Link>}

            {/* ✅ Admin nav */}
            {user?.role === 'ADMIN' && <Link to="/admin" className="nav-link">{t('admin')}</Link>}

            {/* ✅ Common for logged-in users */}
            {user && <Link to="/chat" className="nav-link">{t('chat')}</Link>}
          </div>

          {/* Right side - Language and Auth */}
          <div className="nav-right" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <select
              className="nav-select"
              value={i18n.language}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="en">{t('english')}</option>
              <option value="np">{t('nepali')}</option>
            </select>

            {user ? (
              <>
                <Link to="/profile" className="nav-badge">
                  {user.fullName} • {user.role}
                </Link>
                <button className="nav-btn-secondary" onClick={onLogout}>
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn-secondary">
                  {t('login')}
                </Link>
                <Link to="/register" className="nav-btn-primary">
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/price" element={<Protected roles={['BUYER','FARMER','ADMIN']}><PricePrediction /></Protected>} />

        <Route path="/farmer" element={<Protected roles={['FARMER']}><FarmerDashboard /></Protected>} />
        <Route path="/farmer/add" element={<Protected roles={['FARMER']}><AddCrop /></Protected>} />
        <Route path="/farmer/orders" element={<Protected roles={['FARMER']}><FarmerOrders /></Protected>} />

        {/* ✅ ADD THIS ROUTE so Edit works */}
        <Route path="/farmer/edit/:id" element={<Protected roles={['FARMER']}><EditCrop /></Protected>} />

        <Route path="/admin" element={<Protected roles={['ADMIN']}><AdminDashboard /></Protected>} />

        <Route path="/checkout" element={<Protected roles={['BUYER']}><Checkout/></Protected>} />
        <Route path="/buyer/orders" element={<Protected roles={['BUYER']}><BuyerOrders /></Protected>} />

        <Route path="/chat" element={<Protected roles={['BUYER','FARMER','ADMIN']}><Chat /></Protected>} />
        <Route path="/profile" element={<Protected roles={['BUYER','FARMER','ADMIN']}><Profile /></Protected>} />

        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
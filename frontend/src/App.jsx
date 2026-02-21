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
    <div className="nav">
      <div className="inner">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Link to="/" style={{ fontSize: 18, fontWeight: 900 }}>{t('appName')}</Link>
          <Link to="/market">{t('marketplace')}</Link>

          {/* ✅ Buyer nav */}
          {user?.role === 'BUYER' && <Link to="/buyer/orders">My Orders</Link>}

          {/* ✅ Farmer nav */}
          {user?.role === 'FARMER' && <Link to="/farmer">{t('dashboard')}</Link>}
          {user?.role === 'FARMER' && <Link to="/farmer/orders">Customer Orders</Link>}
          {user && <Link to="/price">AI Price</Link>}

          {/* ✅ Admin nav */}
          {user?.role === 'ADMIN' && <Link to="/admin">{t('admin')}</Link>}

          {/* ✅ Common for logged-in users */}
          {user && <Link to="/chat">{t('chat')}</Link>}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <select
            className="input"
            style={{ width: 140, padding: '8px 10px' }}
            value={i18n.language}
            onChange={(e)=>setLang(e.target.value)}
          >
            <option value="en">{t('english')}</option>
            <option value="np">{t('nepali')}</option>
          </select>

          {user ? (
            <>
              <Link to="/profile" className="badge" style={{ background:'#ffffff22', color:'#fff' }}>
                {user.fullName} • {user.role}
              </Link>
              <button className="btn secondary" onClick={onLogout}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn secondary">{t('login')}</Link>
              <Link to="/register" className="btn primary">{t('register')}</Link>
            </>
          )}
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

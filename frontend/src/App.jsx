import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './lib/auth';
import BuyerOrders from './pages/BuyerOrders.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentFailure from './pages/PaymentFailure.jsx';
import Checkout from "./pages/Checkout.jsx";
import PricePrediction from "./pages/PricePrediction.jsx";
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminTransactions from './pages/admin/AdminTransaction.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import AdminPayments from './pages/admin/AdminPayments.jsx';
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
import Failure from "./components/Failure";
import PaymentComponent from "./components/Payment";
import Success from "./components/Success";
import EditCrop from './pages/farmer/EditCrop.jsx';
import DemandRequest from './pages/DemandRequest.jsx';
// import MyDemandPosts from './pages/MyDemandPost.jsx';
// import DemandMarketplace from './pages/DemandMarketplace.jsx';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import BrowseDemands from "./pages/BrowseDemands";

function NavBar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(false);

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
        }
        .nav-btn-secondary {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          cursor: pointer;
        }
        .nav-btn-primary {
          padding: 8px 20px;
          background: white;
          color: #4a7c3b;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          text-decoration: none;
        }

        /* Layout */
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .hamburger {
          display: none;
          font-size: 24px;
          cursor: pointer;
          color: white;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .hamburger {
            display: block;
          }

          .nav-links {
            position: absolute;
            top: 60px;
            left: 0;
            width: 100%;
            background: #4a7c3b;
            flex-direction: column;
            align-items: flex-start;
            padding: 16px;
            display: none;
          }

          .nav-links.open {
            display: flex;
          }

          .nav-link, .nav-brand {
            width: 100%;
            padding: 12px 0;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px' }}>
        <div className="nav-container">

          {/* LEFT */}
          <div className={`nav-links ${isOpen ? 'open' : ''}`}>

            <Link to="/" className="nav-brand" onClick={() => setIsOpen(false)}>
              🌾 {t('appName')}
            </Link>

            <Link to="/market" className="nav-link" onClick={() => setIsOpen(false)}>
              {t('marketplace')}
            </Link>

            {user?.role === 'BUYER' && (
              <>
                <Link to="/buyer/orders" className="nav-link" onClick={() => setIsOpen(false)}>My Orders</Link>
                <Link to="/buyer/demand" className="nav-link" onClick={() => setIsOpen(false)}>Post Demand</Link>
              </>
            )}

            {user?.role === 'FARMER' && (
              <>
                <Link to="/farmer" className="nav-link" onClick={() => setIsOpen(false)}>{t('dashboard')}</Link>
                <Link to="/farmer/orders" className="nav-link" onClick={() => setIsOpen(false)}>Customer Orders</Link>
                <Link to="/farmer/demands" className="nav-link" onClick={() => setIsOpen(false)}>Buyer Demands</Link>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <>
                <Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/admin/users" className="nav-link" onClick={() => setIsOpen(false)}>Users</Link>
                <Link to="/admin/transactions" className="nav-link" onClick={() => setIsOpen(false)}>Transactions</Link>
                <Link to="/admin/reports" className="nav-link" onClick={() => setIsOpen(false)}>Reports</Link>
                <Link to="/admin/payments" className="nav-link" onClick={() => setIsOpen(false)}>Payments</Link>
                <Link to="/admin/demands" className="nav-link" onClick={() => setIsOpen(false)}>Demand Requests</Link>
              </>
            )}

            {user && <Link to="/price" className="nav-link" onClick={() => setIsOpen(false)}>AI Price</Link>}
            {user && <Link to="/chat" className="nav-link" onClick={() => setIsOpen(false)}>{t('chat')}</Link>}
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Hamburger */}
            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
              ☰
            </div>

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
                <Link to="/login" className="nav-btn-secondary">{t('login')}</Link>
                <Link to="/register" className="nav-btn-primary">{t('register')}</Link>
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

      <Route path="/admin/users" element={<Protected roles={['ADMIN']}><AdminUsers /></Protected>} />
<Route path="/admin/transactions" element={<Protected roles={['ADMIN']}><AdminTransactions /></Protected>} />
<Route path="/admin/reports" element={<Protected roles={['ADMIN']}><AdminReports /></Protected>} />
<Route path="/admin/payments" element={<Protected roles={['ADMIN']}><AdminPayments /></Protected>} />

<Route
  path="/buyer/demand"
  element={
    <Protected roles={['BUYER', 'ADMIN']}>
      <DemandRequest />
    </Protected>
  }
/>
<Route path="/farmer/demands" element={<BrowseDemands />} />
<Route path="/admin/demands" element={<BrowseDemands />} />

{/* <Route
  path="/buyer/demands"
  element={
    <Protected roles={['BUYER', 'ADMIN']}>
      <MyDemandPosts />
    </Protected>
  }
/> */}

{/* <Route
  path="/demands"
  element={<DemandMarketplace />}
/> */}

        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/price" element={<Protected roles={['BUYER','FARMER','ADMIN']}><PricePrediction /></Protected>} />

        {/* Farmer + Admin access */}
        <Route path="/farmer" element={<Protected roles={['FARMER','ADMIN']}><FarmerDashboard /></Protected>} />
        <Route path="/farmer/add" element={<Protected roles={['FARMER','ADMIN']}><AddCrop /></Protected>} />
        <Route path="/farmer/orders" element={<Protected roles={['FARMER','ADMIN']}><FarmerOrders /></Protected>} />
        <Route path="/farmer/edit/:id" element={<Protected roles={['FARMER','ADMIN']}><EditCrop /></Protected>} />

        {/* Admin */}
        <Route path="/admin" element={<Protected roles={['ADMIN']}><AdminDashboard /></Protected>} />

        {/* Buyer + Admin */}
        <Route path="/checkout" element={<Protected roles={['BUYER','ADMIN']}><Checkout/></Protected>} />
        <Route path="/buyer/orders" element={<Protected roles={['BUYER']}><BuyerOrders /></Protected>} />

        {/* Common */}
        <Route path="/chat" element={<Protected roles={['BUYER','FARMER','ADMIN']}><Chat /></Protected>} />
        <Route path="/profile" element={<Protected roles={['BUYER','FARMER','ADMIN']}><Profile /></Protected>} />

       <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AuthProvider>
  );
}
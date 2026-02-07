import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 968px) {
          .hero-section {
            padding: 60px 24px !important;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .roles-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .hero-section {
            padding: 40px 20px !important;
          }
          .hero-content h1 {
            font-size: 32px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .demo-card {
            position: static !important;
            margin-top: 24px !important;
          }
          .hero-buttons {
            flex-direction: column !important;
          }
          .hero-buttons a {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, #4a7c3b 0%, #6b9c5a 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 24px',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '8%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(139, 195, 74, 0.3)',
          opacity: 0.6
        }}></div>
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '10%',
          fontSize: '48px',
          opacity: 0.7
        }}>🌸</div>
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(139, 195, 74, 0.2)',
          opacity: 0.5
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          fontSize: '40px',
          opacity: 0.6
        }}>🌸</div>

        <div className="hero-content" style={{
          maxWidth: '1200px',
          width: '100%',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            margin: 0,
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Connect Farmers to Markets
          </h1>
          
          <p style={{
            fontSize: '18px',
            lineHeight: '1.6',
            margin: 0,
            marginBottom: '32px',
            opacity: 0.95,
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Empowering Nepal's farmers with direct market access, fair prices, and modern agricultural solutions
          </p>

          <div className="hero-buttons" style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link
              to="/market"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'white',
                color: '#4a7c3b',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Get Started
            </Link>
            
            <Link
              to="/register"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: '2px solid white',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={{
        background: '#f9fafb',
        padding: '80px 24px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '24px'
          }}>
            About Krishi Connect
          </h2>
          
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Krishi Connect is a revolutionary MERN-based online platform that eliminates middlemen by directly connecting local farmers with customers and wholesale buyers. With bilingual support (Nepali/English), AI-powered crop recognition, price prediction tools, and integrated payment systems, we're transforming Nepal's agricultural ecosystem. Our platform ensures transparency, profitability, and accessibility for all stakeholders in the farming community.
          </p>
        </div>
      </div>

      {/* Key Features Section */}
      <div style={{
        padding: '80px 24px',
        background: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            margin: 0,
            marginBottom: '60px'
          }}>
            Key Features
          </h2>

          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px'
          }}>
            {/* Feature 1 */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#e8f5e9',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '40px'
              }}>
                🌾
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                Direct Market Access
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                Connect directly with buyers, eliminating middlemen and maximizing profits
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#fff3e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '40px'
              }}>
                💰
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                AI Price Prediction
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                Smart pricing tools to help you set competitive and fair prices
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#fce4ec',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '40px'
              }}>
                📍
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                Location-Based Search
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                Find nearby suppliers and reduce transportation costs
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#e3f2fd',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '40px'
              }}>
                💳
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                Secure Payments
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                Multiple payment options including eSewa and Cash on Delivery
              </p>
            </div>

            {/* Feature 5 */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#f3e5f5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '40px'
              }}>
                💬
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                Integrated Chat
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                Real-time communication for negotiations and coordination
              </p>
            </div>

            {/* Feature 6 */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#e0f2f1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '40px'
              }}>
                🌏
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                Bilingual Interface
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                Easy-to-use platform in both Nepali and English
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Roles Section */}
      <div style={{
        background: '#f9fafb',
        padding: '80px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            margin: 0,
            marginBottom: '16px'
          }}>
            Who Can Use Krishi Connect?
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            Our platform serves everyone in the agricultural ecosystem
          </p>

          <div className="roles-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {/* Farmer Card */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: '#e8f5e9',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '20px'
              }}>
                🚜
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                Farmer
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                List crops with images, manage inventory, and chat with buyers.
              </p>
            </div>

            {/* Buyer Card */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: '#e3f2fd',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '20px'
              }}>
                🛒
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                Buyer
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                Browse marketplace, filter by location, order with COD or eSewa (demo), and negotiate via chat.
              </p>
            </div>

            {/* Admin Card */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: '#fff3e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '20px'
              }}>
                👤
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px'
              }}>
                Admin
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666',
                margin: 0
              }}>
                Verify users, monitor listings, and view orders.
              </p>
            </div>
          </div>

          {/* Demo Accounts Card */}
          <div className="demo-card" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #4a7c3b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#4a7c3b',
              margin: 0,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🔑 Demo Accounts (after seeding)
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.8'
            }}>
              <li>Admin: admin@krishi.local / password123</li>
              <li>Farmer: farmer@krishi.local / password123</li>
              <li>Buyer: buyer@krishi.local / password123</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#2d5016',
        padding: '60px 24px 40px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            {/* Column 1 */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                marginBottom: '16px',
                color: '#8bc34a'
              }}>
                Fresh Grains
              </h4>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0,
                opacity: 0.9
              }}>
                Connecting farmers with markets for a sustainable future
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                marginBottom: '16px',
                color: '#8bc34a'
              }}>
                Product
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '14px',
                lineHeight: '2'
              }}>
                <li><Link to="/market" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Farmer Portal</Link></li>
                <li><Link to="/market" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Buyer Portal</Link></li>
                <li><Link to="/market" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Admin Panel</Link></li>
                <li><Link to="/market" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Buying Product</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                marginBottom: '16px',
                color: '#8bc34a'
              }}>
                Links
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '14px',
                lineHeight: '2'
              }}>
                <li style={{ opacity: 0.9 }}>Privacy Policy</li>
                <li style={{ opacity: 0.9 }}>Refund Policy</li>
                <li style={{ opacity: 0.9 }}>Pricing Plan</li>
                <li style={{ opacity: 0.9 }}>FAQs</li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                marginBottom: '16px',
                color: '#8bc34a'
              }}>
                Gallery
              </h4>
              <p style={{
                fontSize: '14px',
                margin: 0,
                opacity: 0.9
              }}>
                View our success stories and community
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            fontSize: '14px',
            opacity: 0.8
          }}>
            © 2025 Krishi Connect. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
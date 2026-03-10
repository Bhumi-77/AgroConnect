import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function ProductDetails() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [msg, setMsg] = useState('');

  const titleKey = i18n.language === 'np' ? 'titleNp' : 'titleEn';
  const descKey = i18n.language === 'np' ? 'descriptionNp' : 'descriptionEn';

  // Backend URL for images
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchOne = async () => {
    const { data } = await api.get(`/api/crops/${id}`);
    if (data.ok) setCrop(data.crop);
  };

  useEffect(() => { fetchOne(); }, [id]);

  const total = useMemo(() => {
    if (!crop) return 0;
    return Number(qty) * Number(crop.price);
  }, [qty, crop]);

  const startChat = async () => {
    if (!user) return nav('/login');
    const farmerId = crop?.farmer?.id;
    const buyerId = user.id;
    const { data } = await api.post('/api/chat/room', { buyerId, farmerId });
    if (data.ok) nav('/chat?room=' + data.room.id);
  };

  const goCheckout = () => {
    setMsg('');
    if (!user) return nav('/login');
    if (user.role !== 'BUYER') return setMsg('Only buyers can order.');

    nav('/checkout', {
      state: {
        items: [
          {
            id: crop.id,
            title: crop[titleKey],
            price: crop.price,
            quantity: Number(qty),
            unit: crop.unit,
          }
        ],
        defaultPaymentMethod: paymentMethod
      }
    });
  };

  if (!crop) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e0e0e0',
              borderTopColor: '#4a7c3b',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract image
  const rawImages = crop.images;
  let firstImage = null;

  if (Array.isArray(rawImages) && rawImages.length > 0) {
    firstImage = rawImages[0];
  } else if (typeof rawImages === 'string' && rawImages.trim()) {
    const s = rawImages.trim();
    if (s.startsWith('[')) {
      try { const arr = JSON.parse(s); if (Array.isArray(arr) && arr.length > 0) firstImage = arr[0]; } catch {}
    }
    if (!firstImage && s.includes(',')) firstImage = s.split(',')[0].trim();
    if (!firstImage) firstImage = s;
  }

  const imageUrl = firstImage ? (firstImage.startsWith('http') ? firstImage : `${BACKEND_URL}${firstImage.startsWith('/') ? '' : '/'}${firstImage}`) : null;

  const availableQty = crop.inventory?.available ?? crop.quantity ?? 0;
  const inStock = availableQty > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '24px' }}>
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 968px) {
          .product-layout {
            flex-direction: column !important;
          }
          .product-sidebar {
            width: 100% !important;
            position: static !important;
          }
        }
        @media (max-width: 640px) {
          .product-container {
            padding: 16px !important;
          }
          .product-badges {
            flex-direction: column !important;
          }
          .farmer-actions {
            flex-direction: column !important;
          }
          .farmer-actions button {
            width: 100% !important;
          }
        }
      `}</style>

      <div className="product-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => nav('/market')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'white',
            color: '#666',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.background = '#f9fafb'; e.target.style.borderColor = '#4a7c3b'; }}
          onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#e0e0e0'; }}
        >
          ← Back to Marketplace
        </button>

        <div className="product-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Main Content */}
          <div style={{ flex: 1 }}>
            {/* Image Section */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                background: '#f3f4f6',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={crop[titleKey]}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '80px',
                    color: '#9ca3af'
                  }}>🌾</div>
                )}

                {!inStock && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '8px 16px',
                    background: 'rgba(254, 226, 226, 0.95)',
                    color: '#991b1b',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    backdropFilter: 'blur(4px)'
                  }}>
                    Out of Stock
                  </div>
                )}

                {crop.farmer?.isVerified && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: '8px 14px',
                    background: 'rgba(219, 234, 254, 0.95)',
                    color: '#1e40af',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ✓ Verified Farmer
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0'
            }}>
              {/* Category Badge */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  padding: '6px 12px',
                  background: '#f0f0f0',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {crop.category}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px',
                lineHeight: '1.2'
              }}>
                {crop[titleKey]}
              </h1>

              {/* Location */}
              <div style={{
                fontSize: '15px',
                color: '#666',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                📍 {crop.district || '-'} {crop.municipality ? `, ${crop.municipality}` : ''}
              </div>

              {/* Description */}
              {crop[descKey] && (
                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Description
                  </div>
                  <div style={{
                    fontSize: '15px',
                    color: '#333',
                    lineHeight: '1.6'
                  }}>
                    {crop[descKey]}
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="product-badges" style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '12px 20px',
                  background: '#e8f5e9',
                  color: '#4a7c3b',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', opacity: 0.8 }}>Price</div>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>रु {crop.price}/{crop.unit}</div>
                </div>

                <div style={{
                  padding: '12px 20px',
                  background: '#f9fafb',
                  color: '#333',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#666' }}>Available Stock</div>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{availableQty}</div>
                </div>

                {crop.qualityGrade && (
                  <div style={{
                    padding: '12px 20px',
                    background: '#f9fafb',
                    color: '#333',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#666' }}>Quality Grade</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{crop.qualityGrade}</div>
                  </div>
                )}
              </div>

              {/* Farmer Info */}
              <div style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Seller Information
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#4a7c3b',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '600'
                    }}>
                      {crop.farmer?.fullName?.[0]?.toUpperCase() || 'F'}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        marginBottom: '4px'
                      }}>
                        {crop.farmer?.fullName || 'Farmer'}
                      </div>
                      {crop.farmer?.isVerified && (
                        <div style={{
                          fontSize: '13px',
                          color: '#4a7c3b',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ✓ Verified Seller
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={startChat}
                    style={{
                      padding: '10px 20px',
                      background: 'white',
                      color: '#4a7c3b',
                      border: '1px solid #4a7c3b',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                    onMouseOut={(e) => e.target.style.background = 'white'}
                  >
                    💬 {t('chat')} with Seller
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Sidebar */}
          <div className="product-sidebar" style={{
            width: '400px',
            position: 'sticky',
            top: '24px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '20px'
              }}>
                Order Details
              </h2>

              {/* Error Message */}
              {msg && (
                <div style={{
                  padding: '12px',
                  background: '#ffebee',
                  border: '1px solid #ffcdd2',
                  borderRadius: '8px',
                  color: '#c62828',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  {msg}
                </div>
              )}

              {/* Quantity */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={availableQty}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  disabled={!inStock}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '6px'
                }}>
                  Maximum available: {availableQty}
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="COD">💵 Cash on Delivery</option>
                  <option value="ESEWA">💳 eSewa</option>
                </select>
              </div>

              {/* Total */}
              <div style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#666'
                  }}>
                    Total Amount
                  </span>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#4a7c3b'
                  }}>
                    रु {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={goCheckout}
                disabled={!inStock}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: inStock ? '#4a7c3b' : '#e0e0e0',
                  color: inStock ? 'white' : '#999',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: inStock ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => { if (inStock) e.target.style.background = '#3d6630'; }}
                onMouseOut={(e) => { if (inStock) e.target.style.background = '#4a7c3b'; }}
              >
                {inStock ? '🛒 Continue to Checkout' : 'Out of Stock'}
              </button>

              {/* Security Note */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🔒</span>
                <span>Secure checkout with multiple payment options</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
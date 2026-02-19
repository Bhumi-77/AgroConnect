import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Marketplace() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();

  const [crops, setCrops] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');

  const fetchCrops = async () => {
    const { data } = await api.get('/api/crops', { params: { q, category, district, municipality } });
    if (data.ok) setCrops(data.crops);
  };

  useEffect(() => {
    fetchCrops();
  }, []); // initial

  const titleKey = i18n.language === 'np' ? 'titleNp' : 'titleEn';

  const filtered = useMemo(() => crops, [crops]);

  // ✅ ESSENTIAL: add to cart (localStorage) and go to checkout
  const addToCartAndCheckout = (c) => {
    const availableQty = c.availableQty ?? c.inventory?.available ?? c.quantity ?? 0;
    if (availableQty <= 0) return;

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const existing = cart.find((x) => x.cropId === c.id);
    if (existing) {
      existing.quantity = Number(existing.quantity || 1) + 1;
      // optional safety: don't exceed stock
      existing.quantity = Math.min(existing.quantity, Number(availableQty));
    } else {
      cart.push({
        cropId: c.id,
        title: c.titleEn || c.titleNp,
        titleEn: c.titleEn,
        titleNp: c.titleNp,
        price: c.price,
        unitPrice: c.price,
        quantity: 1,
        unit: c.unit,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    nav('/checkout');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        padding: '24px',
      }}
    >
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 968px) {
          .marketplace-container {
            padding: 16px !important;
          }
          .filter-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .filter-grid .search-full {
            grid-column: 1 / -1 !important;
          }
        }
        @media (max-width: 640px) {
          .filter-grid {
            grid-template-columns: 1fr !important;
          }
          .crop-grid {
            grid-template-columns: 1fr !important;
          }
          .crop-card-content {
            flex-direction: column !important;
          }
          .crop-actions {
            flex-direction: row !important;
            width: 100% !important;
          }
          .crop-actions a {
            flex: 1 !important;
          }
        }
      `}</style>

      <div
        className="marketplace-container"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: '32px',
          }}
        >
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Marketplace
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#666',
              margin: 0,
            }}
          >
            Browse fresh crops directly from farmers
          </p>
        </div>

        {/* Search and Filters */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
          }}
        >
          <div
            className="filter-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '16px',
              alignItems: 'end',
            }}
          >
            {/* Search Input */}
            <div className="search-full">
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}
              >
                {t('search')}
              </label>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search crops... (Tomato / टमाटर)"
                onKeyPress={(e) => e.key === 'Enter' && fetchCrops()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4a7c3b')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}
              >
                {t('category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: 'white',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4a7c3b')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              >
                <option value="">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}
              >
                {t('district')}
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Kathmandu"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4a7c3b')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            {/* Municipality Filter */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}
              >
                {t('municipality')}
              </label>
              <input
                type="text"
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                placeholder="KMC"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4a7c3b')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            {/* Search Button */}
            <button
              onClick={fetchCrops}
              style={{
                padding: '12px 24px',
                background: '#4a7c3b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
                height: '44px',
              }}
              onMouseOver={(e) => (e.target.style.background = '#3d6630')}
              onMouseOut={(e) => (e.target.style.background = '#4a7c3b')}
            >
              🔍 {t('search')}
            </button>
          </div>

          {/* Active Filters Display */}
          {(q || category || district || municipality) && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  color: '#666',
                  fontWeight: '600',
                }}
              >
                Active Filters:
              </span>
              {q && (
                <span
                  style={{
                    fontSize: '13px',
                    padding: '4px 10px',
                    background: '#e8f5e9',
                    color: '#4a7c3b',
                    borderRadius: '12px',
                    fontWeight: '500',
                  }}
                >
                  Search: "{q}"
                </span>
              )}
              {category && (
                <span
                  style={{
                    fontSize: '13px',
                    padding: '4px 10px',
                    background: '#e8f5e9',
                    color: '#4a7c3b',
                    borderRadius: '12px',
                    fontWeight: '500',
                  }}
                >
                  {category}
                </span>
              )}
              {district && (
                <span
                  style={{
                    fontSize: '13px',
                    padding: '4px 10px',
                    background: '#e8f5e9',
                    color: '#4a7c3b',
                    borderRadius: '12px',
                    fontWeight: '500',
                  }}
                >
                  {district}
                </span>
              )}
              {municipality && (
                <span
                  style={{
                    fontSize: '13px',
                    padding: '4px 10px',
                    background: '#e8f5e9',
                    color: '#4a7c3b',
                    borderRadius: '12px',
                    fontWeight: '500',
                  }}
                >
                  {municipality}
                </span>
              )}
              <button
                onClick={() => {
                  setQ('');
                  setCategory('');
                  setDistrict('');
                  setMunicipality('');
                  setTimeout(fetchCrops, 0);
                }}
                style={{
                  fontSize: '13px',
                  padding: '4px 10px',
                  background: '#fff',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            {filtered.length} {filtered.length === 1 ? 'crop' : 'crops'} found
          </div>
        </div>

        {/* Crops Grid */}
        <div
          className="crop-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
            gap: '20px',
          }}
        >
          {filtered.map((c) => {
            const availableQty = c.availableQty ?? c.inventory?.available ?? c.quantity ?? 0;
            const inStock = c.inStock ?? availableQty > 0;

            return (
              <div
                key={c.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="crop-card-content"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  {/* Crop Info */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      {c[titleKey]}
                    </h3>

                    <div
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          padding: '2px 8px',
                          background: '#f0f0f0',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        {c.category}
                      </span>
                      <span>•</span>
                      <span>📍 {c.district || '-'} {c.municipality || ''}</span>
                    </div>

                    {/* Badges */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          padding: '6px 12px',
                          background: '#e8f5e9',
                          color: '#4a7c3b',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        रु {c.price}/{c.unit}
                      </span>

                      <span
                        style={{
                          padding: '6px 12px',
                          background: '#f0f0f0',
                          color: '#333',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {t('qty')}: {availableQty}
                      </span>

                      {!inStock && (
                        <span
                          style={{
                            padding: '6px 12px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '700',
                          }}
                        >
                          Out of Stock
                        </span>
                      )}

                      {c.farmer?.isVerified && (
                        <span
                          style={{
                            padding: '6px 12px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* Farmer Info */}
                    {c.farmer && (
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#4a7c3b',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {c.farmer.fullName?.[0]?.toUpperCase() || 'F'}
                        </span>
                        <span>By {c.farmer.fullName || 'Farmer'}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className="crop-actions"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      minWidth: '120px',
                      justifyContent: 'center',
                    }}
                  >
                    <Link
                      to={`/product/${c.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 20px',
                        background: 'white',
                        color: '#4a7c3b',
                        border: '1px solid #4a7c3b',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f0f0f0';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      {t('view')}
                    </Link>

                    {user?.role === 'BUYER' && (
                      inStock ? (
                        // ✅ ESSENTIAL: add to cart + go checkout (instead of Link)
                        <button
                          type="button"
                          onClick={() => addToCartAndCheckout(c)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 20px',
                            background: '#4a7c3b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'background 0.2s',
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#3d6630';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#4a7c3b';
                          }}
                        >
                          {t('order')}
                        </button>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 20px',
                            background: '#e5e7eb',
                            color: '#6b7280',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '700',
                            textAlign: 'center',
                            cursor: 'not-allowed',
                            userSelect: 'none',
                          }}
                          title="Out of stock"
                        >
                          Out of Stock
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🌾</div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px',
              }}
            >
              No crops found
            </h3>
            <p
              style={{
                fontSize: '15px',
                color: '#666',
                margin: 0,
              }}
            >
              Try adjusting your search filters or check back later for new listings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

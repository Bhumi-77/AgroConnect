import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export default function EditCrop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titleEn: "",
    titleNp: "",
    category: "",
    price: "",
    unit: "",
    quantity: ""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCrop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCrop = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/crops/${id}`);
      if (res.data.ok) {
        const c = res.data.crop;
        setForm({
          titleEn: c.titleEn || "",
          titleNp: c.titleNp || "",
          category: c.category || "",
          price: c.price || "",
          unit: c.unit || "",
          quantity: c.inventory?.available || ""
        });
      }
    } catch (e) {
      setErr("Failed to load crop");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setSubmitting(true);
      await api.put(`/api/crops/${id}`, form);
      navigate("/farmer");
    } catch (e) {
      setErr("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      padding: '24px'
    }}>
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 640px) {
          .edit-crop-container {
            padding: 16px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .form-actions {
            flex-direction: column-reverse !important;
          }
          .form-actions button {
            width: 100% !important;
          }
        }
      `}</style>

      <div className="edit-crop-container" style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <button
            onClick={() => navigate('/farmer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: 'transparent',
              color: '#666',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            ← Back to Dashboard
          </button>

          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '8px'
          }}>
            Edit Crop
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            margin: 0
          }}>
            Update your crop listing details
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
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
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: 0
            }}>
              Loading crop details...
            </p>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            {/* Error Message */}
            {err && (
              <div style={{
                padding: '14px 16px',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: '8px',
                color: '#c62828',
                fontSize: '14px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⚠️ {err}
              </div>
            )}

            <form onSubmit={onSubmit}>
              {/* Crop Names Section */}
              <div style={{
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: '#e8f5e9',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    🌾
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      Crop Information
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      Basic details about your crop
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px'
                    }}>
                      Crop Name (English) *
                    </label>
                    <input
                      type="text"
                      name="titleEn"
                      value={form.titleEn}
                      onChange={onChange}
                      placeholder="e.g., Tomato"
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

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px'
                    }}>
                      Crop Name (Nepali)
                    </label>
                    <input
                      type="text"
                      name="titleNp"
                      value={form.titleNp}
                      onChange={onChange}
                      placeholder="e.g., टमाटर"
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

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px'
                    }}>
                      Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={onChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border 0.2s',
                        boxSizing: 'border-box',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    >
                      <option value="">Select Category</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="grains">Grains</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div style={{
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: '#fff3e0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    💰
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      Pricing & Quantity
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      Set your price and available stock
                    </div>
                  </div>
                </div>

                <div className="form-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px'
                    }}>
                      Price (रु) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={onChange}
                      placeholder="e.g., 100"
                      required
                      min="0"
                      step="0.01"
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

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px'
                    }}>
                      Unit *
                    </label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={onChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border 0.2s',
                        boxSizing: 'border-box',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    >
                      <option value="">Unit</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="piece">piece</option>
                      <option value="dozen">dozen</option>
                      <option value="bundle">bundle</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={onChange}
                    placeholder="e.g., 500"
                    required
                    min="0"
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
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginTop: '6px'
                  }}>
                    This is the amount available for sale
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions" style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => navigate('/farmer')}
                  disabled={submitting}
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#666',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: submitting ? 0.5 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!submitting) e.target.style.background = '#f0f0f0';
                  }}
                  onMouseOut={(e) => {
                    if (!submitting) e.target.style.background = 'white';
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '12px 32px',
                    background: submitting ? '#a5d6a7' : '#4a7c3b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    if (!submitting) e.target.style.background = '#3d6630';
                  }}
                  onMouseOut={(e) => {
                    if (!submitting) e.target.style.background = '#4a7c3b';
                  }}
                >
                  {submitting ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></div>
                      Updating...
                    </>
                  ) : (
                    <>✓ Update Crop</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
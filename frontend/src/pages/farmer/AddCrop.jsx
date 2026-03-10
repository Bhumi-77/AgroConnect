import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AddCrop() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    titleEn:'', titleNp:'', category:'vegetables',
    descriptionEn:'', descriptionNp:'',
    qualityGrade:'A', unit:'kg', price: 0, quantity: 0,
    district:'', municipality:''
  });
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (k,v) => setForm(s => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      for (const f of files) fd.append('images', f);

      const { data } = await api.post('/api/crops', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.ok) nav('/farmer');
    } catch (e2) {
      setErr(e2?.response?.data?.error || 'Failed');
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
          .add-crop-container {
            padding: 16px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row-2 {
            grid-template-columns: 1fr !important;
          }
          .form-row-3 {
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

      <div className="add-crop-container" style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <button
            onClick={() => nav('/farmer')}
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
            Add New Crop
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            margin: 0
          }}>
            List your crop for sale in the marketplace
          </p>
        </div>

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

          <form onSubmit={submit}>
            {/* Basic Information Section */}
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

              {/* Crop Names */}
              <div className="form-row-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
              }}>
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
                    value={form.titleEn}
                    onChange={(e) => set('titleEn', e.target.value)}
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
                    value={form.titleNp}
                    onChange={(e) => set('titleNp', e.target.value)}
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
              </div>

              {/* Descriptions */}
              <div className="form-row-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
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
                    Description (English)
                  </label>
                  <textarea
                    value={form.descriptionEn}
                    onChange={(e) => set('descriptionEn', e.target.value)}
                    placeholder="Describe your crop..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Description (Nepali)
                  </label>
                  <textarea
                    value={form.descriptionNp}
                    onChange={(e) => set('descriptionNp', e.target.value)}
                    placeholder="आफ्नो बाली वर्णन गर्नुहोस्..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div> */}
              </div>
            </div>

            {/* Categories & Specifications */}
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
                  📋
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Categories & Specifications
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Classify and grade your crop
                  </div>
                </div>
              </div>

              <div className="form-row-3" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
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
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
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
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Quality Grade *
                  </label>
                  <select
                    value={form.qualityGrade}
                    onChange={(e) => set('qualityGrade', e.target.value)}
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
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
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
                    value={form.unit}
                    onChange={(e) => set('unit', e.target.value)}
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
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Quantity */}
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

              <div className="form-row-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
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
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
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
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => set('quantity', e.target.value)}
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
                </div>
              </div>
            </div>

            {/* Location */}
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
                  background: '#e3f2fd',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  📍
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Location
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Where is your crop located?
                  </div>
                </div>
              </div>

              <div className="form-row-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
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
                    District
                  </label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => set('district', e.target.value)}
                    placeholder="e.g., Kathmandu"
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
                    Municipality
                  </label>
                  <input
                    type="text"
                    value={form.municipality}
                    onChange={(e) => set('municipality', e.target.value)}
                    placeholder="e.g., KMC"
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
            </div>

            {/* Images */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#f3e5f5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  📸
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Product Images
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Upload up to 5 images of your crop
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px dashed #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border 0.2s',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                {files.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#4a7c3b',
                    fontWeight: '500'
                  }}>
                    ✓ {files.length} image{files.length !== 1 ? 's' : ''} selected
                  </div>
                )}
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
                onClick={() => nav('/farmer')}
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
                    Saving...
                  </>
                ) : (
                  <>✓ Add Crop</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
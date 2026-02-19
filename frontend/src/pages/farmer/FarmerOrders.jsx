import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useNavigate } from "react-router-dom";

export default function FarmerOrders() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const { data } = await api.get("/api/orders/farmer/sales");
      if (data?.ok) setOrders(data.orders || []);
      else setOrders(data?.orders || []);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return nav("/login");
    if (user.role !== "FARMER") return nav("/");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setErr("");
      const { data } = await api.patch(`/api/orders/${orderId}/status`, { status });
      if (!data?.ok) throw new Error(data?.error || "Failed to update status");
      await load();
    } catch (e) {
      alert(e?.response?.data?.error || e?.response?.data?.message || e.message);
    }
  };

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      padding: '24px'
    }}>
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 968px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .orders-container {
            padding: 16px !important;
          }
          .order-layout {
            flex-direction: column !important;
          }
          .order-actions-section {
            width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .order-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .status-actions {
            flex-direction: column !important;
          }
          .status-actions button {
            width: 100% !important;
          }
        }
      `}</style>

      <div className="orders-container" style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div className="order-header-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0,
              marginBottom: '8px'
            }}>
              Customer Orders
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#666',
              margin: 0
            }}>
              Manage orders placed for your crops
            </p>
          </div>

          <button
            onClick={load}
            style={{
              padding: '12px 24px',
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
            onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.background = 'white'}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Total Orders */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Total Orders
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a'
            }}>
              {totalOrders}
            </div>
          </div>

          {/* Pending */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Pending Orders
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#f59e0b'
            }}>
              {pendingOrders}
            </div>
          </div>

          {/* Revenue */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Total Revenue
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#4a7c3b'
            }}>
              रु {totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

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
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: 0,
              marginBottom: '12px'
            }}>
              No orders yet
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#666',
              margin: 0
            }}>
              Orders will appear here once buyers start purchasing your crops
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {orders.map((o) => {
              const paymentMethod = o.paymentMethod || o.payment?.method || "-";
              const paymentStatus = o.paymentStatus || o.payment?.status || "";

              const statusColors = {
                'PENDING': { bg: '#fef3c7', color: '#92400e', icon: '⏳' },
                'CONFIRMED': { bg: '#dbeafe', color: '#1e40af', icon: '✓' },
                'DELIVERED': { bg: '#e8f5e9', color: '#2e7d32', icon: '✓✓' },
                'CANCELLED': { bg: '#fee2e2', color: '#991b1b', icon: '✕' }
              };

              const statusStyle = statusColors[o.status] || { bg: '#f5f5f5', color: '#666', icon: '•' };

              return (
                <div
                  key={o.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <div className="order-layout" style={{
                    display: 'flex',
                    gap: '24px'
                  }}>
                    {/* Order Info */}
                    <div style={{ flex: 1 }}>
                      {/* Order Header */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '20px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '13px',
                            color: '#666',
                            marginBottom: '4px'
                          }}>
                            Order ID
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            fontFamily: 'monospace'
                          }}>
                            #{o.id.slice(0, 8)}
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          flexWrap: 'wrap'
                        }}>
                          {/* Status Badge */}
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            background: statusStyle.bg,
                            color: statusStyle.color
                          }}>
                            {statusStyle.icon} {o.status}
                          </span>

                          {/* Payment Badge */}
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            background: paymentMethod === 'ESEWA' ? '#e0f2f1' : '#f0f0f0',
                            color: paymentMethod === 'ESEWA' ? '#00796b' : '#666'
                          }}>
                            {paymentMethod === 'ESEWA' ? '💳' : '💵'} {paymentMethod}
                            {paymentStatus && ` (${paymentStatus})`}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div style={{
                        background: '#f9fafb',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#666',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '12px'
                        }}>
                          Customer Details
                        </div>
                        
                        <div style={{ display: 'grid', gap: '8px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#4a7c3b',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              {o.buyer?.fullName?.[0]?.toUpperCase() || 'B'}
                            </div>
                            <div>
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#1a1a1a'
                              }}>
                                {o.buyer?.fullName || "Buyer"}
                              </div>
                              <div style={{
                                fontSize: '13px',
                                color: '#666'
                              }}>
                                {o.buyer?.email || "-"}
                              </div>
                            </div>
                          </div>

                          {(o.deliveryAddress || o.district || o.municipality) && (
                            <div style={{
                              fontSize: '13px',
                              color: '#666',
                              display: 'flex',
                              gap: '6px',
                              marginTop: '8px'
                            }}>
                              <span>📍</span>
                              <span>
                                {o.deliveryAddress || "-"}
                                {o.district && `, ${o.district}`}
                                {o.municipality && `, ${o.municipality}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '12px'
                        }}>
                          Order Items
                        </div>

                        <div style={{
                          background: '#f9fafb',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid #f0f0f0'
                        }}>
                          {(o.items || []).map((it, idx) => (
                            <div
                              key={it.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 0',
                                borderBottom: idx < o.items.length - 1 ? '1px solid #e0e0e0' : 'none'
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                              }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  background: '#e8f5e9',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '20px'
                                }}>
                                  🌾
                                </div>
                                <div>
                                  <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    marginBottom: '2px'
                                  }}>
                                    {it.crop?.titleEn || it.crop?.titleNp || "Crop"}
                                  </div>
                                  <div style={{
                                    fontSize: '13px',
                                    color: '#666'
                                  }}>
                                    {it.quantity} × रु {it.unitPrice}
                                  </div>
                                </div>
                              </div>

                              <div style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                              }}>
                                रु {(it.quantity * it.unitPrice).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          Total Amount
                        </div>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#4a7c3b'
                        }}>
                          रु {o.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="order-actions-section" style={{
                      width: '260px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '16px'
                      }}>
                        Update Order Status
                      </div>

                      <div className="status-actions" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <button
                          onClick={() => updateStatus(o.id, "CONFIRMED")}
                          disabled={o.status === "CONFIRMED" || o.status === "DELIVERED" || o.status === "CANCELLED"}
                          style={{
                            padding: '10px 16px',
                            background: o.status === "CONFIRMED" ? '#e0e0e0' : 'white',
                            color: o.status === "CONFIRMED" ? '#999' : '#1e40af',
                            border: '1px solid #1e40af',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: o.status === "CONFIRMED" || o.status === "DELIVERED" || o.status === "CANCELLED" ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: o.status === "CONFIRMED" || o.status === "DELIVERED" || o.status === "CANCELLED" ? 0.5 : 1
                          }}
                        >
                          ✓ Confirm Order
                        </button>

                        <button
                          onClick={() => updateStatus(o.id, "DELIVERED")}
                          disabled={o.status === "DELIVERED" || o.status === "CANCELLED"}
                          style={{
                            padding: '10px 16px',
                            background: o.status === "DELIVERED" ? '#e0e0e0' : 'white',
                            color: o.status === "DELIVERED" ? '#999' : '#2e7d32',
                            border: '1px solid #2e7d32',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: o.status === "DELIVERED" || o.status === "CANCELLED" ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: o.status === "DELIVERED" || o.status === "CANCELLED" ? 0.5 : 1
                          }}
                        >
                          ✓✓ Mark Delivered
                        </button>

                        <button
                          onClick={() => updateStatus(o.id, "CANCELLED")}
                          disabled={o.status === "CANCELLED" || o.status === "DELIVERED"}
                          style={{
                            padding: '10px 16px',
                            background: o.status === "CANCELLED" ? '#e0e0e0' : 'white',
                            color: o.status === "CANCELLED" ? '#999' : '#991b1b',
                            border: '1px solid #991b1b',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: o.status === "CANCELLED" || o.status === "DELIVERED" ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: o.status === "CANCELLED" || o.status === "DELIVERED" ? 0.5 : 1
                          }}
                        >
                          ✕ Cancel Order
                        </button>
                      </div>

                      {/* Status Guide */}
                      <div style={{
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e0e0e0'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          lineHeight: '1.6'
                        }}>
                          <div style={{ fontWeight: '600', marginBottom: '8px' }}>Status Guide:</div>
                          <div>⏳ Pending → New order</div>
                          <div>✓ Confirmed → Accepted</div>
                          <div>✓✓ Delivered → Complete</div>
                          <div>✕ Cancelled → Rejected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Note */}
        {!loading && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#666'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>ℹ️ Developer Note:</div>
            Your farmer orders endpoint is <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>/api/orders/farmer/sales</code> (✅ already exists).
            If you get <strong>404</strong> for <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>/api/orders/:id/status</code>, you still need to add that backend route.
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { api } from "../lib/api";

function postToEsewa(formUrl, fields) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = formUrl;

  Object.entries(fields || {}).forEach(([k, v]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = String(v ?? "");
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      const { data } = await api.get("/api/orders/mine");
      setOrders(data.orders || []);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const payEsewa = async (orderId) => {
    try {
      const { data } = await api.post(`/api/payments/esewa/initiate`, { orderId });
      if (!data.ok) throw new Error(data.error || "Esewa initiate failed");
      postToEsewa(data.formUrl, data.fields);
    } catch (e) {
      alert(e.message);
    }
  };

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

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
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .order-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .order-actions {
            flex-direction: column !important;
            width: 100% !important;
          }
          .order-actions button {
            width: 100% !important;
          }
        }
      `}</style>

      <div className="orders-container" style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '8px'
          }}>
            My Orders
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            margin: 0
          }}>
            Track and manage your crop purchases
          </p>
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
              Pending
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#f59e0b'
            }}>
              {pendingOrders}
            </div>
          </div>

          {/* Total Spent */}
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
              Total Spent
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#4a7c3b'
            }}>
              रु {totalSpent.toLocaleString()}
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

        {/* Orders List */}
        {orders.length === 0 ? (
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
              Start shopping in the marketplace to see your orders here
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {orders.map((o) => {
              const canPayEsewa = o.paymentMethod === "ESEWA" && o.status !== "PAID";
              
              const statusColors = {
                'PENDING': { bg: '#fef3c7', color: '#92400e', icon: '⏳' },
                'CONFIRMED': { bg: '#dbeafe', color: '#1e40af', icon: '✓' },
                'DELIVERED': { bg: '#e8f5e9', color: '#2e7d32', icon: '✓✓' },
                'PAID': { bg: '#e8f5e9', color: '#2e7d32', icon: '💳' },
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
                  {/* Order Header */}
                  <div className="order-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                      gap: '12px',
                      alignItems: 'center'
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

                      {/* Payment Method Badge */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: o.paymentMethod === 'ESEWA' ? '#e0f2f1' : '#f0f0f0',
                        color: o.paymentMethod === 'ESEWA' ? '#00796b' : '#666'
                      }}>
                        {o.paymentMethod === 'ESEWA' ? '💳' : '💵'} {o.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{
                    marginBottom: '20px'
                  }}>
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
                            gap: '12px',
                            flex: 1
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: '#e8f5e9',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                              flexShrink: 0
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

                  {/* Total Amount */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '20px'
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

                  {/* Actions */}
                  <div className="order-actions" style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    {canPayEsewa && (
                      <button
                        onClick={() => payEsewa(o.id)}
                        style={{
                          flex: 1,
                          padding: '12px 24px',
                          background: '#4a7c3b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#3d6630'}
                        onMouseOut={(e) => e.target.style.background = '#4a7c3b'}
                      >
                        💳 Pay with eSewa
                      </button>
                    )}
                    
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
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f0f0f0';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
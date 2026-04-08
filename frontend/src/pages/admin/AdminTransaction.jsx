import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: '600',
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const statusColors = {
  PENDING:   { bg: '#fef3c7', color: '#92400e' },
  CONFIRMED: { bg: '#dbeafe', color: '#1e40af' },
  DELIVERED: { bg: '#e8f5e9', color: '#2e7d32' },
  PAID:      { bg: '#e8f5e9', color: '#2e7d32' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
};

export default function AdminTransactions() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/orders");
      const list = data.orders || [];
      setOrders(list);
      setFiltered(list);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = [...orders];
    if (statusFilter !== "ALL") list = list.filter(o => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.buyer?.fullName?.toLowerCase().includes(q) ||
        o.buyer?.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, statusFilter, orders]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const updateStatus = async (orderId, newStatus) => {
  const confirmed = window.confirm(`Change order status to ${newStatus}?`);
  if (!confirmed) return;

  try {
    console.log("PATCHING ORDER:", orderId, newStatus);
    await api.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus });

    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );

    showSuccess(`Order status updated to ${newStatus}.`);
  } catch (e) {
    console.error("PATCH ERROR:", e?.response || e);
    setErr(
      e?.response?.data?.error ||
      e?.response?.data?.message ||
      e.message
    );
  }
};

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED' || o.status === 'PAID').length;
  const cancelledCount = orders.filter(o => o.status === 'CANCELLED').length;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '24px' }}>
      <style>{`
        @media (max-width: 968px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .filter-row { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', margin: 0, marginBottom: '8px' }}>
            Transaction Oversight
          </h1>
          <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
            Monitor all platform orders, resolve disputes, and update order statuses
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Orders', value: orders.length, color: '#1a1a1a' },
            { label: 'Pending', value: pendingCount, color: '#92400e' },
            { label: 'Completed', value: deliveredCount, color: '#2e7d32' },
            { label: 'Total Revenue', value: `रु ${totalRevenue.toLocaleString()}`, color: '#4a7c3b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>{s.label}</div>
              <div style={{ fontSize: s.label === 'Total Revenue' ? '22px' : '32px', fontWeight: '700', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {err && (
          <div style={{ padding: '14px 16px', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', fontSize: '14px', marginBottom: '24px' }}>
            ⚠️ {err}
          </div>
        )}
        {success && (
          <div style={{ padding: '14px 16px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '8px', color: '#2e7d32', fontSize: '14px', marginBottom: '24px' }}>
            ✅ {success}
          </div>
        )}

        {/* Table Card */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>

          {/* Filters */}
          <div className="filter-row" style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by order ID or buyer name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white', cursor: 'pointer' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="DELIVERED">Delivered</option>
              <option value="PAID">Paid</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              onClick={load}
              style={{ padding: '10px 20px', background: 'white', color: '#4a7c3b', border: '1px solid #4a7c3b', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              🔄 Refresh
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#999', fontSize: '15px' }}>Loading transactions...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>Buyer</th>
                    <th style={thStyle}>Farmer</th>
                    <th style={thStyle}>Payment</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Date</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => {
                    const st = statusColors[o.status] || { bg: '#f5f5f5', color: '#666' };
                    const isExpanded = expandedId === o.id;
                    const farmerNames = [...new Set((o.items || []).map(i => i.crop?.farmer?.fullName).filter(Boolean))].join(', ');

                    return (
                      <>
                        <tr
                          key={o.id}
                          style={{ borderBottom: isExpanded ? 'none' : '1px solid #f0f0f0', transition: 'background 0.2s', cursor: 'pointer' }}
                          onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                          onMouseOut={e => e.currentTarget.style.background = 'white'}
                          onClick={() => setExpandedId(isExpanded ? null : o.id)}
                        >
                          <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px', color: '#666' }}>
                            #{o.id.slice(0, 8)}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '14px' }}>{o.buyer?.fullName || '—'}</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>{o.buyer?.email || ''}</div>
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#333' }}>
                            {farmerNames || '—'}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                              background: o.paymentMethod === 'ESEWA' ? '#e0f2f1' : '#f0f0f0',
                              color: o.paymentMethod === 'ESEWA' ? '#00796b' : '#666'
                            }}>
                              {o.paymentMethod === 'ESEWA' ? '💳' : '💵'} {o.paymentMethod}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', background: st.bg, color: st.color }}>
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#1a1a1a' }}>
                            रु {o.totalAmount?.toLocaleString()}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: '#666' }}>
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {o.status === 'PENDING' && (
                                <button onClick={() => updateStatus(o.id, 'CONFIRMED')}
                                  style={{ padding: '6px 10px', background: 'white', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                  Confirm
                                </button>
                              )}
                              {o.status === 'CONFIRMED' && (
                                <button onClick={() => updateStatus(o.id, 'DELIVERED')}
                                  style={{ padding: '6px 10px', background: 'white', color: '#2e7d32', border: '1px solid #a7f3d0', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                  Deliver
                                </button>
                              )}
                              {(o.status === 'PENDING' || o.status === 'CONFIRMED') && (
                                <button onClick={() => updateStatus(o.id, 'CANCELLED')}
                                  style={{ padding: '6px 10px', background: 'white', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Items Row */}
                        {isExpanded && (
                          <tr key={`${o.id}-expanded`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td colSpan="8" style={{ padding: '0 16px 16px 16px', background: '#f9fafb' }}>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '10px', paddingTop: '12px' }}>
                                ORDER ITEMS
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(o.items || []).map((it, idx) => (
                                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <span style={{ fontSize: '20px' }}>🌾</span>
                                      <div>
                                        <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '14px' }}>{it.crop?.titleEn || 'Crop'}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>Farmer: {it.crop?.farmer?.fullName || '—'}</div>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontWeight: '600', color: '#1a1a1a' }}>रु {(it.quantity * it.unitPrice).toLocaleString()}</div>
                                      <div style={{ fontSize: '12px', color: '#666' }}>{it.quantity} × रु {it.unitPrice}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}

                  {filtered.length === 0 && !loading && (
                    <tr>
                      <td colSpan="8" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>No transactions found</div>
                        <div style={{ fontSize: '14px' }}>Try adjusting your search or filter</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

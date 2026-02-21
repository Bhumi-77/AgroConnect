import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function FarmerDashboard() {
  const [crops, setCrops] = useState([]);
  const [sales, setSales] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const a = await api.get('/api/crops/farmer/mine/list');
      if (a.data.ok) setCrops(a.data.crops);

      const b = await api.get('/api/orders/farmer/sales');
      if (b.data.ok) setSales(b.data.orders);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => { load(); }, []);

  // ✅ Delete crop (hard delete OR soft disable)
  const deleteCrop = async (cropId) => {
    const ok = window.confirm("Are you sure you want to delete this crop?");
    if (!ok) return;

    setErr("");
    try {
      // Option A: HARD delete (if your backend supports it)
      await api.delete(`/api/crops/${cropId}`);

      // Option B: SOFT delete (disable) — uncomment if this is what you want:
      // await api.patch(`/api/crops/${cropId}`, { isActive: false });

      // Remove from UI immediately
      setCrops((prev) => prev.filter((c) => c.id !== cropId));
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Delete failed");
    }
  };

  // Calculate stats
  const totalCrops = crops.length;
  const activeCrops = crops.filter(c => c.isActive).length;
  const totalSold = crops.reduce((sum, c) => sum + (c.inventory?.sold || 0), 0);
  const totalRevenue = sales.reduce((sum, o) => sum + o.totalAmount, 0);

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
          .dashboard-container {
            padding: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .table-container {
            overflow-x: auto !important;
          }
          .table-container table {
            min-width: 760px !important;
          }
        }
      `}</style>

      <div className="dashboard-container" style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div className="dashboard-header" style={{
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
              Farmer Dashboard
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#666',
              margin: 0
            }}>
              Manage your crop listings and track your sales
            </p>
          </div>
          <Link
            to="/farmer/add"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#4a7c3b',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'background 0.2s',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.background = '#3d6630'}
            onMouseOut={(e) => e.target.style.background = '#4a7c3b'}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            Add Crop
          </Link>
        </div>

        {/* ✅ Error Message */}
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

        {/* Stats Cards */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Total Crops */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
              Total Crops
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
              {totalCrops}
            </div>
            <div style={{ fontSize: '13px', color: '#4a7c3b', fontWeight: '500' }}>
              {activeCrops} active
            </div>
          </div>

          {/* Total Sold */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
              Units Sold
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
              {totalSold}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              All time
            </div>
          </div>

          {/* Total Revenue */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
              रु {totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              All sales
            </div>
          </div>

          {/* Total Orders */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
              Total Orders
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
              {sales.length}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              Completed sales
            </div>
          </div>
        </div>

        {/* Crop Listings Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '20px'
          }}>
            Crop Listings
          </h2>

          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={thStyle}>Crop</th>
                  <th style={thStyle}>Price</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Available</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Reserved</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Sold</th>
                  <th style={thStyle}>Status</th>
                  {/* ✅ NEW */}
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {crops.map(c => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                        {c.titleEn}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        {c.category}
                      </div>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#1a1a1a' }}>
                        रु {c.price}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        per {c.unit}
                      </div>
                    </td>

                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a7c3b' }}>
                      {c.inventory?.available ?? '-'}
                    </td>

                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#f59e0b' }}>
                      {c.inventory?.reserved ?? '-'}
                    </td>

                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#6b7280' }}>
                      {c.inventory?.sold ?? '-'}
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: c.isActive ? '#e8f5e9' : '#f5f5f5',
                        color: c.isActive ? '#4a7c3b' : '#666'
                      }}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    {/* ✅ NEW Actions */}
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '10px' }}>
                        <Link
                          to={`/farmer/edit/${c.id}`}
                          style={{
                            padding: '8px 12px',
                            background: 'white',
                            color: '#4a7c3b',
                            border: '1px solid #4a7c3b',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️ Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteCrop(c.id)}
                          style={{
                            padding: '8px 12px',
                            background: 'white',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                          title="Delete crop"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {crops.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#999'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌾</div>
                      <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                        No crops listed yet
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        Start by adding your first crop listing
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales / Orders Table (unchanged) */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '20px'
          }}>
            Sales & Orders
          </h2>

          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Buyer</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
                  <th style={thStyle}>Items</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(o => {
                  const statusColors = {
                    'PENDING': { bg: '#fef3c7', color: '#92400e' },
                    'CONFIRMED': { bg: '#dbeafe', color: '#1e40af' },
                    'DELIVERED': { bg: '#e8f5e9', color: '#2e7d32' },
                    'CANCELLED': { bg: '#fee2e2', color: '#991b1b' }
                  };
                  const statusStyle = statusColors[o.status] || { bg: '#f5f5f5', color: '#666' };

                  return (
                    <tr
                      key={o.id}
                      style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px', color: '#666' }}>
                        #{o.id.slice(0, 8)}
                      </td>
                      <td style={{ padding: '16px', fontWeight: '500', color: '#1a1a1a' }}>
                        {o.buyer?.fullName}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: statusStyle.bg,
                          color: statusStyle.color
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', fontSize: '16px', color: '#1a1a1a' }}>
                        रु {o.totalAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>
                        {o.items.map(i => `${i.crop.titleEn} x${i.quantity}`).join(', ')}
                      </td>
                    </tr>
                  );
                })}

                {sales.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                      <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                        No sales yet
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        Your orders will appear here once buyers start purchasing
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: '600',
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};
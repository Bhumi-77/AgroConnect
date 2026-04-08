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

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/payments");
      const list = data.payments || [];
      setPayments(list);
      setFiltered(list);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = [...payments];
    if (statusFilter !== "ALL") list = list.filter(p => p.status === statusFilter);
    if (methodFilter !== "ALL") list = list.filter(p => p.method === methodFilter || p.paymentMethod === methodFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.id?.toLowerCase().includes(q) ||
        p.transactionId?.toLowerCase().includes(q) ||
        p.refId?.toLowerCase().includes(q) ||
        p.order?.buyer?.fullName?.toLowerCase().includes(q) ||
        p.order?.buyer?.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, statusFilter, methodFilter, payments]);

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successCount = payments.filter(p => p.status === 'SUCCESS' || p.status === 'COMPLETED').length;
  const failedCount = payments.filter(p => p.status === 'FAILED' || p.status === 'FAILURE').length;
  const pendingCount = payments.filter(p => p.status === 'PENDING').length;

  const paymentStatusColor = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'SUCCESS' || s === 'COMPLETED') return { bg: '#e8f5e9', color: '#2e7d32' };
    if (s === 'FAILED' || s === 'FAILURE')    return { bg: '#fee2e2', color: '#991b1b' };
    if (s === 'PENDING')                       return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#f5f5f5', color: '#666' };
  };

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
            Payment Oversight
          </h1>
          <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
            Monitor eSewa transactions, track payment statuses, and audit financial records
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Transactions', value: payments.length,                              color: '#1a1a1a' },
            { label: 'Successful',          value: successCount,                                 color: '#2e7d32' },
            { label: 'Failed',              value: failedCount,                                  color: '#b91c1c' },
            { label: 'Total Processed',     value: `रु ${totalAmount.toLocaleString()}`,          color: '#4a7c3b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>{s.label}</div>
              <div style={{ fontSize: s.label === 'Total Processed' ? '20px' : '32px', fontWeight: '700', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Error */}
        {err && (
          <div style={{ padding: '14px 16px', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', fontSize: '14px', marginBottom: '24px' }}>
            ⚠️ {err}
          </div>
        )}

        {/* Table Card */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>

          {/* Filters */}
          <div className="filter-row" style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by transaction ID, buyer name..."
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
              <option value="SUCCESS">Success</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="FAILURE">Failure</option>
            </select>
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              style={{ padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white', cursor: 'pointer' }}
            >
              <option value="ALL">All Methods</option>
              <option value="ESEWA">eSewa</option>
              <option value="COD">Cash on Delivery</option>
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
              <div style={{ padding: '60px', textAlign: 'center', color: '#999', fontSize: '15px' }}>Loading payment records...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={thStyle}>Transaction ID</th>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>Buyer</th>
                    <th style={thStyle}>Method</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Date</th>
                    <th style={thStyle}>eSewa Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => {
                    const st = paymentStatusColor(p.status);
                    return (
                      <tr
                        key={p.id || idx}
                        style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseOut={e => e.currentTarget.style.background = 'white'}
                      >
                        <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
                          {p.transactionId ? p.transactionId.slice(0, 12) + '…' : p.id?.slice(0, 8) || '—'}
                        </td>
                        <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
                          #{(p.orderId || p.order?.id || '').slice(0, 8) || '—'}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '14px' }}>
                            {p.order?.buyer?.fullName || p.buyerName || '—'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {p.order?.buyer?.email || p.buyerEmail || ''}
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                            background: (p.method || p.paymentMethod) === 'ESEWA' ? '#e0f2f1' : '#f0f0f0',
                            color: (p.method || p.paymentMethod) === 'ESEWA' ? '#00796b' : '#666'
                          }}>
                            {(p.method || p.paymentMethod) === 'ESEWA' ? '💳' : '💵'} {p.method || p.paymentMethod || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', background: st.bg, color: st.color }}>
                            {p.status || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#1a1a1a' }}>
                          रु {(p.amount || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: '#666' }}>
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
                          {p.refId || p.esewaRefId || p.pidx || '—'}
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && !loading && (
                    <tr>
                      <td colSpan="8" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>No payment records found</div>
                        <div style={{ fontSize: '14px' }}>Transactions will appear here once buyers start paying</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer note */}
          {filtered.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                💡 Showing <strong>{filtered.length}</strong> of <strong>{payments.length}</strong> total payment records.
                All times shown in local timezone. eSewa Ref ID is the unique identifier from eSewa's system.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

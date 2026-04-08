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

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/users");
      const list = data.users || [];
      setUsers(list);
      setFiltered(list);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = [...users];
    if (roleFilter !== "ALL") list = list.filter(u => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, roleFilter, users]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const confirm = window.confirm(`Are you sure you want to ${newStatus === "SUSPENDED" ? "suspend" : "activate"} this user?`);
    if (!confirm) return;
    try {
      await api.patch(`/api/admin/users/${userId}/status`, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      showSuccess(`User ${newStatus === "SUSPENDED" ? "suspended" : "activated"} successfully.`);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    }
  };

  const verifyFarmer = async (userId, currentVerified) => {
    const action = currentVerified ? "unverify" : "verify";
    const confirm = window.confirm(`Are you sure you want to ${action} this farmer?`);
    if (!confirm) return;
    try {
      await api.patch(`/api/admin/users/${userId}/verify`, { verified: !currentVerified });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !currentVerified } : u));
      showSuccess(`Farmer ${action === "verify" ? "verified" : "unverified"} successfully.`);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    }
  };

  const totalUsers = users.length;
  const totalFarmers = users.filter(u => u.role === "FARMER").length;
  const totalBuyers = users.filter(u => u.role === "BUYER").length;
  const suspended = users.filter(u => u.status === "SUSPENDED").length;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '24px' }}>
      <style>{`
        @media (max-width: 968px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .filter-row { flex-direction: column !important; }
          .filter-row input, .filter-row select { width: 100% !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', margin: 0, marginBottom: '8px' }}>
            User Management
          </h1>
          <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
            Manage farmer and buyer accounts, verify credentials, and control access
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Users', value: totalUsers, color: '#1a1a1a' },
            { label: 'Farmers', value: totalFarmers, color: '#4a7c3b' },
            { label: 'Buyers', value: totalBuyers, color: '#1e40af' },
            { label: 'Suspended', value: suspended, color: '#b91c1c' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>{s.label}</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: s.color }}>{s.value}</div>
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
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              style={{ padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white', cursor: 'pointer' }}
            >
              <option value="ALL">All Roles</option>
              <option value="FARMER">Farmers</option>
              <option value="BUYER">Buyers</option>
              <option value="ADMIN">Admins</option>
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
              <div style={{ padding: '60px', textAlign: 'center', color: '#999', fontSize: '15px' }}>Loading users...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Role</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Verified</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Joined</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr
                      key={u.id}
                      style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseOut={e => e.currentTarget.style.background = 'white'}
                    >
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>{u.fullName}</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                          background: u.role === 'FARMER' ? '#e8f5e9' : u.role === 'BUYER' ? '#dbeafe' : '#f3e8ff',
                          color: u.role === 'FARMER' ? '#4a7c3b' : u.role === 'BUYER' ? '#1e40af' : '#6b21a8'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                          background: u.status === 'SUSPENDED' ? '#fee2e2' : '#e8f5e9',
                          color: u.status === 'SUSPENDED' ? '#991b1b' : '#2e7d32'
                        }}>
                          {u.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {u.role === 'FARMER' ? (
                          <span style={{
                            display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                            background: u.isVerified ? '#e8f5e9' : '#fef3c7',
                            color: u.isVerified ? '#2e7d32' : '#92400e'
                          }}>
                            {u.isVerified ? '✓ Verified' : '⏳ Pending'}
                          </span>
                        ) : (
                          <span style={{ color: '#ccc', fontSize: '13px' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: '#666' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {u.role === 'FARMER' && (
                            <button
                              onClick={() => verifyFarmer(u.id, u.isVerified)}
                              style={{
                                padding: '7px 12px', background: 'white',
                                color: u.isVerified ? '#92400e' : '#4a7c3b',
                                border: `1px solid ${u.isVerified ? '#fcd34d' : '#4a7c3b'}`,
                                borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                              }}
                            >
                              {u.isVerified ? '✕ Unverify' : '✓ Verify'}
                            </button>
                          )}
                          <button
                            onClick={() => toggleStatus(u.id, u.status || 'ACTIVE')}
                            style={{
                              padding: '7px 12px', background: 'white',
                              color: u.status === 'SUSPENDED' ? '#2e7d32' : '#b91c1c',
                              border: `1px solid ${u.status === 'SUSPENDED' ? '#a7f3d0' : '#fecaca'}`,
                              borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                            }}
                          >
                            {u.status === 'SUSPENDED' ? '▶ Activate' : '⏸ Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>No users found</div>
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

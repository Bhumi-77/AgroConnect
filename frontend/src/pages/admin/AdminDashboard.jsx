import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const a = await api.get('/api/admin/dashboard');
    if (a.data.ok) setStats(a.data.stats);
    const b = await api.get('/api/admin/users');
    if (b.data.ok) setUsers(b.data.users);
    const c = await api.get('/api/admin/orders');
    if (c.data.ok) setOrders(c.data.orders);
  };

  const verify = async (id) => {
    await api.post(`/api/admin/users/${id}/verify`);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col card">
          <h2 style={{ marginTop:0 }}>Admin Dashboard</h2>
          {!stats ? <div className="small">Loading...</div> : (
            <div className="row">
              <div className="col card" style={{ background:'#f7fffb' }}>
                <div className="small">Users</div><div style={{ fontSize: 26, fontWeight: 900 }}>{stats.users}</div>
              </div>
              <div className="col card" style={{ background:'#f7fffb' }}>
                <div className="small">Crops</div><div style={{ fontSize: 26, fontWeight: 900 }}>{stats.crops}</div>
              </div>
              <div className="col card" style={{ background:'#f7fffb' }}>
                <div className="small">Orders</div><div style={{ fontSize: 26, fontWeight: 900 }}>{stats.orders}</div>
              </div>
              <div className="col card" style={{ background:'#fff8e7' }}>
                <div className="small">Unverified</div><div style={{ fontSize: 26, fontWeight: 900 }}>{stats.unverifiedUsers}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop:0 }}>Users</h3>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th></th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><b>{u.fullName}</b><div className="small">{u.district || ''} {u.municipality || ''}</div></td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isVerified ? 'Yes' : 'No'}</td>
                <td>
                  {!u.isVerified && <button className="btn secondary" onClick={()=>verify(u.id)}>Verify</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop:0 }}>Orders</h3>
        <table className="table">
          <thead>
            <tr><th>Order</th><th>Buyer</th><th>Status</th><th>Total</th><th>Items</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="small">{o.id.slice(0,8)}</td>
                <td>{o.buyer?.fullName}</td>
                <td>{o.status} / {o.payment?.status}</td>
                <td>रु {o.totalAmount}</td>
                <td className="small">{o.items.map(i => `${i.crop.titleEn} x${i.quantity}`).join(', ')}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="5" className="small">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

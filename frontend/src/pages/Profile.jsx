import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    address: user.address || '',
    district: user.district || '',
    municipality: user.municipality || '',
    ward: user.ward || ''
  });
  const [msg, setMsg] = useState('');

  const set = (k,v) => setForm(s => ({ ...s, [k]: v }));

  const save = async () => {
    setMsg('');
    const { data } = await api.put('/api/users/me', form);
    if (data.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setMsg('Saved');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 720, margin:'0 auto' }}>
        <h2 style={{ marginTop:0 }}>Profile Settings</h2>
        {msg && <div className="card" style={{ background:'#e7f5ec', marginBottom: 10 }}>{msg}</div>}
        <div className="row">
          <div className="col" style={{ marginBottom: 10 }}>
            <div className="small">Full Name</div>
            <input className="input" value={form.fullName} onChange={e=>set('fullName', e.target.value)} />
          </div>
          <div className="col" style={{ marginBottom: 10 }}>
            <div className="small">Phone</div>
            <input className="input" value={form.phone} onChange={e=>set('phone', e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div className="small">Address</div>
          <input className="input" value={form.address} onChange={e=>set('address', e.target.value)} />
        </div>
        <div className="row">
          <div className="col" style={{ marginBottom: 10 }}>
            <div className="small">District</div>
            <input className="input" value={form.district} onChange={e=>set('district', e.target.value)} />
          </div>
          <div className="col" style={{ marginBottom: 10 }}>
            <div className="small">Municipality</div>
            <input className="input" value={form.municipality} onChange={e=>set('municipality', e.target.value)} />
          </div>
          <div className="col" style={{ marginBottom: 10 }}>
            <div className="small">Ward</div>
            <input className="input" value={form.ward} onChange={e=>set('ward', e.target.value)} />
          </div>
        </div>

        <button className="btn primary" onClick={save}>Save</button>
      </div>
    </div>
  );
}

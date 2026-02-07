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

  const set = (k,v) => setForm(s => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      for (const f of files) fd.append('images', f);

      const { data } = await api.post('/api/crops', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.ok) nav('/farmer');
    } catch (e2) {
      setErr(e2?.response?.data?.error || 'Failed');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 860, margin:'0 auto' }}>
        <h2 style={{ marginTop:0 }}>Add Crop</h2>
        {err && <div className="card" style={{ background:'#ffe9e9', marginBottom: 10 }}>{err}</div>}
        <form onSubmit={submit}>
          <div className="row">
            <div className="col" style={{ marginBottom: 10 }}>
              <div className="small">Title (EN)</div>
              <input className="input" value={form.titleEn} onChange={e=>set('titleEn', e.target.value)} />
            </div>
            <div className="col" style={{ marginBottom: 10 }}>
              <div className="small">Title (NP)</div>
              <input className="input" value={form.titleNp} onChange={e=>set('titleNp', e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="col" style={{ marginBottom: 10 }}>
              <div className="small">Category</div>
              <select className="input" value={form.category} onChange={e=>set('category', e.target.value)}>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col" style={{ marginBottom: 10 }}>
              <div className="small">Quality</div>
              <select className="input" value={form.qualityGrade} onChange={e=>set('qualityGrade', e.target.value)}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div className="col" style={{ marginBottom: 10 }}>
              <div className="small">Unit</div>
              <select className="input" value={form.unit} onChange={e=>set('unit', e.target.value)}>
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col" style={{ marginBottom: 10 }}>
              <div className="small">Price</div>
              <input className="input" type="number" value={form.price} onChange={e=>set('price', e.target.value)} />
            </div>
            <div className="col" style={{ marginBottom: 10 }}>
              <div className="small">Quantity</div>
              <input className="input" type="number" value={form.quantity} onChange={e=>set('quantity', e.target.value)} />
            </div>
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
          </div>

          <div style={{ marginBottom: 10 }}>
            <div className="small">Images (max 5)</div>
            <input className="input" type="file" multiple accept="image/*" onChange={e=>setFiles(Array.from(e.target.files || []))} />
          </div>

          <div className="row">
            <button className="btn primary" type="submit">Save</button>
            <button className="btn secondary" type="button" onClick={()=>nav('/farmer')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

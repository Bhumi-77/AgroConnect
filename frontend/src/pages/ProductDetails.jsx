import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function ProductDetails() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [msg, setMsg] = useState('');

  const titleKey = i18n.language === 'np' ? 'titleNp' : 'titleEn';
  const descKey = i18n.language === 'np' ? 'descriptionNp' : 'descriptionEn';

  const fetchOne = async () => {
    const { data } = await api.get(`/api/crops/${id}`);
    if (data.ok) setCrop(data.crop);
  };

  useEffect(() => { fetchOne(); }, [id]);

  const total = useMemo(() => {
    if (!crop) return 0;
    return Number(qty) * Number(crop.price);
  }, [qty, crop]);

  const startChat = async () => {
    if (!user) return nav('/login');
    const farmerId = crop?.farmer?.id;
    const buyerId = user.id;
    const { data } = await api.post('/api/chat/room', { buyerId, farmerId });
    if (data.ok) nav('/chat?room=' + data.room.id);
  };

  // ✅ NEW: send to checkout instead of placing order here
  const goCheckout = () => {
    setMsg('');
    if (!user) return nav('/login');
    if (user.role !== 'BUYER') return setMsg('Only buyers can order.');

    nav('/checkout', {
      state: {
        items: [
          {
            id: crop.id,
            title: crop[titleKey],
            price: crop.price,
            quantity: Number(qty),
            unit: crop.unit,
          }
        ],
        // optional prefill
        defaultPaymentMethod: paymentMethod
      }
    });
  };

  if (!crop) return <div className="container"><div className="card">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display:'flex', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <div style={{ minWidth: 280 }}>
            <h2 style={{ marginTop:0 }}>{crop[titleKey]}</h2>
            <div className="small">{crop.category} • {crop.district || '-'} {crop.municipality || ''}</div>
            <div style={{ marginTop: 10 }} className="small">{crop[descKey] || ''}</div>
            <div style={{ marginTop: 12, display:'flex', gap:8, flexWrap:'wrap' }}>
              <span className="badge">{t('price')}: रु {crop.price}/{crop.unit}</span>
              <span className="badge">{t('quality')}: {crop.qualityGrade || '-'}</span>
              <span className="badge">{t('qty')}: {crop.inventory?.available ?? crop.quantity}</span>
            </div>
            <div style={{ marginTop: 12 }} className="small">
              Farmer: <b>{crop.farmer?.fullName}</b> {crop.farmer?.isVerified ? '• Verified' : ''}
            </div>
            <div style={{ marginTop: 12, display:'flex', gap:10, flexWrap:'wrap' }}>
              <button className="btn secondary" onClick={startChat}>{t('chat')}</button>
            </div>
          </div>

          <div className="card" style={{ width: 360, background:'#f7fffb' }}>
            <h3 style={{ marginTop:0 }}>{t('order')}</h3>
            {msg && <div className="card" style={{ background:'#ffecec', marginBottom: 10 }}>{msg}</div>}
            <div style={{ marginBottom: 10 }}>
              <div className="small">{t('qty')}</div>
              <input className="input" type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div className="small">Payment</div>
              <select className="input" value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>
                <option value="COD">{t('payCOD')}</option>
                <option value="ESEWA">{t('payESEWA')}</option>
              </select>
            </div>
            <div className="small">{t('total')}: <b>रु {total}</b></div>

            {/* ✅ Updated: goes to checkout */}
            <button
              className="btn primary"
              style={{ width:'100%', marginTop: 10 }}
              onClick={goCheckout}
            >
              Continue to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

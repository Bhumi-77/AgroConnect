// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* ─── Fix Leaflet Default Icon ─── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function Profile() {
  const { t } = useTranslation();
  const { user: authUser, setUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUserState] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const [mapPosition, setMapPosition] = useState([28.3949, 84.1240]);
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLng, setSelectedLng] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please login.');

      const response = await api.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && (response.data.ok || response.data.success)) {
        const userData = response.data.user || response.data.data;
        setUserState(userData);
        setForm(userData);

        if (userData.latitude && userData.longitude) {
          setMapPosition([userData.latitude, userData.longitude]);
          setSelectedLat(userData.latitude);
          setSelectedLng(userData.longitude);
        }

        if (userData.address) setSelectedAddress(userData.address);
      } else {
        throw new Error(response.data?.message || 'Invalid response');
      }
    } catch (error) {
      let errorMessage = 'Failed to load profile. ';

      if (error.response?.status === 401) {
        errorMessage += 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error.';
      } else {
        errorMessage += error.message;
      }

      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLat(latlng.lat);
    setSelectedLng(latlng.lng);
    setMapPosition([latlng.lat, latlng.lng]);
    setForm((prev) => ({ ...prev, latitude: latlng.lat, longitude: latlng.lng }));

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&accept-language=en`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.display_name) {
          setSelectedAddress(data.display_name);
          setForm((prev) => ({ ...prev, address: data.display_name }));
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErr('');

    try {
      const token = localStorage.getItem('token');
      const { data } = await api.put('/api/users/me', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.ok || data.success) {
        const updatedUser = data.user || data.data;
        setUserState(updatedUser);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setEditing(false);
      } else throw new Error(data.message || 'Failed to update');
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a3a0d' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: '4px solid rgba(255,255,255,0.2)',
              borderTopColor: '#8bc34a',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }}
          />
          Loading Profile...
        </div>

        <style>{`@keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1a3a0d 0%, #2d5a1b 50%, #4a7c3b 100%)',
        padding: '60px 20px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

      .profile-card {
        background: white;
        border-radius: 24px;
        padding: 40px;
        max-width: 780px;
        margin: 0 auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        animation: fadeUp .6s ease;
      }

      @keyframes fadeUp {
        from {opacity:0; transform:translateY(40px)}
        to {opacity:1; transform:translateY(0)}
      }

      .profile-input {
        width:100%;
        padding:14px 16px;
        border-radius:12px;
        border:1.5px solid #e8ede6;
        font-size:14px;
        transition:.25s;
      }

      .profile-input:focus {
        outline:none;
        border-color:#4a7c3b;
        box-shadow:0 0 0 3px rgba(74,124,59,.12);
      }

      .profile-btn {
        padding:14px 26px;
        border-radius:40px;
        border:none;
        font-weight:600;
        cursor:pointer;
        transition:.25s;
      }

      .profile-btn-primary {
        background:linear-gradient(135deg,#8bc34a,#558b2f);
        color:white;
      }

      .profile-btn-primary:hover {
        transform:translateY(-2px);
        box-shadow:0 12px 28px rgba(74,124,59,.3);
      }

      .profile-btn-outline {
        background:white;
        border:1.5px solid #4a7c3b;
        color:#4a7c3b;
      }
      `}</style>

      <div className="profile-card">
        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-block',
              background: '#e8f5e9',
              color: '#2d5a1b',
              padding: '6px 18px',
              borderRadius: 40,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '.08em',
              marginBottom: 16,
            }}
          >
            MY PROFILE
          </div>

          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#1c2e0f',
              margin: '0 0 6px',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Manage Your Account
          </h1>

          <p style={{ color: '#5a6b51', margin: 0 }}>
            Update your personal details and location for better marketplace experience.
          </p>
        </div>

        {err && (
          <div
            style={{
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              padding: 14,
              borderRadius: 12,
              color: '#c62828',
              marginBottom: 24,
            }}
          >
            {err}
          </div>
        )}

        {!editing ? (
          <div>
            <ProfileItem label="Full Name" value={user.fullName} />
            <ProfileItem label="Email" value={user.email} />
            <ProfileItem label="Phone" value={user.phone || 'Not provided'} />
            <ProfileItem label="Address" value={user.address || 'Not provided'} />

            <button
              onClick={() => setEditing(true)}
              className="profile-btn profile-btn-primary"
              style={{ marginTop: 20 }}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <FormInput label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
            <FormInput label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <FormInput label="District" name="district" value={form.district} onChange={handleChange} />
            <FormInput label="Municipality" name="municipality" value={form.municipality} onChange={handleChange} />

            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Select Location</label>

              <MapContainer center={mapPosition} zoom={7} style={{ height: 220, borderRadius: 16 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {(selectedLat && selectedLng) && <Marker position={[selectedLat, selectedLng]} />}
              </MapContainer>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <button type="submit" className="profile-btn profile-btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                className="profile-btn profile-btn-outline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#7a8c6e', marginBottom: 6 }}>{label}</div>
      <div
        style={{
          padding: '14px 16px',
          borderRadius: 12,
          border: '1.5px solid #e8ede6',
          background: '#fafcf9',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FormInput({ label, name, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>{label}</label>
      <input name={name} value={value || ''} onChange={onChange} className="profile-input" />
    </div>
  );
}

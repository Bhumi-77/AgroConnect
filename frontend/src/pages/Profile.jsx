// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
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
  
  // Map states
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
      console.log('🔑 Token from storage:', token ? 'EXISTS' : 'MISSING');
      
      if (!token) {
        throw new Error('No token found. Please login.');
      }

      console.log('📡 Fetching profile from /api/user/me...');
      
      const response = await api.get('/api/users/me', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Response:', response);
      
      if (response.data && (response.data.ok || response.data.success)) {
        const userData = response.data.user || response.data.data;
        console.log('👤 User data:', userData);
        
        setUserState(userData);
        setForm(userData);
        if (userData.latitude && userData.longitude) {
          setMapPosition([userData.latitude, userData.longitude]);
          setSelectedLat(userData.latitude);
          setSelectedLng(userData.longitude);
        }
        if (userData.address) setSelectedAddress(userData.address);
      } else {
        throw new Error(response.data?.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Profile fetch error:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Failed to load profile. ';
      
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
        
        if (error.response.status === 401) {
          errorMessage += 'Session expired. Please login again.';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else if (error.response.status === 404) {
          errorMessage += 'Profile endpoint not found.';
        } else if (error.response.status === 500) {
          errorMessage += 'Server error. Please try again later.';
        } else {
          errorMessage += error.response.data?.message || 'Please login again.';
        }
      } else if (error.request) {
        errorMessage += 'No response from server. Is the backend running?';
      } else {
        errorMessage += error.message || 'Please login again.';
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
    setForm(prev => ({ ...prev, latitude: latlng.lat, longitude: latlng.lng }));
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&accept-language=en`)
      .then(res => res.json())
      .then(data => {
        if (data?.display_name) {
          setSelectedAddress(data.display_name);
          setForm(prev => ({ ...prev, address: data.display_name }));
        }
      })
      .catch(() => {});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.put('/api/users/me', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.ok || data.success) {
        const updatedUser = data.user || data.data;
        setUserState(updatedUser);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setEditing(false);
        if (updatedUser.latitude && updatedUser.longitude) {
          setMapPosition([updatedUser.latitude, updatedUser.longitude]);
          setSelectedLat(updatedUser.latitude);
          setSelectedLng(updatedUser.longitude);
        }
        if (updatedUser.address) setSelectedAddress(updatedUser.address);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update failed:', error);
      setErr(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setForm(user);
    if (user?.latitude && user?.longitude) {
      setSelectedLat(user.latitude);
      setSelectedLng(user.longitude);
      setMapPosition([user.latitude, user.longitude]);
    }
    if (user?.address) setSelectedAddress(user.address);
    setErr('');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e0e0e0', borderTopColor: '#4a7c3b', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#666' }}>Loading profile...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: '#c62828', marginBottom: '16px', fontSize: '16px' }}>{err}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/login')} 
              style={{ 
                padding: '10px 24px', 
                background: '#4a7c3b', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Go to Login
            </button>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '10px 24px', 
                background: 'white', 
                color: '#4a7c3b', 
                border: '1px solid #4a7c3b', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Retry
            </button>
          </div>
          <p style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
            Check browser console (F12) for detailed error logs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%)',
      padding: '24px'
    }}>
      <style>{`
        @media (max-width: 640px) {
          .profile-card { padding: 20px !important; }
          .form-row { flex-direction: column !important; gap: 12px !important; }
          .form-row > div { width: 100% !important; }
        }
        .map-container { border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
        .selected-location { background: #f5f5f5; padding: 10px 14px; border-radius: 6px; font-size: 13px; margin-top: 10px; }
        .location-coords { font-family: monospace; color: #4a7c3b; font-size: 12px; }
      `}</style>

      <div className="profile-card" style={{
        maxWidth: '700px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
              {t('myProfile') || 'My Profile'}
            </h1>
            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0' }}>
              {user.role === 'FARMER' ? '🚜 Farmer' : user.role === 'BUYER' ? '🛒 Buyer' : '🔐 Admin'}
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: '10px 20px',
                background: '#4a7c3b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {t('editProfile') || 'Edit Profile'}
            </button>
          )}
        </div>

        {err && (
          <div style={{
            padding: '12px',
            background: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: '8px',
            color: '#c62828',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            {err}
          </div>
        )}

        {!editing ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>Full Name</label>
              <p style={{ fontSize: '16px', color: '#333', margin: '6px 0 0' }}>{user.fullName}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>Email</label>
              <p style={{ fontSize: '16px', color: '#333', margin: '6px 0 0' }}>{user.email}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>Phone</label>
              <p style={{ fontSize: '16px', color: '#333', margin: '6px 0 0' }}>{user.phone || 'Not provided'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>Address</label>
              <p style={{ fontSize: '16px', color: '#333', margin: '6px 0 0' }}>{user.address || 'Not provided'}</p>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>District</label>
                <p style={{ fontSize: '16px', color: '#333', margin: '6px 0 0' }}>{user.district || '-'}</p>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>Municipality</label>
                <p style={{ fontSize: '16px', color: '#333', margin: '6px 0 0' }}>{user.municipality || '-'}</p>
              </div>
            </div>

            {user.ward && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>Ward</label>
                <p style={{ fontSize: '16px', color: '#333', margin: '6px 0 0' }}>Ward No. {user.ward}</p>
              </div>
            )}

            {user.latitude && user.longitude && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Your Location
                </label>
                <div className="map-container">
                  <MapContainer
                    center={[user.latitude, user.longitude]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: '200px', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[user.latitude, user.longitude]} />
                  </MapContainer>
                </div>
                <div className="selected-location">
                  <div>📍 {selectedAddress || 'Location saved'}</div>
                  <div className="location-coords">
                    Lat: {user.latitude.toFixed(6)}, Lng: {user.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            )}

            <div style={{ paddingTop: '16px', borderTop: '1px solid #eee', fontSize: '13px', color: '#999' }}>
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone || ''}
                onChange={handleChange}
                placeholder="Enter your phone"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                Address
              </label>
              <textarea
                name="address"
                value={form.address || ''}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={form.district || ''}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                  Municipality
                </label>
                <input
                  type="text"
                  name="municipality"
                  value={form.municipality || ''}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                Ward (Optional)
              </label>
              <input
                type="text"
                name="ward"
                value={form.ward || ''}
                onChange={handleChange}
                placeholder="Ward number"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                Select Your Location
              </label>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Click on the map to update your location</p>
              
              <div className="map-container">
                <MapContainer
                  center={mapPosition}
                  zoom={7}
                  scrollWheelZoom={true}
                  style={{ height: '200px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                  {(selectedLat && selectedLng) && <Marker position={[selectedLat, selectedLng]} />}
                </MapContainer>
              </div>
              
              {(selectedLat && selectedLng) && (
                <div className="selected-location">
                  <div>📍 Location selected</div>
                  <div className="location-coords">
                    Lat: {selectedLat.toFixed(6)}, Lng: {selectedLng.toFixed(6)}
                  </div>
                  {selectedAddress && <div style={{marginTop: '4px', color: '#555'}}>📬 {selectedAddress}</div>}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: saving ? '#999' : '#4a7c3b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
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
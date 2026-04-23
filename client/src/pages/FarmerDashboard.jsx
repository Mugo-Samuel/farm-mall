import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) { setWeatherError('Please enter a city name.'); return; }
    setWeatherLoading(true); setWeatherError(''); setWeather(null);
    try {
      const res = await API.get(`/weather?city=${encodeURIComponent(city)}`);
      setWeather(res.data);
    } catch (err) {
      setWeatherError(err.response?.data?.message || 'Could not fetch weather.');
    } finally { setWeatherLoading(false); }
  };

  const tips = [
    { icon: '💧', title: 'Irrigation', tip: 'Water crops early morning to reduce evaporation.' },
    { icon: '🌱', title: 'Crop Rotation', tip: 'Rotate crops each season to maintain soil health.' },
    { icon: '🐛', title: 'Pest Control', tip: 'Regularly inspect crops for pests and diseases.' },
    { icon: '📦', title: 'Record Keeping', tip: 'Keep records of your yield for better planning.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Welcome Card */}
        <div style={{ background: 'linear-gradient(135deg, #166534, #15803d)', borderRadius: '20px', padding: '32px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(22,101,52,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0 }}>👨‍🌾</div>
            <div>
              <p style={{ color: '#86efac', fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Welcome back</p>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', margin: '0 0 4px' }}>{user?.name} 🌱</h1>
              <p style={{ color: '#bbf7d0', fontSize: '14px', margin: 0 }}>{user?.email}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[{ label: 'Role', value: `🌾 ${user?.role}` }, { label: 'Status', value: '✅ Active' }].map(({ label, value }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px' }}>
                <p style={{ color: '#86efac', fontSize: '12px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ color: 'white', fontWeight: '600', margin: 0, textTransform: 'capitalize' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Card */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#111' }}>🌤️ Weather & Farming Insights</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Enter your farm's location to get today's weather and farming tips.</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input type="text" value={city} onChange={e => { setCity(e.target.value); setWeatherError(''); }}
              onKeyDown={e => e.key === 'Enter' && fetchWeather()}
              placeholder="Enter city (e.g. Nakuru, Nairobi)"
              style={{ flex: 1, border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#166534'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            <button onClick={fetchWeather} disabled={weatherLoading}
              style={{ background: '#166534', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {weatherLoading ? '...' : 'Search'}
            </button>
          </div>
          {weatherError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '12px' }}>⚠️ {weatherError}</div>}
          {weather && (
            <div>
              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '20px', color: '#166534', margin: '0 0 4px' }}>📍 {weather.city}, {weather.country}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, textTransform: 'capitalize' }}>{weather.condition}</p>
                  </div>
                  <p style={{ color: '#166534', fontWeight: '700', fontSize: '36px', margin: 0 }}>{weather.temp}°C</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[{ label: 'Humidity', value: `${weather.humidity}%` }, { label: 'Wind Speed', value: `${weather.windSpeed} m/s` }].map(({ label, value }) => (
                    <div key={label} style={{ background: 'white', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 4px' }}>{label}</p>
                      <p style={{ fontWeight: '700', fontSize: '18px', margin: 0, color: '#111' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '20px' }}>
                <p style={{ color: '#92400e', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>🌾 Today's Farming Insight</p>
                <p style={{ color: '#374151', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>{weather.icon} {weather.insight}</p>
              </div>
            </div>
          )}
          {!weather && !weatherLoading && !weatherError && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌍</div>
              <p style={{ fontSize: '14px' }}>Search for your city to see weather conditions and farming tips</p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#111' }}>📋 General Farming Tips</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {tips.map(({ icon, title, tip }) => (
              <div key={title} style={{ background: '#f9fafb', borderRadius: '14px', padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px', margin: '0 0 4px', color: '#111' }}>{title}</p>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
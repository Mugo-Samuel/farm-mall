import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #166534, #15803d)', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '700', margin: '0 0 6px' }}>Farm Mall</h1>
          <p style={{ color: '#86efac', fontSize: '14px', margin: 0 }}>Your agricultural marketplace</p>
        </div>
        <div style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111' }}>Welcome back</h2>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#166534'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password"
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#166534'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#86efac' : '#166534', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#166534', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #166534, #15803d)', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌾</div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '700', margin: '0 0 6px' }}>Join Farm Mall</h1>
          <p style={{ color: '#86efac', fontSize: '14px', margin: 0 }}>Create your account today</p>
        </div>
        <div style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111' }}>Create Account</h2>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'e.g. Samuel Mugo' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Minimum 6 characters' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>{label}</label>
                <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#166534'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            ))}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>I am registering as</label>
              <select name="role" value={form.role} onChange={handleChange}
                style={{ ...inputStyle, background: 'white', cursor: 'pointer' }}>
                <option value="farmer">🌾 Farmer</option>
                <option value="admin">🛠️ Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#86efac' : '#166534', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#166534', fontWeight: '600', textDecoration: 'none' }}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
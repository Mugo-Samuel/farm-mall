import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FarmerModal from '../components/FarmerModal';
import API from '../api/axios';

const AdminDashboard = () => {
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [farmersRes, statsRes] = await Promise.all([API.get('/farmers'), API.get('/farmers/stats')]);
      setFarmers(farmersRes.data.farmers);
      setStats(statsRes.data);
    } catch { setError('Failed to load data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try { await API.delete(`/farmers/${id}`); showSuccess(`${name} deleted.`); fetchData(); }
    catch { setError('Failed to delete farmer.'); }
  };

  const handleModalSubmit = async (form) => {
    setSubmitLoading(true); setError('');
    try {
      if (selectedFarmer) { await API.put(`/farmers/${selectedFarmer.id}`, form); showSuccess('Farmer updated!'); }
      else { await API.post('/farmers', form); showSuccess('Farmer added!'); }
      setModalOpen(false); fetchData();
    } catch (err) { setError(err.response?.data?.message || 'Operation failed.'); }
    finally { setSubmitLoading(false); }
  };

  const filtered = farmers.filter(f =>
    [f.name, f.email, f.location, f.crop].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: '0 0 6px' }}>🛠️ Admin Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>Manage all registered farmers on Farm Mall</p>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' }}>⚠️ {error}</div>}
        {success && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' }}>✅ {success}</div>}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👨‍🌾</div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px' }}>Total Farmers</p>
              <p style={{ color: '#166534', fontWeight: '700', fontSize: '32px', margin: 0 }}>{stats.total}</p>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#eff6ff', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📋</div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px' }}>Showing Now</p>
              <p style={{ color: '#1d4ed8', fontWeight: '700', fontSize: '32px', margin: 0 }}>{filtered.length}</p>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #166534, #15803d)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(22,101,52,0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🌱</div>
            <div>
              <p style={{ color: '#86efac', fontSize: '13px', margin: '0 0 4px' }}>Platform</p>
              <p style={{ color: 'white', fontWeight: '700', fontSize: '20px', margin: 0 }}>Farm Mall</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111', margin: 0 }}>All Farmers</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search farmers..."
                style={{ border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', outline: 'none', width: '220px', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#166534'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              <button onClick={() => { setSelectedFarmer(null); setModalOpen(true); }}
                style={{ background: '#166534', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                + Add Farmer
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
              <p>Loading farmers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👨‍🌾</div>
              <p style={{ fontWeight: '500', fontSize: '16px', color: '#6b7280' }}>{search ? 'No farmers match your search.' : 'No farmers yet.'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['#', 'Name', 'Email', 'Location', 'Crop', 'Phone', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((farmer, i) => (
                    <tr key={farmer.id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '16px 20px', color: '#9ca3af' }}>{i + 1}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ background: '#dcfce7', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
                            {farmer.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '500', color: '#111' }}>{farmer.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#6b7280' }}>{farmer.email}</td>
                      <td style={{ padding: '16px 20px', color: '#6b7280' }}>{farmer.location || '—'}</td>
                      <td style={{ padding: '16px 20px' }}>
                        {farmer.crop
                          ? <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{farmer.crop}</span>
                          : <span style={{ color: '#d1d5db' }}>—</span>}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#6b7280' }}>{farmer.phone || '—'}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setSelectedFarmer(farmer); setModalOpen(true); }}
                            style={{ background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(farmer.id, farmer.name)}
                            style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                            🗑️ Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <FarmerModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setError(''); }} onSubmit={handleModalSubmit} farmer={selectedFarmer} loading={submitLoading} />
    </div>
  );
};

export default AdminDashboard;
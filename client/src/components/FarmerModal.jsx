import { useState, useEffect } from 'react';

const FarmerModal = ({ isOpen, onClose, onSubmit, farmer, loading }) => {
  const [form, setForm] = useState({ name: '', email: '', location: '', crop: '', phone: '' });

  useEffect(() => {
    setForm(farmer ? { name: farmer.name || '', email: farmer.email || '', location: farmer.location || '', crop: farmer.crop || '', phone: farmer.phone || '' }
      : { name: '', email: '', location: '', crop: '', phone: '' });
  }, [farmer, isOpen]);

  if (!isOpen) return null;

  const inputStyle = { width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginTop: '6px' };
  const fields = [
    { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'e.g. John Kamau' },
    { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'e.g. john@email.com' },
    { label: 'Location', name: 'location', type: 'text', placeholder: 'e.g. Nakuru, Kenya' },
    { label: 'Main Crop', name: 'crop', type: 'text', placeholder: 'e.g. Maize, Tomatoes, Tea' },
    { label: 'Phone Number', name: 'phone', type: 'text', placeholder: 'e.g. +254 712 345 678' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ background: 'linear-gradient(135deg, #166534, #15803d)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'white', fontWeight: '700', fontSize: '18px', margin: 0 }}>
            {farmer ? '✏️ Edit Farmer' : '➕ Add New Farmer'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} style={{ padding: '24px' }}>
          {fields.map(({ label, name, type, placeholder }) => (
            <div key={name} style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>{label}</label>
              <input type={type} name={name} value={form[name]} placeholder={placeholder} required={label.includes('*')}
                onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#166534'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', padding: '12px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ flex: 1, background: loading ? '#86efac' : '#166534', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : farmer ? 'Update Farmer' : 'Add Farmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerModal;
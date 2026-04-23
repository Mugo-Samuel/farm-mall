import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{ background: '#166534', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🌱</span>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '20px', letterSpacing: '-0.3px' }}>Farm Mall</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{user?.name}</div>
          <div style={{ color: '#86efac', fontSize: '12px', textTransform: 'capitalize' }}>{user?.role}</div>
        </div>
        <button onClick={handleLogout} style={{ background: 'white', color: '#166534', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
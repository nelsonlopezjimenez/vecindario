import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav style={{
      background: 'var(--navy)', color: '#fff',
      padding: '0 1.5rem', height: 56,
      display: 'flex', alignItems: 'center', gap: '1.5rem',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: -0.5 }}>
        🏘️ Vecindario
      </Link>
      <Link to="/posts" style={{ color: 'var(--sky)', textDecoration: 'none', fontSize: 14 }}>
        Publicaciones
      </Link>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <Link to="/new-post" style={{
              background: 'var(--blue)', color: '#fff',
              padding: '5px 14px', borderRadius: 7,
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
            }}>+ Nuevo</Link>
            <span style={{ fontSize: 13, color: 'var(--sky)' }}>
              {user.username} · ⭐ {user.points ?? 0}
            </span>
            <button onClick={() => { logout(); nav('/'); }}
              style={{ background: 'none', border: '1px solid rgba(147,197,253,0.4)', color: 'var(--sky)', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--sky)', textDecoration: 'none', fontSize: 14 }}>Entrar</Link>
            <Link to="/register" style={{ background: 'var(--blue)', color: '#fff', padding: '5px 14px', borderRadius: 7, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
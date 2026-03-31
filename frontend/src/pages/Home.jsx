import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = [
  { key: 'safety',        icon: '🚨', label: 'Seguridad' },
  { key: 'events',        icon: '📅', label: 'Eventos' },
  { key: 'marketplace',   icon: '🛍️', label: 'Mercado' },
  { key: 'services',      icon: '🔧', label: 'Servicios' },
  { key: 'lost_found',    icon: '🔍', label: 'Perdidos' },
  { key: 'announcements', icon: '📢', label: 'Anuncios' },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem 2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--navy)', lineHeight: 1.2 }}>
          Tu barrio,<br />conectado.
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 460, margin: '1rem auto 1.5rem', fontSize: 16 }}>
          Vecindario es el espacio de tu comunidad: avisos, seguridad, eventos y mucho más.
        </p>
        {!user && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/register" style={{ background: 'var(--blue)', color: '#fff', padding: '10px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Únete gratis
            </Link>
            <Link to="/posts" style={{ border: '1.5px solid var(--border)', color: 'var(--text)', padding: '10px 28px', borderRadius: 8, textDecoration: 'none' }}>
              Ver publicaciones
            </Link>
          </div>
        )}
      </div>

      <h2 style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>Categorías</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {CATEGORIES.map((c) => (
          <Link key={c.key} to={`/posts?category=${c.key}`}
            style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', textAlign: 'center', textDecoration: 'none', color: 'var(--navy)', background: '#fff', transition: 'all 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--warm)'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <div style={{ fontSize: 30 }}>{c.icon}</div>
            <div style={{ fontWeight: 600, marginTop: 6, fontSize: 14 }}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '1.5rem', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: 12, border: '1px solid #bfdbfe' }}>
        <h3 style={{ color: '#1e40af', fontFamily: 'var(--font-display)' }}>⭐ Sistema de recompensas</h3>
        <p style={{ color: '#374151', fontSize: 14, marginTop: 8 }}>
          Gana puntos publicando (+10) y recibiendo votos (+2). Desbloquea insignias de <strong>Vecino Activo</strong>, <strong>Guardián del Barrio</strong> y acceso anticipado a funciones premium.
        </p>
        <p style={{ color: '#374151', fontSize: 13, marginTop: 6 }}>
          🔐 Contraseña visual por imágenes — sin texto, sin olvidos.
        </p>
      </div>
    </div>
  );
}
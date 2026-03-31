import { Link } from 'react-router-dom';

const CAT = {
  safety:        { label: '🚨 Seguridad',      color: '#dc2626' },
  events:        { label: '📅 Eventos',         color: '#d97706' },
  marketplace:   { label: '🛍️ Mercado',        color: '#16a34a' },
  services:      { label: '🔧 Servicios',       color: '#2563eb' },
  lost_found:    { label: '🔍 Perdido/Encontrado', color: '#7c3aed' },
  announcements: { label: '📢 Anuncios',        color: '#0891b2' },
  general:       { label: '💬 General',         color: '#6b7280' },
};

export default function PostCard({ post }) {
  const cat = CAT[post.category] || CAT.general;
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: 12, padding: '1rem 1.1rem',
      marginBottom: 10, transition: 'box-shadow 0.15s',
    }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 3px 14px rgba(0,0,0,0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          background: cat.color + '18', color: cat.color,
          padding: '2px 10px', borderRadius: 20,
          fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
        }}>{cat.label}</span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {post.neighborhood}</span>
        {post.pinned && <span title="Fijado">📌</span>}
        {post.resolved && <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>✓ Resuelto</span>}
      </div>

      <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: 'var(--text)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
          {post.title}
        </h3>
      </Link>

      <p style={{
        fontSize: 13, color: 'var(--muted)', margin: '0 0 10px',
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>{post.body}</p>

      <div style={{ fontSize: 12, color: '#9ca3af', display: 'flex', gap: '1rem' }}>
        <span>👤 {post.author?.username}</span>
        <span>👍 {post.upvotes?.length ?? 0}</span>
        <span>{new Date(post.createdAt).toLocaleDateString('es-CO')}</span>
      </div>
    </div>
  );
}
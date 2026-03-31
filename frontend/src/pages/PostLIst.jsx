import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const CATS = [
  { key: '',             label: 'Todos' },
  { key: 'safety',       label: '🚨 Seguridad' },
  { key: 'events',       label: '📅 Eventos' },
  { key: 'marketplace',  label: '🛍️ Mercado' },
  { key: 'services',     label: '🔧 Servicios' },
  { key: 'lost_found',   label: '🔍 Perdidos' },
  { key: 'announcements',label: '📢 Anuncios' },
  { key: 'general',      label: '💬 General' },
];

export default function PostList() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const [posts,   setPosts]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const category = params.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const q = category ? `?category=${category}` : '';
    api(`/posts${q}`)
      .then((d) => { setPosts(d.posts); setTotal(d.total); })
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', margin: 0 }}>
          Publicaciones {total > 0 && <span style={{ fontSize: 15, color: 'var(--muted)' }}>({total})</span>}
        </h2>
        {user && (
          <Link to="/new-post" style={{ background: 'var(--blue)', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            + Nueva
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATS.map((c) => (
          <button key={c.key}
            onClick={() => setParams(c.key ? { category: c.key } : {})}
            style={{
              padding: '4px 14px', borderRadius: 20,
              border: '1px solid var(--border)', cursor: 'pointer', fontSize: 12,
              background: category === c.key ? 'var(--blue)' : '#fff',
              color:      category === c.key ? '#fff' : 'var(--text)',
              fontWeight: category === c.key ? 600 : 400,
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {loading
        ? <p style={{ color: 'var(--muted)' }}>Cargando…</p>
        : posts.length === 0
          ? <p style={{ color: 'var(--muted)' }}>No hay publicaciones en esta categoría todavía.</p>
          : posts.map((p) => <PostCard key={p._id} post={p} />)
      }
    </div>
  );
}
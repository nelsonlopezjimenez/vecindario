import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const CAT_LABEL = {
  safety:'🚨 Seguridad', events:'📅 Eventos', marketplace:'🛍️ Mercado',
  services:'🔧 Servicios', lost_found:'🔍 Perdido/Encontrado',
  announcements:'📢 Anuncios', general:'💬 General',
};

export default function PostDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [post,    setPost]    = useState(null);
  const [upvoted, setUpvoted] = useState(false);
  const [count,   setCount]   = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/posts/${id}`).then((p) => {
      setPost(p);
      setCount(p.upvotes?.length ?? 0);
      if (user) setUpvoted(p.upvotes?.some((uid) => uid === user.id || uid?._id === user.id));
    }).finally(() => setLoading(false));
  }, [id]);

  const handleUpvote = async () => {
    try {
      const data = await api(`/posts/${id}/upvote`, { method: 'PUT' }, token);
      setUpvoted(data.voted);
      setCount(data.upvotes);
    } catch { /* show nothing */ }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Cargando…</p>;
  if (!post)   return <p style={{ color: '#dc2626' }}>Post no encontrado.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Link to="/posts" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>← Volver</Link>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--warm)', padding: '2px 10px', borderRadius: 20 }}>
            {CAT_LABEL[post.category]}
          </span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {post.neighborhood}, {post.city}</span>
          {post.resolved && <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>✓ Resuelto</span>}
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: 28, lineHeight: 1.25 }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 20px' }}>
          Por <strong>{post.author?.username}</strong> · {new Date(post.createdAt).toLocaleDateString('es-CO', { dateStyle: 'long' })}
        </p>

        <p style={{ lineHeight: 1.75, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{post.body}</p>

        <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={handleUpvote} disabled={!user}
            style={{
              background: upvoted ? '#dbeafe' : 'var(--warm)',
              border: upvoted ? '1.5px solid var(--blue)' : '1.5px solid var(--border)',
              borderRadius: 8, padding: '7px 18px', cursor: user ? 'pointer' : 'not-allowed',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>
            👍 {count}
          </button>
          {!user && <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            <Link to="/login">Entra</Link> para votar
          </span>}
        </div>
      </div>
    </div>
  );
}
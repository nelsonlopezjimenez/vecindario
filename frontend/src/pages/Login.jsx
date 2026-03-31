import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import ImagePassphrase from '../components/ImagePassphrase.jsx';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [step,   setStep]   = useState(1);
  const [email,  setEmail]  = useState('');
  const [images, setImages] = useState([]);
  const [error,  setError]  = useState('');
  const [busy,   setBusy]   = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api(`/auth/images/${encodeURIComponent(email)}`);
      setImages(data.images);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handlePassphrase = async (orderedIds) => {
    setBusy(true);
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, passphraseOrder: orderedIds }),
      });
      login(data.user, data.token);
      nav('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '2rem auto' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 20 }}>
        Entrar
      </h2>

      {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}

      {step === 1 && (
        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Tu correo electrónico" value={email}
            onChange={(e) => setEmail(e.target.value)} style={IS} />
          <button type="submit" disabled={busy} style={BS}>
            {busy ? 'Cargando…' : 'Ver mis imágenes →'}
          </button>
          <p style={{ fontSize: 13, textAlign: 'center', color: 'var(--muted)' }}>
            ¿Sin cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <div>
          <p style={{ color: 'var(--text)', marginBottom: 16 }}>
            <strong>Reproduce tu contraseña visual.</strong><br />
            Selecciona las imágenes en el mismo orden que elegiste al registrarte.
          </p>
          <ImagePassphrase images={images} onComplete={handlePassphrase} label="Ingresa tu secuencia" />
          {busy && <p style={{ marginTop: 12, color: 'var(--muted)' }}>Verificando…</p>}
          <button onClick={() => { setStep(1); setError(''); }} style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Cambiar correo
          </button>
        </div>
      )}
    </div>
  );
}

const IS = { padding: '0.65rem 0.8rem', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 15, outline: 'none' };
const BS = { background: 'var(--blue)', color: '#fff', padding: '0.7rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15 };
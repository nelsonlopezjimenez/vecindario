import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import ImagePassphrase from '../components/ImagePassphrase.jsx';

const F = { username: 'Usuario', email: 'Correo electrónico', neighborhood: 'Barrio', city: 'Ciudad' };

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [step,   setStep]   = useState(1);
  const [form,   setForm]   = useState({ username: '', email: '', neighborhood: '', city: '' });
  const [images, setImages] = useState([]);
  const [error,  setError]  = useState('');
  const [busy,   setBusy]   = useState(false);

  useEffect(() => {
    api('/auth/images/new').then((d) => setImages(d.images)).catch(() => {});
  }, []);

  const handleFormNext = (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) {
      setError('Todos los campos son requeridos'); return;
    }
    setError(''); setStep(2);
  };

  const handlePassphrase = async (orderedIds) => {
    setBusy(true);
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...form, passphraseOrder: orderedIds }),
      });
      login(data.user, data.token);
      nav('/');
    } catch (err) {
      setError(err.message);
      setStep(2);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '2rem auto' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 20 }}>
        Crear cuenta
      </h2>

      {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}

      {step === 1 && (
        <form onSubmit={handleFormNext} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(F).map(([key, label]) => (
            <input key={key} placeholder={label} value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              type={key === 'email' ? 'email' : 'text'}
              style={IS} />
          ))}
          <button type="submit" style={BS}>Siguiente →</button>
          <p style={{ fontSize: 13, textAlign: 'center', color: 'var(--muted)' }}>
            ¿Ya tienes cuenta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <div>
          <p style={{ color: 'var(--text)', marginBottom: 16 }}>
            <strong>Crea tu contraseña visual.</strong><br />
            Elige las {images.length} imágenes en el orden que quieras recordar.
            Ese orden es tu contraseña — nadie más lo sabrá.
          </p>
          {images.length > 0
            ? <ImagePassphrase images={images} onComplete={handlePassphrase} />
            : <p>Cargando imágenes…</p>
          }
          {busy && <p style={{ marginTop: 12, color: 'var(--muted)' }}>Registrando…</p>}
        </div>
      )}
    </div>
  );
}

const IS = { padding: '0.65rem 0.8rem', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 15, outline: 'none' };
const BS = { background: 'var(--blue)', color: '#fff', padding: '0.7rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15 };
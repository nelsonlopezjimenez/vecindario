import { useState } from 'react';

// Emoji fallbacks — replace with actual /images/N.png via <img> if you have files
const EMOJI = {
  1:'🏠', 2:'🌳', 3:'☀️', 4:'🌙', 5:'🐶',
  6:'🐱', 7:'🔑', 8:'🚪', 9:'🌸', 10:'⛰️',
  11:'🌊', 12:'🚗', 13:'🚲', 14:'📚', 15:'⭐',
  16:'🕊️', 17:'🦋', 18:'🐟', 19:'👶', 20:'☁️',
};

/**
 * props:
 *   images     [{id, name}]           — images to display
 *   onComplete (orderedIds: number[]) — called when all images selected
 *   label      string                 — instruction text
 */
export default function ImagePassphrase({ images, onComplete, label }) {
  const [selected, setSelected] = useState([]); // ordered array of ids

  const handleClick = (img) => {
    if (selected.includes(img.id)) {
      setSelected(selected.filter((id) => id !== img.id));
      return;
    }
    const next = [...selected, img.id];
    setSelected(next);
    if (next.length === images.length) onComplete(next);
  };

  const rank = (id) => {
    const i = selected.indexOf(id);
    return i === -1 ? null : i + 1;
  };

  return (
    <div>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>
        {label || 'Selecciona las imágenes en tu orden secreto'}
      </p>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        {selected.length}/{images.length} seleccionadas
        {selected.length === images.length && ' ✓ Completo'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {images.map((img) => {
          const r = rank(img.id);
          return (
            <div key={img.id} onClick={() => handleClick(img)}
              style={{
                position: 'relative', textAlign: 'center',
                border: r ? '2.5px solid var(--blue)' : '1.5px solid var(--border)',
                borderRadius: 12, padding: '1rem 0.5rem',
                background: r ? '#eff6ff' : '#fff',
                cursor: 'pointer', userSelect: 'none',
                transition: 'all 0.15s',
                boxShadow: r ? '0 2px 8px rgba(37,99,235,0.15)' : 'none',
              }}>
              {r && (
                <span style={{
                  position: 'absolute', top: 6, right: 8,
                  background: 'var(--blue)', color: '#fff',
                  borderRadius: '50%', width: 22, height: 22,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>{r}</span>
              )}
              <div style={{ fontSize: 38 }}>{EMOJI[img.id] || '🖼️'}</div>
              <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text)', fontWeight: 500 }}>
                {img.name}
              </div>
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <button onClick={() => setSelected([])}
          style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ↺ Reiniciar
        </button>
      )}
    </div>
  );
}
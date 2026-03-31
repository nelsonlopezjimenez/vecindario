// 20 named images — emoji are used in the UI as fallback.
// Place actual image files in frontend/public/images/1.png … 20.png
export const IMAGE_POOL = [
  { id: 1,  name: 'Casa' },
  { id: 2,  name: 'Árbol' },
  { id: 3,  name: 'Sol' },
  { id: 4,  name: 'Luna' },
  { id: 5,  name: 'Perro' },
  { id: 6,  name: 'Gato' },
  { id: 7,  name: 'Llave' },
  { id: 8,  name: 'Puerta' },
  { id: 9,  name: 'Flor' },
  { id: 10, name: 'Montaña' },
  { id: 11, name: 'Río' },
  { id: 12, name: 'Carro' },
  { id: 13, name: 'Bicicleta' },
  { id: 14, name: 'Libro' },
  { id: 15, name: 'Estrella' },
  { id: 16, name: 'Paloma' },
  { id: 17, name: 'Mariposa' },
  { id: 18, name: 'Pez' },
  { id: 19, name: 'Niño' },
  { id: 20, name: 'Nube' },
];

export const getRandomImageSubset = (count = 6) =>
  [...IMAGE_POOL].sort(() => Math.random() - 0.5).slice(0, count);
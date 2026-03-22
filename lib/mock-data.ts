export interface User {
  username: string;
  name: string;
}

export const users: User[] = [
  { username: "anagarcia", name: "Ana García" },
  { username: "carlosruiz", name: "Carlos Ruiz" },
  { username: "luciafernandez", name: "Lucía Fernández" },
  { username: "mateolopez", name: "Mateo López" },
  { username: "valentinatorres", name: "Valentina Torres" },
  { username: "sebastianmora", name: "Sebastián Mora" },
  { username: "isabelladiaz", name: "Isabella Díaz" },
  { username: "diegoherrera", name: "Diego Herrera" },
  { username: "camilarojas", name: "Camila Rojas" },
  { username: "andresvargas", name: "Andrés Vargas" },
  { username: "sofiacastro", name: "Sofía Castro" },
  { username: "nicolasmendoza", name: "Nicolás Mendoza" },
  { username: "mariajosepena", name: "María José Peña" },
  { username: "tomasaguilar", name: "Tomás Aguilar" },
  { username: "renatasilva", name: "Renata Silva" },
  { username: "joaquinreyes", name: "Joaquín Reyes" },
];

export interface Photo {
  id: number;
  picsumId: number;
  title: string;
  description: string;
  photographer: string;
  username: string;
  width: number;
  height: number;
  date: string;
}

export const photos: Photo[] = [
  { id: 1, picsumId: 10, title: "Bosque de niebla", description: "Amanecer entre los árboles cubiertos de bruma en la sierra norte", photographer: "Ana García", username: "anagarcia", width: 600, height: 800, date: "2024-03-15" },
  { id: 2, picsumId: 17, title: "Costa atlántica", description: "Olas rompiendo contra las rocas en la costa patagónica", photographer: "Carlos Ruiz", username: "carlosruiz", width: 800, height: 533, date: "2024-02-28" },
  { id: 3, picsumId: 14, title: "Montañas del sur", description: "Picos nevados reflejados en un lago de aguas cristalinas", photographer: "Lucía Fernández", username: "luciafernandez", width: 600, height: 900, date: "2024-01-10" },
  { id: 4, picsumId: 15, title: "Tarde de trabajo", description: "Escritorio iluminado por la luz natural de la ventana", photographer: "Mateo López", username: "mateolopez", width: 800, height: 450, date: "2024-03-01" },
  { id: 5, picsumId: 18, title: "Camino rural", description: "Sendero de tierra entre campos verdes al atardecer", photographer: "Valentina Torres", username: "valentinatorres", width: 800, height: 600, date: "2024-02-14" },
  { id: 6, picsumId: 19, title: "Girasol", description: "Un girasol solitario bañado por la luz del mediodía", photographer: "Sebastián Mora", username: "sebastianmora", width: 600, height: 600, date: "2024-01-20" },
  { id: 7, picsumId: 20, title: "Pausa", description: "Momento de calma capturado en una tarde de otoño", photographer: "Isabella Díaz", username: "isabelladiaz", width: 800, height: 533, date: "2024-03-05" },
  { id: 8, picsumId: 22, title: "La cámara", description: "Detalle de una cámara analógica sobre una mesa de madera", photographer: "Diego Herrera", username: "diegoherrera", width: 600, height: 800, date: "2024-02-10" },
  { id: 9, picsumId: 24, title: "Biblioteca", description: "Estantes repletos de libros en una biblioteca antigua", photographer: "Camila Rojas", username: "camilarojas", width: 800, height: 533, date: "2024-01-15" },
  { id: 10, picsumId: 27, title: "Rocas y mar", description: "Formaciones rocosas erosionadas por el oleaje constante", photographer: "Andrés Vargas", username: "andresvargas", width: 600, height: 900, date: "2024-03-12" },
  { id: 11, picsumId: 28, title: "Valle lejano", description: "Vista panorámica de un valle cubierto de vegetación", photographer: "Sofía Castro", username: "sofiacastro", width: 800, height: 450, date: "2024-02-22" },
  { id: 12, picsumId: 29, title: "Fogata", description: "Brasas encendidas en una noche de campo bajo las estrellas", photographer: "Nicolás Mendoza", username: "nicolasmendoza", width: 600, height: 600, date: "2024-01-28" },
  { id: 13, picsumId: 36, title: "Profundidad", description: "Aguas oscuras y tranquilas en un lago de montaña", photographer: "María José Peña", username: "mariajosepena", width: 600, height: 800, date: "2024-03-08" },
  { id: 14, picsumId: 37, title: "Calle vacía", description: "Una calle desierta en las primeras horas de la mañana", photographer: "Tomás Aguilar", username: "tomasaguilar", width: 800, height: 600, date: "2024-02-05" },
  { id: 15, picsumId: 39, title: "Verde intenso", description: "Hojas brillantes después de la lluvia en un jardín tropical", photographer: "Renata Silva", username: "renatasilva", width: 600, height: 800, date: "2024-01-22" },
  { id: 16, picsumId: 42, title: "Horizonte urbano", description: "Silueta de edificios recortada contra el cielo del atardecer", photographer: "Joaquín Reyes", username: "joaquinreyes", width: 800, height: 533, date: "2024-03-18" },
];

export function getPhotoUrl(photo: Photo): string {
  return `https://picsum.photos/id/${photo.picsumId}/${photo.width}/${photo.height}`;
}

export function getPhotoById(id: number): Photo | undefined {
  return photos.find((p) => p.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username === username);
}

export function getPhotosByUsername(username: string): Photo[] {
  return photos.filter((p) => p.username === username);
}

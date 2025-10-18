import { db } from '@/lib/db';

const defaultTypes = [
  {
    name: 'Netflix',
    description: 'Streaming de películas y series',
    icon: '🎬',
    color: '#E50914'
  },
  {
    name: 'Disney+',
    description: 'Contenido Disney, Pixar, Marvel, Star Wars',
    icon: '🏰',
    color: '#113CCF'
  },
  {
    name: 'HBO Max',
    description: 'Series HBO, películas Warner Bros',
    icon: '🎭',
    color: '#B535F6'
  },
  {
    name: 'Amazon Prime',
    description: 'Streaming de Amazon con contenido variado',
    icon: '📦',
    color: '#00A8E1'
  },
  {
    name: 'Paramount+',
    description: 'Contenido Paramount, CBS, Nickelodeon',
    icon: '⭐',
    color: '#0064FF'
  },
  {
    name: 'Apple TV+',
    description: 'Contenido original de Apple',
    icon: '🍎',
    color: '#000000'
  },
  {
    name: 'Star+',
    description: 'Contenido deportivo y entretenimiento',
    icon: '⚡',
    color: '#0063E5'
  }
];

export async function seedStreamingTypes() {
  try {
    for (const type of defaultTypes) {
      await db.streamingType.upsert({
        where: { name: type.name },
        update: type,
        create: type
      });
    }
    console.log('Tipos de streaming inicializados correctamente');
  } catch (error) {
    console.error('Error al inicializar tipos de streaming:', error);
  }
}
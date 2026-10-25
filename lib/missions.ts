export type MissionStatus = 'locked' | 'available' | 'completed'

export const SPECIALTIES = [
  'Maquinista',
  'Electricista',
  'Electrónico',
  'Naval',
  'Logístico',
] as const

export const DISCIPLINES = [
  'Ciencias',
  'Tecnología',
  'Ingeniería',
  'Matemática',
  'Humanidades y Artes',
] as const

export type Specialty = (typeof SPECIALTIES)[number]
export type Discipline = (typeof DISCIPLINES)[number]

/** Colores tomados de los cuadrantes del escudo de la academia. */
export const DISCIPLINE_META: Record<Discipline, { letter: string; color: string }> = {
  Ciencias: { letter: 'S', color: '#14b4f0' },
  Tecnología: { letter: 'T', color: '#22a34a' },
  Ingeniería: { letter: 'E', color: '#d6339a' },
  Matemática: { letter: 'M', color: '#e2d23c' },
  'Humanidades y Artes': { letter: 'A', color: '#d9942f' },
}

export type Mission = {
  id: string
  code: string
  title: string
  node: string
  image: string
  /** Ruta a un MP4/WebM en /public/videos. Si falta, la hero anima la imagen. */
  video?: string
  status: MissionStatus
  progress?: number
  specialty?: Specialty
  discipline?: Discipline
}

const IMAGES = [
  '/images/m-torpedo.png',
  '/images/m-control.png',
  '/images/m-engine.png',
  '/images/m-sonar.png',
  '/images/m-periscope.png',
  '/images/m-hull.png',
]

const NODES = [
  'USS Pampanito',
  'USS Bowfin',
  'USS Cod',
  'HMS Alliance',
  'U-995',
  'ARA Santa Fe',
]

const ACERO_STATUS: MissionStatus[] = [
  'completed',
  'completed',
  'completed',
  'available',
  'locked',
  'locked',
]

export const aceroMissions: Mission[] = ACERO_STATUS.map((status, i) => ({
  id: `acero-${i + 1}`,
  code: `AC-${String(i + 1).padStart(2, '0')}`,
  title: `Misión ${i + 1}`,
  node: NODES[i],
  image: IMAGES[i],
  status,
  progress: status === 'available' ? 38 : undefined,
}))

export const featuredMission = aceroMissions[3]

const COBRE_COMPLETED = new Set([0, 1, 6, 7, 12])
const COBRE_AVAILABLE = new Set([2, 5, 8, 11, 13, 18])

export const cobreMissions: Mission[] = SPECIALTIES.flatMap((specialty, row) =>
  DISCIPLINES.map((discipline, col) => {
    const index = row * DISCIPLINES.length + col
    const status: MissionStatus = COBRE_COMPLETED.has(index)
      ? 'completed'
      : COBRE_AVAILABLE.has(index)
        ? 'available'
        : 'locked'
    return {
      id: `cobre-${index + 1}`,
      code: `CU-${String.fromCharCode(65 + row)}${col + 1}`,
      title: `Misión ${index + 1}`,
      node: NODES[(index + row) % NODES.length],
      image: IMAGES[(index + col) % IMAGES.length],
      status,
      specialty,
      discipline,
    }
  }),
)

export const allMissions = [...aceroMissions, ...cobreMissions]

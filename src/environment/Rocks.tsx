import { AutoModel } from '../AutoModel'

interface ItemDef {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  targetSize: number
}

// Периметр арени: скелі та стіни. Фронт (+z) відкритий як вхід.
const PERIMETER: ItemDef[] = [
  // задня дуга
  { url: '/models/imported/rock-large.glb', position: [-9, 0, -9], rotation: [0, 0.3, 0], targetSize: 5 },
  { url: '/models/imported/rock-medium-2.glb', position: [-6, 0, -9.8], rotation: [0, 1.2, 0], targetSize: 4.5 },
  { url: '/models/imported/rock-large.glb', position: [-3, 0, -10], rotation: [0, 2.1, 0], targetSize: 5 },
  { url: '/models/imported/rock-medium.glb', position: [3, 0, -10], rotation: [0, 3, 0], targetSize: 4.5 },
  { url: '/models/imported/rock-large.glb', position: [6, 0, -9.8], rotation: [0, 0.9, 0], targetSize: 5 },
  { url: '/models/imported/rock-medium-2.glb', position: [9, 0, -9], rotation: [0, 1.6, 0], targetSize: 4.5 },
  // ліва стіна
  { url: '/models/imported/stone-wall.glb', position: [-10, 0, -5], rotation: [0, Math.PI / 2, 0], targetSize: 4 },
  { url: '/models/imported/stone-wall.glb', position: [-10, 0, -1], rotation: [0, Math.PI / 2, 0], targetSize: 4 },
  { url: '/models/imported/rock-large.glb', position: [-9.8, 0, 3], rotation: [0, 2.6, 0], targetSize: 4.5 },
  { url: '/models/imported/rock-medium.glb', position: [-9.5, 0, 7], rotation: [0, 3.4, 0], targetSize: 4 },
  // права стіна
  { url: '/models/imported/stone-wall.glb', position: [10, 0, -5], rotation: [0, -Math.PI / 2, 0], targetSize: 4 },
  { url: '/models/imported/stone-wall.glb', position: [10, 0, -1], rotation: [0, -Math.PI / 2, 0], targetSize: 4 },
  { url: '/models/imported/rock-large.glb', position: [9.8, 0, 3], rotation: [0, 0.6, 0], targetSize: 4.5 },
  { url: '/models/imported/rock-medium.glb', position: [9.5, 0, 7], rotation: [0, 1.8, 0], targetSize: 4 },
]

// Кути-«ворота» входу
const CORNERS: ItemDef[] = [
  { url: '/models/imported/rock-large.glb', position: [8.5, 0, 8.5], rotation: [0, 0.6, 0], targetSize: 3.5 },
  { url: '/models/imported/rock-large.glb', position: [-8.5, 0, 8.5], rotation: [0, 2.2, 0], targetSize: 3.5 },
]

interface DuneDef {
  position: [number, number, number]
  scale: [number, number, number]
}

const DUNES: DuneDef[] = [
  { position: [-4, -0.1, 5], scale: [3, 0.7, 2] },
  { position: [4, -0.1, 6.5], scale: [2.5, 0.6, 2.2] },
  { position: [-5, -0.1, -6], scale: [3.5, 0.7, 2.4] },
  { position: [5, -0.1, -5.5], scale: [2.8, 0.6, 2.2] },
  { position: [0, -0.1, -7], scale: [4, 0.6, 2] },
]

function SandDune({ position, scale }: DuneDef) {
  return (
    <mesh position={position} scale={scale} receiveShadow>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color="#43545f" roughness={1} />
    </mesh>
  )
}

/** Периметр арени, кути входу та піщані дюни. */
export function Rocks() {
  return (
    <group>
      {PERIMETER.map((r, i) => (
        <group key={`p${i}`} position={r.position} rotation={r.rotation}>
          <AutoModel url={r.url} targetSize={r.targetSize} />
        </group>
      ))}
      {CORNERS.map((r, i) => (
        <group key={`c${i}`} position={r.position} rotation={r.rotation}>
          <AutoModel url={r.url} targetSize={r.targetSize} />
        </group>
      ))}
      {DUNES.map((d, i) => (
        <SandDune key={`d${i}`} {...d} />
      ))}
    </group>
  )
}

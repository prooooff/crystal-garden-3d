import { AutoModel } from '../AutoModel'

interface RockDef {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  targetSize: number
}

const ROCKS: RockDef[] = [
  { url: '/models/imported/rock-large.glb', position: [7.5, 0, -3.5], rotation: [0, 0.4, 0], targetSize: 2.2 },
  { url: '/models/imported/rock-medium.glb', position: [-7.5, 0, -2], rotation: [0, 1.2, 0], targetSize: 1.8 },
  { url: '/models/imported/rock-medium-2.glb', position: [9, 0, 2.5], rotation: [0, 2.1, 0], targetSize: 2.4 },
  { url: '/models/imported/rock-large.glb', position: [-9, 0, 3], rotation: [0, 3, 0], targetSize: 2 },
  { url: '/models/imported/rock-medium.glb', position: [3, 0, 8], rotation: [0, 0.9, 0], targetSize: 1.6 },
  { url: '/models/imported/rock-medium-2.glb', position: [-3.5, 0, -8], rotation: [0, 2.6, 0], targetSize: 2 },
  { url: '/models/imported/rock-medium.glb', position: [6.5, 0, 6], rotation: [0, 1.6, 0], targetSize: 1.5 },
  { url: '/models/imported/rock-large.glb', position: [-6.5, 0, 6.5], rotation: [0, 3.7, 0], targetSize: 1.9 },
]

/** Скелі (готові GLB-моделі), розкидані по дну. */
export function Rocks() {
  return (
    <group>
      {ROCKS.map((r, i) => (
        <group key={i} position={r.position} rotation={r.rotation}>
          <AutoModel url={r.url} targetSize={r.targetSize} />
        </group>
      ))}
    </group>
  )
}

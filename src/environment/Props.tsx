import { AutoModel } from '../AutoModel'

interface ItemDef {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  targetSize: number
}

const ITEMS: ItemDef[] = [
  { url: '/models/imported/chest-ocean.glb', position: [2.8, 0, -0.6], rotation: [0, -0.5, 0], targetSize: 1.1 },
  { url: '/models/imported/chest.glb', position: [-3.8, 0, -0.8], rotation: [0, 0.4, 0], targetSize: 0.9 },
  { url: '/models/imported/statue.glb', position: [3.6, 0, 3.4], rotation: [0, -0.7, 0], targetSize: 2.2 },
  { url: '/models/imported/column.glb', position: [-6.8, 0, -6], rotation: [0, 0.1, 0], targetSize: 2.6 },
  { url: '/models/imported/column.glb', position: [7.2, 0, -6.8], rotation: [0, 0.2, 0], targetSize: 2.2 },
  { url: '/models/imported/column.glb', position: [-8.5, 0, 2], rotation: [0, 1.5, 0], targetSize: 2.0 },
  { url: '/models/imported/nautilus.glb', position: [1.6, 0, 1.8], rotation: [0, 1.2, 0], targetSize: 0.6 },
  { url: '/models/imported/starfish.glb', position: [-2.2, 0, -4.2], rotation: [-Math.PI / 2, 0, 0], targetSize: 0.8 },
  { url: '/models/imported/seashell.glb', position: [4.2, 0, -5.5], rotation: [0, 0.6, 0], targetSize: 0.7 },
]

/** Реквізит і руїни: скрині, статуя, колони, черепашки (готові GLB-моделі). */
export function Props() {
  return (
    <group>
      {ITEMS.map((it, i) => (
        <group key={i} position={it.position} rotation={it.rotation}>
          <AutoModel url={it.url} targetSize={it.targetSize} />
        </group>
      ))}
    </group>
  )
}

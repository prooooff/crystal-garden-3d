import { AutoModel } from '../AutoModel'

interface ItemDef {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  targetSize: number
}

const ITEMS: ItemDef[] = [
  { url: '/models/imported/chest-ocean.glb', position: [3, 0, 2], rotation: [0, -0.5, 0], targetSize: 1.1 },
  { url: '/models/imported/statue.glb', position: [-3.5, 0, 2.5], rotation: [0, -0.7, 0], targetSize: 2.2 },
  { url: '/models/imported/nautilus.glb', position: [5, 0, 6], rotation: [0, 1.2, 0], targetSize: 0.6 },
  { url: '/models/imported/starfish.glb', position: [-5, 0, -5], rotation: [-Math.PI / 2, 0, 0], targetSize: 0.8 },
  { url: '/models/imported/seashell.glb', position: [6.5, 0, 3], rotation: [0, 0.6, 0], targetSize: 0.7 },
]

/** Невеликий реквізит: скриня, статуя, черепашки (акцентно, без нагромадження). */
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

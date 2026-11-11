import { AutoModel } from '../AutoModel'

interface ItemDef {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  targetSize: number
}

const ITEMS: ItemDef[] = [
  // головний зруйнований храм
  { url: '/models/imported/ruined-temple.glb', position: [0, 0, 0], rotation: [0, 0, 0], targetSize: 7 },
  // другий храм на задньому плані
  { url: '/models/imported/greek-temple.glb', position: [-9, 0, -6], rotation: [0, 0.6, 0], targetSize: 5.5 },
  // колони-рамка перед храмом
  { url: '/models/imported/doric-column.glb', position: [-5, 0, 4], rotation: [0, 0, 0], targetSize: 3.2 },
  { url: '/models/imported/doric-column.glb', position: [5, 0, 4], rotation: [0, 0, 0], targetSize: 3.2 },
  { url: '/models/imported/column-wide.glb', position: [-4.5, 0, -3], rotation: [0, 0.4, 0], targetSize: 2.8 },
  // арка позаду
  { url: '/models/imported/arch.glb', position: [0, 0, -7], rotation: [0, 0, 0], targetSize: 4.5 },
  // фрагменти стін
  { url: '/models/imported/stone-wall.glb', position: [-6.5, 0, 2], rotation: [0, 1.2, 0], targetSize: 2.4 },
  { url: '/models/imported/stone-wall.glb', position: [6.5, 0, 2], rotation: [0, -1.2, 0], targetSize: 2.4 },
  // впалі уламки колон
  { url: '/models/imported/broken-pillar.glb', position: [4.8, 0, -1.5], rotation: [0, 0, 1.4], targetSize: 2.2 },
  { url: '/models/imported/broken-pillar.glb', position: [-4.8, 0, 0.8], rotation: [0, 0, -1.3], targetSize: 2.0 },
  // окрема руїна справа
  { url: '/models/imported/ruin.glb', position: [8, 0, 4], rotation: [0, 2.4, 0], targetSize: 3 },
]

/** Руїни храму: головна споруда, колони, арка, стіни та уламки. */
export function Ruins() {
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

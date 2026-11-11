import { AutoModel } from '../AutoModel'

interface ItemDef {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  targetSize: number
}

// Алея з колон — ширше і далі від храму, щоб не накладалось
function makeAvenue(): ItemDef[] {
  const cols: ItemDef[] = []
  const zs = [4.5, 7, 9.5]
  for (const z of zs) {
    cols.push({ url: '/models/imported/doric-column.glb', position: [-5.5, 0, z], rotation: [0, 0, 0], targetSize: 2.8 })
    cols.push({ url: '/models/imported/doric-column.glb', position: [5.5, 0, z], rotation: [0, 0, 0], targetSize: 2.8 })
  }
  return cols
}

const TEMPLE: ItemDef = { url: '/models/imported/ruined-temple.glb', position: [0, 0, 0], rotation: [0, 0, 0], targetSize: 6 }

const SIDE: ItemDef[] = [
  { url: '/models/imported/greek-temple.glb', position: [-8, 0, -5.5], rotation: [0, 0.6, 0], targetSize: 4 },
  { url: '/models/imported/arch.glb', position: [8, 0, -5.5], rotation: [0, -0.6, 0], targetSize: 3.5 },
  { url: '/models/imported/ruin.glb', position: [7.5, 0, 5], rotation: [0, 2.2, 0], targetSize: 2.5 },
  { url: '/models/imported/column-wide.glb', position: [-7.5, 0, 5], rotation: [0, 0.5, 0], targetSize: 2.5 },
]

// Уламки — по боках, подалі від центру
const DEBRIS: ItemDef[] = [
  { url: '/models/imported/broken-pillar.glb', position: [6.8, 0, 1], rotation: [0, 0, 1.5], targetSize: 2 },
  { url: '/models/imported/broken-pillar.glb', position: [-6.8, 0, 1], rotation: [0, 0, -1.5], targetSize: 2 },
  { url: '/models/imported/doric-column.glb', position: [4.5, 0, -4.5], rotation: [0, 0, 1.5], targetSize: 3 },
  { url: '/models/imported/doric-column.glb', position: [-4.5, 0, -4.5], rotation: [0, 0, -1.5], targetSize: 3 },
]

/** Композиція руїн: храм у центрі, алея колон, бічні споруди та уламки. */
export function Ruins() {
  const items: ItemDef[] = [TEMPLE, ...makeAvenue(), ...SIDE, ...DEBRIS]

  return (
    <group>
      {items.map((it, i) => (
        <group key={i} position={it.position} rotation={it.rotation}>
          <AutoModel url={it.url} targetSize={it.targetSize} />
        </group>
      ))}
    </group>
  )
}

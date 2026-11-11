import { GlowCrystal } from './GlowCrystal'

interface CrystalDef {
  position: [number, number, number]
  color1: string
  color2: string
  scale: number
  speed: number
}

const CRYSTALS: CrystalDef[] = [
  { position: [-4, 1.6, -2.5], color1: '#a78bfa', color2: '#22d3ee', scale: 0.9, speed: 1.1 },
  { position: [4, 1.4, -2.8], color1: '#f472b6', color2: '#a78bfa', scale: 0.75, speed: 0.9 },
  { position: [-5, 2.2, 1.8], color1: '#22d3ee', color2: '#34d399', scale: 0.6, speed: 1.3 },
  { position: [5.5, 2.0, 1.5], color1: '#fbbf24', color2: '#f472b6', scale: 0.55, speed: 1.0 },
  { position: [0, 2.8, -5.5], color1: '#34d399', color2: '#22d3ee', scale: 0.7, speed: 1.2 },
  { position: [3, 3.0, 4.2], color1: '#a78bfa', color2: '#f472b6', scale: 0.5, speed: 1.4 },
]

/** Набір плаваючих неонових кристалів (декоративна група). */
export function Crystals() {
  return (
    <group>
      {CRYSTALS.map((c, i) => (
        <GlowCrystal key={i} {...c} />
      ))}
    </group>
  )
}

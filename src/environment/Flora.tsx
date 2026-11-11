import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mulberry32 } from './rng'

interface Branch {
  pos: [number, number, number]
  rot: [number, number, number]
  r1: number
  r2: number
  h: number
}

/** Процедурна гілляста коралова колонія. */
function makeCoral(seed: number): Branch[] {
  const rand = mulberry32(seed)
  const parts: Branch[] = []
  const trunkH = 0.7 + rand() * 0.8
  parts.push({ pos: [0, trunkH / 2, 0], rot: [0, 0, 0], r1: 0.16, r2: 0.1, h: trunkH })

  const n = 6 + Math.floor(rand() * 5)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand() * 0.7
    const r = 0.18 + rand() * 0.22
    const y = trunkH * (0.4 + rand() * 0.55)
    const h = 0.3 + rand() * 0.6
    const tilt = 0.25 + rand() * 0.4
    parts.push({
      pos: [Math.cos(a) * r, y, Math.sin(a) * r],
      rot: [Math.sin(a) * tilt, 0, -Math.cos(a) * tilt],
      r1: 0.04 + rand() * 0.05,
      r2: 0.05 + rand() * 0.05,
      h,
    })
  }
  return parts
}

interface CoralProps {
  seed: number
  color: string
  position: [number, number, number]
  scale: number
}

function Coral({ seed, color, position, scale }: CoralProps) {
  const parts = useMemo(() => makeCoral(seed), [seed])
  return (
    <group position={position} scale={scale}>
      {parts.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot} receiveShadow>
          <cylinderGeometry args={[p.r1, p.r2, p.h, 7]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      ))}
    </group>
  )
}

interface AnemoneProps {
  seed: number
  color: string
  position: [number, number, number]
  scale: number
}

function Anemone({ seed, color, position, scale }: AnemoneProps) {
  const rand = useMemo(() => mulberry32(seed), [seed])
  const tentacles = useMemo(() => {
    const n = 10
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2
      return { a, tilt: 0.3 + rand() * 0.4, len: 0.5 + rand() * 0.3 }
    })
  }, [rand])

  return (
    <group position={position} scale={scale}>
      <mesh receiveShadow>
        <cylinderGeometry args={[0.35, 0.5, 0.3, 10]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {tentacles.map((t, i) => (
        <mesh
          key={i}
          position={[Math.cos(t.a) * 0.25, 0.25, Math.sin(t.a) * 0.25]}
          rotation={[Math.cos(t.a) * t.tilt, 0, -Math.sin(t.a) * t.tilt]}
        >
          <cylinderGeometry args={[0.03, 0.02, t.len, 5]} />
          <meshStandardMaterial color={color} roughness={0.6} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  )
}

interface SeagrassProps {
  seed: number
  color: string
  position: [number, number, number]
  count?: number
  spread?: number
}

/** Пучок морської трави, що хитається. */
function Seagrass({ seed, color, position, count = 26, spread = 1.4 }: SeagrassProps) {
  const rand = useMemo(() => mulberry32(seed), [seed])
  const blades = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (rand() - 0.5) * spread * 2,
        z: (rand() - 0.5) * spread * 2,
        h: 0.5 + rand() * 0.9,
        tilt: (rand() - 0.5) * 0.5,
      })),
    [rand, count, spread],
  )

  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.rotation.z = Math.sin(t * 0.8 + seed) * 0.06
  })

  return (
    <group ref={group} position={position}>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[b.tilt, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.03, b.h, 4]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

interface KelpProps {
  seed: number
  color: string
  position: [number, number, number]
  height?: number
}

/** Висока ламінарія, що колишеться. */
function Kelp({ seed, color, position, height = 4 }: KelpProps) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.rotation.z = Math.sin(t * 0.5 + seed) * 0.08
  })

  return (
    <group ref={group} position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 0.25, height / 2 - i * 0.3, 0]} rotation={[0, 0, (i - 1) * 0.15]}>
          <cylinderGeometry args={[0.06, 0.1, height - i * 0.4, 6]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

const CORALS: CoralProps[] = [
  { seed: 101, color: '#e2725b', position: [4.5, 0.1, 4.5], scale: 1.3 },
  { seed: 102, color: '#c86f9d', position: [-4, 0.1, 5], scale: 1.1 },
  { seed: 103, color: '#e8a24b', position: [6, 0.1, -4], scale: 1.5 },
  { seed: 104, color: '#7fd8d2', position: [-6.5, 0.1, -4.5], scale: 1.2 },
  { seed: 105, color: '#e2725b', position: [2.5, 0.1, -6.5], scale: 1.0 },
  { seed: 106, color: '#c86f9d', position: [-2.5, 0.1, 6.5], scale: 1.4 },
  { seed: 107, color: '#e8a24b', position: [8, 0.1, 5.5], scale: 0.9 },
  { seed: 108, color: '#7fd8d2', position: [-8, 0.1, 5], scale: 1.1 },
]

const ANEMONES: AnemoneProps[] = [
  { seed: 201, color: '#e88fb0', position: [3.8, 0.12, -2.2], scale: 1 },
  { seed: 202, color: '#b78fe8', position: [-3.5, 0.12, 2.8], scale: 1.1 },
  { seed: 203, color: '#8fd0e8', position: [5.5, 0.12, 1.5], scale: 0.9 },
  { seed: 204, color: '#e8b08f', position: [-5, 0.12, -2.8], scale: 1 },
  { seed: 205, color: '#8fe8a8', position: [0.5, 0.12, -4.5], scale: 1.2 },
]

const SEAGRASS: SeagrassProps[] = [
  { seed: 301, color: '#3f8a5f', position: [5, 0, -1] },
  { seed: 302, color: '#4c9a6b', position: [-5, 0, -3.5] },
  { seed: 303, color: '#357a52', position: [3, 0, 3] },
  { seed: 304, color: '#4c9a6b', position: [-3, 0, -5] },
  { seed: 305, color: '#3f8a5f', position: [7, 0, -5.5] },
  { seed: 306, color: '#357a52', position: [-7, 0, 4.5] },
]

const KELPS: KelpProps[] = [
  { seed: 401, color: '#2f6b4f', position: [9, 0, 8], height: 4.5 },
  { seed: 402, color: '#357a52', position: [-9.5, 0, -7], height: 5 },
  { seed: 403, color: '#2f6b4f', position: [-8, 0, 8.5], height: 4 },
  { seed: 404, color: '#3f8a5f', position: [8.5, 0, -8], height: 4.8 },
]

/** Корали, анемони, морська трава та ламінарія. */
export function Flora() {
  return (
    <group>
      {CORALS.map((c, i) => (
        <Coral key={i} {...c} />
      ))}
      {ANEMONES.map((a, i) => (
        <Anemone key={i} {...a} />
      ))}
      {SEAGRASS.map((s, i) => (
        <Seagrass key={i} {...s} />
      ))}
      {KELPS.map((k, i) => (
        <Kelp key={i} {...k} />
      ))}
    </group>
  )
}

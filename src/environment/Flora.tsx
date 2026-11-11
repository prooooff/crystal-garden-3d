import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AutoModel } from '../AutoModel'

interface ItemDef {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  targetSize: number
}

const CORALS: ItemDef[] = [
  { url: '/models/imported/coral-orange.glb', position: [4.5, 0, 6], rotation: [0, 0.3, 0], targetSize: 1.6 },
  { url: '/models/imported/coral.glb', position: [-4, 0, 6.5], rotation: [0, 1.5, 0], targetSize: 1.4 },
  { url: '/models/imported/coral-2.glb', position: [8, 0, -5], rotation: [0, 2.4, 0], targetSize: 1.8 },
  { url: '/models/imported/coral-orange.glb', position: [-8, 0, -4.5], rotation: [0, 0.8, 0], targetSize: 1.3 },
  { url: '/models/imported/coral.glb', position: [2, 0, 8.5], rotation: [0, 3.1, 0], targetSize: 1.5 },
  { url: '/models/imported/coral-2.glb', position: [-2, 0, 8.5], rotation: [0, 0.4, 0], targetSize: 1.4 },
  { url: '/models/imported/coral-orange.glb', position: [0, 0, 9.5], rotation: [0, 1.8, 0], targetSize: 1.2 },
]

const ANEMONES: ItemDef[] = [
  { url: '/models/imported/anemone.glb', position: [6, 0, 2.5], rotation: [0, 0, 0], targetSize: 1.2 },
  { url: '/models/imported/anemone.glb', position: [-6, 0, -2.5], rotation: [0, 1.8, 0], targetSize: 1.3 },
  { url: '/models/imported/anemone.glb', position: [0, 0, -6], rotation: [0, 0.6, 0], targetSize: 1.1 },
]

const KELPS: ItemDef[] = [
  { url: '/models/imported/kelp.glb', position: [9.5, 0, 8.5], rotation: [0, 0, 0], targetSize: 3.5 },
  { url: '/models/imported/kelp.glb', position: [-9.5, 0, -7.5], rotation: [0, 2, 0], targetSize: 3.8 },
  { url: '/models/imported/seaweed.glb', position: [-8.5, 0, 8.5], rotation: [0, 1, 0], targetSize: 2.8 },
  { url: '/models/imported/seaweed.glb', position: [8.5, 0, -8.5], rotation: [0, 3, 0], targetSize: 2.6 },
  { url: '/models/imported/kelp.glb', position: [8, 0, 9], rotation: [0, 1.5, 0], targetSize: 3 },
  { url: '/models/imported/kelp.glb', position: [-8, 0, 9], rotation: [0, 2.4, 0], targetSize: 3 },
]

function Sway({ amplitude = 0.05, speed = 0.5, phase = 0, children }: { amplitude?: number; speed?: number; phase?: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed + phase) * amplitude
  })
  return <group ref={ref}>{children}</group>
}

/** Корали, анемони та ламінарія — по периметру. */
export function Flora() {
  return (
    <group>
      {CORALS.map((c, i) => (
        <group key={i} position={c.position} rotation={c.rotation}>
          <AutoModel url={c.url} targetSize={c.targetSize} />
        </group>
      ))}
      {ANEMONES.map((a, i) => (
        <group key={i} position={a.position} rotation={a.rotation}>
          <AutoModel url={a.url} targetSize={a.targetSize} />
        </group>
      ))}
      {KELPS.map((k, i) => (
        <Sway key={i} phase={i * 1.3} speed={0.5}>
          <group position={k.position} rotation={k.rotation}>
            <AutoModel url={k.url} targetSize={k.targetSize} />
          </group>
        </Sway>
      ))}
    </group>
  )
}

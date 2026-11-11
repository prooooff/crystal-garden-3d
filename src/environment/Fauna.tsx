import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AutoModel } from '../AutoModel'
import { mulberry32 } from './rng'

interface FishDef {
  url: string
  targetSize: number
  speed: number
  phase: number
  radius: number
  height: number
}

const FISH: FishDef[] = [
  { url: '/models/imported/goldfish.glb', targetSize: 0.7, speed: 0.5, phase: 0, radius: 6, height: 3.5 },
  { url: '/models/imported/clownfish.glb', targetSize: 0.6, speed: 0.45, phase: 2, radius: 5.5, height: 4 },
  { url: '/models/imported/blowfish.glb', targetSize: 0.55, speed: 0.5, phase: 4, radius: 6.5, height: 3 },
  { url: '/models/imported/goldfish.glb', targetSize: 0.6, speed: 0.55, phase: 1.3, radius: 6, height: 4.5 },
  { url: '/models/imported/clownfish.glb', targetSize: 0.5, speed: 0.5, phase: 3.1, radius: 5, height: 2.8 },
  { url: '/models/imported/blowfish.glb', targetSize: 0.5, speed: 0.6, phase: 5, radius: 7, height: 3.8 },
  { url: '/models/imported/shark.glb', targetSize: 2.4, speed: 0.25, phase: 0.8, radius: 9, height: 4.5 },
  { url: '/models/imported/clownfish.glb', targetSize: 0.5, speed: 0.5, phase: 6.2, radius: 6.8, height: 3.2 },
  { url: '/models/imported/goldfish.glb', targetSize: 0.65, speed: 0.42, phase: 2.4, radius: 7.5, height: 4.8 },
]

/** Риба (готовий GLB), що пливе по еліптичній траєкторії. */
function Fish({ url, targetSize, speed, phase, radius, height }: FishDef) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase
    const x = Math.cos(t) * radius
    const z = Math.sin(t * 0.9) * radius
    const y = height + Math.sin(t * 1.4) * 0.7
    const tx = x - Math.sin(t) * radius
    const tz = z + Math.cos(t * 0.9) * radius * 0.9
    const ty = y + Math.cos(t * 1.4) * 0.5

    if (ref.current) {
      ref.current.position.set(x, y, z)
      ref.current.lookAt(tx, ty, tz)
    }
  })

  return (
    <group ref={ref}>
      <AutoModel url={url} targetSize={targetSize} castShadow={false} receiveShadow={false} />
    </group>
  )
}

/** Бульбашки, що піднімаються (точковий хмара). */
function Bubbles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const rand = useMemo(() => mulberry32(777), [])

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 26
      positions[i * 3 + 1] = rand() * 12
      positions[i * 3 + 2] = (rand() - 0.5) * 26
      speeds[i] = 0.3 + rand() * 0.7
    }
    return { positions, speeds }
  }, [rand, count])

  useFrame((state, dt) => {
    const points = ref.current
    if (!points) return
    const arr = points.geometry.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt * 2.2
      arr[i * 3] += Math.sin(t * 1.2 + i * 0.7) * 0.003
      if (arr[i * 3 + 1] > 12) arr[i * 3 + 1] = 0.2
    }
    points.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#cfefff" size={0.08} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/** Зграя риб та висхідні бульбашки. */
export function Fauna() {
  return (
    <group>
      {FISH.map((f, i) => (
        <Fish key={i} {...f} />
      ))}
      <Bubbles />
    </group>
  )
}

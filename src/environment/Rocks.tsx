import { useMemo } from 'react'
import * as THREE from 'three'
import { mulberry32 } from './rng'

interface RockDef {
  seed: number
  position: [number, number, number]
  scale: number | [number, number, number]
  color: string
}

const ROCKS: RockDef[] = [
  { seed: 11, position: [7.5, 0.25, -3.5], scale: 1.4, color: '#4a5d70' },
  { seed: 12, position: [-7.5, 0.2, -2], scale: 1.1, color: '#41536a' },
  { seed: 13, position: [9, 0.3, 2.5], scale: 1.8, color: '#4e6378' },
  { seed: 14, position: [-9, 0.25, 3], scale: 1.6, color: '#43566c' },
  { seed: 15, position: [3, 0.2, 8], scale: 1.2, color: '#4a5d70' },
  { seed: 16, position: [-3.5, 0.2, -8], scale: 1.5, color: '#3f5166' },
  { seed: 17, position: [6.5, 0.2, 6], scale: 1.0, color: '#50657a' },
  { seed: 18, position: [-6.5, 0.25, 6.5], scale: 1.3, color: '#42556b' },
]

/** Камінь із випадковим зміщенням вершин (низькополігональний, фасетний). */
function Rock({ seed, position, scale, color }: RockDef) {
  const rand = useMemo(() => mulberry32(seed), [seed])

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      v.multiplyScalar(0.75 + rand() * 0.5)
      v.y *= 0.85
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()
    return geo
  }, [rand])

  return (
    <mesh geometry={geometry} position={position} scale={scale} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.9} flatShading />
    </mesh>
  )
}

interface MoundDef {
  position: [number, number, number]
  scale: [number, number, number]
}

const MOUNDS: MoundDef[] = [
  { position: [-8, -0.05, 6], scale: [3.2, 0.8, 2.4] },
  { position: [8, -0.05, 7], scale: [2.6, 0.7, 2.8] },
  { position: [0, -0.05, -8.5], scale: [4, 0.6, 2.5] },
  { position: [9.5, -0.05, -6], scale: [2.2, 0.6, 2] },
  { position: [-9.5, -0.05, -1], scale: [2.8, 0.6, 2] },
]

/** Піщаний пагорб (згладжена сфера). */
function SandMound({ position, scale }: MoundDef) {
  return (
    <mesh position={position} scale={scale} receiveShadow>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color="#33424e" roughness={1} />
    </mesh>
  )
}

/** Скелі та піщані пагорби, розкидані по дну. */
export function Rocks() {
  return (
    <group>
      {ROCKS.map((r, i) => (
        <Rock key={i} {...r} />
      ))}
      {MOUNDS.map((m, i) => (
        <SandMound key={i} {...m} />
      ))}
    </group>
  )
}

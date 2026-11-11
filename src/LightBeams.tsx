import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BeamDef {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  height: number
  radius: number
  phase: number
}

const BEAMS: BeamDef[] = [
  { position: [4.5, 8.5, 3.5], rotation: [0.28, 0, -0.45], color: '#7c3aed', height: 10, radius: 1.5, phase: 0 },
  { position: [-4.5, 8.5, 3.5], rotation: [0.28, 0, 0.45], color: '#22d3ee', height: 10, radius: 1.5, phase: 2.1 },
  { position: [0, 9.5, -5.5], rotation: [0.15, 0, 0], color: '#f472b6', height: 11, radius: 1.7, phase: 4.2 },
]

/** Один світловий промінь (additive-конус), що «дихає» і злегка коливається. */
function Beam({ def }: { def: BeamDef }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.1 + 0.07 * Math.sin(t * 1.1 + def.phase)
      mesh.current.rotation.z = def.rotation[2] + Math.sin(t * 0.4 + def.phase) * 0.12
    }
  })

  return (
    <mesh ref={mesh} position={def.position} rotation={def.rotation}>
      <coneGeometry args={[def.radius, def.height, 32, 1, true]} />
      <meshBasicMaterial
        color={def.color}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** Центральний вертикальний енергетичний стовп світла. */
function EnergyPillar() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.14 + 0.08 * Math.sin(t * 1.8)
      mesh.current.scale.y = 1 + Math.sin(t * 1.4) * 0.06
    }
  })

  return (
    <mesh ref={mesh} position={[0, 5.5, 0]}>
      <cylinderGeometry args={[0.9, 1.4, 11, 32, 1, true]} />
      <meshBasicMaterial
        color="#a78bfa"
        transparent
        opacity={0.16}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** Об'ємні світлові промені (god rays) + центральний стовп. Разом із Bloom дають ефект волюметричного світла. */
export function LightBeams() {
  return (
    <group>
      {BEAMS.map((b, i) => (
        <Beam key={i} def={b} />
      ))}
      <EnergyPillar />
    </group>
  )
}

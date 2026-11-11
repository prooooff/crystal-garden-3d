import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BeamDef {
  position: [number, number, number]
  rotation: [number, number, number]
  height: number
  radius: number
  phase: number
}

const BEAMS: BeamDef[] = [
  { position: [5, 10, 3], rotation: [0.12, 0, -0.3], height: 14, radius: 2.0, phase: 0 },
  { position: [-5, 10, 3], rotation: [0.12, 0, 0.3], height: 14, radius: 2.0, phase: 2.1 },
  { position: [1, 10, -5], rotation: [0.08, 0, 0], height: 15, radius: 2.3, phase: 4.2 },
]

/** Один блідо-бірюзовий промінь світла з поверхні (god ray). */
function Beam({ def }: { def: BeamDef }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.05 + 0.03 * Math.sin(t * 0.7 + def.phase)
      mesh.current.rotation.z = def.rotation[2] + Math.sin(t * 0.25 + def.phase) * 0.08
    }
  })

  return (
    <mesh ref={mesh} position={def.position} rotation={def.rotation}>
      <coneGeometry args={[def.radius, def.height, 32, 1, true]} />
      <meshBasicMaterial
        color="#aee6ff"
        transparent
        opacity={0.07}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** God rays з поверхні води (разом із Bloom дають волюметричний ефект). */
export function LightBeams() {
  return (
    <group>
      {BEAMS.map((b, i) => (
        <Beam key={i} def={b} />
      ))}
    </group>
  )
}

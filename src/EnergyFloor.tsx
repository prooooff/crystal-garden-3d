import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { energyFloorVertex, energyFloorFragment } from './shaders'

/**
 * Підлога сцени:
 *  - кастомний ShaderMaterial (анімована енергетична сітка з хвилями),
 *  - поверх нього ShadowMaterial, який приймає РЕАЛЬНІ тіні від directional light.
 */
export function EnergyFloor() {
  const material = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#7c3aed') },
      uColorB: { value: new THREE.Color('#22d3ee') },
    }),
    [],
  )

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <group>
      {/* Кастомний шейдер підлоги */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40, 200, 200]} />
        <shaderMaterial
          ref={material}
          vertexShader={energyFloorVertex}
          fragmentShader={energyFloorFragment}
          uniforms={uniforms}
        />
      </mesh>

      {/* Приймач реальних тіней (ShadowMaterial рендерить лише тінь) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.45} />
      </mesh>
    </group>
  )
}

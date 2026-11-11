import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { causticsVertex, causticsFragment } from './shaders'

/**
 * Дно храму:
 *  - кастомний шейдер каустики (рухомі переливи світла крізь воду),
 *  - поверх нього ShadowMaterial, який приймає реальні тіні від колон.
 */
export function CausticsFloor() {
  const material = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSand: { value: new THREE.Color('#33424e') },
      uLight: { value: new THREE.Color('#7fe3e8') },
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
      {/* Каустика на дні */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[44, 44, 128, 128]} />
        <shaderMaterial
          ref={material}
          vertexShader={causticsVertex}
          fragmentShader={causticsFragment}
          uniforms={uniforms}
        />
      </mesh>

      {/* Приймач реальних тіней (ShadowMaterial рендерить лише тінь) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
        <planeGeometry args={[44, 44]} />
        <shadowMaterial transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

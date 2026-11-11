import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { waterVertex, waterFragment } from './shaders'

/**
 * Поверхня води над сценою: напівпрозора, з анімованими хвилями
 * та френелівським затемненням — пояснює god rays і каустику внизу.
 */
export function WaterSurface() {
  const material = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#1c5f7a') },
    }),
    [],
  )

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 14, 0]}>
      <planeGeometry args={[70, 70, 96, 96]} />
      <shaderMaterial
        ref={material}
        vertexShader={waterVertex}
        fragmentShader={waterFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

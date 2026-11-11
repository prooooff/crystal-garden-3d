import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { glowVertex, glowFragment } from './shaders'

interface GlowArtifactProps {
  position?: [number, number, number]
}

/**
 * Сяючий артефакт над вівтарем: кастомний fresnel-шейдер,
 * повільне обертання та вертикальне «дихання».
 */
export function GlowArtifact({ position = [0, 1.7, 0] }: GlowArtifactProps) {
  const mesh = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#f5d97a') },
      uColor2: { value: new THREE.Color('#7fe3e8') },
    }),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    if (mesh.current) {
      mesh.current.rotation.y += 0.008
      mesh.current.position.y = position[1] + Math.sin(t * 0.9) * 0.22
    }
  })

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[0.55, 2]} />
      <shaderMaterial
        vertexShader={glowVertex}
        fragmentShader={glowFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

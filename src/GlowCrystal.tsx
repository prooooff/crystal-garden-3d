import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { glowCrystalVertex, glowCrystalFragment } from './shaders'

interface GlowCrystalProps {
  position: [number, number, number]
  color1?: string
  color2?: string
  scale?: number
  speed?: number
  detail?: number
}

/**
 * Неоновий кристал на основі кастомного шейдера з френелівським свіченням.
 * Анімація: обертання, плавання по вертикалі та «дихання» кольору.
 */
export function GlowCrystal({
  position,
  color1 = '#a78bfa',
  color2 = '#22d3ee',
  scale = 1,
  speed = 1,
  detail = 1,
}: GlowCrystalProps) {
  const mesh = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
    }),
    [color1, color2],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    if (mesh.current) {
      mesh.current.rotation.y += 0.004 * speed
      mesh.current.position.y = position[1] + Math.sin(t * 0.9) * 0.35
      mesh.current.rotation.z = Math.sin(t * 0.5) * 0.25
    }
    uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[1, detail]} />
      <shaderMaterial
        vertexShader={glowCrystalVertex}
        fragmentShader={glowCrystalFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

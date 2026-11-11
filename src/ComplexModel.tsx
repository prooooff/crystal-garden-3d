import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface ComplexModelProps {
  position?: [number, number, number]
}

/**
 * Складна модель: завантажується з локального GLTF-файлу
 * (згенерований скриптом scripts/generate-model.mjs).
 * Анімація: плавне обертання + вертикальне плавання.
 */
export function ComplexModel({ position = [0, 2.5, 0] }: ComplexModelProps) {
  const { scene } = useGLTF('/models/crystal-tower.gltf')
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    // Після завантаження вмикаємо тіні для всіх мешів моделі.
    scene.traverse((obj) => {
      obj.castShadow = true
      obj.receiveShadow = true
    })
  }, [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.7
      group.current.position.y = position[1] + Math.sin(t * 1.1) * 0.2
    }
  })

  return <primitive ref={group} object={scene} position={position} />
}

useGLTF.preload('/models/crystal-tower.gltf')

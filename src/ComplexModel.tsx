import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

interface ComplexModelProps {
  position?: [number, number, number]
}

/**
 * Складна модель: кам'яна брама + вівтар храму, завантажена з локального
 * GLTF-файлу (згенерований скриптом scripts/generate-model.mjs).
 * Руїни статичні — анімацію сцени несуть каустика, артефакт і фізика.
 */
export function ComplexModel({ position = [0, 0, 0] }: ComplexModelProps) {
  const { scene } = useGLTF('/models/sunken-temple.gltf')

  useEffect(() => {
    scene.traverse((obj) => {
      obj.castShadow = true
      obj.receiveShadow = true
    })
  }, [scene])

  return <primitive object={scene} position={position} />
}

useGLTF.preload('/models/sunken-temple.gltf')

import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface AutoModelProps {
  url: string
  targetSize?: number
  castShadow?: boolean
  receiveShadow?: boolean
}

/**
 * Завантажує GLB-модель, клонує її, автоматично нормалізує розмір
 * (щоб найбільший габарит дорівнював targetSize) і вирівнює основу на y=0.
 */
export function AutoModel({
  url,
  targetSize = 1,
  castShadow = true,
  receiveShadow = true,
}: AutoModelProps) {
  const { scene } = useGLTF(url)

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      const obj = o as THREE.Object3D
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = castShadow
        obj.receiveShadow = receiveShadow
      }
      // прибираємо випадкові камери/світло, що можуть бути всередині GLB
      if (
        obj.type === 'Camera' ||
        obj.type === 'DirectionalLight' ||
        obj.type === 'PointLight' ||
        obj.type === 'AmbientLight' ||
        obj.type === 'SpotLight'
      ) {
        obj.visible = false
      }
    })
    return c
  }, [scene, castShadow, receiveShadow])

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const max = Math.max(size.x, size.y, size.z)
    if (max > 0) cloned.scale.setScalar(targetSize / max)

    const b = new THREE.Box3().setFromObject(cloned)
    cloned.position.set(-(b.max.x + b.min.x) / 2, -b.min.y, -(b.max.z + b.min.z) / 2)
  }, [cloned, targetSize])

  return <primitive object={cloned} />
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Підводне освітлення:
 *  - ambient + hemisphere (холодне заповнювальне),
 *  - directional з поверхні (god ray + реальні тіні),
 *  - point-світло артефакту (пульсує),
 *  - холодне фонове світло ззаду.
 */
export function Lights() {
  const artifactLight = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (artifactLight.current) {
      artifactLight.current.intensity = 26 + Math.sin(t * 1.6) * 6
    }
  })

  return (
    <>
      <ambientLight intensity={0.25} color="#3a5f7a" />
      <hemisphereLight args={['#7fb2c9', '#0a1822', 0.6]} />

      <directionalLight
        castShadow
        position={[6, 16, 3]}
        intensity={1.6}
        color="#bfe8ff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      <pointLight ref={artifactLight} position={[0, 2.4, 0]} intensity={28} distance={14} color="#7fe3e8" />
      <pointLight position={[0, 4, -7]} intensity={18} distance={20} color="#2b6f9e" />
    </>
  )
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Освітлення сцени:
 *  - ambient + hemisphere (базова заповнювальна),
 *  - directional з картою тіней (головне світло + реальні тіні),
 *  - три кольорові point light, два з яких анімовані (рух + зміна кольору).
 */
export function Lights() {
  const pointA = useRef<THREE.PointLight>(null)
  const pointB = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pointA.current) {
      pointA.current.position.x = Math.sin(t * 0.7) * 6
      pointA.current.position.z = Math.cos(t * 0.7) * 6
      pointA.current.color.setHSL((t * 0.06) % 1, 0.85, 0.62)
    }
    if (pointB.current) {
      pointB.current.position.x = Math.cos(t * 0.5) * 5
      pointB.current.position.z = Math.sin(t * 0.5) * 5
    }
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#b0c4ff', '#1a0b2e', 0.7]} />

      <directionalLight
        castShadow
        position={[8, 14, 6]}
        intensity={2.5}
        color="#fff4e0"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      <pointLight ref={pointA} position={[6, 4, 0]} intensity={140} distance={30} color="#ff4dff" />
      <pointLight ref={pointB} position={[-5, 3, 4]} intensity={110} distance={28} color="#22d3ee" />
      <pointLight position={[0, 2.5, -6]} intensity={90} distance={26} color="#7c3aed" />
    </>
  )
}

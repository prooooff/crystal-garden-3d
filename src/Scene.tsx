import { Suspense, useCallback, useState } from 'react'
import { OrbitControls, Environment, Lightformer } from '@react-three/drei'
import { Lights } from './Lights'
import { EnergyFloor } from './EnergyFloor'
import { Crystals } from './Crystals'
import { ComplexModel } from './ComplexModel'
import { PhysicsWorld, BallSpawner, type BallData } from './PhysicsWorld'
import { Effects } from './Effects'

const PALETTE = ['#ff4d6d', '#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#f472b6']

/**
 * Головна композиція сцени. Об'єднує світло, підлогу з шейдером,
 * складну модель, кристали, фізику, постобробку та керування камерою.
 */
export function Scene() {
  const [balls, setBalls] = useState<BallData[]>([])

  const spawnBall = useCallback((x: number, z: number) => {
    const id = Date.now() + Math.random()
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    setBalls((prev) => [
      ...prev.slice(-40), // тримаємо в сцені максимум ~40 куль
      { id, position: [x, 9, z], color, radius: 0.45 + Math.random() * 0.2 },
    ])
  }, [])

  return (
    <>
      <color attach="background" args={['#05060f']} />
      <fog attach="fog" args={['#0a0a1a', 14, 45]} />

      <Lights />

      {/* Процедурна env map (без завантаження HDR з мережі) для відблисків на металі */}
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 6, 0]} scale={[12, 12, 1]} color="#ffffff" />
        <Lightformer intensity={3} position={[-6, 2, 3]} rotation={[0, Math.PI / 2, 0]} scale={[9, 4, 1]} color="#7c3aed" />
        <Lightformer intensity={3} position={[6, 2, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[9, 4, 1]} color="#22d3ee" />
      </Environment>

      <EnergyFloor />

      <Suspense fallback={null}>
        <ComplexModel position={[0, 2.5, 0]} />
      </Suspense>

      <Crystals />

      <PhysicsWorld balls={balls} />
      <BallSpawner onSpawn={spawnBall} />

      <Effects />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 - 0.06}
        target={[0, 1.6, 0]}
      />
    </>
  )
}

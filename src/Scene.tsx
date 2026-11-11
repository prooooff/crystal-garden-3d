import { Suspense, useCallback, useState } from 'react'
import { OrbitControls, Environment, Lightformer, Stars, Sparkles } from '@react-three/drei'
import { Lights } from './Lights'
import { EnergyFloor } from './EnergyFloor'
import { Crystals } from './Crystals'
import { ComplexModel } from './ComplexModel'
import { LightBeams } from './LightBeams'
import { PhysicsWorld, BallSpawner, type BallData } from './PhysicsWorld'
import { Effects } from './Effects'

const PALETTE = ['#ff4d6d', '#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#f472b6']

/**
 * Головна композиція сцени. Об'єднує світло, підлогу з шейдером,
 * складну модель, кристали, фізику, постобробку та керування камерою.
 */
export function Scene() {
  const [balls, setBalls] = useState<BallData[]>([])

  const spawnBall = useCallback(
    (position: [number, number, number], velocity: [number, number, number]) => {
      const id = Date.now() + Math.random()
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      setBalls((prev) => [
        ...prev.slice(-60),
        { id, position, velocity, color, radius: 0.4 + Math.random() * 0.18 },
      ])
    },
    [],
  )

  return (
    <>
      <color attach="background" args={['#05060f']} />
      <fog attach="fog" args={['#070714', 22, 90]} />

      {/* Космічний фон та плаваючий «пил» */}
      <Stars radius={70} depth={40} count={2500} factor={5} saturation={0.5} fade speed={0.4} />
      <Sparkles
        count={140}
        scale={[18, 7, 18]}
        position={[0, 3.2, 0]}
        size={2.4}
        speed={0.35}
        opacity={0.5}
        color="#c4b5fd"
      />

      <Lights />
      <LightBeams />

      {/* Процедурна env map (без HDR з мережі) для відблисків на металі/склі */}
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
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

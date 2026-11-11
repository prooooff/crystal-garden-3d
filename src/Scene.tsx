import { Suspense, useCallback, useState } from 'react'
import { OrbitControls, Environment, Lightformer, Sparkles } from '@react-three/drei'
import { Lights } from './Lights'
import { CausticsFloor } from './CausticsFloor'
import { WaterSurface } from './WaterSurface'
import { GlowArtifact } from './GlowArtifact'
import { ComplexModel } from './ComplexModel'
import { LightBeams } from './LightBeams'
import { PhysicsWorld, BallSpawner, type BallData } from './PhysicsWorld'
import { Effects } from './Effects'

const PALETTE = ['#7fe3e8', '#f5d97a', '#a8e6cf', '#9fb8ff']

/**
 * «Затонулий храм»: підводна сцена з каустикою, поверхнею води,
 * кам'яною брамою, сяючим артефактом, god rays та фізикою уламків.
 */
export function Scene() {
  const [balls, setBalls] = useState<BallData[]>([])

  const spawnBall = useCallback(
    (position: [number, number, number], velocity: [number, number, number]) => {
      const id = Date.now() + Math.random()
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      setBalls((prev) => [
        ...prev.slice(-50),
        { id, position, velocity, color, radius: 0.34 + Math.random() * 0.14 },
      ])
    },
    [],
  )

  return (
    <>
      <color attach="background" args={['#06141d']} />
      <fog attach="fog" args={['#0a1f2c', 12, 60]} />

      {/* Морський сніг */}
      <Sparkles
        count={180}
        scale={[20, 10, 20]}
        position={[0, 5, 0]}
        size={1.6}
        speed={0.25}
        opacity={0.35}
        color="#bfe8ff"
      />

      <Lights />
      <LightBeams />

      {/* Процедурна env map (холодні підводні відблиски) */}
      <Environment resolution={128}>
        <Lightformer intensity={1.2} position={[0, 8, 0]} scale={[14, 14, 1]} color="#8fd0e8" />
        <Lightformer intensity={0.8} position={[-6, 2, 4]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} color="#2b6f9e" />
        <Lightformer intensity={0.8} position={[6, 2, 4]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 4, 1]} color="#7fe3e8" />
      </Environment>

      <CausticsFloor />
      <WaterSurface />

      <Suspense fallback={null}>
        <ComplexModel position={[0, 0, 0]} />
      </Suspense>
      <GlowArtifact position={[0, 1.7, 0]} />

      <PhysicsWorld balls={balls} />
      <BallSpawner onSpawn={spawnBall} />

      <Effects />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 2, 0]}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  )
}

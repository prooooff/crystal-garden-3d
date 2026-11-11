import { Suspense } from 'react'
import { OrbitControls, Environment, Lightformer, Sparkles } from '@react-three/drei'
import { Lights } from './Lights'
import { CausticsFloor } from './CausticsFloor'
import { WaterSurface } from './WaterSurface'
import { GlowArtifact } from './GlowArtifact'
import { PhysicsWorld } from './PhysicsWorld'
import { Effects } from './Effects'
import { Rocks } from './environment/Rocks'
import { Flora } from './environment/Flora'
import { Fauna } from './environment/Fauna'
import { Props } from './environment/Props'
import { Ruins } from './environment/Ruins'

/**
 * «Затонулий храм» — ігровий рівень: арена, алея колон, храм, артефакт,
 * рифи, фауна та підводна фізика (маятники, уламки, ударні хвилі).
 */
export function Scene() {
  return (
    <>
      <color attach="background" args={['#04121c']} />
      <fog attach="fog" args={['#07212e', 10, 55]} />

      {/* Морський сніг */}
      <Sparkles
        count={260}
        scale={[22, 12, 22]}
        position={[0, 5, 0]}
        size={1.8}
        speed={0.25}
        opacity={0.4}
        color="#bfe8ff"
      />

      <Lights />

      {/* Процедурна env map (холодні підводні відблиски) */}
      <Environment resolution={128}>
        <Lightformer intensity={1.2} position={[0, 8, 0]} scale={[14, 14, 1]} color="#8fd0e8" />
        <Lightformer intensity={0.8} position={[-6, 2, 4]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} color="#2b6f9e" />
        <Lightformer intensity={0.8} position={[6, 2, 4]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 4, 1]} color="#7fe3e8" />
      </Environment>

      <CausticsFloor />
      <WaterSurface />

      {/* Локація (готові GLB-моделі) */}
      <Suspense fallback={null}>
        <Ruins />
        <Rocks />
        <Flora />
        <Fauna />
        <Props />
      </Suspense>

      <GlowArtifact position={[0, 3.4, 0]} />

      <PhysicsWorld />

      <Effects />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={32}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 2, 0]}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  )
}

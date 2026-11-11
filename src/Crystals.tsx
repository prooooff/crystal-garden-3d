import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GlowCrystal } from './GlowCrystal'
import { glowCrystalVertex, glowCrystalFragment } from './shaders'

interface CrystalDef {
  position: [number, number, number]
  color1: string
  color2: string
  scale: number
  speed: number
}

const CRYSTALS: CrystalDef[] = [
  { position: [-4, 1.6, -2.5], color1: '#a78bfa', color2: '#22d3ee', scale: 0.9, speed: 1.1 },
  { position: [4, 1.4, -2.8], color1: '#f472b6', color2: '#a78bfa', scale: 0.75, speed: 0.9 },
  { position: [-5, 2.2, 1.8], color1: '#22d3ee', color2: '#34d399', scale: 0.6, speed: 1.3 },
  { position: [5.5, 2.0, 1.5], color1: '#fbbf24', color2: '#f472b6', scale: 0.55, speed: 1.0 },
  { position: [0, 2.8, -5.5], color1: '#34d399', color2: '#22d3ee', scale: 0.7, speed: 1.2 },
  { position: [3, 3.0, 4.2], color1: '#a78bfa', color2: '#f472b6', scale: 0.5, speed: 1.4 },
]

/** Скляні примітиви (transmission) — демонстрація фізичних матеріалів. */
function GlassOrbs() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.rotation.y = t * 0.15
  })

  return (
    <group ref={group}>
      <mesh position={[-2.6, 1.1, 2.6]}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshPhysicalMaterial
          color="#9be7ff"
          metalness={0}
          roughness={0.05}
          transmission={1}
          thickness={0.8}
          ior={1.5}
          clearcoat={1}
          transparent
        />
      </mesh>
      <mesh position={[2.8, 0.9, 2.9]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffd9f0"
          metalness={0}
          roughness={0.03}
          transmission={1}
          thickness={1}
          ior={1.45}
          clearcoat={1}
          transparent
        />
      </mesh>
      <mesh position={[0.2, 0.8, -3.6]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial
          color="#c8ffe0"
          metalness={0}
          roughness={0.06}
          transmission={1}
          thickness={0.9}
          ior={1.6}
          clearcoat={1}
          transparent
        />
      </mesh>
    </group>
  )
}

/** Неонове кільце-ореол, що обертається навколо центральної моделі. */
function GlowRing() {
  const ring = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#22d3ee') },
      uColor2: { value: new THREE.Color('#a78bfa') },
    }),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    if (ring.current) {
      ring.current.rotation.x = Math.PI / 2 - 0.2
      ring.current.rotation.y = t * 0.5
      ring.current.position.y = 2.6 + Math.sin(t * 0.8) * 0.25
    }
  })

  return (
    <mesh ref={ring} position={[0, 2.6, 0]}>
      <torusGeometry args={[2.4, 0.06, 16, 96]} />
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

/** Маленькі неонові супутники, що обертаються навколо центральної моделі. */
function Orbitals() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.rotation.y = t * 0.6
  })

  return (
    <group ref={group} position={[0, 2.6, 0]}>
      <GlowCrystal position={[2.8, 0, 0]} color1="#22d3ee" color2="#a78bfa" scale={0.32} speed={1.4} />
      <GlowCrystal position={[-2.8, 0.2, 0.6]} color1="#f472b6" color2="#22d3ee" scale={0.28} speed={1.2} />
      <GlowCrystal position={[0.6, -0.3, 2.9]} color1="#fbbf24" color2="#f472b6" scale={0.26} speed={1.5} />
    </group>
  )
}

/** Набір кристалів, скляних об'єктів, кільця та орбітальних супутників. */
export function Crystals() {
  return (
    <group>
      {CRYSTALS.map((c, i) => (
        <GlowCrystal key={i} {...c} />
      ))}
      <GlassOrbs />
      <GlowRing />
      <Orbitals />
    </group>
  )
}

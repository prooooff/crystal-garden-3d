import { useEffect, useRef } from 'react'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface BallData {
  id: number
  position: [number, number, number]
  color: string
  radius: number
}

interface PedestalProps {
  position: [number, number, number]
  args: [number, number, number]
  color: string
}

/** Фіксований постамент-примітив (box) із фізичним колайдером. */
function Pedestal({ position, args, color }: PedestalProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
      </mesh>
    </RigidBody>
  )
}

/** Фіксований похилий пандус. */
function Ramp() {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[7, 0.25, -3.5]} rotation={[0, 0.6, -0.35]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[5, 0.5, 2.6]} />
        <meshStandardMaterial color="#3f3f56" metalness={0.7} roughness={0.35} />
      </mesh>
    </RigidBody>
  )
}

const STACK: Array<{ position: [number, number, number]; color: string }> = [
  { position: [5.5, 0.6, 2], color: '#ff4d6d' },
  { position: [5.5, 1.7, 2], color: '#fbbf24' },
  { position: [5.5, 2.8, 2], color: '#34d399' },
]

/** Динамічна стопка кубів, яку можна збити кулею. */
function BoxStack() {
  return (
    <>
      {STACK.map((d, i) => (
        <RigidBody
          key={i}
          colliders="cuboid"
          position={d.position}
          restitution={0.2}
          friction={0.5}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
            <meshStandardMaterial color={d.color} metalness={0.3} roughness={0.35} />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}

interface BallProps {
  position: [number, number, number]
  color: string
  radius: number
}

/** Динамічна куля, яку спавнить користувач. */
function Ball({ position, color, radius }: BallProps) {
  return (
    <RigidBody
      colliders="ball"
      position={position}
      restitution={0.75}
      friction={0.25}
      linearDamping={0.04}
      angularDamping={0.1}
    >
      <mesh castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>
    </RigidBody>
  )
}

interface BallSpawnerProps {
  onSpawn: (x: number, z: number) => void
}

/**
 * Перетворює клік по сцені на точку на підлозі (перетин променя камери
 * з площиною y=0) і викликає onSpawn. Drag (обертання камери) ігнорується.
 */
function BallSpawner({ onSpawn }: BallSpawnerProps) {
  const { camera, gl } = useThree()

  useEffect(() => {
    const el = gl.domElement
    let down: [number, number] | null = null

    const onDown = (e: PointerEvent) => {
      down = [e.clientX, e.clientY]
    }

    const onUp = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - down[0]
      const dy = e.clientY - down[1]
      down = null
      if (dx * dx + dy * dy > 25) return // це був drag, не клік

      const ndc = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(ndc, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const point = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, point)) {
        onSpawn(point.x, point.z)
      }
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
    }
  }, [camera, gl, onSpawn])

  return null
}

interface PhysicsWorldProps {
  balls: BallData[]
}

/**
 * Фізичний світ Rapier: гравітація, невидима підлога,
 * фіксовані платформи, пандус, динамічні куби та спавнені кулі.
 */
export function PhysicsWorld({ balls }: PhysicsWorldProps) {
  return (
    <Physics gravity={[0, -25, 0]}>
      {/* Невидимий колайдер підлоги (візуально її замінює EnergyFloor) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[20, 0.5, 20]} position={[0, -0.5, 0]} />
      </RigidBody>

      {/* Центральний постамент під складною моделлю */}
      <Pedestal position={[0, 0.7, 0]} args={[3, 1.4, 3]} color="#2a2a3f" />

      {/* Бічні платформи-примітиви */}
      <Pedestal position={[-5.5, 0.5, 3]} args={[2.2, 1, 2.2]} color="#1f2a3a" />
      <Pedestal position={[3.5, 0.4, -5]} args={[2.6, 0.8, 2.6]} color="#241a3a" />

      <Ramp />

      <BoxStack />

      {balls.map((b) => (
        <Ball key={b.id} position={b.position} color={b.color} radius={b.radius} />
      ))}
    </Physics>
  )
}

export { BallSpawner }

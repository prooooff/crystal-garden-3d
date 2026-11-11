import { useEffect, useRef } from 'react'
import {
  Physics,
  RigidBody,
  CuboidCollider,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface BallData {
  id: number
  position: [number, number, number]
  velocity: [number, number, number]
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

interface BoxDef {
  position: [number, number, number]
  color: string
}

const STACK: BoxDef[] = [
  { position: [5.5, 0.6, 2], color: '#ff4d6d' },
  { position: [5.5, 1.7, 2], color: '#fbbf24' },
  { position: [5.5, 2.8, 2], color: '#34d399' },
]

const STACK2: BoxDef[] = [
  { position: [-3.4, 0.55, -3.4], color: '#fbbf24' },
  { position: [-3.4, 1.65, -3.4], color: '#f472b6' },
  { position: [-3.1, 2.75, -3.2], color: '#22d3ee' },
]

/** Динамічна стопка кубів, яку можна збити. */
function BoxStack({ boxes }: { boxes: BoxDef[] }) {
  return (
    <>
      {boxes.map((d, i) => (
        <RigidBody
          key={i}
          colliders="cuboid"
          position={d.position}
          restitution={0.25}
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
  velocity: [number, number, number]
  color: string
  radius: number
}

/** Динамічна куля, яку спавнить користувач (з початковою швидкістю). */
function Ball({ position, velocity, color, radius }: BallProps) {
  return (
    <RigidBody
      colliders="ball"
      position={position}
      linearVelocity={velocity}
      restitution={0.78}
      friction={0.25}
      linearDamping={0.03}
      angularDamping={0.08}
    >
      <mesh castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    </RigidBody>
  )
}

/** Важка металева куля, яку можна збити з платформи. */
function HeavyBall() {
  return (
    <RigidBody colliders="ball" position={[-5.5, 1.7, 3]} mass={4} restitution={0.5} friction={0.4}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshStandardMaterial
          color="#a78bfa"
          metalness={0.95}
          roughness={0.15}
          emissive="#3b2a7a"
          emissiveIntensity={0.4}
        />
      </mesh>
    </RigidBody>
  )
}

/** Кінематичний ротор-«пропелер», що обертається і розкидає об'єкти. */
function Spinner() {
  const body = useRef<RapierRigidBody>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (body.current) {
      const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), t * 1.6)
      body.current.setNextKinematicRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
    }
  })

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders="cuboid" position={[0, 2.7, 4.6]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.28, 0.5]} />
        <meshStandardMaterial
          color="#22d3ee"
          metalness={0.9}
          roughness={0.2}
          emissive="#0a4a5e"
          emissiveIntensity={0.7}
        />
      </mesh>
    </RigidBody>
  )
}

/** Вибух на клавішу E: імпульс у всі динамічні тіла в радіусі. */
function ExplosionController() {
  const { world } = useRapier()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return

      const center = new THREE.Vector3(0, 2.5, 0)
      const radius = 15

      world.forEachRigidBody((body) => {
        if (!body.isDynamic()) return
        const t = body.translation()
        const p = new THREE.Vector3(t.x, t.y, t.z)
        const dist = p.distanceTo(center)
        if (dist > radius) return

        const dir = p.clone().sub(center)
        dir.y += 0.9
        dir.normalize()
        const strength = (1 - dist / radius) * 70 + 18
        body.applyImpulse(
          { x: dir.x * strength, y: dir.y * strength, z: dir.z * strength },
          true,
        )
      })
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [world])

  return null
}

interface BallSpawnerProps {
  onSpawn: (position: [number, number, number], velocity: [number, number, number]) => void
}

/**
 * Клік по сцені кидає кулю від камери в точку прицілу
 * (перетин променя камери з площиною підлоги). Drag ігнорується.
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
      const dir = raycaster.ray.direction.clone().normalize()

      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const hit = new THREE.Vector3()
      const target = raycaster.ray.intersectPlane(floorPlane, hit)
        ? hit.clone()
        : camera.position.clone().addScaledVector(dir, 24)

      const spawn = camera.position.clone().addScaledVector(dir, 1.6)
      spawn.y = Math.max(spawn.y, 1.2)
      const velocity = target.clone().sub(spawn).normalize().multiplyScalar(24)

      onSpawn([spawn.x, spawn.y, spawn.z], [velocity.x, velocity.y, velocity.z])
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
 * Фізичний світ Rapier: гравітація, невидима підлога, платформи,
 * пандус, кінематичний ротор, динамічні куби/кулі та вибух.
 */
export function PhysicsWorld({ balls }: PhysicsWorldProps) {
  return (
    <Physics gravity={[0, -25, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[20, 0.5, 20]} position={[0, -0.5, 0]} />
      </RigidBody>

      <Pedestal position={[0, 0.7, 0]} args={[3, 1.4, 3]} color="#2a2a3f" />
      <Pedestal position={[-5.5, 0.5, 3]} args={[2.2, 1, 2.2]} color="#1f2a3a" />
      <Pedestal position={[3.5, 0.4, -5]} args={[2.6, 0.8, 2.6]} color="#241a3a" />

      <Ramp />
      <Spinner />

      <BoxStack boxes={STACK} />
      <BoxStack boxes={STACK2} />
      <HeavyBall />

      {balls.map((b) => (
        <Ball
          key={b.id}
          position={b.position}
          velocity={b.velocity}
          color={b.color}
          radius={b.radius}
        />
      ))}

      <ExplosionController />
    </Physics>
  )
}

export { BallSpawner }

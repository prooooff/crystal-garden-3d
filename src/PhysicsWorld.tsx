import { useEffect, useRef } from 'react'
import { Physics, RigidBody, CuboidCollider, useRapier } from '@react-three/rapier'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface BallData {
  id: number
  position: [number, number, number]
  velocity: [number, number, number]
  color: string
  radius: number
}

interface StoneBlockProps {
  position: [number, number, number]
  args: [number, number, number]
  rotation?: [number, number, number]
  color?: string
}

/** Фіксований кам'яний блок-перешкода. */
function StoneBlock({ position, args, rotation = [0, 0, 0], color = '#3d4c5a' }: StoneBlockProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.85} />
      </mesh>
    </RigidBody>
  )
}

interface RubbleDef {
  position: [number, number, number]
  color: string
}

const RUBBLE: RubbleDef[] = [
  { position: [5, 0.5, 2.5], color: '#45566a' },
  { position: [5, 1.4, 2.5], color: '#3a4a5c' },
  { position: [5, 2.3, 2.5], color: '#4d5f74' },
  { position: [-4.5, 0.5, -3], color: '#3a4a5c' },
  { position: [-4.5, 1.4, -3], color: '#45566a' },
]

/** Динамічна купа кам'яних уламків, яку можна розкидати. */
function RubblePile({ blocks }: { blocks: RubbleDef[] }) {
  return (
    <>
      {blocks.map((d, i) => (
        <RigidBody key={i} colliders="cuboid" position={d.position} restitution={0.15} friction={0.7}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial color={d.color} metalness={0.1} roughness={0.9} />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}

/** Важка впала колона (convex hull), яку можна зрушити. */
function FallenPillar() {
  return (
    <RigidBody colliders="hull" position={[-5.5, 0.5, 2]} rotation={[0, 0, 1.5]} mass={6} restitution={0.1} friction={0.8}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 3, 12]} />
        <meshStandardMaterial color="#3a4a5c" metalness={0.1} roughness={0.9} />
      </mesh>
    </RigidBody>
  )
}

interface OrbProps {
  position: [number, number, number]
  velocity: [number, number, number]
  color: string
  radius: number
}

/** Енергетична сфера, якою стріляє користувач. */
function Orb({ position, velocity, color, radius }: OrbProps) {
  return (
    <RigidBody
      colliders="ball"
      position={position}
      linearVelocity={velocity}
      restitution={0.6}
      friction={0.2}
      linearDamping={0.04}
      angularDamping={0.08}
    >
      <mesh castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
    </RigidBody>
  )
}

/** Ударна хвиля на клавішу E: імпульс у динамічні тіла в радіусі. */
function Shockwave() {
  const { world } = useRapier()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return

      const center = new THREE.Vector3(0, 2, 0)
      const radius = 15

      world.forEachRigidBody((body) => {
        if (!body.isDynamic()) return
        const t = body.translation()
        const p = new THREE.Vector3(t.x, t.y, t.z)
        const dist = p.distanceTo(center)
        if (dist > radius) return

        const dir = p.clone().sub(center)
        dir.y += 1.2
        dir.normalize()
        const strength = (1 - dist / radius) * 45 + 12
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
 * Клік кидає енергосферу від камери в точку прицілу
 * (перетин променя камери з площиною дна). Drag ігнорується.
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
      if (dx * dx + dy * dy > 25) return

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
      const velocity = target.clone().sub(spawn).normalize().multiplyScalar(22)

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
 * Фізичний світ Rapier (підводний): знижена гравітація, кам'яні уламки,
 * впала колона, енергосфери та ударна хвиля.
 */
export function PhysicsWorld({ balls }: PhysicsWorldProps) {
  return (
    <Physics gravity={[0, -18, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[22, 0.5, 22]} position={[0, -0.5, 0]} />
      </RigidBody>

      <StoneBlock position={[6, 0.5, -2]} args={[2.2, 1, 1.4]} rotation={[0, 0.4, 0]} />
      <StoneBlock position={[-6, 0.4, 3.5]} args={[1.8, 0.8, 1.8]} rotation={[0, -0.3, 0]} />
      <StoneBlock position={[2, 0.35, -6]} args={[2.4, 0.7, 1.2]} rotation={[0, 0.2, 0]} />

      <RubblePile blocks={RUBBLE} />
      <FallenPillar />

      {balls.map((b) => (
        <Orb key={b.id} position={b.position} velocity={b.velocity} color={b.color} radius={b.radius} />
      ))}

      <Shockwave />
    </Physics>
  )
}

export { BallSpawner }

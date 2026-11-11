import { useEffect, useRef } from 'react'
import { Physics, RigidBody, CuboidCollider, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StoneBlockProps {
  position: [number, number, number]
  args: [number, number, number]
  rotation?: [number, number, number]
}

/** Фіксований кам'яний блок-перешкода. */
function StoneBlock({ position, args, rotation = [0, 0, 0] }: StoneBlockProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color="#3d4c5a" metalness={0.1} roughness={0.85} />
      </mesh>
    </RigidBody>
  )
}

interface DebrisRockProps {
  position: [number, number, number]
  radius: number
  color: string
}

/** Динамічний валун на дні, який можна розштовхати ударною хвилею. */
function DebrisRock({ position, radius, color }: DebrisRockProps) {
  return (
    <RigidBody colliders="ball" position={position} restitution={0.2} friction={0.8} linearDamping={0.1} angularDamping={0.2}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
    </RigidBody>
  )
}

/** Важка впала колона (convex hull), яку можна зрушити. */
function FallenPillar() {
  return (
    <RigidBody colliders="hull" position={[-5.5, 0.5, 2]} rotation={[0, 0, 1.5]} mass={6} restitution={0.1} friction={0.8}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 3, 12]} />
        <meshStandardMaterial color="#3a4a5c" metalness={0.1} roughness={0.9} flatShading />
      </mesh>
    </RigidBody>
  )
}

const CRATES: Array<[number, number, number]> = [
  [4, 3.2, 3],
  [-4.5, 4, -2.5],
  [5.5, 3.6, -4],
]

/**
 * Плавучі ящики (нейтральна плавучість: gravityScale = 0).
 * Погойдуються по-кадрово, а ударні хвилі штовхають їх убік.
 */
function BuoyantCrates() {
  const refs = useRef<Array<RapierRigidBody | null>>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((body, i) => {
      if (!body) return
      body.applyImpulse(
        {
          x: Math.sin(t * 0.4 + i) * 0.02,
          y: Math.sin(t * 1.6 + i * 1.7) * 0.2,
          z: Math.cos(t * 0.35 + i) * 0.02,
        },
        true,
      )
    })
  })

  return (
    <>
      {CRATES.map((p, i) => (
        <RigidBody
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          colliders="cuboid"
          position={p}
          gravityScale={0}
          linearDamping={0.5}
          angularDamping={0.2}
          restitution={0.3}
          friction={0.4}
        >
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#6b4a2f" roughness={0.7} />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}

/** Ударна хвиля по кліку: розштовхує динамічні тіла навколо точки кліку. */
function ClickShockwave() {
  const { world } = useRapier()
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
      if (dx * dx + dy * dy > 25) return // це був drag

      const ndc = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(ndc, camera)
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const hit = new THREE.Vector3()
      const center = raycaster.ray.intersectPlane(floorPlane, hit)
        ? hit.clone()
        : camera.position.clone().addScaledVector(raycaster.ray.direction, 12)

      const radius = 9
      world.forEachRigidBody((body) => {
        if (!body.isDynamic()) return
        const t = body.translation()
        const p = new THREE.Vector3(t.x, t.y, t.z)
        const d = p.distanceTo(center)
        if (d > radius) return

        const dir = p.clone().sub(center)
        dir.y += 1.4
        dir.normalize()
        const strength = (1 - d / radius) * 30 + 8
        body.applyImpulse(
          { x: dir.x * strength, y: dir.y * strength, z: dir.z * strength },
          true,
        )
      })
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
    }
  }, [world, camera, gl])

  return null
}

/** Потужна ударна хвиля на клавішу E (від центру сцени). */
function Shockwave() {
  const { world } = useRapier()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return

      const center = new THREE.Vector3(0, 2, 0)
      const radius = 18

      world.forEachRigidBody((body) => {
        if (!body.isDynamic()) return
        const t = body.translation()
        const p = new THREE.Vector3(t.x, t.y, t.z)
        const d = p.distanceTo(center)
        if (d > radius) return

        const dir = p.clone().sub(center)
        dir.y += 1.2
        dir.normalize()
        const strength = (1 - d / radius) * 50 + 14
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

/**
 * Підводний фізичний світ: знижена гравітація, уламки/валуни,
 * впала колона, плавучі ящики та ударні хвилі (клік і E).
 */
export function PhysicsWorld() {
  return (
    <Physics gravity={[0, -18, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[22, 0.5, 22]} position={[0, -0.5, 0]} />
      </RigidBody>

      <StoneBlock position={[6, 0.5, -2]} args={[2.2, 1, 1.4]} rotation={[0, 0.4, 0]} />
      <StoneBlock position={[-6, 0.4, 3.5]} args={[1.8, 0.8, 1.8]} rotation={[0, -0.3, 0]} />
      <StoneBlock position={[2, 0.35, -6]} args={[2.4, 0.7, 1.2]} rotation={[0, 0.2, 0]} />

      <DebrisRock position={[5, 0.5, 1]} radius={0.5} color="#4a5d70" />
      <DebrisRock position={[-5, 0.45, -2]} radius={0.6} color="#41536a" />
      <DebrisRock position={[4, 0.4, -4]} radius={0.45} color="#50657a" />
      <DebrisRock position={[-4, 0.5, 4]} radius={0.55} color="#42556b" />

      <FallenPillar />

      <BuoyantCrates />

      <ClickShockwave />
      <Shockwave />
    </Physics>
  )
}

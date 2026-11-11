import { useEffect, useRef } from 'react'
import {
  Physics,
  RigidBody,
  CuboidCollider,
  useRapier,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StoneBlockProps {
  position: [number, number, number]
  args: [number, number, number]
  rotation?: [number, number, number]
}

/** Фіксований кам'яний блок. */
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

/** Динамічний валун, який розкидає ударна хвиля. */
function DebrisRock({ position, radius, color }: DebrisRockProps) {
  return (
    <RigidBody colliders="ball" position={position} restitution={0.25} friction={0.8} linearDamping={0.08} angularDamping={0.2}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
    </RigidBody>
  )
}

/** Важка впала колона (convex hull). */
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

/** Маятник: вага на сферичному джойнті, яку можна розгойдати ударною хвилею. */
function Pendulum({ position }: { position: [number, number, number] }) {
  const anchorRef = useRef<RapierRigidBody>(null!)
  const weightRef = useRef<RapierRigidBody>(null!)
  const ropeRef = useRef<THREE.Mesh>(null)

  useSphericalJoint(anchorRef, weightRef, [
    [0, 0, 0],
    [0, 1.5, 0],
  ])

  useFrame(() => {
    const a = anchorRef.current?.translation()
    const w = weightRef.current?.translation()
    if (a && w && ropeRef.current) {
      const dx = w.x - a.x
      const dy = w.y - a.y
      const dz = w.z - a.z
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
      ropeRef.current.position.set((a.x + w.x) / 2, (a.y + w.y) / 2, (a.z + w.z) / 2)
      ropeRef.current.scale.y = len
      ropeRef.current.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(dx, dy, dz).normalize(),
      )
    }
  })

  const [x, y, z] = position

  return (
    <>
      <RigidBody ref={anchorRef} type="fixed" position={position}>
        <mesh>
          <torusGeometry args={[0.25, 0.06, 8, 20]} />
          <meshStandardMaterial color="#7a5a3a" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody ref={weightRef} colliders="ball" position={[x, y - 3, z]} mass={1.5} restitution={0.3} friction={0.5}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.8} roughness={0.3} emissive="#3a2a00" emissiveIntensity={0.4} />
        </mesh>
      </RigidBody>
      <mesh ref={ropeRef}>
        <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
        <meshStandardMaterial color="#3a4a5c" roughness={0.9} />
      </mesh>
    </>
  )
}

const CRATES: Array<[number, number, number]> = [
  [4, 3.2, 3],
  [-4.5, 4, -2.5],
  [5.5, 3.6, -4],
  [3.5, 4, -3],
  [-3.5, 4.5, 3],
]

/** Плавучі ящики (нейтральна плавучість), що погойдуються і реагують на хвилі. */
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

/** Ударна хвиля по кліку. */
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
      if (dx * dx + dy * dy > 25) return

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
        const strength = (1 - d / radius) * 32 + 9
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

/** Потужна ударна хвиля на E. */
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
        const strength = (1 - d / radius) * 52 + 15
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

/** Підводний фізичний світ: уламки, маятники, плавучі ящики, ударні хвилі. */
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
      <DebrisRock position={[3, 0.4, 7]} radius={0.4} color="#4a5d70" />
      <DebrisRock position={[-3, 0.4, 7]} radius={0.45} color="#50657a" />
      <DebrisRock position={[0, 0.4, -6]} radius={0.5} color="#41536a" />

      <FallenPillar />

      <Pendulum position={[3.5, 6, 7]} />
      <Pendulum position={[-3.5, 6, 7]} />

      <BuoyantCrates />

      <ClickShockwave />
      <Shockwave />
    </Physics>
  )
}

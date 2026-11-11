interface Pos3 {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

/** Скриня зі скарбами: дерев'яна основа, металеві смуги, відкрита кришка та монети. */
function TreasureChest({ position, rotation = [0, 0, 0] }: Pos3) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.6]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.25, 0.31]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, -0.31]}>
        <boxGeometry args={[0.9, 0.08, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.56, -0.12]} rotation={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.18, 0.6]} />
        <meshStandardMaterial color="#7a5434" roughness={0.7} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0.05 * (i - 2), 0.52, -0.1 + i * 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
          <meshStandardMaterial color="#f5d97a" metalness={1} roughness={0.3} emissive="#3a2a00" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/** Амфора (теракота): кулястий корпус + горло. */
function Amphora({ position, rotation = [0, 0, 0], scale = 1 }: Pos3) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.45, 20, 20]} />
        <meshStandardMaterial color="#b06a4a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.3, 12]} />
        <meshStandardMaterial color="#b06a4a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.2, 0.14, 0.06, 12]} />
        <meshStandardMaterial color="#b06a4a" roughness={0.8} />
      </mesh>
    </group>
  )
}

/** Розсипані золоті монети. */
function Coins({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[i * 0.09 - 0.2, 0.03, (i % 2) * 0.1 - 0.05]} rotation={[Math.PI / 2, 0, i]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 14]} />
          <meshStandardMaterial color="#f5d97a" metalness={1} roughness={0.3} emissive="#3a2a00" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  )
}

/** Впала кам'яна статуя (голова + торс + рука). */
function FallenStatue({ position, rotation = [0, 0, 0] }: Pos3) {
  const stone = '#4b5a6a'
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0.6, 0.32, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={stone} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 0.4]} />
        <meshStandardMaterial color={stone} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.3, 0.35, 0.1]} rotation={[0, 0, 0.8]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.8, 8]} />
        <meshStandardMaterial color={stone} roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

/** Надламана колона (стоїть або лежить). */
function BrokenColumn({ position, rotation = [0, 0, 0], scale = 1 }: Pos3) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <cylinderGeometry args={[0.4, 0.5, 2.2, 10]} />
      <meshStandardMaterial color="#3a4a5c" roughness={0.9} flatShading />
    </mesh>
  )
}

/** Реквізит і руїни: скриня, амфори, монети, статуя, колони. */
export function Props() {
  return (
    <group>
      <TreasureChest position={[2.8, 0.2, -0.6]} rotation={[0, -0.5, 0]} />
      <Amphora position={[-3.8, 0.3, -0.8]} rotation={[0, 0.4, 0]} />
      <Amphora position={[3.4, 0.3, 2.6]} rotation={[0.1, 0, -0.3]} scale={0.8} />
      <Amphora position={[-2.4, 0.25, 3.4]} rotation={[0.2, 0, 0.2]} scale={0.9} />
      <Coins position={[1.4, 0.1, 1.6]} />
      <FallenStatue position={[3.6, 0.15, 3.4]} rotation={[0, -0.7, 0]} />
      <BrokenColumn position={[-6.8, 0.3, -6]} rotation={[0, 0, 0.1]} />
      <BrokenColumn position={[7.2, 0.3, -6.8]} rotation={[0, 0.2, 0]} scale={0.9} />
      <BrokenColumn position={[-8.5, 0.25, 2]} rotation={[0, 0, 1.45]} scale={1.1} />
      <BrokenColumn position={[8.5, 0.25, -1.5]} rotation={[0, 0, -1.5]} scale={1} />
    </group>
  )
}

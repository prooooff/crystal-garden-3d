// Генерує складну GLTF-модель «Кришталева вежа» у public/models/.
// Запуск: npm run generate:model  (потрібен встановлений пакет three)
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Buffer } from 'node:buffer'

// GLTFExporter у Node використовує браузерний FileReader, якого немає в глобальному скоупі.
// Додаємо мінімальний поліфіл (Node Blob підтримує arrayBuffer()).
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf
        if (this.onloadend) this.onloadend()
      })
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        const type = blob.type || 'application/octet-stream'
        this.result = `data:${type};base64,${Buffer.from(buf).toString('base64')}`
        if (this.onloadend) this.onloadend()
      })
    }
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public/models')
mkdirSync(outDir, { recursive: true })

// PBR-матеріали (метал + емісія — зберігаються в GLTF)
const coreMat = new THREE.MeshStandardMaterial({
  color: '#7c3aed', metalness: 0.6, roughness: 0.2,
  emissive: '#2a0a5e', emissiveIntensity: 0.7,
})
const ringMat = new THREE.MeshStandardMaterial({
  color: '#22d3ee', metalness: 0.9, roughness: 0.15,
  emissive: '#0a3a4a', emissiveIntensity: 0.55,
})
const satMat = new THREE.MeshStandardMaterial({
  color: '#f472b6', metalness: 0.4, roughness: 0.3,
  emissive: '#5e0a3a', emissiveIntensity: 0.8,
})
const nodeMat = new THREE.MeshStandardMaterial({
  color: '#fbbf24', metalness: 0.7, roughness: 0.2,
  emissive: '#5e3a00', emissiveIntensity: 0.9,
})

const group = new THREE.Group()
group.name = 'CrystalTower'

// Центральний витягнутий кристал (октаедр)
const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 0), coreMat)
core.scale.set(1, 1.8, 1)
core.position.y = 0.4
group.add(core)

// Три орбітальні кільця (торуси) навколо ядра
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3 + i * 0.35, 0.05, 16, 80), ringMat)
  ring.rotation.x = Math.PI / 2 + i * 0.5
  ring.rotation.y = i * 0.7
  group.add(ring)
}

// Сателітні кристали
for (let i = 0; i < 5; i++) {
  const a = (i / 5) * Math.PI * 2
  const sat = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 0), satMat)
  sat.position.set(Math.cos(a) * 1.9, Math.sin(a * 2) * 0.55 + 0.4, Math.sin(a) * 1.9)
  group.add(sat)
}

// Енергетичні вузли (маленькі сфери)
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2
  const node = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), nodeMat)
  node.position.set(Math.cos(a) * 1.9, 0.4, Math.sin(a) * 1.9)
  group.add(node)
}

group.traverse((o) => {
  if (o.isMesh) {
    o.castShadow = true
    o.receiveShadow = true
  }
})

const exporter = new GLTFExporter()
exporter.parse(
  group,
  (result) => {
    if (result instanceof ArrayBuffer) {
      writeFileSync(resolve(outDir, 'crystal-tower.glb'), Buffer.from(result))
      console.log('✅ Згенеровано public/models/crystal-tower.glb')
    } else {
      // Небінарний JSON-формат .gltf: буфер вбудовано як base64 data URI.
      writeFileSync(resolve(outDir, 'crystal-tower.gltf'), JSON.stringify(result))
      console.log('✅ Згенеровано public/models/crystal-tower.gltf')
    }
  },
  (error) => {
    console.error('❌ Помилка GLTFExporter:', error)
    process.exit(1)
  },
  { binary: false },
)

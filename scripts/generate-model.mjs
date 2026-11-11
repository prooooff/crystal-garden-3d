// Генерує складну GLTF-модель «Затонулий храм» (кам'яна брама + вівтар)
// у public/models/sunken-temple.gltf.
// Запуск: npm run generate:model
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Buffer } from 'node:buffer'

// GLTFExporter у Node використовує браузерний FileReader, якого немає в глобальному скоупі.
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

// Матеріали (камінь, темний камінь, золото)
const stone = new THREE.MeshStandardMaterial({ color: '#4b5a6a', metalness: 0.15, roughness: 0.85 })
const stoneDark = new THREE.MeshStandardMaterial({ color: '#2b3947', metalness: 0.15, roughness: 0.9 })
const gold = new THREE.MeshStandardMaterial({
  color: '#d4af37', metalness: 1, roughness: 0.25,
  emissive: '#3a2a00', emissiveIntensity: 0.4,
})

const group = new THREE.Group()
group.name = 'SunkenTemple'

// Дві колони брами
const pillarGeo = new THREE.CylinderGeometry(0.55, 0.8, 5, 12)
const left = new THREE.Mesh(pillarGeo, stone)
left.position.set(-3, 2.5, 0)
group.add(left)

const right = new THREE.Mesh(pillarGeo, stone)
right.position.set(3, 2.5, 0)
right.rotation.z = 0.04
group.add(right)

// Надламаний перетин (балка над колонами)
const lintel = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.8, 1.4), stoneDark)
lintel.position.set(0, 5.1, 0)
lintel.rotation.z = 0.06
group.add(lintel)

// Сходинки вівтаря
const step1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 3.2), stoneDark)
step1.position.set(0, 0.25, 0)
group.add(step1)
const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.5, 2.3), stone)
step2.position.set(0, 0.75, 0)
group.add(step2)

// Золоте кільце-інкрустація на вівтарі
const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.06, 12, 64), gold)
ring.rotation.x = Math.PI / 2
ring.position.set(0, 1.05, 0)
group.add(ring)

// Уламки колон поруч
const stubGeo = new THREE.CylinderGeometry(0.45, 0.55, 1.6, 10)
const stub1 = new THREE.Mesh(stubGeo, stone)
stub1.position.set(4.6, 0.8, 1.2)
stub1.rotation.z = 0.3
group.add(stub1)

const stub2 = new THREE.Mesh(stubGeo, stoneDark)
stub2.position.set(-4.7, 0.7, -1.0)
stub2.rotation.x = 0.4
stub2.rotation.z = -0.2
group.add(stub2)

// Золоті сфери на верхівках колон
const sphereGeo = new THREE.SphereGeometry(0.22, 24, 24)
const g1 = new THREE.Mesh(sphereGeo, gold)
g1.position.set(-3, 5.1, 0)
group.add(g1)
const g2 = new THREE.Mesh(sphereGeo, gold)
g2.position.set(3, 5.1, 0)
group.add(g2)

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
      writeFileSync(resolve(outDir, 'sunken-temple.glb'), Buffer.from(result))
      console.log('✅ Згенеровано public/models/sunken-temple.glb')
    } else {
      writeFileSync(resolve(outDir, 'sunken-temple.gltf'), JSON.stringify(result))
      console.log('✅ Згенеровано public/models/sunken-temple.gltf')
    }
  },
  (error) => {
    console.error('❌ Помилка GLTFExporter:', error)
    process.exit(1)
  },
  { binary: false },
)

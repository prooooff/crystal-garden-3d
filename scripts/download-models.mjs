// Завантажує готові CC0-моделі з Poly Pizza у public/models/imported/.
// Запуск: node scripts/download-models.mjs
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public/models/imported')
mkdirSync(outDir, { recursive: true })

// [slug, назва файлу]
const MODELS = [
  ['3GPUntjwqCa', 'goldfish'],
  ['769fHo3eEB', 'clownfish'],
  ['8DXeKkgTS_s', 'blowfish'],
  ['1mVWW4RFVHc', 'shark'],
  ['3HEc6LvqCJd', 'coral-orange'],
  ['4KUXdtDdgHR', 'coral'],
  ['8UNN578byC0', 'coral-2'],
  ['5mWGVL6VgMd', 'anemone'],
  ['3VhttTFyADO', 'kelp'],
  ['oYxUdpyc4u', 'seaweed'],
  ['54jZKTAt5p', 'rock-large'],
  ['KZdEP3uUpa', 'rock-medium'],
  ['JQxF95498B', 'rock-medium-2'],
  ['u26ZhjApbs', 'chest-ocean'],
  ['f7SU-dO1FG7', 'chest'],
  ['n8ZvVFcJhl', 'column'],
  ['0Mkdl3SJDT', 'statue'],
  ['bceVxKNzLaJ', 'nautilus'],
  ['6H-0K9IEr56', 'starfish'],
  ['5ovn4mnRejL', 'seashell'],
]

for (const [slug, name] of MODELS) {
  const outPath = resolve(outDir, `${name}.glb`)
  if (existsSync(outPath)) {
    console.log(`skip ${name} (already downloaded)`)
    continue
  }
  try {
    const pageRes = await fetch(`https://poly.pizza/m/${slug}`, { headers: { 'user-agent': 'Mozilla/5.0' } })
    const html = await pageRes.text()
    const match = html.match(/https:\/\/static\.poly\.pizza\/[A-Za-z0-9-]+\.glb/)
    if (!match) {
      console.log(`NO GLB for ${name} (${slug})`)
      continue
    }
    const glbUrl = match[0]
    const glbRes = await fetch(glbUrl, { headers: { 'user-agent': 'Mozilla/5.0' } })
    const buf = Buffer.from(await glbRes.arrayBuffer())
    writeFileSync(outPath, buf)
    const isGlb = buf.length > 4 && buf.readUInt32LE(0) === 0x46546c67
    console.log(`${name}: ${buf.length} bytes, valid=${isGlb}`)
  } catch (e) {
    console.log(`${name}: ERROR ${e.message}`)
  }
}

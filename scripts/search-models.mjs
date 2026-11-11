// Допоміжний скрипт: шукає моделі на Poly Pizza і друкує (слаг :: назва).
// Використання: node scripts/search-models.mjs "coral" "fish" "rock" ...
const queries = process.argv.slice(2)
if (!queries.length) {
  console.log('usage: node scripts/search-models.mjs "coral" "fish" ...')
  process.exit(1)
}

const seen = new Set()

for (const q of queries) {
  const url = `https://poly.pizza/search/${encodeURIComponent(q)}`
  let html = ''
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
    html = await res.text()
  } catch (e) {
    console.log(`\n=== ${q} === ERROR ${e.message}`)
    continue
  }

  console.log(`\n=== ${q} ===`)
  const slugRe = /\/m\/([A-Za-z0-9_-]+)/g
  let m
  let count = 0
  while ((m = slugRe.exec(html)) !== null && count < 12) {
    const slug = m[1]
    if (seen.has(slug)) continue
    seen.add(slug)
    count++
    // шукаємо назву поруч зі слагом (у наступних 400 символах)
    const after = html.slice(m.index, m.index + 500)
    const nameMatch = after.match(/(?:title|alt)="([^"]{1,60})"/)
    const name = nameMatch ? nameMatch[1] : '?'
    console.log(`${slug} :: ${name}`)
  }
}

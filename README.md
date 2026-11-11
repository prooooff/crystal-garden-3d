# Затонулий храм (Abyss) — фінальний проєкт 3D_R3F

Інтерактивна підводна 3D-сцена «Затонулий храм» на **Three.js** + **React Three Fiber**.
Цілісна концепція: руїни храму на дні, сяючий артефакт, коралові рифи, фауна, світло крізь товщу води та підводна фізика.

## 🚀 Технології

- **React 19 + TypeScript + Vite**
- **three.js** (рендер, камера, геометрія)
- **@react-three/fiber** — декларативна інтеграція three.js у React
- **@react-three/drei** — OrbitControls, Environment, Lightformer, Sparkles, useGLTF
- **@react-three/rapier** (Rapier) — фізика
- **@react-three/postprocessing** — Bloom + Vignette + ChromaticAberration

## ✅ Як реалізовані вимоги

| Вимога | Реалізація |
| --- | --- |
| **Примітиви** | `box`, `cylinder`, `sphere`, `plane`, `icosahedron`, `torus` (колони, вівтар, уламки, енергетичні елементи) |
| **Складні моделі** | GLTF-модель «кам'яна брама + вівтар» + ~20 готових CC0-моделей (корали, риби, скелі, скрині, статуя, колони) |
| **Матеріали** | камінь, золото (metalness/emissive), `shadowMaterial`, кастомні `shaderMaterial` |
| **Освітлення** | ambient + hemisphere + directional (god ray + тіні) + point-світло артефакту (пульсує) |
| **Тіні** | `PCFSoftShadowMap`, shadow map 2048×2048, `castShadow`/`receiveShadow`, `ShadowMaterial`-приймач |
| **Анімація** | каустика, хвилі води, пульс артефакту, коливання флори, зграя риб, бульбашки, god rays, морський сніг |
| **Фізика** | Rapier: знижена гравітація (вода), динамічні валуни, впала колона, плавучі ящики (нейтральна плавучість), ударні хвилі |
| **Якісний рендер** | ACES Filmic, antialias, dpr [1,2], Bloom + Vignette + ChromaticAberration |
| **Шейдер** | 3 кастомні GLSL: `caustics` (каустика + пісок), `water` (поверхня води), `glow` (френель артефакту) |

## 🕹️ Керування

- **Клік** — ударна хвиля (розштовхує уламки)
- **E** — потужна ударна хвиля
- **Drag** — обертання камери
- **Scroll** — наближення / віддалення
- **ПКМ + drag** — панорамування

## 📁 Структура

```
src/
  App.tsx             # Canvas + налаштування рендера
  Scene.tsx           # композиція сцени
  AutoModel.tsx       # завантаження GLB + авто-нормалізація розміру
  shaders.ts          # кастомні GLSL-шейдери (caustics / water / glow)
  CausticsFloor.tsx   # дно з каустикою + приймач тіней
  WaterSurface.tsx    # поверхня води (хвилі + френель)
  GlowArtifact.tsx    # сяючий артефакт (fresnel)
  ComplexModel.tsx    # завантаження GLTF-моделі храму
  Lights.tsx          # підводне освітлення + тіні
  LightBeams.tsx      # god rays з поверхні
  PhysicsWorld.tsx    # фізика Rapier (уламки, плавучість, ударні хвилі)
  Effects.tsx         # постобробка
  Overlay.tsx         # HTML-оверлей
  environment/
    rng.ts            # детермінований PRNG (бульбашки)
    Rocks.tsx         # скелі (готові GLB)
    Flora.tsx         # корали, анемони, ламінарія (готові GLB)
    Fauna.tsx         # зграя риб + бульбашки
    Props.tsx         # скрині, статуя, колони, черепашки (готові GLB)
scripts/
  generate-model.mjs  # генерація GLTF-моделі храму
  download-models.mjs # завантаження CC0-моделей з Poly Pizza
  search-models.mjs   # пошук моделей на Poly Pizza
public/models/
  imported/           # готові GLB-моделі (Poly Pizza)
```

## 📦 Моделі

Готові 3D-моделі завантажені з [Poly Pizza](https://poly.pizza) (CC0/CC-BY, безкоштовні для використання). Скрипт `scripts/download-models.mjs` качає їх у `public/models/imported/`.

## 🛠️ Запуск локально

```bash
npm install
npm run dev              # http://localhost:5173
```

## 📦 Білд

```bash
npm run build    # результат у dist/
npm run preview  # перегляд продакшн-білду
```

## ☁️ Деплой

**Vercel (рекомендовано):**

1. Завантажте проєкт у GitHub-репозиторій.
2. На [vercel.com](https://vercel.com) → *Add New → Project* → оберіть репозиторій.
3. Vercel автоматично визначить Vite (build `npm run build`, output `dist`).
4. **Deploy** → отримаєте посилання.

Або через CLI: `npm i -g vercel && vercel login && vercel --prod`.

**GitHub Pages:** `npm run build` і задеплойте вміст `dist/` (за потреби налаштуйте `base` у `vite.config.ts`).

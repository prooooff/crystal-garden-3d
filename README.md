# Crystal Garden — фінальний проєкт 3D_R3F

Інтерактивна 3D-сцена «Кришталевий сад» на **Three.js** + **React Three Fiber**.
Проєкт розроблений із використанням ШІ-асистента (генерація коду, шейдерів та моделі).

## 🚀 Технології

- **React 19 + TypeScript + Vite**
- **three.js** (рендер, камера, геометрія)
- **@react-three/fiber** — декларативна інтеграція three.js у React
- **@react-three/drei** — допоміжні компоненти (OrbitControls, Environment, Lightformer, useGLTF)
- **@react-three/rapier** (Rapier physics) — реалістична фізика
- **@react-three/postprocessing** — Bloom + Vignette (якісний рендер)

## ✅ Як реалізовані вимоги

| Вимога | Реалізація |
| --- | --- |
| **Примітиви** | `boxGeometry`, `sphereGeometry`, `planeGeometry`, `icosahedronGeometry`, `octahedronGeometry`, `torusGeometry` (постаменти, кулі, кристали) |
| **Складні моделі** | Завантажена GLTF-модель «Кришталева вежа» (`public/models/crystal-tower.gltf`) + процедурні групи |
| **Матеріали** | `meshStandardMaterial` (metalness/roughness/emissive), `shadowMaterial`, кастомні `shaderMaterial` |
| **Освітлення** | ambient, hemisphere, directional, 3 point light (два анімовані), процедурна env map |
| **Тіні** | `PCFSoftShadowMap`, shadow map 2048×2048, `castShadow`/`receiveShadow`, `ShadowMaterial`-приймач |
| **Анімація** | обертання/плавання моделі та кристалів, рух світла, анімовані шейдерні uniformи |
| **Фізика** | Rapier: гравітація, колайдери, restitution, стопка кубів, спавн куль по кліку |
| **Якісний рендер** | ACES Filmic tone mapping, antialias, dpr [1,2], м'які тіні, Bloom + Vignette |
| **Шейдер** | 2 кастомні GLSL-шейдери: `energyFloor` (хвилі + сітка) та `glowCrystal` (френель) |

## 🕹️ Керування

- **Клік** — кинути неонову кулю (фізика)
- **Drag** — обертання камери
- **Scroll** — наближення/віддалення
- **ПКМ + drag** — панорамування

## 📁 Структура

```
src/
  App.tsx             # Canvas + налаштування рендера
  Scene.tsx           # композиція сцени
  shaders.ts          # кастомні GLSL-шейдери
  EnergyFloor.tsx     # підлога-шейдер + приймач тіней
  GlowCrystal.tsx     # неонові кристали (шейдер)
  Crystals.tsx        # група кристалів
  ComplexModel.tsx    # завантаження GLTF-моделі
  Lights.tsx          # освітлення + тіні
  PhysicsWorld.tsx    # фізика Rapier + спавнер куль
  Effects.tsx         # постобробка
  Overlay.tsx         # HTML-оверлей
scripts/
  generate-model.mjs  # генерація GLTF-моделі
public/models/        # згенерована модель
```

## 🛠️ Запуск локально

```bash
npm install
npm run generate:model   # (модель вже в репозиторії; потрібно лише для регенерації)
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
3. Vercel автоматично визначить Vite (build command `npm run build`, output `dist`).
4. Натисніть **Deploy** — отримаєте посилання.

Або через CLI:

```bash
npm i -g vercel
vercel login
vercel --prod
```

**GitHub Pages:** `npm run build` і задеплойте вміст `dist/` (за потреби налаштуйте `base` у `vite.config.ts`).

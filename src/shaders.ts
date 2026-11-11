// Кастомні GLSL-шейдери проєкту.
// 1) EnergyFloor — анімована енергетична сітка підлоги (вершинні хвилі + фрагментна сітка).
// 2) GlowCrystal — френелівське неонове свічення кристалів.

export const energyFloorVertex = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying vec3 vWorldPos;
varying float vHeight;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Вершинне зміщення: суперпозиція хвиль у площині площини (вздовж її локальної нормалі Z).
  float w = sin(pos.x * 2.2 + uTime * 1.1) * cos(pos.y * 2.2 + uTime * 0.8);
  w += sin((pos.x + pos.y) * 3.0 + uTime * 0.6) * 0.55;
  w += cos(pos.x * 5.0 - uTime * 0.4) * 0.25;
  pos.z += w * 0.07;
  vHeight = w;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

export const energyFloorFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;
varying vec3 vWorldPos;
varying float vHeight;

void main() {
  // Антиаліазована сітка (на основі похідних екранних координат).
  vec2 g = vUv * 44.0;
  vec2 grid = abs(fract(g - 0.5) - 0.5) / fwidth(g);
  float line = min(grid.x, grid.y);
  float gridIntensity = 1.0 - min(line, 1.0);

  // Радіальна пульсація, що розходиться від центру сцени.
  vec2 c = vUv - 0.5;
  float dist = length(c);
  float pulse = 0.5 + 0.5 * sin(dist * 22.0 - uTime * 3.0);
  pulse *= smoothstep(0.65, 0.05, dist);

  // Градієнт базового кольору, підсвічення гребенів хвиль, сітка і пульс.
  vec3 base = mix(uColorA, uColorB, vUv.y * 0.6 + vUv.x * 0.4);
  vec3 col = base * (0.10 + vHeight * 1.6);
  col += uColorB * gridIntensity * 0.55;
  col += uColorA * pulse * 0.7;
  col += uColorB * pow(max(vHeight, 0.0), 2.0) * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`

export const glowCrystalVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorldPos;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);

  vec4 mvPosition = viewMatrix * worldPos;
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const glowCrystalFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorldPos;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);

  // Френель: краї кристала світяться сильніше за центр.
  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);

  // Пульсація, залежна від часу і висоти, щоб кристали «дихали».
  float pulse = 0.55 + 0.45 * sin(uTime * 2.0 + vWorldPos.y * 2.5);

  vec3 col = mix(uColor1, uColor2, fresnel * pulse);
  col += uColor2 * fresnel * 1.6 * pulse;

  gl_FragColor = vec4(col, 1.0);
}
`

// Кастомні GLSL-шейдери проєкту «Затонулий храм»:
// 1) caustics — рухомі переливи світла на дні (каустика).
// 2) water — напівпрозора поверхня води з хвилями та френелем.
// 3) glow — френелівське свічення артефакту.

export const causticsVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const causticsFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uSand;
uniform vec3 uLight;
varying vec2 vUv;

float causticPattern(vec2 uv, float t) {
  float c = 0.0;
  float a = 0.55;
  vec2 p = uv;
  for (int i = 0; i < 4; i++) {
    vec2 q = p * 1.4 + vec2(t * (0.18 + 0.08 * float(i)), t * 0.12);
    c += a * (sin(q.x + sin(q.y * 1.7 + t * 1.2)) + sin(q.y + cos(q.x * 1.4 + t * 0.9)));
    p = p * 1.7 + vec2(0.37, 0.71);
    a *= 0.5;
  }
  return c;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  float c = causticPattern(vUv * 3.2, uTime);
  c = c * 0.5 + 0.5;
  c = smoothstep(0.4, 0.9, c);

  // Зернистість і плямистість піску
  float g = noise(vUv * 260.0);
  float patches = noise(vUv * 7.0) * 0.5 + noise(vUv * 20.0) * 0.3;
  vec3 sand = uSand + (g - 0.5) * 0.14 + (patches - 0.35) * 0.12;

  vec3 col = mix(sand, uLight, c);
  gl_FragColor = vec4(col, 1.0);
}
`

export const waterVertex = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 pos = position;
  pos.z += sin(pos.x * 0.8 + uTime * 1.2) * 0.15 + cos(pos.y * 0.7 + uTime * 0.9) * 0.15;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);

  vec4 mvPosition = viewMatrix * worldPos;
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const waterFragment = /* glsl */ `
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);
  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);
  float alpha = mix(0.5, 0.85, fresnel);
  vec3 col = uColor + vec3(0.12, 0.22, 0.28) * fresnel;
  gl_FragColor = vec4(col, alpha);
}
`

export const glowVertex = /* glsl */ `
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

export const glowFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorldPos;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);

  // Френель: краї артефакту світяться сильніше за центр.
  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);

  // Пульсація, залежна від часу і висоти.
  float pulse = 0.6 + 0.4 * sin(uTime * 2.0 + vWorldPos.y * 2.5);

  vec3 col = mix(uColor1, uColor2, fresnel * pulse);
  col += uColor2 * fresnel * 1.6 * pulse;

  gl_FragColor = vec4(col, 1.0);
}
`

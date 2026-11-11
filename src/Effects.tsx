import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
} from '@react-three/postprocessing'
import * as THREE from 'three'

/**
 * Постобробка для «максимально якісного рендеру»:
 *  - Bloom — неонове свічення,
 *  - ChromaticAberration — легка кінематографічна аберація,
 *  - Vignette — м'яке затемнення країв,
 *  - Noise — тонке кінематографічне зерно.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={1.15} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
      <ChromaticAberration offset={new THREE.Vector2(0.0009, 0.0012)} />
      <Vignette offset={0.25} darkness={0.85} />
      <Noise opacity={0.02} />
    </EffectComposer>
  )
}

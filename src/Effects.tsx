import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing'
import * as THREE from 'three'

/**
 * Постобробка: Bloom (свічення артефакту/променів),
 * легка хроматична аберація (товща води) та Vignette.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
      <ChromaticAberration offset={new THREE.Vector2(0.0006, 0.0008)} />
      <Vignette offset={0.25} darkness={0.9} />
    </EffectComposer>
  )
}

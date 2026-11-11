import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

/**
 * Постобробка для «максимально якісного рендеру»:
 *  - Bloom — неонове свічення яскравих/емісивних поверхонь,
 *  - Vignette — м'яке затемнення країв кадру.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={1.1}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      <Vignette offset={0.25} darkness={0.85} />
    </EffectComposer>
  )
}

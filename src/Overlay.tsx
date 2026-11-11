/** HTML-оверлей поверх 3D-сцени: назва, керування, кредити. */
export function Overlay() {
  return (
    <div className="overlay">
      <div className="overlay__panel">
        <h1 className="overlay__title">Crystal Garden</h1>
        <p className="overlay__subtitle">3D_R3F · Final Project</p>
        <ul className="overlay__list">
          <li><kbd>Клік</kbd> — кинути неонову кулю (фізика Rapier)</li>
          <li><kbd>Drag</kbd> — обертання камери</li>
          <li><kbd>Scroll</kbd> — наближення / віддалення</li>
          <li><kbd>ПКМ drag</kbd> — панорамування</li>
        </ul>
      </div>
      <div className="overlay__credit">
        Three.js · React Three Fiber · Rapier
        <br />
        Шейдери · Тіні · Постобробка
      </div>
    </div>
  )
}

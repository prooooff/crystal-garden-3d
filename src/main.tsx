import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Точка входу React-додатка.
// StrictMode вимкнено навмисно: він дублює монтування в dev-режимі,
// що може спричинити подвійну ініціалізацію фізичного світу Rapier.
createRoot(document.getElementById('root')!).render(<App />)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'  // Remova .tsx

try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error("Elemento root não encontrado!");
    } else {
        createRoot(rootElement).render(
            <StrictMode>
                <App />
            </StrictMode>
        );
        console.log("React renderizado com sucesso!");
    }
} catch (error) {
    console.error("Erro ao renderizar React:", error);
}
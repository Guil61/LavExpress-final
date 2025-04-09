import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Cadastro from './Cadastro'; // Certifique-se de ter o componente de cadastro

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                {/* Outras rotas */}
            </Routes>
        </Router>
    );
}

export default App;

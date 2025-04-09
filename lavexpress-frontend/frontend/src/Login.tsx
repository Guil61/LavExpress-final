import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8090/api/auth/login', { // Alterado para garantir o caminho correto
                email,
                senha,
            });

            alert('Login realizado com sucesso!');
            console.log('Login realizado:', response.data);
            navigate('/dashboard');  // Redireciona após o login
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Usuário ou senha inválidos');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Entrar</button>
            </form>
            <p>
                Não tem uma conta? <a href="/cadastro">Cadastre-se</a>
            </p>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '400px',
        margin: 'auto',
        textAlign: 'center' as const,
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginTop: '100px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '10px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default Login;

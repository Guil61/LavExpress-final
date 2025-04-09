import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        try {
            const response = await axios.post('/api/auth/cadastro', {
                nome,
                email,
                senha,
            });


            alert('Cadastro realizado com sucesso!');
            console.log('Cadastro realizado:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao realizar cadastro');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    style={styles.input}
                />
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
                <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Cadastrar</button>
            </form>
            <p>
                Já tem uma conta? <a href="/login" style={styles.link}>Faça login</a>
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
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '10px',
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '12px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default Cadastro;

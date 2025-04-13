import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem!');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/cadastro', {
                nome,
                email,
                senha,
                telefone,
                endereco
            });

            console.log('Cadastro realizado com sucesso:', response.data);
            alert('Cadastro realizado com sucesso!');
            navigate('/login');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setErro('Erro ao realizar cadastro. Verifique seus dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.cadastroBox}>
                <div style={styles.logoContainer}>
                    <h1 style={styles.logo}>LavExpress</h1>
                    <p style={styles.tagline}>Cadastre-se e encontre o melhor lava-jato</p>
                </div>

                {erro && <div style={styles.erro}>{erro}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome completo</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            style={styles.input}
                            placeholder="Seu nome completo"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="Seu email"
                            required
                        />
                    </div>

                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Senha</label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                style={styles.input}
                                placeholder="Crie uma senha"
                                required
                                minLength={6}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirmar senha</label>
                            <input
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                style={styles.input}
                                placeholder="Confirme sua senha"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Telefone</label>
                        <input
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            style={styles.input}
                            placeholder="(00) 00000-0000"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Endereço</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            style={styles.input}
                            placeholder="Rua, número, bairro, cidade"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <div style={styles.links}>
                    <a href="/login" style={styles.link}>Já tem uma conta? Faça login</a>
                </div>

                <div style={styles.footer}>
                    <div style={styles.carIcon}>🚗</div>
                    <p>© 2025 LavExpress - Todos os direitos reservados</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f8ff',
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
    },
    cadastroBox: {
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        boxSizing: 'border-box' as const
    },
    logoContainer: {
        textAlign: 'center' as const,
        marginBottom: '30px'
    },
    logo: {
        color: '#1e90ff',
        margin: '0 0 5px 0',
        fontSize: '32px'
    },
    tagline: {
        color: '#555',
        margin: 0,
        fontSize: '16px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px'
    },
    inputRow: {
        display: 'flex',
        gap: '20px',
        width: '100%'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '5px',
        flex: 1
    },
    label: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#444'
    },
    input: {
        padding: '12px 15px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
        transition: 'border 0.3s',
        outline: 'none'
    },
    button: {
        backgroundColor: '#1e90ff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '13px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px'
    },
    buttonDisabled: {
        backgroundColor: '#84b9f5',
        cursor: 'not-allowed'
    },
    links: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '25px'
    },
    link: {
        color: '#1e90ff',
        textDecoration: 'none',
        fontSize: '14px'
    },
    erro: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px 15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center' as const
    },
    footer: {
        marginTop: '40px',
        textAlign: 'center' as const,
        color: '#888',
        fontSize: '12px'
    },
    carIcon: {
        fontSize: '24px',
        marginBottom: '10px'
    }
};

export default Cadastro;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Cadastro() {
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCadastro = async () => {
        setErro('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem!');
            return;
        }

        try {
            setLoading(true);

            // Aqui você pode chamar sua API de cadastro
            // await axios.post('URL_DA_SUA_API', { nome, email, senha, telefone, endereco });

            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            router.replace('/login');
        } catch (error) {
            setErro('Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.box}>
                <Text style={styles.logo}>LavExpress</Text>
                <Text style={styles.tagline}>Cadastre-se e encontre o melhor lava-jato</Text>

                {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

                <TextInput
                    placeholder="Nome completo"
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                />
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <View style={styles.row}>
                    <TextInput
                        placeholder="Senha"
                        style={[styles.input, { flex: 1, marginRight: 10 }]}
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />
                    <TextInput
                        placeholder="Confirmar senha"
                        style={[styles.input, { flex: 1 }]}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry
                    />
                </View>
                <TextInput
                    placeholder="Telefone"
                    style={styles.input}
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    placeholder="Endereço"
                    style={styles.input}
                    value={endereco}
                    onChangeText={setEndereco}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleCadastro}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('/login')}>
                    <Text style={styles.link}>Já tem uma conta? Faça login</Text>
                </TouchableOpacity>

                <Text style={styles.footer}>🚗 © 2025 LavExpress - Todos os direitos reservados</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f8ff',
        flexGrow: 1,
        justifyContent: 'center',
    },
    box: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logo: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1e90ff',
        marginBottom: 5,
    },
    tagline: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginBottom: 25,
    },
    erro: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonDisabled: {
        backgroundColor: '#84b9f5',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#1e90ff',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
    },
    footer: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
});

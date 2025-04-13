// app/cadastro.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function CadastroScreen() {
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const handleCadastro = async () => {
        setErro('');

        // Validações básicas
        if (!nome || !email || !senha || !confirmarSenha || !telefone) {
            setErro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErro('Por favor, informe um email válido.');
            return;
        }

        // Validação de senha
        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem!');
            return;
        }

        try {
            setLoading(true);

            // Simulação de chamada de API
            // Aqui você pode chamar sua API de cadastro
            // await api.post('/cadastro', { nome, email, senha, telefone, endereco });

            // Simulando um tempo de resposta da API
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert(
                'Sucesso',
                'Cadastro realizado com sucesso!',
                [{ text: 'OK', onPress: () => router.replace('/login') }]
            );
        } catch (error) {
            setErro('Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/login')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0077cc" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Criar Conta</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        <View style={styles.logo}>
                            <Text style={styles.logoTitle}>
                                <Text style={styles.logoLav}>Lav</Text>
                                Express
                            </Text>
                            <Text style={styles.logoSubtitle}>Cadastre-se e encontre o melhor lava-jato</Text>
                        </View>

                        {erro !== '' && (
                            <View style={styles.erroContainer}>
                                <Ionicons name="alert-circle" size={20} color="#c62828" />
                                <Text style={styles.erroText}>{erro}</Text>
                            </View>
                        )}

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome completo *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Digite seu nome completo"
                                        value={nome}
                                        onChangeText={setNome}
                                    />
                                    <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Digite seu email"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Senha *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Crie uma senha"
                                        value={senha}
                                        onChangeText={setSenha}
                                        secureTextEntry={!mostrarSenha}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setMostrarSenha(!mostrarSenha)}
                                        style={styles.inputIcon}
                                    >
                                        <Ionicons
                                            name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#999"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirmar senha *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirme sua senha"
                                        value={confirmarSenha}
                                        onChangeText={setConfirmarSenha}
                                        secureTextEntry={!mostrarConfirmarSenha}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                        style={styles.inputIcon}
                                    >
                                        <Ionicons
                                            name={mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#999"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Telefone *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="(00) 00000-0000"
                                        value={telefone}
                                        onChangeText={setTelefone}
                                        keyboardType="phone-pad"
                                    />
                                    <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Endereço (opcional)</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Seu endereço"
                                        value={endereco}
                                        onChangeText={setEndereco}
                                    />
                                    <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
                                </View>
                            </View>

                            <Text style={styles.camposObrigatorios}>* Campos obrigatórios</Text>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleCadastro}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.buttonText}>Cadastrar</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => router.replace('/login')}
                        >
                            <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
                        </TouchableOpacity>

                        <View style={styles.termos}>
                            <Text style={styles.termosTexto}>
                                Ao se cadastrar, você concorda com nossos{' '}
                                <Text style={styles.termosLink}>Termos de Uso</Text> e{' '}
                                <Text style={styles.termosLink}>Política de Privacidade</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    statusBarSpacer: {
        height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        backgroundColor: "white",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        marginBottom: 20,
    },
    logo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    logoLav: {
        color: '#0077cc',
    },
    logoSubtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    erroContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    erroText: {
        color: '#c62828',
        marginLeft: 8,
        flex: 1,
    },
    form: {
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
    },
    inputIcon: {
        paddingHorizontal: 15,
    },
    camposObrigatorios: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#0077cc',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#84b9f5',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        alignItems: 'center',
        marginVertical: 16,
    },
    linkText: {
        color: '#0077cc',
        fontSize: 14,
        fontWeight: '500',
    },
    termos: {
        marginTop: 8,
    },
    termosTexto: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 18,
    },
    termosLink: {
        color: '#0077cc',
        fontWeight: '500',
    },
});
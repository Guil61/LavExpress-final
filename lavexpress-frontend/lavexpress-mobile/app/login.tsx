// app/login.tsx

import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    // Função para validar e fazer login
    const fazerLogin = () => {
        // Validação básica
        if (!email || !senha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        // Validação de formato de email simples
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Erro", "Por favor, informe um email válido.");
            return;
        }

        // Navegar diretamente para a tela home após validação bem-sucedida
        router.replace('/home');
    };

    // Navegar para tela de cadastro
    const navegarParaCadastro = () => {
        router.push('/cadastro');
    };

    // Navegar para tela de recuperação de senha
    const navegarParaRecuperarSenha = () => {
        router.push('/recuperarsenha');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer}/>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.loginContainer}>
                        <View style={styles.logo}>
                            <Text style={styles.logoTitle}>
                                <Text style={styles.logoLav}>Lav</Text>
                                Express
                            </Text>
                            <Text style={styles.logoSubtitle}>Seu lava-jato na palma da mão</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Seu email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                    <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon}/>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Senha</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Sua senha"
                                        secureTextEntry={!mostrarSenha}
                                        value={senha}
                                        onChangeText={setSenha}
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

                            <TouchableOpacity
                                style={styles.button}
                                onPress={fazerLogin}
                            >
                                <Text style={styles.buttonText}>Entrar</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.links}>
                            <TouchableOpacity onPress={navegarParaCadastro}>
                                <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={navegarParaRecuperarSenha}>
                                <Text style={styles.linkText}>Esqueceu sua senha?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.separador}>
                            <View style={styles.linha}/>
                            <Text style={styles.separadorTexto}>ou continue com</Text>
                            <View style={styles.linha}/>
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-google" size={20} color="#DB4437"/>
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-facebook" size={20} color="#4267B2"/>
                                <Text style={styles.socialButtonText}>Facebook</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>© 2025 LavExpress - Todos os direitos reservados</Text>
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
        backgroundColor: "#f5f5f5",
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    loginContainer: {
        width: '100%',
        maxWidth: 450,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 10,
        elevation: 5,
    },
    logo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    logoLav: {
        color: '#0077cc',
    },
    logoSubtitle: {
        color: '#555',
        fontSize: 16,
    },
    form: {
        marginBottom: 25,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
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
    button: {
        backgroundColor: '#0077cc',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    links: {
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    linkText: {
        color: '#0077cc',
        fontSize: 14,
        fontWeight: '500',
    },
    separador: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    linha: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    separadorTexto: {
        paddingHorizontal: 10,
        fontSize: 14,
        color: '#888',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    socialButtonText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    footer: {
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
});
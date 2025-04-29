// app/login.tsx

import React, { useState, useEffect } from "react";
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
    Alert,
    Animated,
    Dimensions
} from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [modoAdmin, setModoAdmin] = useState(false);

    // Valores animados
    const [animationValue] = useState(new Animated.Value(0));
    const [slideAnimation] = useState(new Animated.Value(0));

    // Efeito para animar a transição de modo
    useEffect(() => {
        Animated.parallel([
            Animated.timing(animationValue, {
                toValue: modoAdmin ? 1 : 0,
                duration: 350,
                useNativeDriver: false,
            }),
            Animated.spring(slideAnimation, {
                toValue: modoAdmin ? 1 : 0,
                friction: 8,
                tension: 40,
                useNativeDriver: false,
            })
        ]).start();
    }, [modoAdmin]);

    // Cores animadas baseadas no modo
    const backgroundColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#f5f5f5", "#1a1a1a"]
    });

    const cardBackgroundColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#ffffff", "#2a2a2a"]
    });

    const textColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#333333", "#ffffff"]
    });

    const primaryColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#0077cc", "#e63946"]
    });

    const secondaryColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#e6f3fb", "#471217"]
    });

    const inputBgColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#f9f9f9", "#3a3a3a"]
    });

    const inputBorderColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#ddd", "#555"]
    });

    const switchPosition = slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width / 2 - 20]
    });

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

        // Navegar para a tela apropriada com base no modo
        if (modoAdmin) {
            router.push('/admin/dashboard');
        } else {
            // Redirecionando para home.tsx em vez de index
            router.push('/home');
        }
    };

    // Navegar para tela de cadastro
    const navegarParaCadastro = () => {
        if (modoAdmin) {
            router.push('/cadastro-admin');
        } else {
            router.push('/cadastro');
        }
    };

    // Navegar para tela de recuperação de senha
    const navegarParaRecuperarSenha = () => {
        router.push('/recuperarsenha');
    };

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            <StatusBar
                barStyle={modoAdmin ? "light-content" : "dark-content"}
                backgroundColor="transparent"
                translucent
            />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={[styles.statusBarSpacer, { backgroundColor: modoAdmin ? "#1a1a1a" : "#f5f5f5" }]} />

            {/* Seletor de modo */}
            <View style={styles.modeSelectorContainer}>
                <Animated.View
                    style={[
                        styles.modeSelectorSwitch,
                        {
                            backgroundColor: primaryColor,
                            transform: [{ translateX: switchPosition }]
                        }
                    ]}
                />
                <TouchableOpacity
                    style={[styles.modeOption, modoAdmin ? {} : styles.activeOption]}
                    onPress={() => setModoAdmin(false)}
                >
                    <Animated.Text style={[styles.modeOptionText, { color: textColor }]}>
                        Cliente
                    </Animated.Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeOption, modoAdmin ? styles.activeOption : {}]}
                    onPress={() => setModoAdmin(true)}
                >
                    <Animated.Text style={[styles.modeOptionText, { color: textColor }]}>
                        Administrador
                    </Animated.Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={[styles.loginContainer, { backgroundColor: cardBackgroundColor }]}>
                        <View style={styles.logo}>
                            <Animated.Text style={[styles.logoTitle, { color: textColor }]}>
                                {modoAdmin ? (
                                    <>
                                        <Animated.Text style={{ color: primaryColor }}>
                                            Lav
                                        </Animated.Text>
                                        Express
                                        <Animated.Text style={{ color: primaryColor }}>
                                            Pro
                                        </Animated.Text>
                                    </>
                                ) : (
                                    <>
                                        <Animated.Text style={{ color: primaryColor }}>
                                            Lav
                                        </Animated.Text>
                                        Express
                                    </>
                                )}
                            </Animated.Text>
                            <Animated.Text style={[styles.logoSubtitle, { color: modoAdmin ? "#ccc" : "#555" }]}>
                                {modoAdmin ? "Gestão de lava-jatos" : "Seu lava-jato na palma da mão"}
                            </Animated.Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Animated.Text style={[styles.label, { color: textColor }]}>Email</Animated.Text>
                                <Animated.View style={[
                                    styles.inputContainer,
                                    {
                                        backgroundColor: inputBgColor,
                                        borderColor: inputBorderColor
                                    }
                                ]}>
                                    <TextInput
                                        style={[styles.input, { color: modoAdmin ? "#fff" : "#333" }]}
                                        placeholder={modoAdmin ? "Email corporativo" : "Seu email"}
                                        placeholderTextColor={modoAdmin ? "#999" : "#999"}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                    <Animated.View style={styles.inputIcon}>
                                        <Ionicons
                                            name="mail-outline"
                                            size={20}
                                            color={modoAdmin ? "#999" : "#999"}
                                        />
                                    </Animated.View>
                                </Animated.View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Animated.Text style={[styles.label, { color: textColor }]}>Senha</Animated.Text>
                                <Animated.View style={[
                                    styles.inputContainer,
                                    {
                                        backgroundColor: inputBgColor,
                                        borderColor: inputBorderColor
                                    }
                                ]}>
                                    <TextInput
                                        style={[styles.input, { color: modoAdmin ? "#fff" : "#333" }]}
                                        placeholder="Sua senha"
                                        placeholderTextColor={modoAdmin ? "#999" : "#999"}
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
                                            color={modoAdmin ? "#999" : "#999"}
                                        />
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>

                            <Animated.View
                                style={[
                                    styles.button,
                                    { backgroundColor: primaryColor }
                                ]}
                            >
                                <TouchableOpacity
                                    style={styles.buttonTouchable}
                                    onPress={fazerLogin}
                                >
                                    <Text style={styles.buttonText}>
                                        {modoAdmin ? "Acessar Painel" : "Entrar"}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>

                        <View style={styles.links}>
                            <TouchableOpacity onPress={navegarParaCadastro}>
                                <Animated.Text style={[styles.linkText, { color: primaryColor }]}>
                                    {modoAdmin
                                        ? "Cadastrar meu lava-jato"
                                        : "Não tem uma conta? Cadastre-se"}
                                </Animated.Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={navegarParaRecuperarSenha}>
                                <Animated.Text style={[styles.linkText, { color: primaryColor }]}>
                                    Esqueceu sua senha?
                                </Animated.Text>
                            </TouchableOpacity>
                        </View>

                        <Animated.View style={[styles.separador]}>
                            <Animated.View style={[styles.linha, { backgroundColor: inputBorderColor }]} />
                            <Animated.Text style={[styles.separadorTexto, { color: modoAdmin ? "#999" : "#888" }]}>
                                ou continue com
                            </Animated.Text>
                            <Animated.View style={[styles.linha, { backgroundColor: inputBorderColor }]} />
                        </Animated.View>

                        <View style={styles.socialButtons}>
                            <Animated.View style={[
                                styles.socialButton,
                                {
                                    backgroundColor: inputBgColor,
                                    borderColor: inputBorderColor,
                                    borderWidth: 1
                                }
                            ]}>
                                <TouchableOpacity style={styles.socialButtonTouchable}>
                                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                                    <Animated.Text style={[styles.socialButtonText, { color: textColor }]}>
                                        Google
                                    </Animated.Text>
                                </TouchableOpacity>
                            </Animated.View>

                            <Animated.View style={[
                                styles.socialButton,
                                {
                                    backgroundColor: inputBgColor,
                                    borderColor: inputBorderColor,
                                    borderWidth: 1
                                }
                            ]}>
                                <TouchableOpacity style={styles.socialButtonTouchable}>
                                    <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                                    <Animated.Text style={[styles.socialButtonText, { color: textColor }]}>
                                        Facebook
                                    </Animated.Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>

                        <View style={styles.footer}>
                            <Animated.Text style={[styles.footerText, { color: modoAdmin ? "#999" : "#888" }]}>
                                © 2025 LavExpress - Todos os direitos reservados
                            </Animated.Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBarSpacer: {
        height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
    },
    modeSelectorContainer: {
        flexDirection: "row",
        marginHorizontal: 40,
        marginTop: 20,
        borderRadius: 30,
        backgroundColor: "rgba(0,0,0,0.1)",
        position: "relative",
        height: 50,
    },
    modeSelectorSwitch: {
        position: "absolute",
        top: 5,
        left: 5,
        bottom: 5,
        width: width / 2 - 50,
        borderRadius: 25,
        zIndex: 0,
    },
    modeOption: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    activeOption: {
        color: "#fff",
    },
    modeOptionText: {
        fontSize: 15,
        fontWeight: "600",
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
    logoSubtitle: {
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
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    inputIcon: {
        paddingHorizontal: 15,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonTouchable: {
        width: '100%',
        alignItems: 'center',
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
    },
    separadorTexto: {
        paddingHorizontal: 10,
        fontSize: 14,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    socialButton: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 8,
    },
    socialButtonTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    socialButtonText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
    },
});
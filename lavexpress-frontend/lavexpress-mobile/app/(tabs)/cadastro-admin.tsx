// app/cadastro-admin.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
    Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function CadastroAdminScreen() {
    const router = useRouter();

    // Estados para as informações básicas
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');

    // Estados para as informações do estabelecimento
    const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cep, setCep] = useState('');

    // Estados para controle de UI
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [etapaAtual, setEtapaAtual] = useState(1);
    const [carregando, setCarregando] = useState(false);
    const [concordaTermos, setConcordaTermos] = useState(false);

    // Formatadores
    const formatarCNPJ = (texto) => {
        const apenasNumeros = texto.replace(/\D/g, '');
        let cnpjFormatado = apenasNumeros;

        if (apenasNumeros.length > 2)
            cnpjFormatado = apenasNumeros.substring(0, 2) + '.' + apenasNumeros.substring(2);
        if (apenasNumeros.length > 5)
            cnpjFormatado = cnpjFormatado.substring(0, 6) + '.' + cnpjFormatado.substring(6);
        if (apenasNumeros.length > 8)
            cnpjFormatado = cnpjFormatado.substring(0, 10) + '/' + cnpjFormatado.substring(10);
        if (apenasNumeros.length > 12)
            cnpjFormatado = cnpjFormatado.substring(0, 15) + '-' + cnpjFormatado.substring(15);

        setCnpj(cnpjFormatado.substring(0, 18));
    };

    const formatarTelefone = (texto) => {
        const apenasNumeros = texto.replace(/\D/g, '');
        let telefoneFormatado = apenasNumeros;

        if (apenasNumeros.length > 0)
            telefoneFormatado = '(' + apenasNumeros.substring(0, 2);
        if (apenasNumeros.length > 2)
            telefoneFormatado += ') ' + apenasNumeros.substring(2, 7);
        if (apenasNumeros.length > 7)
            telefoneFormatado += '-' + apenasNumeros.substring(7, 11);

        setTelefone(telefoneFormatado.substring(0, 15));
    };

    // Validações
    const validarEtapa1 = () => {
        if (!nome || !email || !senha || !confirmarSenha || !telefone) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Erro", "Por favor, informe um email válido.");
            return false;
        }

        if (senha.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            return false;
        }

        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return false;
        }

        return true;
    };

    // Navegação entre etapas
    const proximaEtapa = () => {
        if (etapaAtual === 1 && validarEtapa1()) {
            setEtapaAtual(2);
        } else if (etapaAtual === 2) {
            setEtapaAtual(3);
        }
    };

    const etapaAnterior = () => {
        if (etapaAtual > 1) {
            setEtapaAtual(etapaAtual - 1);
        } else {
            router.push('/login');
        }
    };

    // Finalizar cadastro
    const finalizarCadastro = async () => {
        try {
            setCarregando(true);
            // Simulação de API
            await new Promise(resolve => setTimeout(resolve, 2000));
            Alert.alert(
                "Cadastro Enviado",
                "Seu cadastro foi enviado para análise. Você receberá um email com mais informações em breve.",
                [{ text: "OK", onPress: () => router.push('/login') }]
            );
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao enviar o cadastro. Tente novamente mais tarde.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" translucent />

            {/* Espaçamento para a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={etapaAnterior} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    <Text style={styles.headerTitleRed}>Lav</Text>
                    Express<Text style={styles.headerTitleRed}>Pro</Text>
                </Text>
                <View style={{width: 24}} />
            </View>

            {/* Indicador de progresso */}
            <View style={styles.progressContainer}>
                <View style={styles.progressLine}>
                    <View style={[styles.progressFill, { width: `${(etapaAtual / 3) * 100}%` }]} />
                </View>
                <View style={styles.stepsContainer}>
                    {[1, 2, 3].map(step => (
                        <View key={step} style={styles.stepItem}>
                            <View style={[styles.stepCircle, etapaAtual >= step && styles.activeStep]}>
                                <Text style={[styles.stepNumber, etapaAtual >= step && styles.activeStepText]}>
                                    {step}
                                </Text>
                            </View>
                            <Text style={styles.stepLabel}>
                                {step === 1 ? 'Dados Pessoais' : step === 2 ? 'Estabelecimento' : 'Finalizar'}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Etapa 1: Dados Pessoais */}
                    {etapaAtual === 1 && (
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Dados Pessoais</Text>
                            <Text style={styles.formSubtitle}>
                                Informe seus dados para criar sua conta de administrador
                            </Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Nome completo *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={nome}
                                        onChangeText={setNome}
                                        placeholder="Digite seu nome completo"
                                        placeholderTextColor="#999"
                                    />
                                    <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Email *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Digite seu email"
                                        placeholderTextColor="#999"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Telefone *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={telefone}
                                        onChangeText={formatarTelefone}
                                        placeholder="(00) 00000-0000"
                                        placeholderTextColor="#999"
                                        keyboardType="phone-pad"
                                    />
                                    <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Senha *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={senha}
                                        onChangeText={setSenha}
                                        placeholder="Crie uma senha"
                                        placeholderTextColor="#999"
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
                                <Text style={styles.inputInfo}>Mínimo de 6 caracteres</Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Confirmar senha *</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={confirmarSenha}
                                        onChangeText={setConfirmarSenha}
                                        placeholder="Confirme sua senha"
                                        placeholderTextColor="#999"
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

                            <Text style={styles.requiredFieldsInfo}>* Campos obrigatórios</Text>
                        </View>
                    )}

                    {/* Botões */}
                    <View style={styles.buttonsContainer}>
                        {etapaAtual < 3 ? (
                            <TouchableOpacity style={styles.nextButton} onPress={proximaEtapa}>
                                <Text style={styles.buttonText}>
                                    {etapaAtual === 1 ? 'Próximo' : 'Continuar'}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={finalizarCadastro}
                                disabled={carregando}
                            >
                                {carregando ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.buttonText}>Finalizar Cadastro</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    statusBarSpacer: {
        height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerTitleRed: {
        color: '#e63946',
    },
    progressContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    progressLine: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        marginBottom: 10,
    },
    progressFill: {
        height: 4,
        backgroundColor: '#e63946',
        borderRadius: 2,
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stepItem: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    activeStep: {
        backgroundColor: '#e63946',
    },
    stepNumber: {
        color: '#fff',
        fontWeight: 'bold',
    },
    activeStepText: {
        color: '#fff',
    },
    stepLabel: {
        fontSize: 12,
        color: '#ccc',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    formContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 16,
        padding: 20,
        margin: 16,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    formSubtitle: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a3a3a',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#555',
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#fff',
    },
    inputIcon: {
        paddingHorizontal: 15,
    },
    inputInfo: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    requiredFieldsInfo: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 16,
    },
    buttonsContainer: {
        marginHorizontal: 16,
        marginBottom: 20,
    },
    nextButton: {
        backgroundColor: '#e63946',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
});
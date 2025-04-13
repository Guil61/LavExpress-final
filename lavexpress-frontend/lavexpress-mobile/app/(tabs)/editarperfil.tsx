// app/editarperfil.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
    Image,
    Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function EditarPerfilScreen() {
    const router = useRouter();

    // Estados para os campos do formulário
    const [nome, setNome] = useState("Carlos Silva");
    const [email, setEmail] = useState("carlos.silva@email.com");
    const [telefone, setTelefone] = useState("(61) 98765-4321");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // Função para salvar as alterações
    const salvarAlteracoes = () => {
        // Verificação básica
        if (!nome || !email || !telefone) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Verificação de senha (apenas se o usuário quiser alterar)
        if (senha && senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        // Aqui você implementaria a lógica de atualização com uma API
        // Por enquanto, apenas simulamos o sucesso e voltamos para a tela anterior

        Alert.alert(
            "Sucesso",
            "Perfil atualizado com sucesso!",
            [
                {
                    text: "OK",
                    onPress: () => router.push('/perfil')
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0077cc" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Foto de perfil */}
                <View style={styles.photoSection}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImageFallback}>
                            <FontAwesome name="user" size={50} color="#FFF" />
                        </View>
                        <TouchableOpacity style={styles.changePhotoButton}>
                            <Ionicons name="camera" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.changePhotoText}>Alterar foto</Text>
                </View>

                {/* Formulário de edição */}
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nome completo</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Seu nome completo"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>E-mail</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="seu.email@exemplo.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Telefone</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={telefone}
                                onChangeText={setTelefone}
                                placeholder="(00) 00000-0000"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Alterar Senha</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nova senha</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={senha}
                                onChangeText={setSenha}
                                placeholder="Digite sua nova senha"
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Confirmar senha</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                                placeholder="Digite novamente sua nova senha"
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <Text style={styles.passwordInfo}>
                        Deixe os campos de senha em branco se não desejar alterá-la
                    </Text>
                </View>
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => router.push('/perfil')}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={salvarAlteracoes}
                >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
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
    content: {
        flex: 1,
    },
    photoSection: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    profileImageContainer: {
        position: "relative",
        marginBottom: 8,
    },
    profileImageFallback: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#0077cc",
        justifyContent: "center",
        alignItems: "center",
    },
    changePhotoButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#333",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    changePhotoText: {
        color: "#0077cc",
        fontSize: 16,
        fontWeight: "500",
    },
    formSection: {
        backgroundColor: "white",
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 8,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: "#333",
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    passwordInfo: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        marginTop: 8,
    },
    actionButtons: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "white",
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: "#f0f0f0",
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: "#0077cc",
        marginLeft: 10,
    },
    cancelButtonText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "600",
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
// app/addveiculo.tsx

import React, {useState} from "react";
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
    Alert
} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function AddVeiculoScreen() {
    const router = useRouter();

    // Estados para os campos do formulário
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [cor, setCor] = useState("");
    const [ano, setAno] = useState("");

    // Opções de tipos de veículo
    const tiposVeiculo = ["Carro", "Moto", "SUV", "Caminhonete", "Outro"];
    const [tipoSelecionado, setTipoSelecionado] = useState("");

    // Função para salvar o veículo
    const salvarVeiculo = () => {
        // Validação básica
        if (!modelo || !placa || !cor || !tipoSelecionado) {
            Alert.alert("Erro", "Por favor, preencha os campos obrigatórios.");
            return;
        }

        // Aqui você implementaria a lógica de cadastro do veículo em uma API
        // Por enquanto, apenas simulamos o sucesso e voltamos para a tela anterior

        Alert.alert(
            "Sucesso",
            "Veículo adicionado com sucesso!",
            [
                {
                    text: "OK",
                    onPress: () => router.back()
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer}/>

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0077cc"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Adicionar Veículo</Text>
                <View style={{width: 24}}/>
            </View>

            <ScrollView style={styles.content}>
                {/* Formulário */}
                <View style={styles.formContainer}>
                    {/* Tipo de Veículo */}
                    <Text style={styles.sectionTitle}>Tipo de Veículo</Text>
                    <View style={styles.tiposContainer}>
                        {tiposVeiculo.map((tipo) => (
                            <TouchableOpacity
                                key={tipo}
                                style={[
                                    styles.tipoButton,
                                    tipoSelecionado === tipo && styles.tipoButtonSelected
                                ]}
                                onPress={() => setTipoSelecionado(tipo)}
                            >
                                <Text
                                    style={[
                                        styles.tipoText,
                                        tipoSelecionado === tipo && styles.tipoTextSelected
                                    ]}
                                >
                                    {tipo}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Informações do Veículo */}
                    <Text style={styles.sectionTitle}>Informações do Veículo</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Modelo *</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={modelo}
                                onChangeText={setModelo}
                                placeholder="Ex: Honda Civic, Toyota Corolla"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Placa *</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={placa}
                                onChangeText={(text) => setPlaca(text.toUpperCase())}
                                placeholder="Ex: ABC-1234"
                                autoCapitalize="characters"
                                maxLength={8}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Cor *</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={cor}
                                onChangeText={setCor}
                                placeholder="Ex: Prata, Preto, Branco"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Ano (opcional)</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={ano}
                                onChangeText={setAno}
                                placeholder="Ex: 2023"
                                keyboardType="number-pad"
                                maxLength={4}
                            />
                        </View>
                    </View>

                    <Text style={styles.requiredFieldsInfo}>* Campos obrigatórios</Text>

                    <View style={styles.notaContainer}>
                        <Ionicons name="information-circle-outline" size={20} color="#0077cc"/>
                        <Text style={styles.notaText}>
                            Estas informações ajudam os lava-jatos a identificar seu veículo e oferecer serviços
                            adequados.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={salvarVeiculo}
                >
                    <Text style={styles.saveButtonText}>Adicionar Veículo</Text>
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
    formContainer: {
        backgroundColor: "white",
        padding: 16,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
        marginTop: 8,
    },
    tiposContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    tipoButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    tipoButtonSelected: {
        backgroundColor: "#e6f3fb",
        borderColor: "#0077cc",
    },
    tipoText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    tipoTextSelected: {
        color: "#0077cc",
        fontWeight: "600",
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
    requiredFieldsInfo: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        marginTop: 4,
        marginBottom: 16,
    },
    notaContainer: {
        flexDirection: "row",
        backgroundColor: "#e6f3fb",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: "flex-start",
    },
    notaText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: "#0077cc",
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
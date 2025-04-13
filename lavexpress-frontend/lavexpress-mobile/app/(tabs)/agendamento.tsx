// app/agendamento.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
    Animated
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AgendamentoScreen = () => {
    const router = useRouter();
    const scrollY = new Animated.Value(0);

    const [lavaJato, setLavaJato] = useState('');
    const [servico, setServico] = useState('');
    const [dia, setDia] = useState('');
    const [horario, setHorario] = useState('');
    const [veiculo, setVeiculo] = useState('');

    const confirmarAgendamento = () => {
        // Aqui você implementaria a lógica para salvar o agendamento
        if (!lavaJato || !servico || !dia || !horario || !veiculo) {
            alert("Por favor, preencha todos os campos");
            return;
        }

        // Simulação de confirmação de agendamento
        alert("Agendamento confirmado com sucesso!");
        router.push('/agenda');
    };

    // Calculando opacidade do cabeçalho com base na animação de scroll
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/agenda')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0077cc" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Agendar Lavagem</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Linha de sombra animada */}
            <Animated.View
                style={[
                    styles.headerShadow,
                    { opacity: headerOpacity }
                ]}
            />

            <Animated.ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={styles.form}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardTitle}>Detalhes do Agendamento</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Lava-jato</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={lavaJato}
                                    onValueChange={setLavaJato}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione o lava-jato" value="" />
                                    <Picker.Item label="Lava Jato Brasil" value="brasil" />
                                    <Picker.Item label="Lava Jato Canaã" value="canaa" />
                                    <Picker.Item label="Lava Jato Rio Negro" value="rio_negro" />
                                    <Picker.Item label="ACQUATEC Lavagem Expressa" value="acquatec" />
                                    <Picker.Item label="New Car Lava Jato" value="new_car" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Veículo</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={veiculo}
                                    onValueChange={setVeiculo}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione o veículo" value="" />
                                    <Picker.Item label="Honda Civic - ABC-1234" value="civic" />
                                    <Picker.Item label="Hyundai HB20 - XYZ-5678" value="hb20" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Serviço</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={servico}
                                    onValueChange={setServico}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione o serviço" value="" />
                                    <Picker.Item label="Lavagem Simples" value="simples" />
                                    <Picker.Item label="Lavagem Completa" value="completa" />
                                    <Picker.Item label="Higienização Interna" value="higienizacao" />
                                    <Picker.Item label="Polimento" value="polimento" />
                                    <Picker.Item label="Enceramento" value="enceramento" />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.cardTitle}>Data e Hora</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Data</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={dia}
                                    onValueChange={setDia}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione a data" value="" />
                                    <Picker.Item label="12/04/2025 (Hoje)" value="12/04/2025" />
                                    <Picker.Item label="13/04/2025 (Amanhã)" value="13/04/2025" />
                                    <Picker.Item label="14/04/2025 (Segunda)" value="14/04/2025" />
                                    <Picker.Item label="15/04/2025 (Terça)" value="15/04/2025" />
                                    <Picker.Item label="16/04/2025 (Quarta)" value="16/04/2025" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Horário</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={horario}
                                    onValueChange={setHorario}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione o horário" value="" />
                                    <Picker.Item label="08:00" value="08:00" />
                                    <Picker.Item label="09:00" value="09:00" />
                                    <Picker.Item label="10:00" value="10:00" />
                                    <Picker.Item label="11:00" value="11:00" />
                                    <Picker.Item label="14:00" value="14:00" />
                                    <Picker.Item label="15:00" value="15:00" />
                                    <Picker.Item label="16:00" value="16:00" />
                                    <Picker.Item label="17:00" value="17:00" />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <Ionicons name="information-circle-outline" size={22} color="#0077cc" />
                        <Text style={styles.infoText}>
                            Ao agendar, você concorda com as políticas de cancelamento do lava-jato.
                            Cancelamentos com menos de 2 horas de antecedência podem estar sujeitos a cobrança.
                        </Text>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Botão de confirmação */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmarAgendamento}
                >
                    <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

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
        zIndex: 10,
    },
    headerShadow: {
        height: 1,
        backgroundColor: "#ddd",
        width: '100%',
        zIndex: 9,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    form: {
        marginBottom: 16,
    },
    cardContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0077cc",
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#444",
        marginBottom: 8,
        marginLeft: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        backgroundColor: "#f9f9f9",
        overflow: "hidden",
    },
    picker: {
        height: 50,
        backgroundColor: "transparent",
    },
    infoContainer: {
        flexDirection: "row",
        backgroundColor: "#e6f3fb",
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: "#0077cc",
        lineHeight: 20,
    },
    bottomContainer: {
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    confirmButton: {
        backgroundColor: "#0077cc",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0077cc",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
});

export default AgendamentoScreen;
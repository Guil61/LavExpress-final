// app/historico_completo.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
    TextInput,
    FlatList
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HistoricoCompletoScreen() {
    const router = useRouter();
    const [filtro, setFiltro] = useState("");
    const [periodoAtivo, setPeriodoAtivo] = useState("todos");

    // Dados de exemplo para o histórico
    const historicoCompleto = [
        {
            id: 1,
            lavaJato: "Lava Jato Brasil",
            servico: "Lavagem Completa",
            data: "10/04/2025",
            hora: "14:30",
            veiculo: "Honda Civic - ABC-1234",
            valor: "R$ 40,00",
            status: "Concluído"
        },
        {
            id: 2,
            lavaJato: "Lava Jato Canaã",
            servico: "Polimento",
            data: "28/03/2025",
            hora: "10:15",
            veiculo: "Honda Civic - ABC-1234",
            valor: "R$ 120,00",
            status: "Concluído"
        },
        {
            id: 3,
            lavaJato: "Auto Clean Express",
            servico: "Higienização Interna",
            data: "15/03/2025",
            hora: "16:45",
            veiculo: "Hyundai HB20 - XYZ-5678",
            valor: "R$ 75,00",
            status: "Concluído"
        },
        {
            id: 4,
            lavaJato: "New Car Lava Jato",
            servico: "Lavagem Simples",
            data: "02/03/2025",
            hora: "09:00",
            veiculo: "Honda Civic - ABC-1234",
            valor: "R$ 35,00",
            status: "Concluído"
        },
        {
            id: 5,
            lavaJato: "Express Lava Jato & Higienização",
            servico: "Lavagem Completa",
            data: "20/02/2025",
            hora: "11:30",
            veiculo: "Hyundai HB20 - XYZ-5678",
            valor: "R$ 50,00",
            status: "Concluído"
        },
        {
            id: 6,
            lavaJato: "Flash Lava Jato",
            servico: "Enceramento",
            data: "05/02/2025",
            hora: "15:00",
            veiculo: "Honda Civic - ABC-1234",
            valor: "R$ 85,00",
            status: "Concluído"
        },
        {
            id: 7,
            lavaJato: "Lava Rapido Guará",
            servico: "Lavagem Simples",
            data: "28/01/2025",
            hora: "08:45",
            veiculo: "Hyundai HB20 - XYZ-5678",
            valor: "R$ 30,00",
            status: "Concluído"
        },
        {
            id: 8,
            lavaJato: "Rota 010 Lava Jato",
            servico: "Higienização Completa",
            data: "15/01/2025",
            hora: "13:20",
            veiculo: "Honda Civic - ABC-1234",
            valor: "R$ 150,00",
            status: "Concluído"
        },
        {
            id: 9,
            lavaJato: "JJ Lava Jato",
            servico: "Lavagem Completa",
            data: "02/01/2025",
            hora: "16:30",
            veiculo: "Hyundai HB20 - XYZ-5678",
            valor: "R$ 45,00",
            status: "Concluído"
        },
        {
            id: 10,
            lavaJato: "Lava Jato Brasil",
            servico: "Polimento",
            data: "22/12/2024",
            hora: "10:00",
            veiculo: "Honda Civic - ABC-1234",
            valor: "R$ 120,00",
            status: "Concluído"
        },
    ];

    // Função para filtrar os itens do histórico
    const filtrarHistorico = () => {
        let resultados = [...historicoCompleto];

        // Filtrar por período
        if (periodoAtivo === "ultimoMes") {
            const hoje = new Date();
            const umMesAtras = new Date();
            umMesAtras.setMonth(hoje.getMonth() - 1);

            resultados = resultados.filter(item => {
                const partesData = item.data.split('/');
                const dataItem = new Date(
                    parseInt(partesData[2]),
                    parseInt(partesData[1]) - 1,
                    parseInt(partesData[0])
                );
                return dataItem >= umMesAtras;
            });
        }
        else if (periodoAtivo === "ultimos3Meses") {
            const hoje = new Date();
            const tresMesesAtras = new Date();
            tresMesesAtras.setMonth(hoje.getMonth() - 3);

            resultados = resultados.filter(item => {
                const partesData = item.data.split('/');
                const dataItem = new Date(
                    parseInt(partesData[2]),
                    parseInt(partesData[1]) - 1,
                    parseInt(partesData[0])
                );
                return dataItem >= tresMesesAtras;
            });
        }

        // Filtrar por texto de busca
        if (filtro) {
            const termoLowerCase = filtro.toLowerCase();
            resultados = resultados.filter(item =>
                item.lavaJato.toLowerCase().includes(termoLowerCase) ||
                item.servico.toLowerCase().includes(termoLowerCase) ||
                item.veiculo.toLowerCase().includes(termoLowerCase)
            );
        }

        return resultados;
    };

    // Obter histórico filtrado
    const historicoFiltrado = filtrarHistorico();

    // Renderizar item do histórico
    const renderHistoricoItem = ({ item }) => (
        <View style={styles.historicoCard}>
            <View style={styles.historicoHeader}>
                <Text style={styles.lavaJatoNome}>{item.lavaJato}</Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.servicoContainer}>
                <Text style={styles.servicoNome}>{item.servico}</Text>
                <Text style={styles.servicoValor}>{item.valor}</Text>
            </View>

            <View style={styles.detalhes}>
                <View style={styles.detalheItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.detalheTexto}>{item.data}</Text>
                </View>
                <View style={styles.detalheItem}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.detalheTexto}>{item.hora}</Text>
                </View>
                <View style={styles.detalheItem}>
                    <Ionicons name="car-outline" size={16} color="#666" />
                    <Text style={styles.detalheTexto}>{item.veiculo}</Text>
                </View>
            </View>

            <View style={styles.botoesContainer}>
                <TouchableOpacity style={styles.botaoReagendar}>
                    <Ionicons name="repeat" size={16} color="#0077cc" />
                    <Text style={styles.botaoReagendarTexto}>Repetir</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoDetalhes}>
                    <Text style={styles.botaoDetalhesTexto}>Ver Detalhes</Text>
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );

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
                <Text style={styles.headerTitle}>Histórico de Lavagens</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Filtros */}
            <View style={styles.filtrosContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar no histórico..."
                        value={filtro}
                        onChangeText={setFiltro}
                    />
                    {filtro ? (
                        <TouchableOpacity onPress={() => setFiltro("")}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View style={styles.periodosContainer}>
                    <TouchableOpacity
                        style={[
                            styles.periodoButton,
                            periodoAtivo === 'todos' && styles.periodoButtonActive
                        ]}
                        onPress={() => setPeriodoAtivo('todos')}
                    >
                        <Text
                            style={[
                                styles.periodoText,
                                periodoAtivo === 'todos' && styles.periodoTextActive
                            ]}
                        >
                            Todos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.periodoButton,
                            periodoAtivo === 'ultimoMes' && styles.periodoButtonActive
                        ]}
                        onPress={() => setPeriodoAtivo('ultimoMes')}
                    >
                        <Text
                            style={[
                                styles.periodoText,
                                periodoAtivo === 'ultimoMes' && styles.periodoTextActive
                            ]}
                        >
                            Último mês
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.periodoButton,
                            periodoAtivo === 'ultimos3Meses' && styles.periodoButtonActive
                        ]}
                        onPress={() => setPeriodoAtivo('ultimos3Meses')}
                    >
                        <Text
                            style={[
                                styles.periodoText,
                                periodoAtivo === 'ultimos3Meses' && styles.periodoTextActive
                            ]}
                        >
                            3 meses
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Lista de Histórico */}
            {historicoFiltrado.length > 0 ? (
                <FlatList
                    data={historicoFiltrado}
                    renderItem={renderHistoricoItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listaContainer}
                />
            ) : (
                <View style={styles.semResultados}>
                    <Ionicons name="calendar" size={60} color="#ccc" />
                    <Text style={styles.semResultadosTitulo}>Nenhum histórico encontrado</Text>
                    <Text style={styles.semResultadosTexto}>
                        Não encontramos lavagens que correspondam aos filtros selecionados.
                    </Text>
                </View>
            )}
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
    filtrosContainer: {
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: "#333",
    },
    periodosContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    periodoButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    periodoButtonActive: {
        backgroundColor: "#e6f3fb",
    },
    periodoText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    periodoTextActive: {
        color: "#0077cc",
        fontWeight: "600",
    },
    listaContainer: {
        padding: 16,
    },
    historicoCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    historicoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    lavaJatoNome: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    statusContainer: {
        backgroundColor: "#e8f5e9",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        color: "#4caf50",
        fontWeight: "500",
    },
    servicoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    servicoNome: {
        fontSize: 15,
        fontWeight: "600",
        color: "#0077cc",
    },
    servicoValor: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    detalhes: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    detalheItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
        marginBottom: 8,
    },
    detalheTexto: {
        marginLeft: 4,
        fontSize: 14,
        color: "#666",
    },
    botoesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    botaoReagendar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e6f3fb",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    botaoReagendarTexto: {
        marginLeft: 6,
        fontSize: 14,
        color: "#0077cc",
        fontWeight: "600",
    },
    botaoDetalhes: {
        flexDirection: "row",
        alignItems: "center",
    },
    botaoDetalhesTexto: {
        marginRight: 4,
        fontSize: 14,
        color: "#666",
    },
    semResultados: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    semResultadosTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 16,
        marginBottom: 8,
    },
    semResultadosTexto: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
    },
});
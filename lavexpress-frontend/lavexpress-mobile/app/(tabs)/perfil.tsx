// app/(tabs)/perfil.tsx

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function PerfilScreen() {
    const router = useRouter();

    // Dados do usuário (simulação)
    const usuario = {
        nome: "Carlos Silva",
        email: "carlos.silva@email.com",
        telefone: "(61) 98765-4321",
        foto: "", // URL da foto, deixando vazio para usar fallback
        veiculos: [
            { modelo: "Honda Civic", placa: "ABC-1234", cor: "Prata" },
            { modelo: "Hyundai HB20", placa: "XYZ-5678", cor: "Branco" }
        ],
        historico: [
            {
                id: 1,
                lavaJato: "Lava Jato Brasil",
                servico: "Lavagem Completa",
                data: "10/04/2025",
                valor: "R$ 40,00",
                status: "Concluído"
            },
            {
                id: 2,
                lavaJato: "Lava Jato Canaã",
                servico: "Polimento",
                data: "28/03/2025",
                valor: "R$ 120,00",
                status: "Concluído"
            },
            {
                id: 3,
                lavaJato: "Auto Clean Express",
                servico: "Higienização Interna",
                data: "15/03/2025",
                valor: "R$ 75,00",
                status: "Concluído"
            }
        ]
    };

    // Funções de navegação
    const navegarParaEditarPerfil = () => {
        router.push('/editarperfil');
    };

    const navegarParaAddVeiculo = () => {
        router.push('/addveiculo');
    };

    const navegarParaHistoricoCompleto = () => {
        router.push('/historico_completo');
    };

    const navegarParaAjuda = () => {
        router.push('/ajudatela');
    };

    const navegarParaSair = () => {
        router.push('/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meu Perfil</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="settings-outline" size={24} color="#0077cc" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Informações do Perfil */}
                <View style={styles.profileSection}>
                    <View style={styles.profileHeader}>
                        {usuario.foto ? (
                            <Image source={{ uri: usuario.foto }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.profileImageFallback}>
                                <FontAwesome name="user" size={50} color="#FFF" />
                            </View>
                        )}
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{usuario.nome}</Text>
                            <Text style={styles.profileEmail}>{usuario.email}</Text>
                            <Text style={styles.profilePhone}>{usuario.telefone}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.editProfileButton}
                        onPress={navegarParaEditarPerfil}
                    >
                        <Text style={styles.editProfileText}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Meus Veículos */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Meus Veículos</Text>
                        <TouchableOpacity onPress={navegarParaAddVeiculo}>
                            <Text style={styles.addButton}>+ Adicionar</Text>
                        </TouchableOpacity>
                    </View>

                    {usuario.veiculos.map((veiculo, index) => (
                        <View key={index} style={styles.vehicleCard}>
                            <View style={styles.vehicleIcon}>
                                <Ionicons name="car" size={28} color="#0077cc" />
                            </View>
                            <View style={styles.vehicleInfo}>
                                <Text style={styles.vehicleModel}>{veiculo.modelo}</Text>
                                <View style={styles.vehicleDetails}>
                                    <Text style={styles.vehiclePlate}>{veiculo.placa}</Text>
                                    <Text style={styles.vehicleColor}>• {veiculo.cor}</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-vertical" size={24} color="#999" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Histórico de Lavagens */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Histórico de Lavagens</Text>

                    {usuario.historico.map((item) => (
                        <View key={item.id} style={styles.historyCard}>
                            <View style={styles.historyHeader}>
                                <Text style={styles.historyPlace}>{item.lavaJato}</Text>
                                <Text style={styles.historyStatus}>{item.status}</Text>
                            </View>
                            <View style={styles.historyDetails}>
                                <Text style={styles.historyService}>{item.servico}</Text>
                                <Text style={styles.historyDate}>{item.data}</Text>
                            </View>
                            <View style={styles.historyFooter}>
                                <Text style={styles.historyPrice}>{item.valor}</Text>
                                <TouchableOpacity style={styles.repeatButton}>
                                    <Ionicons name="repeat" size={16} color="#0077cc" />
                                    <Text style={styles.repeatText}>Repetir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.viewAllButton}
                        onPress={navegarParaHistoricoCompleto}
                    >
                        <Text style={styles.viewAllText}>Ver Histórico Completo</Text>
                    </TouchableOpacity>
                </View>

                {/* Botões de Ajuda e Sair */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={navegarParaAjuda}
                    >
                        <Ionicons name="help-circle-outline" size={24} color="#666" />
                        <Text style={styles.actionText}>Ajuda e Suporte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.logoutButton]}
                        onPress={navegarParaSair}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
                        <Text style={[styles.actionText, styles.logoutText]}>Sair da Conta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Barra de navegação inferior */}
            <View style={styles.tabBar}>
                <Link href="/" asChild>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="home-outline" size={24} color="#999" />
                        <Text style={styles.tabText}>Início</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/buscar" asChild>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="search-outline" size={24} color="#999" />
                        <Text style={styles.tabText}>Buscar</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/agenda" asChild>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="calendar-outline" size={24} color="#999" />
                        <Text style={styles.tabText}>Agenda</Text>
                    </TouchableOpacity>
                </Link>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="person" size={24} color="#0077cc" />
                    <Text style={[styles.tabText, { color: "#0077cc" }]}>Perfil</Text>
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
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    editButton: {
        padding: 8,
    },
    profileSection: {
        backgroundColor: "white",
        padding: 16,
        marginBottom: 10,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileImageFallback: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#0077cc",
        justifyContent: "center",
        alignItems: "center",
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    profilePhone: {
        fontSize: 14,
        color: "#666",
    },
    editProfileButton: {
        backgroundColor: "#e6f3fb",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    editProfileText: {
        color: "#0077cc",
        fontWeight: "600",
        fontSize: 16,
    },
    sectionContainer: {
        backgroundColor: "white",
        padding: 16,
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    addButton: {
        color: "#0077cc",
        fontWeight: "600",
        fontSize: 14,
    },
    vehicleCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    vehicleIcon: {
        backgroundColor: "#e6f3fb",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleModel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    vehicleDetails: {
        flexDirection: "row",
        alignItems: "center",
    },
    vehiclePlate: {
        fontSize: 14,
        color: "#666",
        marginRight: 8,
    },
    vehicleColor: {
        fontSize: 14,
        color: "#666",
    },
    historyCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
    },
    historyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    historyPlace: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    historyStatus: {
        fontSize: 14,
        color: "#4caf50",
        fontWeight: "500",
    },
    historyDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    historyService: {
        fontSize: 14,
        color: "#666",
    },
    historyDate: {
        fontSize: 14,
        color: "#0077cc",
    },
    historyFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    historyPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    repeatButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e6f3fb",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    repeatText: {
        color: "#0077cc",
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 4,
    },
    viewAllButton: {
        alignItems: "center",
        paddingVertical: 12,
        marginTop: 8,
    },
    viewAllText: {
        color: "#0077cc",
        fontWeight: "600",
        fontSize: 16,
    },
    actionsContainer: {
        backgroundColor: "white",
        padding: 16,
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    actionText: {
        marginLeft: 16,
        fontSize: 16,
        color: "#666",
    },
    logoutButton: {
        borderBottomWidth: 0,
    },
    logoutText: {
        color: "#e74c3c",
    },
    tabBar: {
        flexDirection: "row",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
    },
    tabText: {
        fontSize: 12,
        marginTop: 4,
        color: "#999",
    },
});
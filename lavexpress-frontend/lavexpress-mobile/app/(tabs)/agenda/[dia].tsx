import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DiaAgendaScreen() {
    const router = useRouter();
    const { dia } = useLocalSearchParams();

    const dataFormatada = format(parseISO(dia as string), "EEEE, d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
    });

    return (
        <View style={styles.container}>
            {/* Cabeçalho com logo e botão voltar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/agenda")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0077cc" />
                </TouchableOpacity>
                <Text style={styles.logo}>
                    <Text style={styles.logoLav}>Lav</Text>
                    Express
                </Text>
            </View>

            {/* Data */}
            <Text style={styles.dateText}>{dataFormatada}</Text>

            {/* Conteúdo */}
            <View style={styles.card}>
                <Text style={styles.cardText}>Nenhum agendamento encontrado.</Text>
                <TouchableOpacity style={styles.agendarBtn} onPress={() => router.push('/agendamento')}>
                    <Text style={styles.agendarBtnText}>Agendar serviço</Text>
                </TouchableOpacity>

            </View>

            {/* Barra de navegação inferior */}
            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="home" size={24} color="#0077cc" />
                    <Text style={[styles.tabText, { color: "#0077cc" }]}>Início</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="search" size={24} color="#0077cc" />
                    <Text style={[styles.tabText, { color: "#0077cc" }]}>Buscar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="calendar" size={24} color="#0077cc" />
                    <Text style={[styles.tabText, { color: "#0077cc" }]}>Agenda</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="person" size={24} color="#999" />
                    <Text style={styles.tabText}>Perfil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e6f0fa",
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 80, // espaço para a tab bar
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    backButton: {
        marginRight: 10,
    },
    logo: {
        fontSize: 20,
        fontWeight: "bold",
    },
    logoLav: {
        color: "#0077cc",
    },
    dateText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "500",
        textTransform: "capitalize",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        alignItems: "center",
        marginBottom: 30,
    },
    cardText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    agendarBtn: {
        backgroundColor: "#0077cc",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    agendarBtnText: {
        color: "#fff",
        fontWeight: "bold",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    tabItem: {
        alignItems: "center",
    },
    tabText: {
        fontSize: 12,
        marginTop: 4,
        color: "#999",
    },
});

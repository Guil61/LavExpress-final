// app/(tabs)/agenda.tsx

import {View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform} from "react-native";
import {Link, useRouter} from "expo-router"; // Adicionando useRouter
import {Ionicons} from "@expo/vector-icons";
import {format, startOfMonth, endOfMonth, eachDayOfInterval} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default function AgendaScreen() {
    const router = useRouter(); // Inicializando o router
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const days = eachDayOfInterval({start: monthStart, end: monthEnd});

    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho com botão de voltar */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
                    <Ionicons name="arrow-back" size={24} color="#0077cc" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.logo}>
                        <Text style={styles.logoLav}>Lav</Text>
                        Express
                    </Text>
                </View>
                <View style={{width: 40}} /> {/* Espaço para balancear o cabeçalho */}
            </View>

            <Text style={styles.monthText}>{format(today, "MMMM yyyy", {locale: ptBR})}</Text>

            <View style={styles.weekRow}>
                {weekDays.map((day, index) => (
                    <Text key={index} style={styles.weekDay}>
                        {day}
                    </Text>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.calendar}>
                <View style={styles.grid}>
                    {days.map((day, index) => {
                        const weekDay = day.getDay(); // domingo = 0 ... sábado = 6
                        const correctedDay = weekDay === 0 ? 6 : weekDay - 1; // começa segunda

                        const isFirst = index === 0;
                        const marginLeft = isFirst ? `${correctedDay * (100 / 7)}%` : 0;

                        return (
                            <Link
                                key={index}
                                href={{
                                    pathname: "/agenda/[dia]",
                                    params: {dia: format(day, "yyyy-MM-dd")},
                                }}
                                asChild
                            >
                                <TouchableOpacity style={{...styles.dayButton, marginLeft}}>
                                    <Text style={styles.dayText}>{format(day, "d")}</Text>
                                </TouchableOpacity>
                            </Link>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.tabBar}>
                <Link href="/" asChild>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="home-outline" size={24} color="#999"/>
                        <Text style={styles.tabText}>Início</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/buscar" asChild>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="search-outline" size={24} color="#999"/>
                        <Text style={styles.tabText}>Buscar</Text>
                    </TouchableOpacity>
                </Link>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="calendar" size={24} color="#0077cc"/>
                    <Text style={[styles.tabText, {color: "#0077cc"}]}>Agenda</Text>
                </TouchableOpacity>
                <Link href="/perfil" asChild>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="person-outline" size={24} color="#999"/>
                        <Text style={styles.tabText}>Perfil</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e6f0fa",
    },
    statusBarSpacer: {
        height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        backgroundColor: "#e6f0fa",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    logo: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },
    logoLav: {
        color: "#0077cc",
    },
    monthText: {
        textAlign: "center",
        fontSize: 16,
        color: "#0077cc",
        marginBottom: 10,
        fontWeight: "600",
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 8,
    },
    weekDay: {
        width: "14.28%",
        textAlign: "center",
        color: "#0077cc",
        fontWeight: "500",
        fontSize: 12,
    },
    calendar: {
        paddingHorizontal: 10,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayButton: {
        width: "14.28%",
        aspectRatio: 1,
        backgroundColor: "#b3d9f5",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    dayText: {
        fontSize: 14,
        color: "#003366",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    },
    tabItem: {
        alignItems: "center",
    },
    tabText: {
        fontSize: 12,
        color: "#999",
    },
});
// app/ServicoEspecifico.tsx

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform
} from 'react-native';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import {useLocalSearchParams, Link, router} from 'expo-router';

const lavaJatos = [
    {
        nome: "Lava Jato Brasil",
        servico: "Completo",
        avaliacao: 4.7,
        distancia: "3.5 km",
        tempo: "20-30 min",
        preco: "R$ 40,00",
        imagem: "",
    },
    {
        nome: "Lava Jato Canaã",
        servico: "Lavagem Simples",
        avaliacao: 4.5,
        distancia: "2.1 km",
        tempo: "15-25 min",
        preco: "R$ 30,00",
        imagem: "",
    },
    {
        nome: "Lava Jato Rio Negro",
        servico: "Completo",
        avaliacao: 4.8,
        distancia: "4.0 km",
        tempo: "30-40 min",
        preco: "R$ 50,00",
        imagem: "",
    },
    {
        nome: "ACQUATEC Lavagem Expressa",
        servico: "Lavagem Simples",
        avaliacao: 4.6,
        distancia: "5.2 km",
        tempo: "25-35 min",
        preco: "R$ 35,00",
        imagem: "",
    },
    {
        nome: "New Car Lava Jato",
        servico: "Polimento",
        avaliacao: 4.9,
        distancia: "1.8 km",
        tempo: "40-50 min",
        preco: "R$ 80,00",
        imagem: "",
    },
    {
        nome: "Express Lava Jato & Higienização",
        servico: "Higienização",
        avaliacao: 4.4,
        distancia: "3.2 km",
        tempo: "20-25 min",
        preco: "R$ 25,00",
        imagem: "",
    },
    {
        nome: "Flash Lava Jato",
        servico: "Polimento",
        avaliacao: 4.7,
        distancia: "4.5 km",
        tempo: "60 min",
        preco: "R$ 120,00",
        imagem: "",
    },
    {
        nome: "Lava Rapido Guará",
        servico: "Lavagem Simples",
        avaliacao: 4.3,
        distancia: "2.7 km",
        tempo: "15-20 min",
        preco: "R$ 28,00",
        imagem: "",
    },
    {
        nome: "Rota 010 Lava Jato",
        servico: "Higienização",
        avaliacao: 4.8,
        distancia: "5.0 km",
        tempo: "35-45 min",
        preco: "R$ 45,00",
        imagem: "",
    },
    {
        nome: "JJ Lava Jato",
        servico: "Completo",
        avaliacao: 4.6,
        distancia: "2.3 km",
        tempo: "25-35 min",
        preco: "R$ 55,00",
        imagem: "",
    },
];

export default function ServicoEspecifico() {
    const params = useLocalSearchParams();
    const servico = params.servico as string;
    const icone = params.icone as string;

    // Filtramos apenas os lava-jatos que oferecem o serviço selecionado
    const lavaJatosFiltrados = lavaJatos.filter(lj => lj.servico === servico);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0077cc" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Ionicons name={icone as any} size={24} color="#0077cc" />
                    <Text style={styles.headerTitle}>{servico}</Text>
                </View>
                <View style={{width: 24}}/> {/* Espaço para manter alinhamento */}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {lavaJatosFiltrados.length > 0 ? (
                        <>
                            <Text style={styles.subTitle}>
                                Encontramos {lavaJatosFiltrados.length} lava-jatos com {servico}
                            </Text>

                            {/* Lista de lava-jatos filtrados */}
                            <View style={styles.lavaJatosContainer}>
                                {lavaJatosFiltrados.map((lj) => (
                                    <View key={lj.nome} style={styles.lavaJatoCard}>
                                        <Image
                                            source={{uri: lj.imagem || 'https://via.placeholder.com/100'}}
                                            style={styles.logo}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.lavaJatoInfo}>
                                            <View style={styles.lavaJatoHeader}>
                                                <Text style={styles.nome}>{lj.nome}</Text>
                                                <FontAwesome name="heart-o" size={20} color="#999"/>
                                            </View>

                                            <View style={styles.ratingContainer}>
                                                <Ionicons name="star" size={14} color="#ffb700"/>
                                                <Text style={styles.ratingText}>{lj.avaliacao}</Text>
                                                <Text style={styles.dot}>•</Text>
                                                <Text style={styles.distance}>{lj.distancia}</Text>
                                            </View>

                                            <View style={styles.detailsContainer}>
                                                <Text style={styles.detailItem}>{lj.tempo}</Text>
                                                <Text style={styles.dot}>•</Text>
                                                <Text style={styles.detailItem}>{lj.preco}</Text>
                                            </View>

                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => router.push('/agendamento')}
                                            >
                                                <Text style={styles.buttonText}>Agendar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="alert-circle-outline" size={80} color="#cccccc"/>
                            <Text style={styles.emptyText}>
                                Nenhum lava-jato com {servico} encontrado.
                            </Text>
                            <TouchableOpacity
                                style={styles.backToHomeButton}
                                onPress={() => router.push('/home')}
                            >
                                <Text style={styles.backToHomeButtonText}>Voltar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
                <Link href="/agenda" asChild>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="calendar-outline" size={24} color="#999"/>
                        <Text style={styles.tabText}>Agenda</Text>
                    </TouchableOpacity>
                </Link>
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
        backgroundColor: "#f5f5f5",
    },
    statusBarSpacer: {
        height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        backgroundColor: "white",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginLeft: 8,
    },
    content: {
        padding: 16,
    },
    subTitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
    lavaJatosContainer: {
        marginBottom: 20,
    },
    lavaJatoCard: {
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: "row",
        padding: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: "#f0f0f0",
    },
    lavaJatoInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },
    lavaJatoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    nome: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        maxWidth: "80%",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    ratingText: {
        marginLeft: 4,
        color: "#666",
        fontSize: 14,
        fontWeight: "500",
    },
    dot: {
        color: "#999",
        marginHorizontal: 6,
        fontSize: 14,
    },
    distance: {
        color: "#666",
        fontSize: 14,
    },
    detailsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    detailItem: {
        color: "#666",
        fontSize: 14,
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#0077cc",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        marginTop: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    backToHomeButton: {
        backgroundColor: "#0077cc",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    backToHomeButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "white",
        paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    },
    tabItem: {
        alignItems: "center",
        paddingHorizontal: 10,
    },
    tabText: {
        fontSize: 12,
        marginTop: 4,
        color: "#999",
        fontWeight: "500",
    },
});
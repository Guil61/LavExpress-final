import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as Location from 'expo-location';
import { lavaJatoService, LavaJato } from "../services/api";

const categorias = [
    { nome: "Completo", icone: "car-sport" },
    { nome: "Lavagem Simples", icone: "water" },
    { nome: "Higienização", icone: "brush" },
    { nome: "Polimento", icone: "color-wand" },
];

export default function Home() {
    const router = useRouter();
    const [lavaJatos, setLavaJatos] = useState<LavaJato[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationPermission, setLocationPermission] = useState<boolean>(false);
    const [userCity, setUserCity] = useState<string>("Brasília, DF");

    // Carregar dados ao iniciar
    useEffect(() => {
        // Solicitar permissão de localização e carregar dados
        requestLocationPermissionAndLoadData();
    }, []);

    const requestLocationPermissionAndLoadData = async () => {
        try {
            // Solicitar permissão de localização
            const { status } = await Location.requestForegroundPermissionsAsync();
            const hasPermission = status === 'granted';
            setLocationPermission(hasPermission);

            if (hasPermission) {
                // Obter localização atual
                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });

                // Tentar obter nome da cidade
                try {
                    const geocode = await Location.reverseGeocodeAsync({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    });

                    if (geocode.length > 0) {
                        const { city, region } = geocode[0];
                        if (city && region) {
                            setUserCity(`${city}, ${region}`);
                        }
                    }
                } catch (error) {
                    console.error("Erro ao obter nome da cidade:", error);
                }

                // Carregar lava-jatos próximos
                await loadNearbyLavaJatos(location.coords.latitude, location.coords.longitude);
            } else {
                // Se não tiver permissão, carregar lava-jatos gerais
                await loadLavaJatos();
            }
        } catch (error) {
            console.error("Erro ao obter localização:", error);
            await loadLavaJatos();
        } finally {
            setLoading(false);
        }
    };

    const loadNearbyLavaJatos = async (latitude: number, longitude: number) => {
        try {
            const data = await lavaJatoService.buscarProximos(latitude, longitude, 10);
            setLavaJatos(data);
        } catch (error) {
            console.error("Erro ao carregar lava-jatos próximos:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar os lava-jatos próximos. Carregando lista geral."
            );
            await loadLavaJatos();
        }
    };

    const loadLavaJatos = async () => {
        try {
            const data = await lavaJatoService.listarLavaJatos();
            setLavaJatos(data.lavaJatos || []);
        } catch (error) {
            console.error("Erro ao carregar lava-jatos:", error);
            Alert.alert("Erro", "Não foi possível carregar a lista de lava-jatos.");
            // Usar dados de exemplo caso a API falhe
            setLavaJatos([]);
        }
    };

    // Função para navegar para a tela de detalhes do lava-jato
    const navegarParaDetalhes = (id: number) => {
        router.push(`/lava-jato-detalhes?id=${id}`);
    };

    // Formatar preço médio
    const formatarPreco = (lavaJato: LavaJato) => {
        // Aqui você pode implementar lógica para obter preço médio dos serviços
        // Por enquanto, retornaremos um valor fixo
        return "R$ 40,00";
    };

    // Calcular tempo estimado baseado na distância
    const calcularTempoEstimado = (lavaJato: LavaJato) => {
        // Implementar lógica baseada na distância ou duração dos serviços
        return "20-30 min";
    };

    // Calcular distância se tiver localização do usuário
    const calcularDistancia = (lavaJato: LavaJato) => {
        if (!userLocation || !lavaJato.latitude || !lavaJato.longitude) return null;

        const lat1 = userLocation.latitude;
        const lon1 = userLocation.longitude;
        const lat2 = lavaJato.latitude;
        const lon2 = lavaJato.longitude;

        const R = 6371; // Raio da Terra em km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distância em km

        return `${distance.toFixed(1)} km`;
    };

    // Função auxiliar para conversão de graus para radianos
    const deg2rad = (deg: number) => {
        return deg * (Math.PI/180);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.locationContainer}>
                    <Ionicons name="location-sharp" size={20} color="#0077cc"/>
                    <Text style={styles.locationText}>{userCity}</Text>
                </View>
                <Link href="/perfil" asChild>
                    <TouchableOpacity>
                        <FontAwesome name="user-circle" size={28} color="#0077cc"/>
                    </TouchableOpacity>
                </Link>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0077cc" />
                    <Text style={styles.loadingText}>Carregando lava-jatos...</Text>
                </View>
            ) : (
                <ScrollView>
                    {/* Conteúdo Principal */}
                    <View style={styles.content}>
                        <Text style={styles.headerTitle}>Encontre o melhor lava-jato</Text>

                        {/* Barra de Pesquisa */}
                        <Link href="/buscar" asChild>
                            <TouchableOpacity style={styles.searchBar}>
                                <Ionicons name="search" size={20} color="#666"/>
                                <Text style={styles.searchText}>Pesquisar lava-jatos...</Text>
                            </TouchableOpacity>
                        </Link>

                        {/* Categorias */}
                        <Text style={styles.sectionTitle}>Categorias</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoriasContainer}
                        >
                            {categorias.map((cat) => (
                                <Link
                                    key={cat.nome}
                                    href={{
                                        pathname: "/ServicoEspecifico",
                                        params: {servico: cat.nome, icone: cat.icone}
                                    }}
                                    asChild
                                >
                                    <TouchableOpacity style={styles.categoriaCard}>
                                        <View style={styles.categoriaIcon}>
                                            <Ionicons name={cat.icone as any} size={28} color="#0077cc"/>
                                        </View>
                                        <Text style={styles.categoriaTexto}>{cat.nome}</Text>
                                    </TouchableOpacity>
                                </Link>
                            ))}
                        </ScrollView>

                        {/* Lava-jatos próximos */}
                        <Text style={styles.sectionTitle}>
                            {locationPermission ? "Próximos de você" : "Lava-jatos disponíveis"}
                        </Text>

                        {lavaJatos.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="car-wash-outline" size={64} color="#cccccc" />
                                <Text style={styles.emptyText}>Nenhum lava-jato encontrado</Text>
                                <TouchableOpacity
                                    style={styles.refreshButton}
                                    onPress={requestLocationPermissionAndLoadData}
                                >
                                    <Text style={styles.refreshButtonText}>Tentar Novamente</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.lavaJatosContainer}>
                                {lavaJatos.map((lj) => (
                                    <TouchableOpacity
                                        key={lj.id}
                                        style={styles.lavaJatoCard}
                                        onPress={() => navegarParaDetalhes(lj.id)}
                                    >
                                        <Image
                                            source={lj.imagemUrl ? { uri: lj.imagemUrl } : require('../assets/lavajato-default.png')}
                                            style={styles.logo}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.lavaJatoInfo}>
                                            <View style={styles.lavaJatoHeader}>
                                                <Text style={styles.nome}>{lj.nome}</Text>
                                                <TouchableOpacity>
                                                    <FontAwesome name="heart-o" size={20} color="#999"/>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.ratingContainer}>
                                                <Ionicons name="star" size={14} color="#ffb700"/>
                                                <Text style={styles.ratingText}>{lj.avaliacaoMedia.toFixed(1)}</Text>
                                                <Text style={styles.dot}>•</Text>
                                                <Text style={styles.distance}>
                                                    {calcularDistancia(lj) || "Distância desconhecida"}
                                                </Text>
                                            </View>

                                            <View style={styles.detailsContainer}>
                                                <Text style={styles.detailItem}>{calcularTempoEstimado(lj)}</Text>
                                                <Text style={styles.dot}>•</Text>
                                                <Text style={styles.detailItem}>{formatarPreco(lj)}</Text>
                                            </View>

                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => navegarParaDetalhes(lj.id)}
                                            >
                                                <Text style={styles.buttonText}>Ver detalhes</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}

            {/* Bottom Navigation */}
            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="home" size={24} color="#0077cc"/>
                    <Text style={[styles.tabText, {color: "#0077cc"}]}>Início</Text>
                </TouchableOpacity>
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
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#0077cc",
        fontWeight: "500",
    },
    content: {
        padding: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },
    searchText: {
        marginLeft: 12,
        color: "#666",
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    categoriasContainer: {
        paddingBottom: 8,
    },
    categoriaCard: {
        alignItems: "center",
        marginRight: 16,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        width: 100,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    categoriaIcon: {
        backgroundColor: "#e6f3fb",
        padding: 12,
        borderRadius: 50,
        marginBottom: 8,
    },
    categoriaTexto: {
        fontSize: 13,
        color: "#0077cc",
        fontWeight: "600",
        textAlign: "center",
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#666",
        marginTop: 16,
        marginBottom: 20,
    },
    refreshButton: {
        backgroundColor: "#0077cc",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: "white",
        fontWeight: "600",
    },
});
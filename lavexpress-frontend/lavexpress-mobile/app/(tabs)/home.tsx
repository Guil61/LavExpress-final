import React from "react";
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
} from "react-native";
import {Ionicons, FontAwesome} from "@expo/vector-icons";
import {Link, useRouter} from "expo-router";

const categorias = [
    {nome: "Completo", icone: "car-sport"},
    {nome: "Lavagem Simples", icone: "water"},
    {nome: "Higienização", icone: "brush"},
    {nome: "Polimento", icone: "color-wand"},
];

const lavaJatos = [
    {
        id: "brasil",
        nome: "Lava Jato Brasil",
        servico: "Completo",
        avaliacao: 4.7,
        distancia: "3.5 km",
        tempo: "20-30 min",
        preco: "R$ 40,00",
        imagem: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=300&q=80",
    },
    {
        id: "canaa",
        nome: "Lava Jato Canaã",
        servico: "Simples",
        avaliacao: 4.5,
        distancia: "2.1 km",
        tempo: "15-25 min",
        preco: "R$ 30,00",
        imagem: "https://images.pexels.com/photos/6873076/pexels-photo-6873076.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
        id: "rio_negro",
        nome: "Lava Jato Rio Negro",
        servico: "Completo",
        avaliacao: 4.8,
        distancia: "4.0 km",
        tempo: "30-40 min",
        preco: "R$ 50,00",
        imagem: "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
        id: "acquatec",
        nome: "ACQUATEC Lavagem Expressa",
        servico: "Express",
        avaliacao: 4.6,
        distancia: "5.2 km",
        tempo: "25-35 min",
        preco: "R$ 35,00",
        imagem: "https://images.unsplash.com/photo-1605618826115-fb9e775cf91d?auto=format&fit=crop&w=300&q=80",
    },
    {
        id: "new_car",
        nome: "New Car Lava Jato",
        servico: "Premium",
        avaliacao: 4.9,
        distancia: "1.8 km",
        tempo: "40-50 min",
        preco: "R$ 80,00",
        imagem: "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
        id: "express",
        nome: "Express Lava Jato & Higienização",
        servico: "Simples",
        avaliacao: 4.4,
        distancia: "3.2 km",
        tempo: "20-25 min",
        preco: "R$ 25,00",
        imagem: "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
        id: "flash",
        nome: "Flash Lava Jato",
        servico: "Polimento",
        avaliacao: 4.7,
        distancia: "4.5 km",
        tempo: "60 min",
        preco: "R$ 120,00",
        imagem: "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
        id: "guara",
        nome: "Lava Rapido Guará",
        servico: "Express",
        avaliacao: 4.3,
        distancia: "2.7 km",
        tempo: "15-20 min",
        preco: "R$ 28,00",
        imagem: "https://images.pexels.com/photos/7781310/pexels-photo-7781310.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
        id: "rota010",
        nome: "Rota 010 Lava Jato",
        servico: "Ecológico",
        avaliacao: 4.8,
        distancia: "5.0 km",
        tempo: "35-45 min",
        preco: "R$ 45,00",
        imagem: "https://images.pexels.com/photos/5765/car-vehicle-transport-vintage.jpg?auto=compress&cs=tinysrgb&w=300",
    },
    {
        id: "jj",
        nome: "JJ Lava Jato",
        servico: "Completo",
        avaliacao: 4.6,
        distancia: "2.3 km",
        tempo: "25-35 min",
        preco: "R$ 55,00",
        imagem: "https://images.pexels.com/photos/244553/pexels-photo-244553.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
];

export default function Home() {
    const router = useRouter();

    // Função para navegar para a tela de detalhes do lava-jato
    const navegarParaDetalhes = (id: string) => {
        router.push(`/lava-jato-detalhes?id=${id}`);
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
                    <Text style={styles.locationText}>Brasília, DF</Text>
                </View>
                <Link href="/perfil" asChild>
                    <TouchableOpacity>
                        <FontAwesome name="user-circle" size={28} color="#0077cc"/>
                    </TouchableOpacity>
                </Link>
            </View>

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
                    <Text style={styles.sectionTitle}>Próximos de você</Text>
                    <View style={styles.lavaJatosContainer}>
                        {lavaJatos.map((lj) => (
                            <TouchableOpacity
                                key={lj.id}
                                style={styles.lavaJatoCard}
                                onPress={() => navegarParaDetalhes(lj.id)}
                            >
                                <Image
                                    source={{uri: lj.imagem}}
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
                                        onPress={() => navegarParaDetalhes(lj.id)}
                                    >
                                        <Text style={styles.buttonText}>Ver detalhes</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

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
});
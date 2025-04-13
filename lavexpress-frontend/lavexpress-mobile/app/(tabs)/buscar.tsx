import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    SafeAreaView,
    Platform,
} from 'react-native';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';

// Dados de exemplo
const lavaJatos = [
    {
        nome: "Lava Jato Brasil",
        servico: "Completo",
        avaliacao: 4.7,
        distancia: "3.5 km",
        tempo: "20-30 min",
        preco: "R$ 40,00",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlAvD9vqz101dbo1wAXG6pNMHcCEX7jQGdEQ&s",
        bairro: "Asa Sul",
        promocao: true,
    },
    {
        nome: "Lava Jato Canaã",
        servico: "Lavagem Simples",
        avaliacao: 4.5,
        distancia: "2.1 km",
        tempo: "15-25 min",
        preco: "R$ 30,00",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_znZfOLL5tIu-F9kDiW8l6HdUhBiWy6c4hw&s",
        bairro: "Asa Norte",
        promocao: false,
    },
    {
        nome: "Lava Jato Rio Negro",
        servico: "Completo",
        avaliacao: 4.8,
        distancia: "4.0 km",
        tempo: "30-40 min",
        preco: "R$ 50,00",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSUlddiIEhgG7EEDxrnEfJlp1OdOZzq_OgBQ&s",
        bairro: "Sudoeste",
        promocao: true,
    },
    {
        nome: "ACQUATEC Lavagem Expressa",
        servico: "Lavagem Simples",
        avaliacao: 4.6,
        distancia: "5.2 km",
        tempo: "25-35 min",
        preco: "R$ 35,00",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5uL85G2lu4Xe1UshHhX1zuv2HroxmiVWrVg&s",
        bairro: "Lago Sul",
        promocao: false,
    },
];

const categorias = [
    {nome: "Completo", icone: "car-sport"},
    {nome: "Lavagem Simples", icone: "water"},
    {nome: "Higienização", icone: "brush"},
    {nome: "Polimento", icone: "color-wand"},
];

export default function Buscar() {
    const [busca, setBusca] = useState('');
    const [resultados, setResultados] = useState(lavaJatos);
    const [filtroAtivo, setFiltroAtivo] = useState(false);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [historicoBuscas, setHistoricoBuscas] = useState([
        "Lava jato próximo",
        "Polimento automotivo",
        "Lavagem completa"
    ]);

    // Função para filtrar os resultados com base no termo de busca
    const filtrarResultados = (termo: string) => {
        if (!termo) {
            setResultados(lavaJatos);
            return;
        }

        // Filtrar resultados pelo termo
        const filtrados = lavaJatos.filter(lavaJato =>
            lavaJato.nome.toLowerCase().includes(termo.toLowerCase()) ||
            lavaJato.servico.toLowerCase().includes(termo.toLowerCase()) ||
            lavaJato.bairro.toLowerCase().includes(termo.toLowerCase())
        );

        setResultados(filtrados);
    };

    // Função para realizar a busca
    const realizarBusca = () => {
        if (busca) {
            // Adicionar à lista de histórico se não existir
            if (!historicoBuscas.includes(busca)) {
                setHistoricoBuscas([busca, ...historicoBuscas.slice(0, 4)]);
            }
            filtrarResultados(busca);
        }
    };

    // Renderização de avaliação com estrelas
    const renderEstrelas = (avaliacao: number) => {
        const estrelas = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= avaliacao) {
                estrelas.push(<Ionicons key={i} name="star" size={12} color="#ffb700"/>);
            } else if (i - 0.5 <= avaliacao) {
                estrelas.push(<Ionicons key={i} name="star-half" size={12} color="#ffb700"/>);
            } else {
                estrelas.push(<Ionicons key={i} name="star-outline" size={12} color="#ffb700"/>);
            }
        }
        return estrelas;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer}/>

            {/* Cabeçalho */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#666"/>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar lava-jatos, serviços..."
                            value={busca}
                            onChangeText={(texto) => {
                                setBusca(texto);
                            }}
                            onSubmitEditing={realizarBusca}
                            returnKeyType="search"
                        />
                        {busca ? (
                            <TouchableOpacity onPress={() => {
                                setBusca('');
                                setResultados(lavaJatos);
                            }}>
                                <Ionicons name="close-circle" size={20} color="#999"/>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setMostrarFiltros(!mostrarFiltros)}
                    >
                        <MaterialIcons name="filter-list" size={24} color="#666"/>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* Histórico de buscas */}
                {!busca && historicoBuscas.length > 0 && (
                    <View style={styles.historySection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Buscas recentes</Text>
                            <TouchableOpacity onPress={() => setHistoricoBuscas([])}>
                                <Text style={styles.clearText}>Limpar</Text>
                            </TouchableOpacity>
                        </View>
                        {historicoBuscas.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.historyItem}
                                onPress={() => {
                                    setBusca(item);
                                    realizarBusca();
                                }}
                            >
                                <Ionicons name="time-outline" size={20} color="#666"/>
                                <Text style={styles.historyText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Categorias de serviço */}
                {!busca && (
                    <View style={styles.categoriesSection}>
                        <Text style={styles.sectionTitle}>Buscar por categoria</Text>
                        <View style={styles.categoriesGrid}>
                            {categorias.map((categoria) => (
                                <TouchableOpacity
                                    key={categoria.nome}
                                    style={styles.categoryCard}
                                    onPress={() => {
                                        setBusca(categoria.nome);
                                        realizarBusca();
                                    }}
                                >
                                    <View style={styles.categoryIcon}>
                                        <Ionicons name={categoria.icone as any} size={28} color="#0077cc"/>
                                    </View>
                                    <Text style={styles.categoryText}>{categoria.nome}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Resultados de busca */}
                {busca && (
                    <View style={styles.resultsSection}>
                        <Text style={styles.resultsTitle}>
                            {resultados.length === 0
                                ? "Nenhum resultado encontrado"
                                : `${resultados.length} resultado${resultados.length > 1 ? 's' : ''} encontrado${resultados.length > 1 ? 's' : ''}`}
                        </Text>

                        {resultados.map((lavaJato) => (
                            <TouchableOpacity key={lavaJato.nome} style={styles.resultCard}>
                                <Image
                                    source={{uri: lavaJato.imagem}}
                                    style={styles.resultImage}
                                />
                                <View style={styles.resultInfo}>
                                    <View style={styles.resultHeader}>
                                        <Text style={styles.resultName}>{lavaJato.nome}</Text>
                                        {lavaJato.promocao && (
                                            <View style={styles.promoTag}>
                                                <Text style={styles.promoText}>Promoção</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.resultRating}>
                                        {renderEstrelas(lavaJato.avaliacao)}
                                        <Text style={styles.ratingText}>{lavaJato.avaliacao}</Text>
                                    </View>

                                    <View style={styles.resultDetails}>
                                        <Text style={styles.detailText}>{lavaJato.distancia}</Text>
                                        <Text style={styles.detailDot}>•</Text>
                                        <Text style={styles.detailText}>{lavaJato.tempo}</Text>
                                        <Text style={styles.detailDot}>•</Text>
                                        <Text style={styles.detailService}>{lavaJato.servico}</Text>
                                    </View>

                                    <View style={styles.resultBottom}>
                                        <Text style={styles.resultPrice}>{lavaJato.preco}</Text>
                                        <TouchableOpacity style={styles.resultButton}>
                                            <Text style={styles.resultButtonText}>Ver detalhes</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Sugestões populares */}
                {!busca && (
                    <View style={styles.popularSection}>
                        <Text style={styles.sectionTitle}>Buscas populares</Text>
                        <View style={styles.popularTags}>
                            {[
                                "Lavagem completa",
                                "Polimento",
                                "Higienização",
                                "Promoções",
                                "Melhor avaliados",
                                "Mais próximos"
                            ].map((tag, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.popularTag}
                                    onPress={() => {
                                        setBusca(tag);
                                        realizarBusca();
                                    }}
                                >
                                    <Text style={styles.popularTagText}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Barra de navegação inferior */}
            <View style={styles.tabBar}>
                <Link href="/home" asChild>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="home-outline" size={24} color="#999"/>
                        <Text style={styles.tabText}>Início</Text>
                    </TouchableOpacity>
                </Link>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="search" size={24} color="#0077cc"/>
                    <Text style={[styles.tabText, {color: "#0077cc"}]}>Buscar</Text>
                </TouchableOpacity>
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
    header: {
        backgroundColor: "white",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: "#f0f0f0",
        marginLeft: 10,
        padding: 12,
        borderRadius: 10,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    historySection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    clearText: {
        color: "#0077cc",
        fontSize: 14,
        fontWeight: "500",
        backgroundColor: "#e6f3fb",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        overflow: "hidden",
    },
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "white",
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    historyText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    categoriesSection: {
        marginBottom: 24,
    },
    categoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 12,
    },
    categoryCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        width: "48%",
        alignItems: "center",
        marginBottom: 16,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#e6f3fb",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
        textAlign: "center",
    },
    resultsSection: {
        marginBottom: 16,
    },
    resultsTitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
    resultCard: {
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    resultImage: {
        width: 110,
        height: 110,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    resultInfo: {
        flex: 1,
        padding: 12,
    },
    resultHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 6,
    },
    resultName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
    },
    promoTag: {
        backgroundColor: "#ffebcd",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 8,
    },
    promoText: {
        color: "#ff8c00",
        fontSize: 12,
        fontWeight: "bold",
    },
    resultRating: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 12,
        color: "#666",
    },
    resultDetails: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 8,
    },
    detailText: {
        fontSize: 12,
        color: "#666",
    },
    detailDot: {
        fontSize: 10,
        color: "#ccc",
        marginHorizontal: 4,
    },
    detailService: {
        fontSize: 12,
        color: "#0077cc",
    },
    resultBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    resultPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    resultButton: {
        backgroundColor: "#0077cc",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    resultButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
    popularSection: {
        marginBottom: 24,
    },
    popularTags: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 12,
    },
    popularTag: {
        backgroundColor: "#e6f3fb",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        borderWidth: 1,
        borderColor: "#d9e8f3",
    },
    popularTagText: {
        color: "#0077cc",
        fontSize: 14,
        fontWeight: "600",
    },
    tabBar: {
        flexDirection: "row",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingBottom: 20,
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
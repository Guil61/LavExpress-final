// app/lava-jato-detalhes.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Linking,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { lavaJatoService, LavaJato, Servico } from '../services/api';

// Tipo para avaliações (mantendo a estrutura atual)
interface Avaliacao {
    id: number;
    usuario: string;
    data: string;
    nota: number;
    comentario: string;
}

// Dados de exemplo para avaliações (como ainda não temos na API)
const avaliacoesExemplo: Avaliacao[] = [
    { id: 1, usuario: "Marcos R.", data: "12/03/2025", nota: 5, comentario: "Excelente atendimento e serviço de qualidade! Recomendo." },
    { id: 2, usuario: "Ana Paula", data: "28/02/2025", nota: 4, comentario: "Bom serviço, mas demorou um pouco mais do que o previsto." },
    { id: 3, usuario: "Carlos Eduardo", data: "15/02/2025", nota: 5, comentario: "Melhor lava-jato da cidade! Atendimento nota 10." }
];

const { width } = Dimensions.get('window');

export default function LavaJatoDetalhes() {
    const params = useLocalSearchParams();
    const id = params.id as string;
    const router = useRouter();
    const lavaJatoId = parseInt(id);

    // Estados para dados da API
    const [lavaJato, setLavaJato] = useState<LavaJato | null>(null);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingServicos, setLoadingServicos] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estado para controlar a guia ativa
    const [activeTab, setActiveTab] = useState('servicos');

    // Estado para controlar a imagem ativa no carrossel
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Carrossel de imagens (temporário até termos múltiplas imagens na API)
    const carouselImages = [
        "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
        "https://images.pexels.com/photos/6873076/pexels-photo-6873076.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=800"
    ];

    // Carregar dados do lava-jato e serviços
    useEffect(() => {
        const loadLavaJatoData = async () => {
            if (!lavaJatoId) {
                setError('ID de lava-jato inválido');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Carregar detalhes do lava-jato
                const lavaJatoData = await lavaJatoService.buscarLavaJato(lavaJatoId);
                setLavaJato(lavaJatoData);

                // Carregar serviços
                await loadServicos(lavaJatoId);
            } catch (err) {
                console.error('Erro ao carregar detalhes do lava-jato:', err);
                setError('Não foi possível carregar os detalhes. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        loadLavaJatoData();
    }, [lavaJatoId]);

    // Função para carregar serviços
    const loadServicos = async (id: number) => {
        try {
            setLoadingServicos(true);
            const servicosData = await lavaJatoService.listarServicos(id);

            // Filtrar apenas serviços ativos e ordenar por preço
            const servicosAtivos = servicosData
                .filter(servico => servico.ativo)
                .sort((a, b) => a.preco - b.preco);

            setServicos(servicosAtivos);
        } catch (err) {
            console.error('Erro ao carregar serviços:', err);
            Alert.alert('Erro', 'Não foi possível carregar os serviços deste lava-jato.');
            setServicos([]);
        } finally {
            setLoadingServicos(false);
        }
    };

    // Função para renderizar as estrelas de avaliação
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Ionicons key={i} name="star" size={16} color="#FFB700" />);
            } else if (i === fullStars + 1 && halfStar) {
                stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFB700" />);
            } else {
                stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFB700" />);
            }
        }

        return (
            <View style={styles.starsContainer}>
                {stars}
                <Text style={styles.ratingText}>{lavaJato?.avaliacaoMedia.toFixed(1) || '0.0'}</Text>
                <Text style={styles.reviewCount}>({lavaJato?.avaliacaoMedia ? '328' : '0'} avaliações)</Text>
            </View>
        );
    };

    // Função para abrir o telefone para ligar
    const handleCall = () => {
        if (!lavaJato?.telefone) return;
        Linking.openURL(`tel:${lavaJato.telefone.replace(/[^0-9]/g, '')}`);
    };

    // Função para abrir o mapa
    const handleOpenMap = () => {
        if (!lavaJato?.latitude || !lavaJato?.longitude) return;

        const url = Platform.select({
            ios: `maps:?q=${lavaJato.latitude},${lavaJato.longitude}`,
            android: `geo:${lavaJato.latitude},${lavaJato.longitude}?q=${lavaJato.nome}`
        });

        Linking.openURL(url as string);
    };

    // Função para ir para a tela de agendamento com o serviço selecionado
    const handleAgendarServico = (servicoId: number) => {
        router.push({
            pathname: '/agendamento',
            params: { lavaJatoId: lavaJato?.id.toString(), servicoId: servicoId.toString() }
        });
    };

    // Formatação de preço
    const formatarPreco = (preco: number) => {
        return preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Mostrar tela de carregamento
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0077cc" />
                    <Text style={styles.loadingText}>Carregando detalhes...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Mostrar mensagem de erro
    if (error || !lavaJato) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
                    <Text style={styles.errorText}>{error || 'Lava-jato não encontrado'}</Text>
                    <TouchableOpacity style={styles.backButtonError} onPress={() => router.push('/home')}>
                        <Text style={styles.backButtonTextError}>Voltar para a Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Carrossel de imagens */}
            <View style={styles.imageCarousel}>
                <FlatList
                    data={lavaJato.imagemUrl ? [lavaJato.imagemUrl, ...carouselImages.slice(1)] : carouselImages}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                        setActiveImageIndex(newIndex);
                    }}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.carouselImage} />
                    )}
                    keyExtractor={(_, index) => index.toString()}
                />

                {/* Indicadores do carrossel */}
                <View style={styles.paginationContainer}>
                    {(lavaJato.imagemUrl ? [lavaJato.imagemUrl, ...carouselImages.slice(1)] : carouselImages).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === activeImageIndex && styles.paginationDotActive
                            ]}
                        />
                    ))}
                </View>

                {/* Botão voltar */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                {/* Botão favoritar */}
                <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Informações gerais */}
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{lavaJato.nome}</Text>
                    {renderStars(lavaJato.avaliacaoMedia || 0)}

                    <View style={styles.addressContainer}>
                        <Ionicons name="location-outline" size={18} color="#666" />
                        <Text style={styles.address}>{lavaJato.endereco}, {lavaJato.cidade}-{lavaJato.estado}</Text>
                    </View>

                    <View style={styles.scheduleContainer}>
                        <Ionicons name="time-outline" size={18} color="#666" />
                        <Text style={styles.schedule}>
                            {lavaJato.horarioAbertura && lavaJato.horarioFechamento
                                ? `Segunda a Sábado: ${lavaJato.horarioAbertura} - ${lavaJato.horarioFechamento}`
                                : "Horário não informado"}
                        </Text>
                    </View>

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                            <Ionicons name="call" size={20} color="#0077cc" />
                            <Text style={styles.actionText}>Ligar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={handleOpenMap}>
                            <Ionicons name="map" size={20} color="#0077cc" />
                            <Text style={styles.actionText}>Ver no mapa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="share-social" size={20} color="#0077cc" />
                            <Text style={styles.actionText}>Compartilhar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Descrição */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Sobre</Text>
                    <Text style={styles.descriptionText}>
                        {lavaJato.descricao || "Oferecemos serviços de lavagem automotiva com produtos de primeira linha e equipe especializada, garantindo o melhor resultado para seu veículo."}
                    </Text>
                </View>

                {/* Abas de navegação */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'servicos' && styles.activeTab]}
                        onPress={() => setActiveTab('servicos')}
                    >
                        <Text style={[styles.tabText, activeTab === 'servicos' && styles.activeTabText]}>
                            Serviços
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'avaliacoes' && styles.activeTab]}
                        onPress={() => setActiveTab('avaliacoes')}
                    >
                        <Text style={[styles.tabText, activeTab === 'avaliacoes' && styles.activeTabText]}>
                            Avaliações
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Conteúdo das abas */}
                {activeTab === 'servicos' ? (
                    <View style={styles.servicosContainer}>
                        {loadingServicos ? (
                            <View style={styles.loadingServicos}>
                                <ActivityIndicator size="small" color="#0077cc" />
                                <Text style={styles.loadingServicosText}>Carregando serviços...</Text>
                            </View>
                        ) : servicos.length === 0 ? (
                            <View style={styles.emptyServicos}>
                                <Ionicons name="car-outline" size={48} color="#cccccc" />
                                <Text style={styles.emptyServicosText}>Nenhum serviço disponível.</Text>
                            </View>
                        ) : (
                            servicos.map((servico) => (
                                <View key={servico.id} style={styles.servicoCard}>
                                    <View style={styles.servicoInfo}>
                                        <Text style={styles.servicoNome}>{servico.nome}</Text>
                                        <Text style={styles.servicoDescricao}>
                                            {servico.descricao || "Serviço de lavagem automotiva de qualidade."}
                                        </Text>
                                        <View style={styles.servicoDetails}>
                                            <View style={styles.servicoDetail}>
                                                <Ionicons name="time-outline" size={14} color="#666" />
                                                <Text style={styles.servicoDetailText}>{servico.duracaoMinutos} min</Text>
                                            </View>
                                            <Text style={styles.servicoPreco}>{formatarPreco(servico.preco)}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.agendarButton}
                                        onPress={() => handleAgendarServico(servico.id)}
                                    >
                                        <Text style={styles.agendarButtonText}>Agendar</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </View>
                ) : (
                    <View style={styles.avaliacoesContainer}>
                        {avaliacoesExemplo.map((avaliacao) => (
                            <View key={avaliacao.id} style={styles.avaliacaoCard}>
                                <View style={styles.avaliacaoHeader}>
                                    <View style={styles.userInitials}>
                                        <Text style={styles.userInitialsText}>
                                            {avaliacao.usuario.split(' ').map((n) => n[0]).join('')}
                                        </Text>
                                    </View>
                                    <View style={styles.avaliacaoUser}>
                                        <Text style={styles.avaliacaoUserName}>{avaliacao.usuario}</Text>
                                        <Text style={styles.avaliacaoDate}>{avaliacao.data}</Text>
                                    </View>
                                    <View style={styles.avaliacaoRating}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons
                                                key={i}
                                                name={i < avaliacao.nota ? "star" : "star-outline"}
                                                size={14}
                                                color="#FFB700"
                                            />
                                        ))}
                                    </View>
                                </View>
                                <Text style={styles.avaliacaoComentario}>{avaliacao.comentario}</Text>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.allReviewsButton}>
                            <Text style={styles.allReviewsText}>Ver todas as avaliações</Text>
                            <Ionicons name="chevron-forward" size={16} color="#0077cc" />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Botão fixo na parte inferior */}
            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity
                    style={styles.bottomAgendarButton}
                    onPress={() => handleAgendarServico(servicos.length > 0 ? servicos[0].id : 0)}
                    disabled={servicos.length === 0}
                >
                    <Text style={styles.bottomAgendarButtonText}>Agendar Lavagem</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    backButtonError: {
        backgroundColor: '#0077cc',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backButtonTextError: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imageCarousel: {
        height: 250,
        position: 'relative',
    },
    carouselImage: {
        width,
        height: 250,
        resizeMode: 'cover',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        margin: 4,
    },
    paginationDotActive: {
        backgroundColor: '#FFF',
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        left: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingBottom: 80, // Espaço para o botão fixo
    },
    headerInfo: {
        backgroundColor: '#FFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 6,
        marginRight: 4,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    address: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    scheduleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    schedule: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    actionsContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 16,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 12,
        color: '#0077cc',
        marginTop: 4,
    },
    sectionContainer: {
        backgroundColor: '#FFF',
        padding: 16,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        marginTop: 10,
    },
    tab: {
        paddingVertical: 12,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#0077cc',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#0077cc',
        fontWeight: 'bold',
    },
    servicosContainer: {
        backgroundColor: '#FFF',
        padding: 16,
    },
    servicoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    servicoInfo: {
        flex: 1,
        marginRight: 16,
    },
    servicoNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    servicoDescricao: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    servicoDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    servicoDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    servicoDetailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    servicoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0077cc',
    },
    agendarButton: {
        backgroundColor: '#0077cc',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    agendarButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    avaliacoesContainer: {
        backgroundColor: '#FFF',
        padding: 16,
    },
    avaliacaoCard: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avaliacaoHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    userInitials: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e6f3fb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userInitialsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0077cc',
    },
    avaliacaoUser: {
        flex: 1,
        justifyContent: 'center',
    },
    avaliacaoUserName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    avaliacaoDate: {
        fontSize: 12,
        color: '#999',
    },
    avaliacaoRating: {
        flexDirection: 'row',
    },
    avaliacaoComentario: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    allReviewsButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    allReviewsText: {
        fontSize: 14,
        color: '#0077cc',
        marginRight: 4,
        fontWeight: '500',
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    },
    bottomAgendarButton: {
        backgroundColor: '#0077cc',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomAgendarButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingServicos: {
        padding: 40,
        alignItems: 'center',
    },
    loadingServicosText: {
        marginTop: 12,
        color: '#666',
    },
    emptyServicos: {
        padding: 40,
        alignItems: 'center',
    },
    emptyServicosText: {
        marginTop: 12,
        color: '#666',
        textAlign: 'center',
    },
});
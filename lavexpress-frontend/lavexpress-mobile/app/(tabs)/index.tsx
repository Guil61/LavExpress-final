// app/index.tsx

import React, {useRef, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    Dimensions,
    ImageBackground
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';

const {width, height} = Dimensions.get('window');

const features = [
    {
        icon: 'search-outline',
        title: 'Encontre lava-jatos',
        description: 'Descubra os melhores lava-jatos próximos a você com avaliações e preços.'
    },
    {
        icon: 'calendar-outline',
        title: 'Agende facilmente',
        description: 'Marque lavagens com apenas alguns toques e receba confirmação instantânea.'
    },
    {
        icon: 'notifications-outline',
        title: 'Lembretes e notificações',
        description: 'Receba alertas sobre seus agendamentos e ofertas especiais.'
    },
    {
        icon: 'star-outline',
        title: 'Avalie o serviço',
        description: 'Compartilhe sua experiência e ajude outros usuários a escolherem o melhor.'
    }
];

export default function LandingPage() {
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Imagens para o carrossel (URLs da internet)
    const carouselImages = [
        'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
        'https://images.pexels.com/photos/6873076/pexels-photo-6873076.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];

    useEffect(() => {
        // Animação de entrada dos elementos
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true
            })
        ]).start();

        // Carrossel automático
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Animação para o header ao rolar
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    // Animação para o título principal
    const titleScale = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0.8],
        extrapolate: 'clamp'
    });

    // Navegação para login ou cadastro
    const goToLogin = () => router.push('/login');
    const goToSignup = () => router.push('/cadastro');

    // Componente para o card de feature
    const FeatureCard = ({icon, title, description, index}) => {
        const delay = 100 * index;
        const cardFadeAnim = useRef(new Animated.Value(0)).current;
        const cardSlideAnim = useRef(new Animated.Value(30)).current;

        useEffect(() => {
            Animated.parallel([
                Animated.timing(cardFadeAnim, {
                    toValue: 1,
                    duration: 600,
                    delay,
                    useNativeDriver: true
                }),
                Animated.timing(cardSlideAnim, {
                    toValue: 0,
                    duration: 600,
                    delay,
                    useNativeDriver: true
                })
            ]).start();
        }, []);

        return (
            <Animated.View
                style={[
                    styles.featureCard,
                    {
                        opacity: cardFadeAnim,
                        transform: [{translateY: cardSlideAnim}]
                    }
                ]}
            >
                <View style={styles.featureIconContainer}>
                    <Ionicons name={icon} size={24} color="#0077cc"/>
                </View>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDescription}>{description}</Text>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>

            {/* Header com animação ao scroll */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerOpacity, transform: [{
                            translateY: headerOpacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-30, 0]
                            })
                        }]
                    }
                ]}
            >
                <Text style={styles.headerTitle}>
                    <Text style={styles.headerLav}>Lav</Text>Express
                </Text>
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {/* Hero Section com carrossel */}
                <View style={styles.heroSection}>
                    <ImageBackground
                        source={carouselImages[currentIndex]}
                        style={styles.heroBackground}
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                            style={styles.gradient}
                        >
                            <View style={styles.heroContent}>
                                <Animated.View style={{transform: [{scale: titleScale}]}}>
                                    <Animated.Text
                                        style={[
                                            styles.heroTitle,
                                            {opacity: fadeAnim, transform: [{translateY: slideAnim}]}
                                        ]}
                                    >
                                        <Text style={styles.heroLav}>Lav</Text>Express
                                    </Animated.Text>
                                </Animated.View>

                                <Animated.Text
                                    style={[
                                        styles.heroSubtitle,
                                        {opacity: fadeAnim, transform: [{translateY: slideAnim}]}
                                    ]}
                                >
                                    Seu lava-jato na palma da mão
                                </Animated.Text>

                                <Animated.View
                                    style={[
                                        styles.ctaContainer,
                                        {opacity: fadeAnim, transform: [{translateY: slideAnim}]}
                                    ]}
                                >
                                    <TouchableOpacity style={styles.primaryButton} onPress={goToLogin}>
                                        <Text style={styles.primaryButtonText}>Entrar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.secondaryButton} onPress={goToSignup}>
                                        <Text style={styles.secondaryButtonText}>Cadastrar</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>

                    {/* Indicadores do carrossel */}
                    <View style={styles.carouselIndicators}>
                        {carouselImages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.indicator,
                                    currentIndex === index && styles.activeIndicator
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Seção de Recursos */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Por que escolher o LavExpress?</Text>

                    <View style={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                index={index}
                            />
                        ))}
                    </View>
                </View>

                {/* Seção de destaques */}
                <View style={styles.highlightsSection}>
                    <LinearGradient
                        colors={['#0077cc', '#005599']}
                        style={styles.highlightsGradient}
                    >
                        <Text style={styles.highlightsTitle}>Cuidado profissional para seu veículo</Text>

                        <View style={styles.highlightsContainer}>
                            <View style={styles.highlightItem}>
                                <Text style={styles.highlightNumber}>350+</Text>
                                <Text style={styles.highlightText}>Lava-jatos parceiros</Text>
                            </View>

                            <View style={styles.divider}/>

                            <View style={styles.highlightItem}>
                                <Text style={styles.highlightNumber}>15K+</Text>
                                <Text style={styles.highlightText}>Usuários satisfeitos</Text>
                            </View>

                            <View style={styles.divider}/>

                            <View style={styles.highlightItem}>
                                <Text style={styles.highlightNumber}>4.8</Text>
                                <Text style={styles.highlightText}>Nota média</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Seção de como funciona */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Como funciona?</Text>

                    <View style={styles.howItWorksContainer}>
                        <View style={styles.stepItem}>
                            <View style={[styles.stepNumber, {backgroundColor: '#e6f3fb'}]}>
                                <Text style={[styles.stepNumberText, {color: '#0077cc'}]}>1</Text>
                            </View>
                            <Text style={styles.stepTitle}>Encontre</Text>
                            <Text style={styles.stepDescription}>
                                Busque lava-jatos próximos e veja todas as informações e avaliações
                            </Text>
                        </View>

                        <View style={styles.stepItem}>
                            <View style={[styles.stepNumber, {backgroundColor: '#e6f7fb'}]}>
                                <Text style={[styles.stepNumberText, {color: '#00b3cc'}]}>2</Text>
                            </View>
                            <Text style={styles.stepTitle}>Agende</Text>
                            <Text style={styles.stepDescription}>
                                Escolha o serviço, a data e o horário que melhor se adequar a você
                            </Text>
                        </View>

                        <View style={styles.stepItem}>
                            <View style={[styles.stepNumber, {backgroundColor: '#e6fbf4'}]}>
                                <Text style={[styles.stepNumberText, {color: '#00cc9a'}]}>3</Text>
                            </View>
                            <Text style={styles.stepTitle}>Relaxe</Text>
                            <Text style={styles.stepDescription}>
                                Receba alertas e acompanhe o status da lavagem do seu veículo
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Seção de depoimentos */}
                <View style={styles.testimonialsSection}>
                    <Text style={styles.sectionTitle}>O que nossos usuários dizem</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.testimonialsList}
                    >
                        <View style={styles.testimonialCard}>
                            <View style={styles.testimonialHeader}>
                                <View style={styles.userPhotoPlaceholder}>
                                    <Text style={styles.userInitials}>MC</Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>Marcos Costa</Text>
                                    <View style={styles.ratingContainer}>
                                        {Array(5).fill(0).map((_, i) => (
                                            <Ionicons key={i} name="star" size={14} color="#ffb700"/>
                                        ))}
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.testimonialText}>
                                "Aplicativo excelente! Consegui marcar uma lavagem para meu carro em minutos e o
                                serviço superou minhas expectativas. Recomendo totalmente!"
                            </Text>
                        </View>

                        <View style={styles.testimonialCard}>
                            <View style={styles.testimonialHeader}>
                                <View style={[styles.userPhotoPlaceholder, {backgroundColor: '#e6fbf4'}]}>
                                    <Text style={[styles.userInitials, {color: '#00cc9a'}]}>LP</Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>Lucia Pereira</Text>
                                    <View style={styles.ratingContainer}>
                                        {Array(5).fill(0).map((_, i) => (
                                            <Ionicons key={i} name={i < 4 ? "star" : "star-half"} size={14}
                                                      color="#ffb700"/>
                                        ))}
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.testimonialText}>
                                "Prático, intuitivo e com ótimas opções de lava-jatos. O sistema de avaliações ajuda
                                muito a
                                escolher o melhor serviço. Uso semanalmente!"
                            </Text>
                        </View>

                        <View style={styles.testimonialCard}>
                            <View style={styles.testimonialHeader}>
                                <View style={[styles.userPhotoPlaceholder, {backgroundColor: '#f7e6fb'}]}>
                                    <Text style={[styles.userInitials, {color: '#cc00b3'}]}>RS</Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>Rafael Santos</Text>
                                    <View style={styles.ratingContainer}>
                                        {Array(5).fill(0).map((_, i) => (
                                            <Ionicons key={i} name="star" size={14} color="#ffb700"/>
                                        ))}
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.testimonialText}>
                                "O que mais gosto é a facilidade de remarcar quando preciso. Interface super bonita e
                                nunca tive
                                problemas com os agendamentos. Vale cada centavo!"
                            </Text>
                        </View>
                    </ScrollView>
                </View>

                {/* Rodapé */}
                <View style={styles.footer}>
                    <View style={styles.footerTop}>
                        <Text style={styles.footerLogo}>
                            <Text style={styles.footerLav}>Lav</Text>Express
                        </Text>
                        <Text style={styles.footerTagline}>Seu lava-jato na palma da mão</Text>
                    </View>

                    <View style={styles.footerLinks}>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>Sobre nós</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>Privacidade</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>Termos de uso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>Contato</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.socialLinks}>
                        <TouchableOpacity style={styles.socialIcon}>
                            <Ionicons name="logo-facebook" size={20} color="#ffffff"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <Ionicons name="logo-instagram" size={20} color="#ffffff"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <Ionicons name="logo-twitter" size={20} color="#ffffff"/>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerCopyright}>
                        © 2025 LavExpress. Todos os direitos reservados.
                    </Text>
                </View>
            </Animated.ScrollView>

            {/* Botão flutuante de ação */}
            <TouchableOpacity style={styles.fabButton} onPress={goToSignup}>
                <Ionicons name="arrow-forward" size={24} color="#ffffff"/>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    scrollView: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        left: 0,
        right: 0,
        zIndex: 10,
        height: 50,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerLav: {
        color: '#0077cc',
    },
    heroSection: {
        height: height * 0.75,
        position: 'relative',
    },
    heroBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
    },
    heroContent: {
        marginBottom: 60,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: {width: 0, height: 2},
        textShadowRadius: 4,
    },
    heroLav: {
        color: '#4cd2ff',
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 3,
    },
    ctaContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#0077cc',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginHorizontal: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    secondaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    carouselIndicators: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: '#ffffff',
        width: 16,
    },
    sectionContainer: {
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 20,
        textAlign: 'center',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
        alignItems: 'center',
    },
    featureIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e6f3fb',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 6,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 18,
    },
    highlightsSection: {
        marginBottom: 20,
    },
    highlightsGradient: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 0,
    },
    highlightsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    highlightsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    highlightItem: {
        flex: 1,
        alignItems: 'center',
    },
    highlightNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    highlightText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    howItWorksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 6,
    },
    stepItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    stepNumber: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    stepNumberText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 6,
    },
    stepDescription: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 18,
    },
    testimonialsSection: {
        paddingTop: 20,
        paddingBottom: 30,
        backgroundColor: '#f9f9f9',
    },
    testimonialsList: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    testimonialCard: {
        width: width * 0.8 - 40,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    testimonialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    userPhotoPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e6f3fb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userInitials: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0077cc',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    testimonialText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    footer: {
        backgroundColor: '#003b66',
        padding: 30,
    },
    footerTop: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerLogo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 6,
    },
    footerLav: {
        color: '#4cd2ff',
    },
    footerTagline: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    footerLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    footerLink: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginHorizontal: 12,
        marginVertical: 6,
    },
    socialLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    socialIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    footerCopyright: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        textAlign: 'center',
    },
    fabButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0077cc',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
});
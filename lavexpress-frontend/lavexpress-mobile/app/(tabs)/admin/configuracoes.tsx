// app/(tabs)/admin/configuracoes.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Platform,
    Switch,
    Image,
    ViewStyle,
    TextStyle,
    StyleProp
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Interfaces para tipagem
interface ConfigItem {
    id: string;
    title: string;
    description?: string;
    type: 'toggle' | 'select' | 'link' | 'info';
    value?: boolean | string | number;
    icon: string;
    iconType: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons';
    color: string;
    screen?: string;
}

interface ConfigSection {
    id: string;
    title: string;
    items: ConfigItem[];
}

interface User {
    id: string;
    nome: string;
    email: string;
    cargo: string;
    foto?: string;
    telefone: string;
}

interface ConfiguracoesStyles {
    container: ViewStyle;
    statusBarSpacer: ViewStyle;
    header: ViewStyle;
    headerLeft: ViewStyle;
    backButton: ViewStyle;
    headerContent: ViewStyle;
    headerTitle: TextStyle;
    headerSubtitle: TextStyle;
    userSection: ViewStyle;
    userInfo: ViewStyle;
    userPhoto: ViewStyle;
    userPhotoImage: ViewStyle;
    userPhotoPlaceholder: ViewStyle;
    userPhotoPlaceholderText: TextStyle;
    userTextInfo: ViewStyle;
    userName: TextStyle;
    userEmail: TextStyle;
    userRole: TextStyle;
    editProfileButton: ViewStyle;
    editProfileButtonText: TextStyle;
    sectionHeader: ViewStyle;
    sectionTitle: TextStyle;
    sectionContent: ViewStyle;
    configItem: ViewStyle;
    configItemLeft: ViewStyle;
    configItemIcon: ViewStyle;
    configItemTexts: ViewStyle;
    configItemTitle: TextStyle;
    configItemDescription: TextStyle;
    configItemRight: ViewStyle;
    logoutButton: ViewStyle;
    logoutButtonText: TextStyle;
    versionInfo: ViewStyle;
    versionText: TextStyle;
    buildText: TextStyle;
    tabBar: ViewStyle;
    tabItem: ViewStyle;
    tabText: TextStyle;
}

// Dados de usuário do sistema
const userData: User = {
    id: '1',
    nome: 'Amanda Silva',
    email: 'amanda.silva@lavexpress.com',
    cargo: 'Administradora',
    telefone: '(11) 98765-4321'
};

// Configurações disponíveis
const configSections: ConfigSection[] = [
    {
        id: 'app',
        title: 'Configurações do aplicativo',
        items: [
            {
                id: 'theme',
                title: 'Tema escuro',
                description: 'Ativar/desativar o tema escuro do aplicativo',
                type: 'toggle',
                value: true,
                icon: 'moon',
                iconType: 'Ionicons',
                color: '#6c5ce7'
            },
            {
                id: 'notifications',
                title: 'Notificações',
                description: 'Gerenciar notificações do sistema',
                type: 'link',
                icon: 'notifications',
                iconType: 'Ionicons',
                color: '#fdcb6e',
                screen: '/admin/notificacoes'
            },
            {
                id: 'sounds',
                title: 'Sons do aplicativo',
                description: 'Ativar/desativar sons do aplicativo',
                type: 'toggle',
                value: true,
                icon: 'volume-high',
                iconType: 'Ionicons',
                color: '#00cec9'
            }
        ]
    },
    {
        id: 'negocio',
        title: 'Configurações do negócio',
        items: [
            {
                id: 'servicos',
                title: 'Serviços',
                description: 'Gerenciar serviços e preços',
                type: 'link',
                icon: 'car-wash',
                iconType: 'MaterialCommunityIcons',
                color: '#0984e3',
                screen: '/admin/servicos'
            },
            {
                id: 'horarios',
                title: 'Horários de funcionamento',
                description: 'Configurar horários de atendimento',
                type: 'link',
                icon: 'schedule',
                iconType: 'MaterialIcons',
                color: '#e17055',
                screen: '/admin/horarios'
            },
            {
                id: 'pagamentos',
                title: 'Métodos de pagamento',
                description: 'Configurar métodos de pagamento aceitos',
                type: 'link',
                icon: 'payment',
                iconType: 'MaterialIcons',
                color: '#00b894',
                screen: '/admin/pagamentos'
            }
        ]
    },
    {
        id: 'sistema',
        title: 'Sistema',
        items: [
            {
                id: 'equipe',
                title: 'Equipe',
                description: 'Gerenciar usuários do sistema',
                type: 'link',
                icon: 'people',
                iconType: 'Ionicons',
                color: '#74b9ff',
                screen: '/admin/equipe'
            },
            {
                id: 'backup',
                title: 'Backup e restauração',
                description: 'Fazer backup ou restaurar dados',
                type: 'link',
                icon: 'cloud-upload',
                iconType: 'Ionicons',
                color: '#a29bfe',
                screen: '/admin/backup'
            },
            {
                id: 'logs',
                title: 'Logs do sistema',
                description: 'Verificar atividades do sistema',
                type: 'link',
                icon: 'document-text',
                iconType: 'Ionicons',
                color: '#b2bec3',
                screen: '/admin/logs'
            }
        ]
    }
];

export default function ConfiguracoesScreen(): JSX.Element {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    // Voltar para o dashboard
    const handleBackToDashboard = (): void => {
        router.push('/admin/dashboard');
    };

    // Abrir perfil para edição
    const handleEditProfile = (): void => {
        // Navegar para tela de edição de perfil (a ser implementada)
        router.push('/admin/perfil');
    };

    // Alternar valor de configuração
    const handleToggleSetting = (sectionId: string, itemId: string): void => {
        // Em uma aplicação real, isso salvaria a alteração no banco de dados ou storage
        console.log(`Alterando configuração: ${sectionId}.${itemId}`);
    };

    // Navegar para uma tela
    const handleNavigate = (screen: string): void => {
        router.push(screen);
    };

    // Fazer logout
    const handleLogout = (): void => {
        setLoading(true);

        // Simulando o logout - em uma app real, isso faria a autenticação
        setTimeout(() => {
            setLoading(false);
            router.push('/login');
        }, 1000);
    };

    // Renderizar ícone com base no tipo
    const renderIcon = (item: ConfigItem): JSX.Element => {
        const iconProps = {
            name: item.icon as any,
            size: 22,
            color: item.color
        };

        switch (item.iconType) {
            case 'Ionicons':
                return <Ionicons {...iconProps} />;
            case 'MaterialIcons':
                return <MaterialIcons {...iconProps} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons {...iconProps} />;
            default:
                return <Ionicons {...iconProps} />;
        }
    };

    // Renderizar o lado direito de um item de configuração
    const renderConfigItemRight = (item: ConfigItem): JSX.Element => {
        switch (item.type) {
            case 'toggle':
                return (
                    <Switch
                        value={item.value as boolean}
                        onValueChange={() => handleToggleSetting(item.id, item.id)}
                        trackColor={{ false: '#444', true: '#e63946' }}
                        thumbColor={item.value ? '#fff' : '#f4f3f4'}
                    />
                );
            case 'link':
                return <Ionicons name="chevron-forward" size={22} color="#999" />;
            case 'select':
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#999', marginRight: 8 }}>{item.value as string}</Text>
                        <Ionicons name="chevron-forward" size={22} color="#999" />
                    </View>
                );
            default:
                return <></>;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" translucent />

            {/* Espaçador para status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToDashboard}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Ajustes</Text>
                    <Text style={styles.headerSubtitle}>Configurações do sistema</Text>
                </View>
            </View>

            <ScrollView>
                {/* Seção do usuário */}
                <View style={styles.userSection}>
                    <View style={styles.userInfo}>
                        <View style={styles.userPhoto}>
                            {userData.foto ? (
                                <Image source={{ uri: userData.foto }} style={styles.userPhotoImage} />
                            ) : (
                                <View style={styles.userPhotoPlaceholder}>
                                    <Text style={styles.userPhotoPlaceholderText}>
                                        {userData.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.userTextInfo}>
                            <Text style={styles.userName}>{userData.nome}</Text>
                            <Text style={styles.userEmail}>{userData.email}</Text>
                            <Text style={styles.userRole}>{userData.cargo}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.editProfileButton}
                        onPress={handleEditProfile}
                    >
                        <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Seções de configurações */}
                {configSections.map(section => (
                    <View key={section.id} style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>

                        <View style={styles.sectionContent}>
                            {section.items.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.configItem}
                                    onPress={() => item.type === 'link' && item.screen ? handleNavigate(item.screen) : null}
                                >
                                    <View style={styles.configItemLeft}>
                                        <View style={[styles.configItemIcon, { backgroundColor: item.color + '20' }]}>
                                            {renderIcon(item)}
                                        </View>

                                        <View style={styles.configItemTexts}>
                                            <Text style={styles.configItemTitle}>{item.title}</Text>
                                            {item.description && (
                                                <Text style={styles.configItemDescription}>{item.description}</Text>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.configItemRight}>
                                        {renderConfigItemRight(item)}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Botão de logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    disabled={loading}
                >
                    <Text style={styles.logoutButtonText}>
                        {loading ? 'Saindo...' : 'Sair da conta'}
                    </Text>
                </TouchableOpacity>

                {/* Informações de versão */}
                <View style={styles.versionInfo}>
                    <Text style={styles.versionText}>LavExpress v1.0.0</Text>
                    <Text style={styles.buildText}>Build #1045</Text>
                </View>
            </ScrollView>

            {/* Bottom Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/dashboard')}
                >
                    <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="#999" />
                    <Text style={styles.tabText}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/agenda')}
                >
                    <Ionicons name="calendar-outline" size={24} color="#999" />
                    <Text style={styles.tabText}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/financeiro')}
                >
                    <MaterialIcons name="attach-money" size={24} color="#999" />
                    <Text style={styles.tabText}>Financeiro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/clientes')}
                >
                    <Ionicons name="people-outline" size={24} color="#999" />
                    <Text style={styles.tabText}>Clientes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="settings" size={24} color="#e63946" />
                    <Text style={[styles.tabText, { color: "#e63946" }]}>Ajustes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create<ConfiguracoesStyles>({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    statusBarSpacer: {
        height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    headerLeft: {
        width: 40,
        justifyContent: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    headerContent: {
        flex: 1,
        paddingLeft: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 4,
    },
    userSection: {
        backgroundColor: '#2a2a2a',
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 24,
        borderRadius: 12,
        padding: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    userPhoto: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 16,
        overflow: 'hidden',
    },
    userPhotoImage: {
        width: '100%',
        height: '100%',
    },
    userPhotoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e63946',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userPhotoPlaceholderText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userTextInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 12,
        color: '#999',
    },
    editProfileButton: {
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    editProfileButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sectionHeader: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e63946',
        marginHorizontal: 16,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    sectionContent: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    configItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    configItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    configItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    configItemTexts: {
        flex: 1,
    },
    configItemTitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
    },
    configItemDescription: {
        fontSize: 12,
        color: '#999',
    },
    configItemRight: {
        marginLeft: 16,
    },
    logoutButton: {
        backgroundColor: '#f44336',
        marginHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionInfo: {
        alignItems: 'center',
        marginBottom: 100,
    },
    versionText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
    },
    buildText: {
        fontSize: 12,
        color: '#666',
    },
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#222',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
});
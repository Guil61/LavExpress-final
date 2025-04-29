// app/(tabs)/admin/clientes.tsx

import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Platform,
    FlatList,
    TextInput,
    Modal,
    Image,
    ViewStyle,
    TextStyle,
    StyleProp
} from 'react-native';
import {useRouter} from 'expo-router';
import {Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons';

// Interfaces para tipagem
interface Cliente {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    dataUltimaVisita: string;
    gastosTotal: number;
    visitas: number;
    veiculos: Veiculo[];
    observacoes?: string;
    foto?: string;
    status: 'ativo' | 'inativo';
}

interface Veiculo {
    id: string;
    modelo: string;
    placa: string;
    cor: string;
    ano: string;
    tipo: 'carro' | 'moto' | 'caminhonete' | 'outro';
}

interface ClientesStyles {
    container: ViewStyle;
    statusBarSpacer: ViewStyle;
    header: ViewStyle;
    headerLeft: ViewStyle;
    backButton: ViewStyle;
    headerContent: ViewStyle;
    headerTitle: TextStyle;
    headerSubtitle: TextStyle;
    searchContainer: ViewStyle;
    searchBar: ViewStyle;
    searchInput: TextStyle;
    addButton: ViewStyle;
    filterContainer: ViewStyle;
    filterButton: ViewStyle;
    filterButtonActive: ViewStyle;
    filterText: TextStyle;
    filterTextActive: TextStyle;
    sortButton: ViewStyle;
    clientesList: ViewStyle;
    clientesListContent: ViewStyle;
    clienteCard: ViewStyle;
    clienteHeader: ViewStyle;
    clienteInfo: ViewStyle;
    clienteFoto: ViewStyle;
    clienteFotoImage: ViewStyle;
    clienteFotoPlaceholder: ViewStyle;
    clienteFotoPlaceholderText: TextStyle;
    clienteNome: TextStyle;
    clienteDetalhes: ViewStyle;
    clienteTelefone: TextStyle;
    clienteEmail: TextStyle;
    clienteStats: ViewStyle;
    clienteStat: ViewStyle;
    clienteStatValue: TextStyle;
    clienteStatLabel: TextStyle;
    clienteActions: ViewStyle;
    clienteActionButton: ViewStyle;
    clienteActionButtonText: TextStyle;
    clienteVeiculos: ViewStyle;
    clienteVeiculosTitle: TextStyle;
    clienteVeiculosList: ViewStyle;
    clienteVeiculoItem: ViewStyle;
    clienteVeiculoInfo: ViewStyle;
    clienteVeiculoModelo: TextStyle;
    clienteVeiculoPlaca: TextStyle;
    clienteVeiculoCor: ViewStyle;
    clienteVeiculoAno: TextStyle;
    emptyContainer: ViewStyle;
    emptyIcon: TextStyle;
    emptyText: TextStyle;
    emptySubtext: TextStyle;
    modalContainer: ViewStyle;
    modalContent: ViewStyle;
    modalHeader: ViewStyle;
    modalTitle: TextStyle;
    closeButton: ViewStyle;
    modalBody: ViewStyle;
    modalSection: ViewStyle;
    modalRow: ViewStyle;
    modalLabel: TextStyle;
    modalValue: TextStyle;
    modalTabs: ViewStyle;
    modalTab: ViewStyle;
    modalTabActive: ViewStyle;
    modalTabText: TextStyle;
    modalTabTextActive: TextStyle;
    modalTabContent: ViewStyle;
    modalFoto: ViewStyle;
    modalFotoImage: ViewStyle;
    modalFotoPlaceholder: ViewStyle;
    modalFotoPlaceholderText: TextStyle;
    modalButtonsRow: ViewStyle;
    modalButton: ViewStyle;
    modalButtonText: TextStyle;
    modalButtonPrimary: ViewStyle;
    modalButtonSecondary: ViewStyle;
    modalButtonDanger: ViewStyle;
    tabBar: ViewStyle;
    tabItem: ViewStyle;
    tabText: TextStyle;
}

// Dados simulados de clientes
const clientesData: Cliente[] = [
    {
        id: '1',
        nome: 'Carlos Silva',
        telefone: '(11) 98765-4321',
        email: 'carlos.silva@email.com',
        dataUltimaVisita: '2023-11-10',
        gastosTotal: 245.00,
        visitas: 5,
        status: 'ativo',
        veiculos: [
            {
                id: '1',
                modelo: 'Honda Civic',
                placa: 'ABC-1234',
                cor: '#1a73e8',
                ano: '2020',
                tipo: 'carro'
            }
        ]
    },
    {
        id: '2',
        nome: 'Ana Paula Costa',
        telefone: '(11) 97654-3210',
        email: 'ana.paula@email.com',
        dataUltimaVisita: '2023-11-09',
        gastosTotal: 420.00,
        visitas: 3,
        status: 'ativo',
        veiculos: [
            {
                id: '2',
                modelo: 'Toyota Corolla',
                placa: 'DEF-5678',
                cor: '#000000',
                ano: '2019',
                tipo: 'carro'
            }
        ]
    },
    {
        id: '3',
        nome: 'Roberto Mendes',
        telefone: '(11) 96543-2109',
        email: 'roberto.mendes@email.com',
        dataUltimaVisita: '2023-11-05',
        gastosTotal: 150.00,
        visitas: 2,
        status: 'ativo',
        veiculos: [
            {
                id: '3',
                modelo: 'Jeep Compass',
                placa: 'GHI-9012',
                cor: '#686868',
                ano: '2021',
                tipo: 'caminhonete'
            }
        ]
    },
    {
        id: '4',
        nome: 'Juliana Castro',
        telefone: '(11) 95432-1098',
        email: 'juliana.castro@email.com',
        dataUltimaVisita: '2023-10-28',
        gastosTotal: 290.00,
        visitas: 4,
        status: 'ativo',
        veiculos: [
            {
                id: '4',
                modelo: 'Ford Ka',
                placa: 'JKL-3456',
                cor: '#cc0000',
                ano: '2018',
                tipo: 'carro'
            }
        ]
    },
    {
        id: '5',
        nome: 'Pedro Almeida',
        telefone: '(11) 94321-0987',
        email: 'pedro.almeida@email.com',
        dataUltimaVisita: '2023-10-20',
        gastosTotal: 110.00,
        visitas: 1,
        status: 'inativo',
        veiculos: [
            {
                id: '5',
                modelo: 'Nissan Kicks',
                placa: 'MNO-7890',
                cor: '#ffffff',
                ano: '2022',
                tipo: 'caminhonete'
            }
        ]
    },
];

export default function ClientesScreen(): JSX.Element {
    const router = useRouter();
    const [searchText, setSearchText] = useState<string>('');
    const [selectedFilter, setSelectedFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [modalTab, setModalTab] = useState<'info' | 'veiculos' | 'historico'>('info');

    // Filtrar clientes
    const filteredClientes = clientesData.filter(cliente => {
        // Filtro por status
        if (selectedFilter === 'ativos' && cliente.status !== 'ativo') return false;
        if (selectedFilter === 'inativos' && cliente.status !== 'inativo') return false;

        // Filtro por texto de busca
        if (searchText === '') return true;

        const searchLower = searchText.toLowerCase();
        return (
            cliente.nome.toLowerCase().includes(searchLower) ||
            cliente.telefone.includes(searchLower) ||
            cliente.email.toLowerCase().includes(searchLower) ||
            cliente.veiculos.some(veiculo =>
                veiculo.modelo.toLowerCase().includes(searchLower) ||
                veiculo.placa.toLowerCase().includes(searchLower)
            )
        );
    });

    // Voltar para o dashboard
    const handleBackToDashboard = (): void => {
        router.push('/admin/dashboard');
    };

    // Adicionar novo cliente
    const handleAddCliente = (): void => {
        setSelectedCliente(null);
        setModalTab('info');
        setModalVisible(true);
    };

    // Visualizar cliente existente
    const handleViewCliente = (cliente: Cliente): void => {
        setSelectedCliente(cliente);
        setModalTab('info');
        setModalVisible(true);
    };

    // Formatar número para moeda
    const formatCurrency = (valor: number): string => {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    };

    // Formatar data
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'});
    };

    // Renderizar cliente card
    const renderClienteCard = ({item}: { item: Cliente }) => (
        <TouchableOpacity
            style={styles.clienteCard}
            onPress={() => handleViewCliente(item)}
        >
            <View style={styles.clienteHeader}>
                <View style={styles.clienteInfo}>
                    <View style={styles.clienteFoto}>
                        {item.foto ? (
                            <Image source={{uri: item.foto}} style={styles.clienteFotoImage}/>
                        ) : (
                            <View style={styles.clienteFotoPlaceholder}>
                                <Text style={styles.clienteFotoPlaceholderText}>
                                    {item.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View>
                        <Text style={styles.clienteNome}>{item.nome}</Text>
                        <View style={styles.clienteDetalhes}>
                            <Text style={styles.clienteTelefone}>{item.telefone}</Text>
                            <Text style={styles.clienteEmail}>{item.email}</Text>
                        </View>
                    </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999"/>
            </View>

            <View style={styles.clienteStats}>
                <View style={styles.clienteStat}>
                    <Text style={styles.clienteStatValue}>{formatDate(item.dataUltimaVisita)}</Text>
                    <Text style={styles.clienteStatLabel}>Última visita</Text>
                </View>
                <View style={styles.clienteStat}>
                    <Text style={styles.clienteStatValue}>{item.visitas}</Text>
                    <Text style={styles.clienteStatLabel}>Visitas</Text>
                </View>
                <View style={styles.clienteStat}>
                    <Text style={styles.clienteStatValue}>{formatCurrency(item.gastosTotal)}</Text>
                    <Text style={styles.clienteStatLabel}>Total gasto</Text>
                </View>
            </View>

            {item.veiculos.length > 0 && (
                <View style={styles.clienteVeiculos}>
                    <Text style={styles.clienteVeiculosTitle}>Veículos:</Text>
                    <FlatList
                        data={item.veiculos}
                        keyExtractor={(veiculo) => veiculo.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.clienteVeiculosList}
                        renderItem={({item: veiculo}) => (
                            <View style={styles.clienteVeiculoItem}>
                                <View style={[styles.clienteVeiculoCor, {backgroundColor: veiculo.cor}]}/>
                                <View style={styles.clienteVeiculoInfo}>
                                    <Text style={styles.clienteVeiculoModelo}>{veiculo.modelo}</Text>
                                    <Text style={styles.clienteVeiculoPlaca}>{veiculo.placa}</Text>
                                    <Text style={styles.clienteVeiculoAno}>{veiculo.ano}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
            )}

            <View style={styles.clienteActions}>
                <TouchableOpacity style={styles.clienteActionButton}>
                    <Ionicons name="call-outline" size={18} color="#4caf50"/>
                    <Text style={styles.clienteActionButtonText}>Ligar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.clienteActionButton}>
                    <Ionicons name="calendar-outline" size={18} color="#2196f3"/>
                    <Text style={styles.clienteActionButtonText}>Agendar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.clienteActionButton}>
                    <Ionicons name="logo-whatsapp" size={18} color="#25D366"/>
                    <Text style={styles.clienteActionButtonText}>WhatsApp</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" translucent/>

            {/* Espaçador para status bar */}
            <View style={styles.statusBarSpacer}/>

            {/* Cabeçalho */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToDashboard}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Clientes</Text>
                    <Text style={styles.headerSubtitle}>{clientesData.length} clientes cadastrados</Text>
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAddCliente}>
                    <Ionicons name="add" size={24} color="#fff"/>
                </TouchableOpacity>
            </View>

            {/* Barra de pesquisa */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999"/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar clientes..."
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText ? (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#999"/>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            {/* Filtros */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, selectedFilter === 'todos' && styles.filterButtonActive]}
                    onPress={() => setSelectedFilter('todos')}
                >
                    <Text style={[styles.filterText, selectedFilter === 'todos' && styles.filterTextActive]}>
                        Todos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterButton, selectedFilter === 'ativos' && styles.filterButtonActive]}
                    onPress={() => setSelectedFilter('ativos')}
                >
                    <Text style={[styles.filterText, selectedFilter === 'ativos' && styles.filterTextActive]}>
                        Ativos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterButton, selectedFilter === 'inativos' && styles.filterButtonActive]}
                    onPress={() => setSelectedFilter('inativos')}
                >
                    <Text style={[styles.filterText, selectedFilter === 'inativos' && styles.filterTextActive]}>
                        Inativos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sortButton}>
                    <Ionicons name="options-outline" size={20} color="#999"/>
                </TouchableOpacity>
            </View>

            {/* Lista de clientes */}
            {filteredClientes.length > 0 ? (
                <FlatList
                    data={filteredClientes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderClienteCard}
                    style={styles.clientesList}
                    contentContainerStyle={styles.clientesListContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="people" size={60} color="#555" style={styles.emptyIcon}/>
                    <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
                    <Text style={styles.emptySubtext}>
                        {searchText
                            ? "Tente usar outros termos na busca"
                            : selectedFilter !== 'todos'
                                ? "Tente mudar os filtros de seleção"
                                : "Adicione um cliente clicando no botão +"
                        }
                    </Text>
                </View>
            )}

            {/* Modal de detalhes do cliente */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedCliente ? 'Detalhes do Cliente' : 'Novo Cliente'}
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="#fff"/>
                            </TouchableOpacity>
                        </View>

                        {/* Abas do modal */}
                        <View style={styles.modalTabs}>
                            <TouchableOpacity
                                style={[styles.modalTab, modalTab === 'info' && styles.modalTabActive]}
                                onPress={() => setModalTab('info')}
                            >
                                <Text style={[styles.modalTabText, modalTab === 'info' && styles.modalTabTextActive]}>
                                    Informações
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalTab, modalTab === 'veiculos' && styles.modalTabActive]}
                                onPress={() => setModalTab('veiculos')}
                            >
                                <Text
                                    style={[styles.modalTabText, modalTab === 'veiculos' && styles.modalTabTextActive]}>
                                    Veículos
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalTab, modalTab === 'historico' && styles.modalTabActive]}
                                onPress={() => setModalTab('historico')}
                                disabled={!selectedCliente}
                            >
                                <Text style={[
                                    styles.modalTabText,
                                    modalTab === 'historico' && styles.modalTabTextActive,
                                    !selectedCliente && {opacity: 0.5}
                                ]}>
                                    Histórico
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {modalTab === 'info' && (
                                <View style={styles.modalTabContent}>
                                    {/* Foto do cliente */}
                                    <View style={styles.modalFoto}>
                                        {selectedCliente?.foto ? (
                                            <Image source={{uri: selectedCliente.foto}} style={styles.modalFotoImage}/>
                                        ) : (
                                            <TouchableOpacity style={styles.modalFotoPlaceholder}>
                                                <Text style={styles.modalFotoPlaceholderText}>
                                                    {selectedCliente
                                                        ? selectedCliente.nome.split(' ').map(n => n[0]).slice(0, 2).join('')
                                                        : 'Foto'
                                                    }
                                                </Text>
                                                <Ionicons name="camera" size={20} color="#777"/>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {/* Informações do cliente */}
                                    {selectedCliente && (
                                        <>
                                            <View style={styles.modalSection}>
                                                <Text style={styles.modalLabel}>Nome</Text>
                                                <Text style={styles.modalValue}>{selectedCliente.nome}</Text>
                                            </View>

                                            <View style={styles.modalSection}>
                                                <Text style={styles.modalLabel}>Telefone</Text>
                                                <Text style={styles.modalValue}>{selectedCliente.telefone}</Text>
                                            </View>

                                            <View style={styles.modalSection}>
                                                <Text style={styles.modalLabel}>Email</Text>
                                                <Text style={styles.modalValue}>{selectedCliente.email}</Text>
                                            </View>

                                            <View style={styles.modalRow}>
                                                <View style={[styles.modalSection, {flex: 1}]}>
                                                    <Text style={styles.modalLabel}>Última visita</Text>
                                                    <Text
                                                        style={styles.modalValue}>{formatDate(selectedCliente.dataUltimaVisita)}</Text>
                                                </View>

                                                <View style={[styles.modalSection, {flex: 1}]}>
                                                    <Text style={styles.modalLabel}>Total Gasto</Text>
                                                    <Text
                                                        style={styles.modalValue}>{formatCurrency(selectedCliente.gastosTotal)}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.modalRow}>
                                                <View style={[styles.modalSection, {flex: 1}]}>
                                                    <Text style={styles.modalLabel}>Visitas</Text>
                                                    <Text style={styles.modalValue}>{selectedCliente.visitas}</Text>
                                                </View>

                                                <View style={[styles.modalSection, {flex: 1}]}>
                                                    <Text style={styles.modalLabel}>Status</Text>
                                                    <Text style={[
                                                        styles.modalValue,
                                                        {color: selectedCliente.status === 'ativo' ? '#4caf50' : '#f44336'}
                                                    ]}>
                                                        {selectedCliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {selectedCliente.observacoes && (
                                                <View style={styles.modalSection}>
                                                    <Text style={styles.modalLabel}>Observações</Text>
                                                    <Text style={styles.modalValue}>{selectedCliente.observacoes}</Text>
                                                </View>
                                            )}
                                        </>
                                    )}

                                    {/* Botões de ação */}
                                    <View style={styles.modalButtonsRow}>
                                        {selectedCliente && (
                                            <TouchableOpacity
                                                style={[styles.modalButton, styles.modalButtonDanger]}
                                                onPress={() => setModalVisible(false)}
                                            >
                                                <Text style={styles.modalButtonText}>Excluir</Text>
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.modalButtonPrimary]}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text style={styles.modalButtonText}>
                                                {selectedCliente ? 'Editar' : 'Salvar'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {modalTab === 'veiculos' && selectedCliente && (
                                <View style={styles.modalTabContent}>
                                    {/* Lista de veículos */}
                                    {selectedCliente.veiculos.map((veiculo) => (
                                        <View key={veiculo.id} style={styles.clienteVeiculoItem}>
                                            <View style={[styles.clienteVeiculoCor, {backgroundColor: veiculo.cor}]}/>
                                            <View style={styles.clienteVeiculoInfo}>
                                                <Text style={styles.clienteVeiculoModelo}>{veiculo.modelo}</Text>
                                                <Text style={styles.clienteVeiculoPlaca}>{veiculo.placa}</Text>
                                                <Text style={styles.clienteVeiculoAno}>{veiculo.ano}</Text>
                                            </View>
                                        </View>
                                    ))}

                                    {/* Botão para adicionar veículo */}
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.modalButtonPrimary, {marginTop: 16}]}
                                        onPress={() => {
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>Adicionar Veículo</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {modalTab === 'historico' && selectedCliente && (
                                <View style={styles.modalTabContent}>
                                    <Text style={styles.modalValue}>Histórico de serviços estará disponível em
                                        breve.</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Bottom Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/dashboard')}
                >
                    <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="#999"/>
                    <Text style={styles.tabText}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/agenda')}
                >
                    <Ionicons name="calendar-outline" size={24} color="#999"/>
                    <Text style={styles.tabText}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/financeiro')}
                >
                    <MaterialIcons name="attach-money" size={24} color="#999"/>
                    <Text style={styles.tabText}>Financeiro</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="people" size={24} color="#e63946"/>
                    <Text style={[styles.tabText, {color: "#e63946"}]}>Clientes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/configuracoes')}
                >
                    <Ionicons name="settings-outline" size={24} color="#999"/>
                    <Text style={styles.tabText}>Ajustes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create<ClientesStyles>({
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
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    addButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#e63946',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#2a2a2a',
    },
    filterButtonActive: {
        backgroundColor: '#e63946',
    },
    filterText: {
        color: '#999',
        fontSize: 14,
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sortButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    clientesList: {
        flex: 1,
    },
    clientesListContent: {
        padding: 16,
        paddingBottom: 90, // Espaço para a tab bar
    },
    clienteCard: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    clienteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    clienteInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clienteFoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        overflow: 'hidden',
    },
    clienteFotoImage: {
        width: '100%',
        height: '100%',
    },
    clienteFotoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clienteFotoPlaceholderText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clienteNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    clienteDetalhes: {
        flexDirection: 'column',
    },
    clienteTelefone: {
        fontSize: 14,
        color: '#ccc',
    },
    clienteEmail: {
        fontSize: 12,
        color: '#999',
    },
    clienteStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingVertical: 12,
        marginBottom: 12,
    },
    clienteStat: {
        alignItems: 'center',
    },
    clienteStatValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    clienteStatLabel: {
        fontSize: 12,
        color: '#999',
    },
    clienteVeiculos: {
        marginBottom: 12,
    },
    clienteVeiculosTitle: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 8,
    },
    clienteVeiculosList: {
        paddingBottom: 8,
    },
    clienteVeiculoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    clienteVeiculoCor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    clienteVeiculoInfo: {
        flexDirection: 'column',
    },
    clienteVeiculoModelo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    clienteVeiculoPlaca: {
        fontSize: 12,
        color: '#ccc',
    },
    clienteVeiculoAno: {
        fontSize: 12,
        color: '#999',
    },
    clienteActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 12,
    },
    clienteActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    clienteActionButtonText: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 6,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyIcon: {
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ccc',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#2a2a2a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: '70%',
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalTabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#e63946',
    },
    modalTabText: {
        fontSize: 14,
        color: '#999',
    },
    modalTabTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalBody: {
        padding: 16,
    },
    modalTabContent: {
        paddingBottom: 24,
    },
    modalSection: {
        marginBottom: 16,
    },
    modalRow: {
        flexDirection: 'row',
        marginHorizontal: -8,
    },
    modalLabel: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
    },
    modalValue: {
        fontSize: 16,
        color: '#fff',
    },
    modalFoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 24,
        overflow: 'hidden',
    },
    modalFotoImage: {
        width: '100%',
        height: '100%',
    },
    modalFotoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalFotoPlaceholderText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalButtonPrimary: {
        backgroundColor: '#e63946',
    },
    modalButtonSecondary: {
        backgroundColor: '#555',
    },
    modalButtonDanger: {
        backgroundColor: '#f44336',
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
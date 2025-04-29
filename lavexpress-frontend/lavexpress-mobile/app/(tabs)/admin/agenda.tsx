// app/(tabs)/admin/agenda.tsx

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
    ViewStyle,
    TextStyle,
    StyleProp
} from 'react-native';
import {useRouter} from 'expo-router';
import {Ionicons, MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import {format, addDays, startOfWeek, addWeeks} from 'date-fns';
import {ptBR} from 'date-fns/locale';

// Interfaces para tipagem
interface Agendamento {
    id: string;
    cliente: string;
    servico: string;
    veiculo: string;
    horario: string;
    duracao: string;
    preco: string;
    status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
}

interface DayInfo {
    date: Date;
    dayNumber: string;
    dayName: string;
    isToday: boolean;
}

interface StatusColors {
    [key: string]: string;
    confirmado: string;
    pendente: string;
    concluido: string;
    cancelado: string;
}

// Interface para StyleSheet
interface AppStyles {
    container: ViewStyle;
    statusBarSpacer: ViewStyle;
    header: ViewStyle;
    headerLeft: ViewStyle;
    backButton: ViewStyle;
    headerContent: ViewStyle;
    headerTitle: TextStyle;
    headerSubtitle: TextStyle;
    headerButtons: ViewStyle;
    viewModeButton: ViewStyle;
    viewModeButtonActive: ViewStyle;
    searchContainer: ViewStyle;
    searchBar: ViewStyle;
    searchInput: TextStyle;
    addButton: ViewStyle;
    weekSelector: ViewStyle;
    weekArrow: ViewStyle;
    daysContainer: ViewStyle;
    dayItem: ViewStyle;
    selectedDay: ViewStyle;
    today: ViewStyle;
    dayName: TextStyle;
    dayNumber: TextStyle;
    selectedDayText: TextStyle;
    todayDot: ViewStyle;
    agendamentosList: ViewStyle;
    agendamentosListContent: ViewStyle;
    agendamentoCard: ViewStyle;
    agendamentoHeader: ViewStyle;
    agendamentoTime: ViewStyle;
    timeText: TextStyle;
    durationText: TextStyle;
    statusIndicator: ViewStyle;
    statusText: TextStyle;
    agendamentoDetails: ViewStyle;
    clientInfo: ViewStyle;
    clientName: TextStyle;
    serviceName: TextStyle;
    vehicleInfo: ViewStyle;
    vehicleText: TextStyle;
    agendamentoFooter: ViewStyle;
    priceText: TextStyle;
    actions: ViewStyle;
    actionButton: ViewStyle;
    emptyContainer: ViewStyle;
    emptyText: TextStyle;
    calendarView: ViewStyle;
    timeSlot: ViewStyle;
    timeSlotText: TextStyle;
    timeSlotContent: ViewStyle;
    emptySlot: ViewStyle;
    emptySlotText: TextStyle;
    agendamentoSlot: ViewStyle;
    agendamentoConfirmado: ViewStyle;
    agendamentoPendente: ViewStyle;
    slotClientName: TextStyle;
    slotServiceName: TextStyle;
    modalContainer: ViewStyle;
    modalContent: ViewStyle;
    modalHeader: ViewStyle;
    modalTitle: TextStyle;
    closeButton: ViewStyle;
    modalBody: ViewStyle;
    modalSection: ViewStyle;
    modalRow: ViewStyle;
    modalHalfSection: ViewStyle;
    modalSectionTitle: TextStyle;
    modalText: TextStyle;
    modalActions: ViewStyle;
    modalActionButton: ViewStyle;
    modalActionText: TextStyle;
    confirmButton: ViewStyle;
    rescheduleButton: ViewStyle;
    cancelButton: ViewStyle;
    tabBar: ViewStyle;
    tabItem: ViewStyle;
    tabText: TextStyle;
}

// Dados simulados de agendamentos
const agendamentosData: Agendamento[] = [
    {
        id: '1',
        cliente: 'Carlos Silva',
        servico: 'Lavagem Completa',
        veiculo: 'Honda Civic (ABC-1234)',
        horario: '09:00',
        duracao: '45 min',
        preco: 'R$ 40,00',
        status: 'pendente'
    },
    {
        id: '2',
        cliente: 'Ana Paula',
        servico: 'Polimento',
        veiculo: 'Toyota Corolla (DEF-5678)',
        horario: '10:30',
        duracao: '120 min',
        preco: 'R$ 120,00',
        status: 'confirmado'
    },
    {
        id: '3',
        cliente: 'Roberto Mendes',
        servico: 'Lavagem Simples',
        veiculo: 'Jeep Compass (GHI-9012)',
        horario: '13:45',
        duracao: '30 min',
        preco: 'R$ 30,00',
        status: 'confirmado'
    },
    {
        id: '4',
        cliente: 'Juliana Castro',
        servico: 'Higienização',
        veiculo: 'Ford Ka (JKL-3456)',
        horario: '15:30',
        duracao: '120 min',
        preco: 'R$ 75,00',
        status: 'confirmado'
    },
    {
        id: '5',
        cliente: 'Pedro Almeida',
        servico: 'Lavagem Completa',
        veiculo: 'Nissan Kicks (MNO-7890)',
        horario: '17:00',
        duracao: '45 min',
        preco: 'R$ 40,00',
        status: 'pendente'
    },
];

// Função para gerar dias da semana
const getDaysOfWeek = (startDate: Date): DayInfo[] => {
    const start = startOfWeek(startDate, {weekStartsOn: 1}); // Semana começa na segunda-feira
    const days: DayInfo[] = [];

    for (let i = 0; i < 7; i++) {
        const date = addDays(start, i);
        days.push({
            date,
            dayNumber: format(date, 'd'),
            dayName: format(date, 'EEE', {locale: ptBR}),
            isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
        });
    }

    return days;
};

// Horários disponíveis para agendamento
const horarios: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
];

export default function AdminAgendaScreen(): JSX.Element {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
    const daysOfWeek = getDaysOfWeek(currentWeek);
    const [viewMode, setViewMode] = useState<'agenda' | 'calendario'>('agenda');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    // Filtrar agendamentos
    const filteredAgendamentos = agendamentosData.filter(item => {
        if (searchText === '') return true;

        const searchLower = searchText.toLowerCase();
        return (
            item.cliente.toLowerCase().includes(searchLower) ||
            item.servico.toLowerCase().includes(searchLower) ||
            item.veiculo.toLowerCase().includes(searchLower)
        );
    });

    // Navegar para próxima/anterior semana
    const nextWeek = (): void => {
        setCurrentWeek(addWeeks(currentWeek, 1));
    };

    const previousWeek = (): void => {
        setCurrentWeek(addWeeks(currentWeek, -1));
    };

    // Voltar para o dashboard
    const handleBackToDashboard = (): void => {
        router.push('/admin/dashboard');
    };

    // Abrir modal de detalhes
    const openAgendamentoDetails = (agendamento: Agendamento): void => {
        setSelectedAgendamento(agendamento);
        setModalVisible(true);
    };

    // Renderizar indicador de status
    const renderStatusIndicator = (status: string): JSX.Element => {
        const colors: StatusColors = {
            confirmado: '#4caf50',
            pendente: '#ff9800',
            concluido: '#2196f3',
            cancelado: '#f44336'
        };

        return (
            <View style={[styles.statusIndicator, {backgroundColor: colors[status]}]}>
                <Text style={styles.statusText}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
            </View>
        );
    };

    // Verificar horário ocupado
    const isTimeSlotOccupied = (time: string): boolean => {
        return agendamentosData.some(item => item.horario === time);
    };

    // Encontrar agendamento por horário
    const getAgendamentoByTime = (time: string): Agendamento | undefined => {
        return agendamentosData.find(item => item.horario === time);
    };

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
                    <Text style={styles.headerTitle}>Agenda</Text>
                    <Text style={styles.headerSubtitle}>
                        {format(currentWeek, "MMMM yyyy", {locale: ptBR})}
                    </Text>
                </View>

                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={[styles.viewModeButton, viewMode === 'agenda' && styles.viewModeButtonActive]}
                        onPress={() => setViewMode('agenda')}
                    >
                        <Ionicons
                            name="list"
                            size={20}
                            color={viewMode === 'agenda' ? '#fff' : '#999'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.viewModeButton, viewMode === 'calendario' && styles.viewModeButtonActive]}
                        onPress={() => setViewMode('calendario')}
                    >
                        <Ionicons
                            name="calendar"
                            size={20}
                            color={viewMode === 'calendario' ? '#fff' : '#999'}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Barra de pesquisa */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999"/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar agendamentos..."
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

                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#fff"/>
                </TouchableOpacity>
            </View>

            {/* Seletor de dias */}
            <View style={styles.weekSelector}>
                <TouchableOpacity onPress={previousWeek} style={styles.weekArrow}>
                    <Ionicons name="chevron-back" size={24} color="#ccc"/>
                </TouchableOpacity>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysContainer}
                >
                    {daysOfWeek.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayItem,
                                format(selectedDate, 'yyyy-MM-dd') === format(day.date, 'yyyy-MM-dd') && styles.selectedDay,
                                day.isToday && styles.today
                            ]}
                            onPress={() => setSelectedDate(day.date)}
                        >
                            <Text style={[
                                styles.dayName,
                                format(selectedDate, 'yyyy-MM-dd') === format(day.date, 'yyyy-MM-dd') && styles.selectedDayText
                            ]}>
                                {day.dayName}
                            </Text>
                            <Text style={[
                                styles.dayNumber,
                                format(selectedDate, 'yyyy-MM-dd') === format(day.date, 'yyyy-MM-dd') && styles.selectedDayText
                            ]}>
                                {day.dayNumber}
                            </Text>
                            {day.isToday && <View style={styles.todayDot}/>}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity onPress={nextWeek} style={styles.weekArrow}>
                    <Ionicons name="chevron-forward" size={24} color="#ccc"/>
                </TouchableOpacity>
            </View>

            {viewMode === 'agenda' ? (
                /* Visualização em lista */
                <FlatList
                    data={filteredAgendamentos}
                    keyExtractor={(item) => item.id}
                    style={styles.agendamentosList}
                    contentContainerStyle={styles.agendamentosListContent}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.agendamentoCard}
                            onPress={() => openAgendamentoDetails(item)}
                        >
                            <View style={styles.agendamentoHeader}>
                                <View style={styles.agendamentoTime}>
                                    <Ionicons name="time-outline" size={18} color="#e63946"/>
                                    <Text style={styles.timeText}>{item.horario}</Text>
                                    <Text style={styles.durationText}> • {item.duracao}</Text>
                                </View>
                                {renderStatusIndicator(item.status)}
                            </View>

                            <View style={styles.agendamentoDetails}>
                                <View style={styles.clientInfo}>
                                    <Text style={styles.clientName}>{item.cliente}</Text>
                                    <Text style={styles.serviceName}>{item.servico}</Text>
                                </View>

                                <View style={styles.vehicleInfo}>
                                    <Ionicons name="car-outline" size={16} color="#999"/>
                                    <Text style={styles.vehicleText}>{item.veiculo}</Text>
                                </View>
                            </View>

                            <View style={styles.agendamentoFooter}>
                                <Text style={styles.priceText}>{item.preco}</Text>

                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <MaterialIcons name="check-circle" size={24} color="#4caf50"/>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.actionButton}>
                                        <MaterialIcons name="schedule" size={24} color="#ff9800"/>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.actionButton}>
                                        <MaterialIcons name="cancel" size={24} color="#f44336"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="calendar-blank" size={60} color="#555"/>
                            <Text style={styles.emptyText}>
                                {searchText
                                    ? "Nenhum agendamento encontrado para esta busca."
                                    : "Nenhum agendamento para este dia."}
                            </Text>
                        </View>
                    }
                />
            ) : (
                /* Visualização em calendário */
                <ScrollView style={styles.calendarView}>
                    {horarios.map((horario, index) => {
                        const agendamento = getAgendamentoByTime(horario);

                        return (
                            <View key={index} style={styles.timeSlot}>
                                <Text style={styles.timeSlotText}>{horario}</Text>

                                <View style={styles.timeSlotContent}>
                                    {agendamento ? (
                                        <TouchableOpacity
                                            style={[styles.agendamentoSlot,
                                                agendamento.status === 'confirmado' && styles.agendamentoConfirmado,
                                                agendamento.status === 'pendente' && styles.agendamentoPendente,
                                            ]}
                                            onPress={() => openAgendamentoDetails(agendamento)}
                                        >
                                            <Text style={styles.slotClientName}>{agendamento.cliente}</Text>
                                            <Text style={styles.slotServiceName}>{agendamento.servico}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.emptySlot}>
                                            <Text style={styles.emptySlotText}>Disponível</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            )}

            {/* Modal de detalhes do agendamento */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detalhes do Agendamento</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="#fff"/>
                            </TouchableOpacity>
                        </View>

                        {selectedAgendamento && (
                            <ScrollView style={styles.modalBody}>
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Cliente</Text>
                                    <Text style={styles.modalText}>{selectedAgendamento.cliente}</Text>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Serviço</Text>
                                    <Text style={styles.modalText}>{selectedAgendamento.servico}</Text>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Veículo</Text>
                                    <Text style={styles.modalText}>{selectedAgendamento.veiculo}</Text>
                                </View>

                                <View style={styles.modalRow}>
                                    <View style={styles.modalHalfSection}>
                                        <Text style={styles.modalSectionTitle}>Horário</Text>
                                        <Text style={styles.modalText}>{selectedAgendamento.horario}</Text>
                                    </View>

                                    <View style={styles.modalHalfSection}>
                                        <Text style={styles.modalSectionTitle}>Duração</Text>
                                        <Text style={styles.modalText}>{selectedAgendamento.duracao}</Text>
                                    </View>
                                </View>

                                <View style={styles.modalRow}>
                                    <View style={styles.modalHalfSection}>
                                        <Text style={styles.modalSectionTitle}>Preço</Text>
                                        <Text style={styles.modalText}>{selectedAgendamento.preco}</Text>
                                    </View>

                                    <View style={styles.modalHalfSection}>
                                        <Text style={styles.modalSectionTitle}>Status</Text>
                                        {renderStatusIndicator(selectedAgendamento.status)}
                                    </View>
                                </View>

                                <View style={styles.modalActions}>
                                    <TouchableOpacity
                                        style={[styles.modalActionButton, styles.confirmButton]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <MaterialIcons name="check-circle" size={20} color="#fff"/>
                                        <Text style={styles.modalActionText}>Confirmar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalActionButton, styles.rescheduleButton]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <MaterialIcons name="schedule" size={20} color="#fff"/>
                                        <Text style={styles.modalActionText}>Reagendar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalActionButton, styles.cancelButton]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <MaterialIcons name="cancel" size={20} color="#fff"/>
                                        <Text style={styles.modalActionText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
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

                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="calendar" size={24} color="#e63946"/>
                    <Text style={[styles.tabText, {color: "#e63946"}]}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/financeiro')}
                >
                    <MaterialIcons name="attach-money" size={24} color="#999"/>
                    <Text style={styles.tabText}>Financeiro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/clientes')}
                >
                    <Ionicons name="people-outline" size={24} color="#999"/>
                    <Text style={styles.tabText}>Clientes</Text>
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

const styles = StyleSheet.create<AppStyles>({
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
    headerButtons: {
        flexDirection: 'row',
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 4,
    },
    viewModeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    viewModeButtonActive: {
        backgroundColor: '#e63946',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
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
    weekSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    weekArrow: {
        padding: 10,
    },
    daysContainer: {
        flexDirection: 'row',
        paddingHorizontal: 4,
    },
    dayItem: {
        width: 50,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        borderRadius: 12,
        backgroundColor: '#2a2a2a',
    },
    selectedDay: {
        backgroundColor: '#e63946',
    },
    today: {
        borderWidth: 1,
        borderColor: '#e63946',
    },
    dayName: {
        fontSize: 12,
        color: '#ccc',
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    dayNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    selectedDayText: {
        color: '#fff',
    },
    todayDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#e63946',
        marginTop: 4,
    },
    agendamentosList: {
        flex: 1,
    },
    agendamentosListContent: {
        padding: 16,
        paddingBottom: 90,
    },
    agendamentoCard: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    agendamentoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    agendamentoTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    durationText: {
        fontSize: 14,
        color: '#ccc',
    },
    statusIndicator: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    agendamentoDetails: {
        marginBottom: 12,
    },
    clientInfo: {
        marginBottom: 8,
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    serviceName: {
        fontSize: 14,
        color: '#ccc',
    },
    vehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#999',
    },
    agendamentoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e63946',
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 16,
    },
    calendarView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 90,
    },
    timeSlot: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    timeSlotText: {
        width: 60,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ccc',
        marginRight: 16,
    },
    timeSlotContent: {
        flex: 1,
    },
    emptySlot: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#444',
    },
    emptySlotText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
    agendamentoSlot: {
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#e63946',
    },
    agendamentoConfirmado: {
        borderLeftColor: '#4caf50',
    },
    agendamentoPendente: {
        borderLeftColor: '#ff9800',
    },
    slotClientName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    slotServiceName: {
        fontSize: 12,
        color: '#ccc',
        marginTop: 4,
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
        minHeight: '60%',
        maxHeight: '80%',
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
    modalBody: {
        padding: 16,
    },
    modalSection: {
        marginBottom: 16,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    modalHalfSection: {
        width: '48%',
    },
    modalSectionTitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 16,
    },
    modalActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 4,
    },
    modalActionText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    confirmButton: {
        backgroundColor: '#4caf50',
    },
    rescheduleButton: {
        backgroundColor: '#ff9800',
    },
    cancelButton: {
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
})

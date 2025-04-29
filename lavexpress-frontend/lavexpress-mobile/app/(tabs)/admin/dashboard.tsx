// app/(tabs)/admin/dashboard.tsx

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
    Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dados simulados
const agendamentosHoje = [
    { id: 1, cliente: 'Carlos Silva', horario: '09:00', servico: 'Lavagem Completa', status: 'confirmado', veiculo: 'Honda Civic (ABC-1234)' },
    { id: 2, cliente: 'Ana Paula', horario: '10:30', servico: 'Polimento', status: 'pendente', veiculo: 'Toyota Corolla (DEF-5678)' },
    { id: 3, cliente: 'Roberto Mendes', horario: '13:45', servico: 'Lavagem Simples', status: 'confirmado', veiculo: 'Jeep Compass (GHI-9012)' },
    { id: 4, cliente: 'Juliana Castro', horario: '15:30', servico: 'Higienização', status: 'confirmado', veiculo: 'Ford Ka (JKL-3456)' },
    { id: 5, cliente: 'Pedro Almeida', horario: '17:00', servico: 'Lavagem Completa', status: 'pendente', veiculo: 'Nissan Kicks (MNO-7890)' },
];

// Estatísticas do dia
const estatisticas = {
    agendamentosHoje: 5,
    agendamentosConcluidos: 2,
    faturamentoHoje: 'R$ 320,00',
    avaliacaoMedia: 4.8,
};

// Alertas e notificações
const notificacoes = [
    { id: 1, tipo: 'estoque', mensagem: 'Estoque baixo de shampoo automotivo', icone: 'alert-circle' },
    { id: 2, tipo: 'avaliacao', mensagem: 'Nova avaliação de 5 estrelas recebida', icone: 'star' },
];

export default function DashboardScreen() {
    const router = useRouter();
    const [periodoSelecionado, setPeriodoSelecionado] = useState('hoje');

    // Função para renderizar os status dos agendamentos
    const renderizarStatus = (status) => {
        switch(status) {
            case 'confirmado':
                return (
                    <View style={[styles.statusContainer, styles.statusConfirmado]}>
                        <Text style={styles.statusText}>Confirmado</Text>
                    </View>
                );
            case 'pendente':
                return (
                    <View style={[styles.statusContainer, styles.statusPendente]}>
                        <Text style={styles.statusText}>Pendente</Text>
                    </View>
                );
            case 'concluido':
                return (
                    <View style={[styles.statusContainer, styles.statusConcluido]}>
                        <Text style={styles.statusText}>Concluído</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" translucent />

            {/* Espaçamento para a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, Admin</Text>
                    <Text style={styles.date}>
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <MaterialIcons name="notifications" size={24} color="#fff" />
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Cards de estatísticas */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <View style={[styles.statsCard, styles.cardPrimary]}>
                            <View style={styles.statsCardHeader}>
                                <Text style={styles.statsCardTitle}>Agendamentos</Text>
                                <MaterialCommunityIcons name="calendar-check" size={24} color="#e63946" />
                            </View>
                            <Text style={styles.statsCardValue}>{estatisticas.agendamentosHoje}</Text>
                            <Text style={styles.statsCardSubtitle}>Hoje</Text>
                        </View>

                        <View style={[styles.statsCard, styles.cardSecondary]}>
                            <View style={styles.statsCardHeader}>
                                <Text style={styles.statsCardTitle}>Faturamento</Text>
                                <MaterialIcons name="attach-money" size={24} color="#e63946" />
                            </View>
                            <Text style={styles.statsCardValue}>{estatisticas.faturamentoHoje}</Text>
                            <Text style={styles.statsCardSubtitle}>Hoje</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={[styles.statsCard, styles.cardSecondary]}>
                            <View style={styles.statsCardHeader}>
                                <Text style={styles.statsCardTitle}>Concluídos</Text>
                                <MaterialCommunityIcons name="check-circle" size={24} color="#e63946" />
                            </View>
                            <Text style={styles.statsCardValue}>{estatisticas.agendamentosConcluidos}</Text>
                            <Text style={styles.statsCardSubtitle}>Hoje</Text>
                        </View>

                        <View style={[styles.statsCard, styles.cardPrimary]}>
                            <View style={styles.statsCardHeader}>
                                <Text style={styles.statsCardTitle}>Avaliação</Text>
                                <Ionicons name="star" size={24} color="#e63946" />
                            </View>
                            <Text style={styles.statsCardValue}>{estatisticas.avaliacaoMedia}</Text>
                            <Text style={styles.statsCardSubtitle}>Média</Text>
                        </View>
                    </View>
                </View>

                {/* Alertas e notificações */}
                {notificacoes.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Alertas e Notificações</Text>

                        {notificacoes.map(notificacao => (
                            <View key={notificacao.id} style={styles.alertCard}>
                                <View style={styles.alertIconContainer}>
                                    <Ionicons name={notificacao.icone} size={24} color="#e63946" />
                                </View>
                                <Text style={styles.alertText}>{notificacao.mensagem}</Text>
                                <TouchableOpacity style={styles.alertAction}>
                                    <MaterialIcons name="arrow-forward" size={20} color="#999" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Agendamentos do dia */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Agendamentos</Text>

                        <View style={styles.periodSelector}>
                            <TouchableOpacity
                                style={[styles.periodButton, periodoSelecionado === 'hoje' && styles.periodButtonActive]}
                                onPress={() => setPeriodoSelecionado('hoje')}
                            >
                                <Text style={[styles.periodButtonText, periodoSelecionado === 'hoje' && styles.periodButtonTextActive]}>
                                    Hoje
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.periodButton, periodoSelecionado === 'amanha' && styles.periodButtonActive]}
                                onPress={() => setPeriodoSelecionado('amanha')}
                            >
                                <Text style={[styles.periodButtonText, periodoSelecionado === 'amanha' && styles.periodButtonTextActive]}>
                                    Amanhã
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.periodButton, periodoSelecionado === 'semana' && styles.periodButtonActive]}
                                onPress={() => setPeriodoSelecionado('semana')}
                            >
                                <Text style={[styles.periodButtonText, periodoSelecionado === 'semana' && styles.periodButtonTextActive]}>
                                    Semana
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {agendamentosHoje.map(agendamento => (
                        <TouchableOpacity key={agendamento.id} style={styles.agendamentoCard}>
                            <View style={styles.agendamentoHeader}>
                                <View style={styles.horarioContainer}>
                                    <Ionicons name="time-outline" size={18} color="#e63946" />
                                    <Text style={styles.horarioText}>{agendamento.horario}</Text>
                                </View>

                                {renderizarStatus(agendamento.status)}
                            </View>

                            <View style={styles.agendamentoDetails}>
                                <View style={styles.clienteContainer}>
                                    <Text style={styles.clienteNome}>{agendamento.cliente}</Text>
                                    <Text style={styles.servicoNome}>{agendamento.servico}</Text>
                                </View>

                                <View style={styles.veiculoContainer}>
                                    <Ionicons name="car-outline" size={16} color="#999" />
                                    <Text style={styles.veiculoText}>{agendamento.veiculo}</Text>
                                </View>
                            </View>

                            <View style={styles.agendamentoActions}>
                                <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                                    <Text style={styles.actionButtonText}>Iniciar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
                                    <Text style={styles.actionButtonTextSecondary}>Reagendar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionButtonIcon}>
                                    <Ionicons name="ellipsis-vertical" size={20} color="#999" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.viewAllButton}>
                        <Text style={styles.viewAllButtonText}>Ver todos os agendamentos</Text>
                        <Ionicons name="arrow-forward" size={16} color="#e63946" />
                    </TouchableOpacity>
                </View>

                {/* Ações rápidas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ações Rápidas</Text>

                    <View style={styles.quickActionsContainer}>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <View style={styles.quickActionIcon}>
                                <Ionicons name="add-circle" size={24} color="#e63946" />
                            </View>
                            <Text style={styles.quickActionText}>Novo Agendamento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionButton}>
                            <View style={styles.quickActionIcon}>
                                <MaterialIcons name="attach-money" size={24} color="#e63946" />
                            </View>
                            <Text style={styles.quickActionText}>Registrar Pagamento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionButton}>
                            <View style={styles.quickActionIcon}>
                                <FontAwesome5 name="user-plus" size={20} color="#e63946" />
                            </View>
                            <Text style={styles.quickActionText}>Adicionar Cliente</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionButton}>
                            <View style={styles.quickActionIcon}>
                                <MaterialCommunityIcons name="washing-machine" size={24} color="#e63946" />
                            </View>
                            <Text style={styles.quickActionText}>Gerenciar Serviços</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Espaço para a Tab Bar */}
                <View style={styles.tabBarSpacer} />
            </ScrollView>

            {/* Bottom Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem}>
                    <MaterialCommunityIcons name="view-dashboard" size={24} color="#e63946" />
                    <Text style={[styles.tabText, { color: "#e63946" }]}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/admin/agenda')}>
                    <Ionicons name="calendar-outline" size={24} color="#999" />
                    <Text style={styles.tabText}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/admin/financeiro')}>
                    <MaterialIcons name="attach-money" size={24} color="#999" />
                    <Text style={styles.tabText}>Financeiro</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/admin/clientes')}>
                    <Ionicons name="people-outline" size={24} color="#999" />
                    <Text style={styles.tabText}>Clientes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/admin/configuracoes')}>
                    <Ionicons name="settings-outline" size={24} color="#999" />
                    <Text style={styles.tabText}>Ajustes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        paddingVertical: 12,
        backgroundColor: '#2a2a2a',
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    date: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 2,
    },
    profileButton: {
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3a3a3a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#e63946',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    statsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statsCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardPrimary: {
        backgroundColor: '#2a2a2a',
    },
    cardSecondary: {
        backgroundColor: '#333',
    },
    statsCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statsCardTitle: {
        fontSize: 14,
        color: '#ccc',
    },
    statsCardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    statsCardSubtitle: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    section: {
        marginTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 4,
    },
    periodButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    periodButtonActive: {
        backgroundColor: '#e63946',
    },
    periodButtonText: {
        fontSize: 12,
        color: '#ccc',
    },
    periodButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    alertIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    alertText: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
    },
    alertAction: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
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
    horarioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    horarioText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 6,
    },
    statusContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusConfirmado: {
        backgroundColor: '#4caf50',
    },
    statusPendente: {
        backgroundColor: '#ff9800',
    },
    statusConcluido: {
        backgroundColor: '#2196f3',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    agendamentoDetails: {
        marginBottom: 12,
    },
    clienteContainer: {
        marginBottom: 8,
    },
    clienteNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    servicoNome: {
        fontSize: 14,
        color: '#ccc',
    },
    veiculoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    veiculoText: {
        fontSize: 13,
        color: '#999',
        marginLeft: 6,
    },
    agendamentoActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginRight: 8,
    },
    actionButtonPrimary: {
        backgroundColor: '#e63946',
    },
    actionButtonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#555',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    actionButtonTextSecondary: {
        fontSize: 14,
        color: '#ccc',
    },
    actionButtonIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3a3a3a',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    viewAllButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 8,
    },
    viewAllButtonText: {
        fontSize: 14,
        color: '#e63946',
        marginRight: 6,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionButton: {
        width: '48%',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    quickActionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    quickActionText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
    },
    tabBarSpacer: {
        height: 70, // Altura da Tab Bar
    },
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2a2a2a',
        flexDirection: 'row',
        paddingBottom: Platform.OS === 'ios' ? 25 : 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#3a3a3a',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
});
// app/(tabs)/admin/financeiro.tsx

import React, {useState, useEffect} from 'react';
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
import {Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5, AntDesign} from '@expo/vector-icons';
import {format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay} from 'date-fns';
import {ptBR} from 'date-fns/locale';

// Interfaces para tipagem
interface Transacao {
    id: string;
    descricao: string;
    valor: number;
    data: string;
    hora: string;
    tipo: 'receita' | 'despesa';
    categoria: string;
    status: 'confirmado' | 'pendente';
    metodo: 'dinheiro' | 'cartao' | 'pix' | 'transferencia';
    observacao?: string;
}

interface ResumoFinanceiro {
    receitas: number;
    despesas: number;
    saldo: number;
    percentualReceitas: number;
    percentualDespesas: number;
    variacaoReceitas: number;
    variacaoDespesas: number;
}

interface ChartData {
    dia: string;
    receitas: number;
    despesas: number;
}

interface Categoria {
    id: string;
    nome: string;
    tipo: 'receita' | 'despesa';
    cor: string;
}

// Interface para StyleSheet
interface FinanceiroStyles {
    container: ViewStyle;
    statusBarSpacer: ViewStyle;
    header: ViewStyle;
    headerTitle: TextStyle;
    headerDate: TextStyle;
    monthNavigator: ViewStyle;
    monthButton: ViewStyle;
    currentMonth: TextStyle;
    actionButtons: ViewStyle;
    actionButton: ViewStyle;
    actionButtonText: TextStyle;
    searchContainer: ViewStyle;
    searchBar: ViewStyle;
    searchInput: TextStyle;
    filterButton: ViewStyle;
    tabContainer: ViewStyle;
    tabButton: ViewStyle;
    tabButtonActive: ViewStyle;
    tabText: TextStyle;
    tabTextActive: TextStyle;
    resumoContainer: ViewStyle;
    resumoCard: ViewStyle;
    resumoHeader: TextStyle;
    resumoValor: TextStyle;
    resumoPercentual: TextStyle;
    resumoPositivo: TextStyle;
    resumoNegativo: TextStyle;
    resumoNeutro: TextStyle;
    graficoContainer: ViewStyle;
    graficoHeader: ViewStyle;
    graficoTitle: TextStyle;
    graficoLegendaContainer: ViewStyle;
    graficoLegendaItem: ViewStyle;
    graficoLegendaColor: ViewStyle;
    graficoLegendaText: TextStyle;
    transacoesHeader: ViewStyle;
    transacoesTitle: TextStyle;
    transacoesFiltro: ViewStyle;
    transacoesFiltroTexto: TextStyle;
    transacaoItem: ViewStyle;
    transacaoData: ViewStyle;
    transacaoDia: TextStyle;
    transacaoMes: TextStyle;
    transacaoDetalhes: ViewStyle;
    transacaoInfo: ViewStyle;
    transacaoDescricao: TextStyle;
    transacaoCategoria: TextStyle;
    transacaoValor: TextStyle;
    transacaoReceita: TextStyle;
    transacaoDespesa: TextStyle;
    transacaoStatus: ViewStyle;
    transacaoStatusText: TextStyle;
    transacaoMetodo: ViewStyle;
    transacaoMetodoIcon: ViewStyle;
    transacaoMetodoText: TextStyle;
    separador: ViewStyle;
    emptyContainer: ViewStyle;
    emptyText: TextStyle;
    modalContainer: ViewStyle;
    modalContent: ViewStyle;
    modalHeader: ViewStyle;
    modalTitle: TextStyle;
    closeButton: ViewStyle;
    modalBody: ViewStyle;
    modalFormGroup: ViewStyle;
    modalLabel: TextStyle;
    modalInput: ViewStyle;
    modalInputText: TextStyle;
    modalSelect: ViewStyle;
    modalSelectText: TextStyle;
    modalButtonsRow: ViewStyle;
    modalButton: ViewStyle;
    modalButtonText: TextStyle;
    modalButtonPrimary: ViewStyle;
    modalButtonSecondary: ViewStyle;
    tabBar: ViewStyle;
    tabItem: ViewStyle;
    tabItemText: TextStyle;
}

// Dados simulados para o financeiro
const transacoesData: Transacao[] = [
    {
        id: '1',
        descricao: 'Lavagem Completa - Carlos Silva',
        valor: 40.00,
        data: '2023-11-10',
        hora: '09:45',
        tipo: 'receita',
        categoria: 'Lavagem',
        status: 'confirmado',
        metodo: 'dinheiro'
    },
    {
        id: '2',
        descricao: 'Polimento - Ana Paula',
        valor: 120.00,
        data: '2023-11-10',
        hora: '12:30',
        tipo: 'receita',
        categoria: 'Polimento',
        status: 'confirmado',
        metodo: 'cartao'
    },
    {
        id: '3',
        descricao: 'Compra de produtos de limpeza',
        valor: 250.00,
        data: '2023-11-09',
        hora: '14:00',
        tipo: 'despesa',
        categoria: 'Insumos',
        status: 'confirmado',
        metodo: 'cartao'
    },
    {
        id: '4',
        descricao: 'Conta de Água',
        valor: 180.00,
        data: '2023-11-08',
        hora: '10:00',
        tipo: 'despesa',
        categoria: 'Contas',
        status: 'confirmado',
        metodo: 'transferencia'
    },
    {
        id: '5',
        descricao: 'Higienização - Juliana Castro',
        valor: 75.00,
        data: '2023-11-08',
        hora: '16:15',
        tipo: 'receita',
        categoria: 'Higienização',
        status: 'confirmado',
        metodo: 'pix'
    },
    {
        id: '6',
        descricao: 'Lavagem Simples - Roberto Mendes',
        valor: 30.00,
        data: '2023-11-07',
        hora: '14:30',
        tipo: 'receita',
        categoria: 'Lavagem',
        status: 'confirmado',
        metodo: 'dinheiro'
    },
    {
        id: '7',
        descricao: 'Manutenção Equipamentos',
        valor: 150.00,
        data: '2023-11-06',
        hora: '11:00',
        tipo: 'despesa',
        categoria: 'Manutenção',
        status: 'confirmado',
        metodo: 'cartao'
    },
    {
        id: '8',
        descricao: 'Lavagem Completa - Pedro Almeida',
        valor: 40.00,
        data: '2023-11-05',
        hora: '17:15',
        tipo: 'receita',
        categoria: 'Lavagem',
        status: 'pendente',
        metodo: 'dinheiro'
    },
];

// Categorias
const categorias: Categoria[] = [
    {id: '1', nome: 'Lavagem', tipo: 'receita', cor: '#4CAF50'},
    {id: '2', nome: 'Polimento', tipo: 'receita', cor: '#2196F3'},
    {id: '3', nome: 'Higienização', tipo: 'receita', cor: '#9C27B0'},
    {id: '4', nome: 'Insumos', tipo: 'despesa', cor: '#F44336'},
    {id: '5', nome: 'Contas', tipo: 'despesa', cor: '#FF9800'},
    {id: '6', nome: 'Manutenção', tipo: 'despesa', cor: '#795548'},
    {id: '7', nome: 'Salários', tipo: 'despesa', cor: '#607D8B'},
];

export default function FinanceiroScreen(): JSX.Element {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedTab, setSelectedTab] = useState<'todos' | 'receitas' | 'despesas'>('todos');
    const [searchText, setSearchText] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'adicionar' | 'editar'>('adicionar');
    const [selectedTransacao, setSelectedTransacao] = useState<Transacao | null>(null);
    const [resumoFinanceiro, setResumoFinanceiro] = useState<ResumoFinanceiro>({
        receitas: 0,
        despesas: 0,
        saldo: 0,
        percentualReceitas: 0,
        percentualDespesas: 0,
        variacaoReceitas: 0,
        variacaoDespesas: 0
    });
    const [chartData, setChartData] = useState<ChartData[]>([]);

    // Calcular resumo financeiro e dados do gráfico
    useEffect(() => {
        // Cálculo do resumo financeiro do mês
        const startDate = startOfMonth(currentMonth);
        const endDate = endOfMonth(currentMonth);
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        // Filtrar transações do mês atual
        const transacoesMes = transacoesData.filter(
            t => t.data >= formattedStartDate && t.data <= formattedEndDate
        );

        // Calcular receitas e despesas
        const totalReceitas = transacoesMes
            .filter(t => t.tipo === 'receita')
            .reduce((sum, t) => sum + t.valor, 0);

        const totalDespesas = transacoesMes
            .filter(t => t.tipo === 'despesa')
            .reduce((sum, t) => sum + t.valor, 0);

        // Calcular saldo
        const saldo = totalReceitas - totalDespesas;

        // Calcular percentuais (evitar divisão por zero)
        const total = totalReceitas + totalDespesas;
        const percentualReceitas = total > 0 ? (totalReceitas / total) * 100 : 0;
        const percentualDespesas = total > 0 ? (totalDespesas / total) * 100 : 0;

        // Calcular variação em relação ao mês anterior (simulado)
        // Em uma aplicação real, você buscaria os dados do mês anterior
        const variacaoReceitas = 15; // Exemplo: aumento de 15%
        const variacaoDespesas = -8; // Exemplo: redução de 8%

        setResumoFinanceiro({
            receitas: totalReceitas,
            despesas: totalDespesas,
            saldo,
            percentualReceitas,
            percentualDespesas,
            variacaoReceitas,
            variacaoDespesas
        });

        // Gerar dados para o gráfico (simplificado)
        // Em uma aplicação real, você agruparia por dia e somaria os valores
        const dias = eachDayOfInterval({start: startDate, end: endDate});
        const dadosGrafico: ChartData[] = dias.map(dia => {
            const diaFormatado = format(dia, 'yyyy-MM-dd');
            const transacoesDia = transacoesData.filter(t => t.data === diaFormatado);

            const receitasDia = transacoesDia
                .filter(t => t.tipo === 'receita')
                .reduce((sum, t) => sum + t.valor, 0);

            const despesasDia = transacoesDia
                .filter(t => t.tipo === 'despesa')
                .reduce((sum, t) => sum + t.valor, 0);

            return {
                dia: format(dia, 'dd/MM'),
                receitas: receitasDia,
                despesas: despesasDia
            };
        });

        setChartData(dadosGrafico);
    }, [currentMonth]);

    // Filtrar transações conforme a aba selecionada e pesquisa
    const filteredTransacoes = transacoesData.filter(item => {
        // Filtrar por tipo (todos, receitas, despesas)
        if (selectedTab === 'receitas' && item.tipo !== 'receita') return false;
        if (selectedTab === 'despesas' && item.tipo !== 'despesa') return false;

        // Filtrar por texto de pesquisa
        if (searchText === '') return true;

        const searchLower = searchText.toLowerCase();
        return (
            item.descricao.toLowerCase().includes(searchLower) ||
            item.categoria.toLowerCase().includes(searchLower) ||
            item.valor.toString().includes(searchLower)
        );
    });

    // Navegação entre meses
    const previousMonth = (): void => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = (): void => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    // Abrir modal para adicionar transação
    const openAddModal = (): void => {
        setModalMode('adicionar');
        setSelectedTransacao(null);
        setModalVisible(true);
    };

    // Abrir modal para editar transação
    const openEditModal = (transacao: Transacao): void => {
        setModalMode('editar');
        setSelectedTransacao(transacao);
        setModalVisible(true);
    };

    // Renderizar ícone do método de pagamento
    const renderMetodoIcon = (metodo: string): JSX.Element => {
        switch (metodo) {
            case 'dinheiro':
                return <FontAwesome5 name="money-bill-wave" size={14} color="#4CAF50"/>;
            case 'cartao':
                return <FontAwesome5 name="credit-card" size={14} color="#2196F3"/>;
            case 'pix':
                return <FontAwesome5 name="bolt" size={14} color="#9C27B0"/>;
            case 'transferencia':
                return <FontAwesome5 name="exchange-alt" size={14} color="#FF9800"/>;
            default:
                return <FontAwesome5 name="question-circle" size={14} color="#999"/>;
        }
    };

    // Renderizar indicador de status
    const renderStatusIndicator = (status: string): JSX.Element => {
        const colors = {
            confirmado: '#4CAF50',
            pendente: '#FF9800'
        };

        return (
            <View style={[styles.transacaoStatus, {backgroundColor: colors[status as keyof typeof colors]}]}>
                <Text style={styles.transacaoStatusText}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
            </View>
        );
    };

    // Formatar valor para moeda
    const formatCurrency = (valor: number): string => {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" translucent/>

            {/* Espaçador para status bar */}
            <View style={styles.statusBarSpacer}/>

            {/* Cabeçalho */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Financeiro</Text>
                    <Text style={styles.headerDate}>
                        {format(currentMonth, "MMMM 'de' yyyy", {locale: ptBR})}
                    </Text>
                </View>

                <View style={styles.monthNavigator}>
                    <TouchableOpacity onPress={previousMonth} style={styles.monthButton}>
                        <Ionicons name="chevron-back" size={24} color="#ccc"/>
                    </TouchableOpacity>

                    <Text style={styles.currentMonth}>
                        {format(currentMonth, "MMM", {locale: ptBR})}
                    </Text>

                    <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
                        <Ionicons name="chevron-forward" size={24} color="#ccc"/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Botões de ação */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: '#4CAF50'}]}
                    onPress={openAddModal}
                >
                    <AntDesign name="plus" size={16} color="#fff"/>
                    <Text style={styles.actionButtonText}>Receita</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: '#F44336'}]}
                    onPress={openAddModal}
                >
                    <AntDesign name="minus" size={16} color="#fff"/>
                    <Text style={styles.actionButtonText}>Despesa</Text>
                </TouchableOpacity>
            </View>

            {/* Barra de pesquisa */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999"/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar transações..."
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

                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={24} color="#fff"/>
                </TouchableOpacity>
            </View>

            {/* Tabs de filtragem */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'todos' && styles.tabButtonActive]}
                    onPress={() => setSelectedTab('todos')}
                >
                    <Text style={[styles.tabText, selectedTab === 'todos' && styles.tabTextActive]}>
                        Todos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'receitas' && styles.tabButtonActive]}
                    onPress={() => setSelectedTab('receitas')}
                >
                    <Text style={[styles.tabText, selectedTab === 'receitas' && styles.tabTextActive]}>
                        Receitas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'despesas' && styles.tabButtonActive]}
                    onPress={() => setSelectedTab('despesas')}
                >
                    <Text style={[styles.tabText, selectedTab === 'despesas' && styles.tabTextActive]}>
                        Despesas
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Resumo financeiro */}
                <View style={styles.resumoContainer}>
                    <View style={styles.resumoCard}>
                        <Text style={styles.resumoHeader}>Receitas</Text>
                        <Text style={styles.resumoValor}>{formatCurrency(resumoFinanceiro.receitas)}</Text>
                        <Text style={[
                            styles.resumoPercentual,
                            resumoFinanceiro.variacaoReceitas > 0 ? styles.resumoPositivo :
                                resumoFinanceiro.variacaoReceitas < 0 ? styles.resumoNegativo :
                                    styles.resumoNeutro
                        ]}>
                            {resumoFinanceiro.variacaoReceitas > 0 ? '+' : ''}
                            {resumoFinanceiro.variacaoReceitas}% do mês anterior
                        </Text>
                    </View>

                    <View style={styles.resumoCard}>
                        <Text style={styles.resumoHeader}>Despesas</Text>
                        <Text style={styles.resumoValor}>{formatCurrency(resumoFinanceiro.despesas)}</Text>
                        <Text style={[
                            styles.resumoPercentual,
                            resumoFinanceiro.variacaoDespesas < 0 ? styles.resumoPositivo :
                                resumoFinanceiro.variacaoDespesas > 0 ? styles.resumoNegativo :
                                    styles.resumoNeutro
                        ]}>
                            {resumoFinanceiro.variacaoDespesas > 0 ? '+' : ''}
                            {resumoFinanceiro.variacaoDespesas}% do mês anterior
                        </Text>
                    </View>

                    <View style={styles.resumoCard}>
                        <Text style={styles.resumoHeader}>Saldo</Text>
                        <Text style={[
                            styles.resumoValor,
                            resumoFinanceiro.saldo > 0 ? styles.resumoPositivo :
                                resumoFinanceiro.saldo < 0 ? styles.resumoNegativo :
                                    styles.resumoNeutro
                        ]}>
                            {formatCurrency(resumoFinanceiro.saldo)}
                        </Text>
                        <Text style={[
                            styles.resumoPercentual,
                            resumoFinanceiro.saldo > 0 ? styles.resumoPositivo :
                                resumoFinanceiro.saldo < 0 ? styles.resumoNegativo :
                                    styles.resumoNeutro
                        ]}>
                            {resumoFinanceiro.percentualReceitas.toFixed(1)}% receitas /
                            {resumoFinanceiro.percentualDespesas.toFixed(1)}% despesas
                        </Text>
                    </View>
                </View>

                {/* Área para o gráfico (representação simplificada) */}
                <View style={styles.graficoContainer}>
                    <View style={styles.graficoHeader}>
                        <Text style={styles.graficoTitle}>Fluxo de Caixa</Text>
                        <View style={styles.graficoLegendaContainer}>
                            <View style={styles.graficoLegendaItem}>
                                <View style={[styles.graficoLegendaColor, {backgroundColor: '#4CAF50'}]}/>
                                <Text style={styles.graficoLegendaText}>Receitas</Text>
                            </View>
                            <View style={styles.graficoLegendaItem}>
                                <View style={[styles.graficoLegendaColor, {backgroundColor: '#F44336'}]}/>
                                <Text style={styles.graficoLegendaText}>Despesas</Text>
                            </View>
                        </View>
                    </View>

                    {/* Aqui entraria o componente de gráfico */}
                    {/* Em um aplicativo real, usaríamos uma biblioteca como react-native-chart-kit */}
                    <View style={{
                        height: 200,
                        backgroundColor: '#2a2a2a',
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 12
                    }}>
                        <Text style={{color: '#999'}}>Gráfico de Fluxo de Caixa</Text>
                        <Text style={{color: '#666', fontSize: 12, marginTop: 4}}>
                            Em um app real, usaríamos um componente de gráfico
                        </Text>
                    </View>
                </View>

                {/* Lista de transações */}
                <View style={styles.transacoesHeader}>
                    <Text style={styles.transacoesTitle}>Transações</Text>
                    <TouchableOpacity style={styles.transacoesFiltro}>
                        <Text style={styles.transacoesFiltroTexto}>Filtrar</Text>
                        <Ionicons name="filter" size={16} color="#e63946"/>
                    </TouchableOpacity>
                </View>

                {filteredTransacoes.length > 0 ? (
                    filteredTransacoes.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.transacaoItem}
                            onPress={() => openEditModal(item)}
                        >
                            <View style={styles.transacaoData}>
                                <Text style={styles.transacaoDia}>
                                    {format(new Date(item.data), 'dd')}
                                </Text>
                                <Text style={styles.transacaoMes}>
                                    {format(new Date(item.data), 'MMM', {locale: ptBR})}
                                </Text>
                            </View>

                            <View style={styles.transacaoDetalhes}>
                                <View style={styles.transacaoInfo}>
                                    <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
                                    <Text style={styles.transacaoCategoria}>{item.categoria}</Text>
                                </View>

                                <View>
                                    <Text style={[
                                        styles.transacaoValor,
                                        item.tipo === 'receita' ? styles.transacaoReceita : styles.transacaoDespesa
                                    ]}>
                                        {item.tipo === 'receita' ? '+ ' : '- '}
                                        {formatCurrency(item.valor)}
                                    </Text>
                                    <View style={styles.transacaoMetodo}>
                                        <View style={styles.transacaoMetodoIcon}>
                                            {renderMetodoIcon(item.metodo)}
                                        </View>
                                        <Text style={styles.transacaoMetodoText}>
                                            {item.metodo.charAt(0).toUpperCase() + item.metodo.slice(1)}
                                        </Text>
                                        {renderStatusIndicator(item.status)}
                                    </View>
                                </View>
                            </View>

                            {index < filteredTransacoes.length - 1 && (
                                <View style={styles.separador}/>
                            )}
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="cash-remove" size={60} color="#555"/>
                        <Text style={styles.emptyText}>
                            {searchText
                                ? "Nenhuma transação encontrada para esta busca."
                                : "Nenhuma transação para este período."}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal para adicionar/editar transação */}
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
                                {modalMode === 'adicionar' ? 'Nova Transação' : 'Editar Transação'}
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="#fff"/>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {/* Aqui teria os campos do formulário */}
                            <View style={styles.modalFormGroup}>
                                <Text style={styles.modalLabel}>Descrição</Text>
                                <View style={styles.modalInput}>
                                    <TextInput
                                        style={styles.modalInputText}
                                        placeholder="Descrição da transação"
                                        placeholderTextColor="#999"
                                        value={selectedTransacao?.descricao || ''}
                                    />
                                </View>
                            </View>

                            <View style={styles.modalFormGroup}>
                                <Text style={styles.modalLabel}>Valor</Text>
                                <View style={styles.modalInput}>
                                    <TextInput
                                        style={styles.modalInputText}
                                        placeholder="0,00"
                                        placeholderTextColor="#999"
                                        keyboardType="decimal-pad"
                                        value={selectedTransacao ? selectedTransacao.valor.toString() : ''}
                                    />
                                </View>
                            </View>

                            <View style={styles.modalFormGroup}>
                                <Text style={styles.modalLabel}>Tipo</Text>
                                <View style={styles.modalSelect}>
                                    <Text style={styles.modalSelectText}>
                                        {selectedTransacao?.categoria || 'Selecione uma categoria'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#999"/>
                                </View>
                            </View>

                            <View style={styles.modalFormGroup}>
                                <Text style={styles.modalLabel}>Data</Text>
                                <View style={styles.modalSelect}>
                                    <Text style={styles.modalSelectText}>
                                        {selectedTransacao ? format(new Date(selectedTransacao.data), 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={20} color="#999"/>
                                </View>
                            </View>

                            <View style={styles.modalFormGroup}>
                                <Text style={styles.modalLabel}>Método de Pagamento</Text>
                                <View style={styles.modalSelect}>
                                    <Text style={styles.modalSelectText}>
                                        {selectedTransacao?.metodo === 'dinheiro' ? 'Dinheiro' :
                                            selectedTransacao?.metodo === 'cartao' ? 'Cartão' :
                                                selectedTransacao?.metodo === 'pix' ? 'PIX' :
                                                    selectedTransacao?.metodo === 'transferencia' ? 'Transferência' : 'Selecione o método'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#999"/>
                                </View>
                            </View>

                            <View style={styles.modalFormGroup}>
                                <Text style={styles.modalLabel}>Status</Text>
                                <View style={styles.modalSelect}>
                                    <Text style={styles.modalSelectText}>
                                        {selectedTransacao?.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#999"/>
                                </View>
                            </View>

                            <View style={styles.modalFormGroup}>
                                <Text style={styles.modalLabel}>Observação (opcional)</Text>
                                <View style={styles.modalInput}>
                                    <TextInput
                                        style={styles.modalInputText}
                                        placeholder="Adicione uma observação..."
                                        placeholderTextColor="#999"
                                        multiline
                                        value={selectedTransacao?.observacao || ''}
                                    />
                                </View>
                            </View>

                            <View style={styles.modalButtonsRow}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonSecondary]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonPrimary]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>
                                        {modalMode === 'adicionar' ? 'Adicionar' : 'Salvar'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
                    <Text style={styles.tabItemText}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/agenda')}
                >
                    <Ionicons name="calendar-outline" size={24} color="#999"/>
                    <Text style={styles.tabItemText}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem}>
                    <MaterialIcons name="attach-money" size={24} color="#e63946"/>
                    <Text style={[styles.tabItemText, {color: "#e63946"}]}>Financeiro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/clientes')}
                >
                    <Ionicons name="people-outline" size={24} color="#999"/>
                    <Text style={styles.tabItemText}>Clientes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => router.push('/admin/configuracoes')}
                >
                    <Ionicons name="settings-outline" size={24} color="#999"/>
                    <Text style={styles.tabItemText}>Ajustes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Estilos
const styles = StyleSheet.create<FinanceiroStyles>({
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerDate: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 4,
    },
    monthNavigator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 4,
    },
    monthButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    currentMonth: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
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
    filterButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#e63946',
    },
    tabText: {
        color: '#999',
        fontSize: 14,
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    resumoContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    resumoCard: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 4,
    },
    resumoHeader: {
        color: '#999',
        fontSize: 12,
        marginBottom: 8,
    },
    resumoValor: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    resumoPercentual: {
        fontSize: 10,
    },
    resumoPositivo: {
        color: '#4CAF50',
    },
    resumoNegativo: {
        color: '#F44336',
    },
    resumoNeutro: {
        color: '#999',
    },
    graficoContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    graficoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    graficoTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    graficoLegendaContainer: {
        flexDirection: 'row',
    },
    graficoLegendaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    graficoLegendaColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    graficoLegendaText: {
        color: '#999',
        fontSize: 12,
    },
    transacoesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    transacoesTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    transacoesFiltro: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transacoesFiltroTexto: {
        color: '#e63946',
        fontSize: 14,
        marginRight: 4,
    },
    transacaoItem: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#2a2a2a',
        marginBottom: 1,
    },
    transacaoData: {
        width: 40,
        alignItems: 'center',
        marginRight: 16,
    },
    transacaoDia: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    transacaoMes: {
        color: '#999',
        fontSize: 12,
    },
    transacaoDetalhes: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    transacaoInfo: {
        flex: 1,
        marginRight: 12,
    },
    transacaoDescricao: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 4,
    },
    transacaoCategoria: {
        color: '#999',
        fontSize: 12,
    },
    transacaoValor: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 4,
    },
    transacaoReceita: {
        color: '#4CAF50',
    },
    transacaoDespesa: {
        color: '#F44336',
    },
    transacaoStatus: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 4,
    },
    transacaoStatusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    transacaoMetodo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    transacaoMetodoIcon: {
        marginRight: 4,
    },
    transacaoMetodoText: {
        color: '#999',
        fontSize: 12,
    },
    separador: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        right: 16,
        height: 1,
        backgroundColor: '#333',
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
    modalBody: {
        padding: 16,
    },
    modalFormGroup: {
        marginBottom: 16,
    },
    modalLabel: {
        color: '#999',
        fontSize: 14,
        marginBottom: 8,
    },
    modalInput: {
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    modalInputText: {
        color: '#fff',
        fontSize: 16,
    },
    modalSelect: {
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalSelectText: {
        color: '#fff',
        fontSize: 16,
    },
    modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 16,
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
    tabItemText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
});

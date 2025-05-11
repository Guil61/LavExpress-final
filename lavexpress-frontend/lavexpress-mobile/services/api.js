import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos para as entidades principais
export interface Usuario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    photoPath?: string;
}

export interface Veiculo {
    id: number;
    marca: string;
    modelo: string;
    ano: number;
    cor: string;
    placa: string;
    tipo: string;
    imagemUrl?: string;
    ativo: boolean;
    proprietarioId: number;
    proprietarioNome?: string;
}

export interface LavaJato {
    id: number;
    nome: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep?: string;
    telefone: string;
    email?: string;
    horarioAbertura?: string;
    horarioFechamento?: string;
    descricao?: string;
    imagemUrl?: string;
    latitude?: number;
    longitude?: number;
    avaliacaoMedia: number;
    ativo: boolean;
}

export interface Servico {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    duracaoMinutos: number;
    categoria: string;
    ativo: boolean;
    lavaJatoId: number;
    lavaJatoNome?: string;
}

export interface Agendamento {
    id: number;
    dataHora: string;
    observacoes?: string;
    status: string;
    valorTotal: number;
    usuarioId: number;
    usuarioNome?: string;
    veiculoId: number;
    veiculoDescricao?: string;
    lavaJatoId: number;
    lavaJatoNome?: string;
    servicoId: number;
    servicoNome?: string;
}

export interface CadastroRequest {
    nome: string;
    email: string;
    senha: string;
    confirmacaoSenha: string;
    cpf: string;
    telefone: string;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

// Base URL do backend
const API_URL = 'http://10.0.2.2:8080/api';  // Use 10.0.2.2 para o emulador Android acessar o localhost
// Para dispositivos físicos, use o IP da máquina onde o backend está rodando
// const API_URL = 'http://192.168.1.XX:8080/api';

// Criação da instância do axios
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@LavExpress:token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Tratamento de erros (ex: redirecionamento para login se token expirado)
        if (error.response && error.response.status === 401) {
            // Lógica para redirecionamento ao login ou refresh token
            AsyncStorage.removeItem('@LavExpress:token');
            // Aqui você pode adicionar uma navegação para a tela de login se necessário
        }
        return Promise.reject(error);
    }
);

// Serviços de autenticação
export const authService = {
    login: async (email: string, senha: string): Promise<{ token: string; user: Usuario }> => {
    try {
        const response = await api.post('/login', { email, senha });
        return response.data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
},

cadastrar: async (dadosCadastro: CadastroRequest): Promise<Usuario> => {
    try {
        const response = await api.post('/auth/cadastro', dadosCadastro);
        return response.data;
    } catch (error) {
        console.error('Erro no cadastro:', error);
        throw error;
    }
},

logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('@LavExpress:token');
    await AsyncStorage.removeItem('@LavExpress:user');
}
};

// Serviços de usuário
export const usuarioService = {
    getProfile: async (): Promise<Usuario> => {
    try {
        const userId = await AsyncStorage.getItem('@LavExpress:userId');
        const response = await api.get(`/usuarios/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        throw error;
    }
},

updateProfile: async (userData: Partial<Usuario>): Promise<Usuario> => {
    try {
        const userId = await AsyncStorage.getItem('@LavExpress:userId');
        const response = await api.put(`/usuarios/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw error;
    }
},

uploadProfilePicture: async (imageFile: any): Promise<string> => {
    try {
        const userId = await AsyncStorage.getItem('@LavExpress:userId');

        const formData = new FormData();
        formData.append('file', {
            uri: imageFile.uri,
            type: imageFile.type,
            name: imageFile.fileName || 'profile.jpg'
        });

        const response = await api.post(`/usuarios/${userId}/imagem`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
    }
}
};

// Serviços de veículos
export const veiculoService = {
    listarVeiculos: async (): Promise<Veiculo[]> => {
    try {
        const userId = await AsyncStorage.getItem('@LavExpress:userId');
        const response = await api.get(`/veiculos/usuario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar veículos:', error);
        throw error;
    }
},

getVeiculo: async (veiculoId: number): Promise<Veiculo> => {
    try {
        const response = await api.get(`/veiculos/${veiculoId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar veículo:', error);
        throw error;
    }
},

criarVeiculo: async (veiculoData: Partial<Veiculo>): Promise<Veiculo> => {
    try {
        const userId = await AsyncStorage.getItem('@LavExpress:userId');
        const veiculoCompleto = {
            ...veiculoData,
            proprietarioId: Number(userId)
        };

        const response = await api.post('/veiculos', veiculoCompleto);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar veículo:', error);
        throw error;
    }
},

atualizarVeiculo: async (veiculoId: number, veiculoData: Partial<Veiculo>): Promise<Veiculo> => {
    try {
        const response = await api.put(`/veiculos/${veiculoId}`, veiculoData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar veículo:', error);
        throw error;
    }
},

excluirVeiculo: async (veiculoId: number): Promise<string> => {
    try {
        const response = await api.delete(`/veiculos/${veiculoId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        throw error;
    }
},

uploadVeiculoImage: async (veiculoId: number, imageFile: any): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: imageFile.uri,
            type: imageFile.type,
            name: imageFile.fileName || 'veiculo.jpg'
        });

        const response = await api.post(`/veiculos/${veiculoId}/imagem`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem do veículo:', error);
        throw error;
    }
}
};

// Serviços de lava-jatos
export const lavaJatoService = {
    listarLavaJatos: async (page: number = 0, size: number = 10): Promise<{lavaJatos: LavaJato[], totalItems: number, totalPages: number, currentPage: number}> => {
    try {
        const response = await api.get(`/lavajatos?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar lava-jatos:', error);
        throw error;
    }
},

buscarLavaJato: async (id: number): Promise<LavaJato> => {
    try {
        const response = await api.get(`/lavajatos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar lava-jato:', error);
        throw error;
    }
},

buscarPorCidade: async (cidade: string): Promise<LavaJato[]> => {
    try {
        const response = await api.get(`/lavajatos/cidade/${cidade}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar lava-jatos por cidade:', error);
        throw error;
    }
},

buscarProximos: async (latitude: number, longitude: number, raioKm: number = 10): Promise<LavaJato[]> => {
    try {
        const response = await api.get(`/lavajatos/proximos?latitude=${latitude}&longitude=${longitude}&raioKm=${raioKm}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar lava-jatos próximos:', error);
        throw error;
    }
},

listarServicos: async (lavaJatoId: number): Promise<Servico[]> => {
    try {
        const response = await api.get(`/lavajatos/${lavaJatoId}/servicos`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar serviços do lava-jato:', error);
        throw error;
    }
}
};

// Serviços de agendamentos
export const agendamentoService = {
    listarAgendamentos: async (): Promise<Agendamento[]> => {
    try {
        const userId = await AsyncStorage.getItem('@LavExpress:userId');
        const response = await api.get(`/agendamentos/usuario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        throw error;
    }
},

getAgendamento: async (agendamentoId: number): Promise<Agendamento> => {
    try {
        const response = await api.get(`/agendamentos/${agendamentoId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamento:', error);
        throw error;
    }
},

criarAgendamento: async (agendamentoData: Partial<Agendamento>): Promise<Agendamento> => {
    try {
        const userId = await AsyncStorage.getItem('@LavExpress:userId');
        const agendamentoCompleto = {
            ...agendamentoData,
            usuarioId: Number(userId)
        };

        const response = await api.post('/agendamentos', agendamentoCompleto);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        throw error;
    }
},

cancelarAgendamento: async (agendamentoId: number): Promise<Agendamento> => {
    try {
        const response = await api.patch(`/agendamentos/${agendamentoId}/status`, {
            status: 'CANCELADO'
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        throw error;
    }
},

verificarDisponibilidade: async (lavaJatoId: number, dataHora: string): Promise<{disponivel: boolean}> => {
    try {
        const response = await api.get(`/agendamentos/verificar-disponibilidade?lavaJatoId=${lavaJatoId}&dataHora=${dataHora}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        throw error;
    }
}
};

export default api;
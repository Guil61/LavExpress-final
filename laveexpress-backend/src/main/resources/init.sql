-- Arquivo: laveexpress-backend/src/main/resources/init.sql
-- Script de inicialização do banco de dados LavExpress
-- Este script cria todas as tabelas necessárias para o sistema

-- ==========================================
-- CRIAÇÃO DAS TABELAS
-- ==========================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuario (
                                       id BIGSERIAL PRIMARY KEY,
                                       nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(11),
    telefone VARCHAR(20),
    photo_path TEXT,
    tipo_usuario VARCHAR(50) NOT NULL
    CHECK (tipo_usuario IN ('CLIENTE', 'EMPRESAIRO')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Tabela de Lava-Jatos
CREATE TABLE IF NOT EXISTS lava_jato (
                                         id BIGSERIAL PRIMARY KEY,
                                         nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(500),
    telefone VARCHAR(20),
    email VARCHAR(255),
    cnpj VARCHAR(14),
    lat_long VARCHAR(50),  -- Formato: "latitude,longitude"
    photo_path TEXT,
    usuario_id BIGINT REFERENCES usuario(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Tabela de Veículos
CREATE TABLE IF NOT EXISTS veiculo (
                                       id BIGSERIAL PRIMARY KEY,
                                       placa VARCHAR(10),
    modelo VARCHAR(100),
    ano VARCHAR(4),
    marca VARCHAR(50),
    cor VARCHAR(30),
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Tabela de Serviços
CREATE TABLE IF NOT EXISTS servico (
                                       id BIGSERIAL PRIMARY KEY,
                                       descricao VARCHAR(255),
    valor DECIMAL(10,2),
    lava_jato_id BIGINT NOT NULL REFERENCES lava_jato(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS avaliacao (
                                         id BIGSERIAL PRIMARY KEY,
                                         usuario_id BIGINT REFERENCES usuario(id) ON DELETE CASCADE,
    lavajato_id BIGINT REFERENCES lava_jato(id) ON DELETE CASCADE,
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, lavajato_id)  -- Um usuário só pode avaliar cada lava-jato uma vez
    );

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamento (
                                           id BIGSERIAL PRIMARY KEY,
                                           status_agendamento VARCHAR(50) NOT NULL
    CHECK (status_agendamento IN ('AGENDADO', 'SERVICO_EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO')),
    data_horario TIMESTAMP NOT NULL,
    servico_id BIGINT NOT NULL REFERENCES servico(id) ON DELETE RESTRICT,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    veiculo_id BIGINT NOT NULL REFERENCES veiculo(id) ON DELETE CASCADE,
    lava_jato_id BIGINT NOT NULL REFERENCES lava_jato(id) ON DELETE CASCADE,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- ==========================================
-- ÍNDICES PARA PERFORMANCE
-- ==========================================

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_cpf ON usuario(cpf);
CREATE INDEX IF NOT EXISTS idx_veiculo_usuario ON veiculo(usuario_id);
CREATE INDEX IF NOT EXISTS idx_veiculo_placa ON veiculo(placa);
CREATE INDEX IF NOT EXISTS idx_servico_lavajato ON servico(lava_jato_id);
CREATE INDEX IF NOT EXISTS idx_agendamento_usuario ON agendamento(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamento_lavajato ON agendamento(lava_jato_id);
CREATE INDEX IF NOT EXISTS idx_agendamento_data ON agendamento(data_horario);
CREATE INDEX IF NOT EXISTS idx_agendamento_status ON agendamento(status_agendamento);
CREATE INDEX IF NOT EXISTS idx_avaliacao_lavajato ON avaliacao(lavajato_id);
CREATE INDEX IF NOT EXISTS idx_lavajato_latlong ON lava_jato(lat_long);

-- ==========================================
-- DADOS INICIAIS DE TESTE (OPCIONAL)
-- ==========================================

-- Inserir usuário administrador padrão
INSERT INTO usuario (nome, email, senha, cpf, telefone, tipo_usuario)
VALUES (
           'Administrador',
           'admin@lavexpress.com',
           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- senha: password
           '00000000000',
           '61999999999',
           'EMPRESAIRO'
       ) ON CONFLICT (email) DO NOTHING;

-- Comentários sobre o script:
-- 1. Todas as tabelas usam IF NOT EXISTS para evitar erros se já existirem
-- 2. BIGSERIAL cria IDs auto-incrementais
-- 3. Constraints CHECK garantem integridade dos dados
-- 4. Índices melhoram performance das consultas
-- 5. ON DELETE CASCADE/RESTRICT define comportamento ao deletar registros relacionados
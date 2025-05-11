package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.dtos.AgendamentoDto;
import com.lavexpress.laveexpress.entities.Agendamento;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Servico;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.entities.Veiculo;
import com.lavexpress.laveexpress.mappers.AgendamentoMapper;
import com.lavexpress.laveexpress.repositories.AgendamentoRepository;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import com.lavexpress.laveexpress.repositories.ServicoRepository;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import com.lavexpress.laveexpress.repositories.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Serviço para operações relacionadas a agendamentos
 */
@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private LavaJatoRepository lavaJatoRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private AgendamentoMapper agendamentoMapper;

    /**
     * Lista todos os agendamentos
     * @return Lista de DTOs de agendamentos
     */
    @Transactional(readOnly = true)
    public List<AgendamentoDto> listarTodos() {
        List<Agendamento> agendamentos = agendamentoRepository.findAll();
        return agendamentoMapper.toDtoList(agendamentos);
    }

    /**
     * Busca agendamentos de um usuário
     * @param usuarioId ID do usuário
     * @return Lista de DTOs de agendamentos do usuário
     */
    @Transactional(readOnly = true)
    public List<AgendamentoDto> listarPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        List<Agendamento> agendamentos = agendamentoRepository.findByUsuario(usuario);
        return agendamentoMapper.toDtoList(agendamentos);
    }

    /**
     * Busca agendamentos de um lava jato
     * @param lavaJatoId ID do lava jato
     * @return Lista de DTOs de agendamentos do lava jato
     */
    @Transactional(readOnly = true)
    public List<AgendamentoDto> listarPorLavaJato(Long lavaJatoId) {
        LavaJato lavaJato = lavaJatoRepository.findById(lavaJatoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava Jato não encontrado"));

        List<Agendamento> agendamentos = agendamentoRepository.findByLavaJato(lavaJato);
        return agendamentoMapper.toDtoList(agendamentos);
    }

    /**
     * Busca um agendamento pelo ID
     * @param id ID do agendamento
     * @return DTO do agendamento
     */
    @Transactional(readOnly = true)
    public AgendamentoDto buscarPorId(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        return agendamentoMapper.toDto(agendamento);
    }

    /**
     * Cria um novo agendamento
     * @param agendamentoDto Dados do agendamento
     * @return DTO do agendamento criado
     */
    @Transactional
    public AgendamentoDto criar(AgendamentoDto agendamentoDto) {
        // Validações
        if (agendamentoDto.getDataHora() == null || agendamentoDto.getUsuarioId() == null ||
                agendamentoDto.getVeiculoId() == null || agendamentoDto.getLavaJatoId() == null ||
                agendamentoDto.getServicoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Todos os campos são obrigatórios");
        }

        // Verificar se a data é futura
        if (agendamentoDto.getDataHora().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data do agendamento deve ser futura");
        }

        // Verificar se o horário está disponível
        boolean horarioOcupado = agendamentoRepository.existsByLavaJatoIdAndDataHora(
                agendamentoDto.getLavaJatoId(),
                agendamentoDto.getDataHora());

        if (horarioOcupado) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Horário já está agendado");
        }

        // Buscar entidades relacionadas
        Usuario usuario = usuarioRepository.findById(agendamentoDto.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Veiculo veiculo = veiculoRepository.findById(agendamentoDto.getVeiculoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        LavaJato lavaJato = lavaJatoRepository.findById(agendamentoDto.getLavaJatoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava Jato não encontrado"));

        Servico servico = servicoRepository.findById(agendamentoDto.getServicoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        // Verificar se o veículo pertence ao usuário
        if (!veiculo.getProprietario().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O veículo não pertence ao usuário informado");
        }

        // Criar e salvar o agendamento
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(agendamentoDto.getDataHora());
        agendamento.setObservacoes(agendamentoDto.getObservacoes());
        agendamento.setStatus("PENDENTE"); // Status inicial
        agendamento.setUsuario(usuario);
        agendamento.setVeiculo(veiculo);
        agendamento.setLavaJato(lavaJato);
        agendamento.setServico(servico);
        agendamento.setValorTotal(servico.getPreco());

        agendamento = agendamentoRepository.save(agendamento);

        return agendamentoMapper.toDto(agendamento);
    }

    /**
     * Atualiza um agendamento existente
     * @param id ID do agendamento
     * @param agendamentoDto Novos dados do agendamento
     * @return DTO do agendamento atualizado
     */
    @Transactional
    public AgendamentoDto atualizar(Long id, AgendamentoDto agendamentoDto) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        // Não permitir alterar agendamentos concluídos ou cancelados
        if ("CONCLUIDO".equals(agendamento.getStatus()) || "CANCELADO".equals(agendamento.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Não é possível alterar agendamentos concluídos ou cancelados");
        }

        // Verificar alteração de horário
        if (agendamentoDto.getDataHora() != null && !agendamentoDto.getDataHora().equals(agendamento.getDataHora())) {
            // Verificar se data é futura
            if (agendamentoDto.getDataHora().isBefore(LocalDateTime.now())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data do agendamento deve ser futura");
            }

            // Verificar disponibilidade de horário
            boolean horarioOcupado = agendamentoRepository.existsByLavaJatoIdAndDataHoraAndIdNot(
                    agendamento.getLavaJato().getId(),
                    agendamentoDto.getDataHora(),
                    id);

            if (horarioOcupado) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Horário já está agendado");
            }

            agendamento.setDataHora(agendamentoDto.getDataHora());
        }

        // Atualização de serviço
        if (agendamentoDto.getServicoId() != null && !agendamentoDto.getServicoId().equals(agendamento.getServico().getId())) {
            Servico servico = servicoRepository.findById(agendamentoDto.getServicoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

            agendamento.setServico(servico);
            agendamento.setValorTotal(servico.getPreco());
        }

        // Atualizar observações se fornecidas
        if (agendamentoDto.getObservacoes() != null) {
            agendamento.setObservacoes(agendamentoDto.getObservacoes());
        }

        // Salvar atualizações
        agendamento = agendamentoRepository.save(agendamento);

        return agendamentoMapper.toDto(agendamento);
    }

    /**
     * Atualiza o status de um agendamento
     * @param id ID do agendamento
     * @param statusData Mapa contendo o novo status
     * @return DTO do agendamento atualizado
     */
    @Transactional
    public AgendamentoDto atualizarStatus(Long id, Map<String, String> statusData) {
        String novoStatus = statusData.get("status");

        if (novoStatus == null || novoStatus.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status não informado");
        }

        // Validar status permitidos
        if (!novoStatus.equals("PENDENTE") && !novoStatus.equals("CONFIRMADO") &&
                !novoStatus.equals("EM_ANDAMENTO") && !novoStatus.equals("CONCLUIDO") &&
                !novoStatus.equals("CANCELADO")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Status inválido. Valores permitidos: PENDENTE, CONFIRMADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO");
        }

        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        // Regras de negócio para transição de status
        if ("CANCELADO".equals(agendamento.getStatus()) || "CONCLUIDO".equals(agendamento.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Não é possível alterar o status de agendamentos concluídos ou cancelados");
        }

        // Atualizar status
        agendamento.setStatus(novoStatus);
        agendamento = agendamentoRepository.save(agendamento);

        return agendamentoMapper.toDto(agendamento);
    }

    /**
     * Exclui um agendamento
     * @param id ID do agendamento
     */
    @Transactional
    public void excluir(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        // Não permitir excluir agendamentos concluídos
        if ("CONCLUIDO".equals(agendamento.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Não é possível excluir agendamentos concluídos");
        }

        // Se o agendamento já começou, apenas cancelar
        if ("EM_ANDAMENTO".equals(agendamento.getStatus())) {
            agendamento.setStatus("CANCELADO");
            agendamentoRepository.save(agendamento);
            return;
        }

        // Caso contrário, excluir
        agendamentoRepository.delete(agendamento);
    }

    /**
     * Busca agendamentos por período
     * @param inicio Data inicial
     * @param fim Data final
     * @return Lista de DTOs de agendamentos no período
     */
    @Transactional(readOnly = true)
    public List<AgendamentoDto> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        List<Agendamento> agendamentos = agendamentoRepository.findByDataHoraBetween(inicio, fim);
        return agendamentoMapper.toDtoList(agendamentos);
    }

    /**
     * Verifica disponibilidade de horário
     * @param lavaJatoId ID do lava jato
     * @param dataHora Data e hora para verificação
     * @return True se o horário estiver disponível, false caso contrário
     */
    @Transactional(readOnly = true)
    public boolean verificarDisponibilidade(Long lavaJatoId, LocalDateTime dataHora) {
        return !agendamentoRepository.existsByLavaJatoIdAndDataHora(lavaJatoId, dataHora);
    }
}
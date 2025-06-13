package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.bases.BaseService;
import com.lavexpress.laveexpress.dtos.AgendamentoRequest;
import com.lavexpress.laveexpress.dtos.AgendamentoResponse;
import com.lavexpress.laveexpress.entities.Agendamento;
import com.lavexpress.laveexpress.mappers.AgendamentoMapper;
import com.lavexpress.laveexpress.repositories.AgendamentoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService extends BaseService<Agendamento> {

    private static final Logger log = LoggerFactory.getLogger(AgendamentoService.class);

    private final AgendamentoRepository agendamentoRepository;
    private final AgendamentoMapper agendamentoMapper;

    public AgendamentoService(AgendamentoRepository agendamentoRepository, AgendamentoMapper agendamentoMapper) {
        this.agendamentoRepository = agendamentoRepository;
        this.agendamentoMapper = agendamentoMapper;
    }

    @Override
    public JpaRepository<Agendamento, Long> getRepository() {
        return agendamentoRepository;
    }

    public AgendamentoResponse create(AgendamentoRequest agendamentoRequest) {
        try {
            log.info("Criando agendamento - Request: {}", agendamentoRequest);
            log.info("Usuario ID: {}, Veiculo ID: {}, Servico ID: {}, LavaJato ID: {}",
                    agendamentoRequest.usuarioId(),
                    agendamentoRequest.veiculoId(),
                    agendamentoRequest.servicoId(),
                    agendamentoRequest.lavaJatoId());

            var entity = agendamentoMapper.requestToEntity(agendamentoRequest);

            log.info("Entity criada - Usuario: {}, Veiculo: {}, Servico: {}, LavaJato: {}",
                    entity.getUsuario() != null ? entity.getUsuario().getId() : "NULL",
                    entity.getVeiculo() != null ? entity.getVeiculo().getId() : "NULL",
                    entity.getServico() != null ? entity.getServico().getId() : "NULL",
                    entity.getLavaJato() != null ? entity.getLavaJato().getId() : "NULL");

            getRepository().save(entity);

            log.info("Agendamento criado com sucesso: {}", entity.getId());
            return agendamentoMapper.entityToResponse(entity);

        } catch (Exception e) {
            log.error("Erro ao criar agendamento: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao criar agendamento: " + e.getMessage());
        }
    }
    public AgendamentoResponse update(AgendamentoRequest request, Long id) {
        var entity = agendamentoRepository.findById(id)
                .map(agendamento -> {
                    if (request.dataHorario() != null)
                        agendamento.setDataHorario(request.dataHorario());

                    if (request.statusAgendamento() != null)
                        agendamento.setStatusAgendamento(request.statusAgendamento());

                    return agendamentoRepository.save(agendamento);
                })
                .orElseThrow(() -> {
                    log.error("Agendamento não encontrado para atualização. ID: {}", id);
                    return new RuntimeException("Não foi possível encontrar o agendamento");
                });

//        log.info("Lava-jato atualizado com sucesso: {} (ID: {})", entity.getDescricao(), entity.getId());
        return agendamentoMapper.entityToResponse(entity);
    }

    public AgendamentoResponse findByIdResponse(Long id) {
        return agendamentoMapper.entityToResponse(agendamentoRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("agendamento nao encontrado")));
    }

    public List<AgendamentoResponse> findByUsuario(Long usuarioId) {
        List<Agendamento> agendamentos = agendamentoRepository.findByUsuarioId(usuarioId);
        return agendamentos.stream()
                .map(agendamentoMapper::entityToResponse)
                .collect(Collectors.toList());
    }

    public List<AgendamentoResponse> findByVeiculo(Long veiculoId) {
        List<Agendamento> agendamentos = agendamentoRepository.findByVeiculoId(veiculoId);
        return agendamentos.stream()
                .map(agendamentoMapper::entityToResponse)
                .collect(Collectors.toList());
    }

    public List<AgendamentoResponse> findByLavaJato(Long lavajatoId) {
        List<Agendamento> agendamentos = agendamentoRepository.findByLavaJatoId(lavajatoId);
        return agendamentos.stream()
                .map(agendamentoMapper::entityToResponse)
                .collect(Collectors.toList());
    }






}

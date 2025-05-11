package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.dtos.AgendamentoDto;
import com.lavexpress.laveexpress.entities.Agendamento;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para conversão entre Entity e DTO de Agendamento
 */
@Component
public class AgendamentoMapper {

    /**
     * Converte uma entidade Agendamento para AgendamentoDto
     * @param agendamento entidade a ser convertida
     * @return DTO resultante
     */
    public AgendamentoDto toDto(Agendamento agendamento) {
        if (agendamento == null) {
            return null;
        }

        AgendamentoDto dto = new AgendamentoDto();
        dto.setId(agendamento.getId());
        dto.setDataHora(agendamento.getDataHora());
        dto.setObservacoes(agendamento.getObservacoes());
        dto.setStatus(agendamento.getStatus());
        dto.setValorTotal(agendamento.getValorTotal());

        // Mapear dados do usuário
        if (agendamento.getUsuario() != null) {
            dto.setUsuarioId(agendamento.getUsuario().getId());
            dto.setUsuarioNome(agendamento.getUsuario().getNome());
        }

        // Mapear dados do veículo
        if (agendamento.getVeiculo() != null) {
            dto.setVeiculoId(agendamento.getVeiculo().getId());
            // Criando uma descrição do veículo (marca + modelo + placa)
            String veiculoDescricao = agendamento.getVeiculo().getMarca()
                    + " " + agendamento.getVeiculo().getModelo()
                    + " (" + agendamento.getVeiculo().getPlaca() + ")";
            dto.setVeiculoDescricao(veiculoDescricao);
        }

        // Mapear dados do lava jato
        if (agendamento.getLavaJato() != null) {
            dto.setLavaJatoId(agendamento.getLavaJato().getId());
            dto.setLavaJatoNome(agendamento.getLavaJato().getNome());
        }

        // Mapear dados do serviço
        if (agendamento.getServico() != null) {
            dto.setServicoId(agendamento.getServico().getId());
            dto.setServicoNome(agendamento.getServico().getNome());
        }

        return dto;
    }

    /**
     * Converte uma lista de entidades para lista de DTOs
     * @param agendamentos lista de entidades
     * @return lista de DTOs
     */
    public List<AgendamentoDto> toDtoList(List<Agendamento> agendamentos) {
        if (agendamentos == null) {
            return null;
        }

        return agendamentos.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Converte um AgendamentoDto para entidade Agendamento (apenas dados básicos)
     * Note: Não preenche relacionamentos (usuário, veículo, lava jato, serviço)
     * @param dto DTO a ser convertido
     * @return entidade resultante
     */
    public Agendamento toEntity(AgendamentoDto dto) {
        if (dto == null) {
            return null;
        }

        Agendamento agendamento = new Agendamento();
        agendamento.setId(dto.getId());
        agendamento.setDataHora(dto.getDataHora());
        agendamento.setObservacoes(dto.getObservacoes());
        agendamento.setStatus(dto.getStatus());
        agendamento.setValorTotal(dto.getValorTotal());

        return agendamento;
    }
}
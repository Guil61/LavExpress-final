package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.dtos.ServicoDto;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Servico;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para conversão entre Entity e DTO de Serviço
 */
@Component
public class ServicoMapper {

    /**
     * Converte uma entidade Servico para ServicoDto
     * @param servico entidade a ser convertida
     * @return DTO resultante
     */
    public ServicoDto toDto(Servico servico) {
        if (servico == null) {
            return null;
        }

        ServicoDto dto = new ServicoDto();
        dto.setId(servico.getId());
        dto.setNome(servico.getNome());
        dto.setDescricao(servico.getDescricao());
        dto.setPreco(servico.getPreco());
        dto.setDuracaoMinutos(servico.getDuracaoMinutos());
        dto.setCategoria(servico.getCategoria());
        dto.setAtivo(servico.isAtivo());

        // Mapear dados do lava jato
        if (servico.getLavaJato() != null) {
            dto.setLavaJatoId(servico.getLavaJato().getId());
            dto.setLavaJatoNome(servico.getLavaJato().getNome());
        }

        return dto;
    }

    /**
     * Converte uma lista de entidades para lista de DTOs
     * @param servicos lista de entidades
     * @return lista de DTOs
     */
    public List<ServicoDto> toDtoList(List<Servico> servicos) {
        if (servicos == null) {
            return null;
        }

        return servicos.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Converte um ServicoDto para entidade Servico (sem relacionamento com LavaJato)
     * @param dto DTO a ser convertido
     * @return entidade resultante
     */
    public Servico toEntity(ServicoDto dto) {
        if (dto == null) {
            return null;
        }

        Servico servico = new Servico();
        servico.setId(dto.getId());
        servico.setNome(dto.getNome());
        servico.setDescricao(dto.getDescricao());
        servico.setPreco(dto.getPreco());
        servico.setDuracaoMinutos(dto.getDuracaoMinutos());
        servico.setCategoria(dto.getCategoria());
        servico.setAtivo(dto.isAtivo());

        return servico;
    }

    /**
     * Converte um ServicoDto para entidade Servico e define o relacionamento com LavaJato
     * @param dto DTO a ser convertido
     * @param lavaJato entidade LavaJato a ser associada
     * @return entidade resultante
     */
    public Servico toEntity(ServicoDto dto, LavaJato lavaJato) {
        Servico servico = toEntity(dto);
        if (servico != null) {
            servico.setLavaJato(lavaJato);
        }
        return servico;
    }
}
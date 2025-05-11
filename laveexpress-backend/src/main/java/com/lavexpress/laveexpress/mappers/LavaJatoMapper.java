package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.dtos.LavaJatoDto;
import com.lavexpress.laveexpress.entities.LavaJato;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para conversão entre Entity e DTO de Lava Jato
 */
@Component
public class LavaJatoMapper {

    /**
     * Converte uma entidade LavaJato para LavaJatoDto
     * @param lavaJato entidade a ser convertida
     * @return DTO resultante
     */
    public LavaJatoDto toDto(LavaJato lavaJato) {
        if (lavaJato == null) {
            return null;
        }

        LavaJatoDto dto = new LavaJatoDto();
        dto.setId(lavaJato.getId());
        dto.setNome(lavaJato.getNome());
        dto.setEndereco(lavaJato.getEndereco());
        dto.setCidade(lavaJato.getCidade());
        dto.setEstado(lavaJato.getEstado());
        dto.setCep(lavaJato.getCep());
        dto.setTelefone(lavaJato.getTelefone());
        dto.setEmail(lavaJato.getEmail());
        dto.setHorarioAbertura(lavaJato.getHorarioAbertura());
        dto.setHorarioFechamento(lavaJato.getHorarioFechamento());
        dto.setDescricao(lavaJato.getDescricao());
        dto.setImagemUrl(lavaJato.getImagemUrl());
        dto.setLatitude(lavaJato.getLatitude());
        dto.setLongitude(lavaJato.getLongitude());
        dto.setAvaliacaoMedia(lavaJato.getAvaliacaoMedia());
        dto.setAtivo(lavaJato.isAtivo());

        return dto;
    }

    /**
     * Converte uma lista de entidades para lista de DTOs
     * @param lavaJatos lista de entidades
     * @return lista de DTOs
     */
    public List<LavaJatoDto> toDtoList(List<LavaJato> lavaJatos) {
        if (lavaJatos == null) {
            return null;
        }

        return lavaJatos.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Converte um LavaJatoDto para entidade LavaJato
     * @param dto DTO a ser convertido
     * @return entidade resultante
     */
    public LavaJato toEntity(LavaJatoDto dto) {
        if (dto == null) {
            return null;
        }

        LavaJato lavaJato = new LavaJato();
        lavaJato.setId(dto.getId());
        lavaJato.setNome(dto.getNome());
        lavaJato.setEndereco(dto.getEndereco());
        lavaJato.setCidade(dto.getCidade());
        lavaJato.setEstado(dto.getEstado());
        lavaJato.setCep(dto.getCep());
        lavaJato.setTelefone(dto.getTelefone());
        lavaJato.setEmail(dto.getEmail());
        lavaJato.setHorarioAbertura(dto.getHorarioAbertura());
        lavaJato.setHorarioFechamento(dto.getHorarioFechamento());
        lavaJato.setDescricao(dto.getDescricao());
        lavaJato.setImagemUrl(dto.getImagemUrl());
        lavaJato.setLatitude(dto.getLatitude());
        lavaJato.setLongitude(dto.getLongitude());
        lavaJato.setAvaliacaoMedia(dto.getAvaliacaoMedia());
        lavaJato.setAtivo(dto.isAtivo());

        return lavaJato;
    }
}
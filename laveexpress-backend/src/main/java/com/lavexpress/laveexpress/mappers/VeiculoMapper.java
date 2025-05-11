package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.dtos.VeiculoDto;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.entities.Veiculo;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para conversão entre Entity e DTO de Veículo
 */
@Component
public class VeiculoMapper {

    /**
     * Converte uma entidade Veiculo para VeiculoDto
     * @param veiculo entidade a ser convertida
     * @return DTO resultante
     */
    public VeiculoDto toDto(Veiculo veiculo) {
        if (veiculo == null) {
            return null;
        }

        VeiculoDto dto = new VeiculoDto();
        dto.setId(veiculo.getId());
        dto.setMarca(veiculo.getMarca());
        dto.setModelo(veiculo.getModelo());
        dto.setAno(veiculo.getAno());
        dto.setCor(veiculo.getCor());
        dto.setPlaca(veiculo.getPlaca());
        dto.setTipo(veiculo.getTipo());
        dto.setImagemUrl(veiculo.getImagemUrl());
        dto.setAtivo(veiculo.isAtivo());

        // Mapear dados do proprietário
        if (veiculo.getProprietario() != null) {
            dto.setProprietarioId(veiculo.getProprietario().getId());
            dto.setProprietarioNome(veiculo.getProprietario().getNome());
        }

        return dto;
    }

    /**
     * Converte uma lista de entidades para lista de DTOs
     * @param veiculos lista de entidades
     * @return lista de DTOs
     */
    public List<VeiculoDto> toDtoList(List<Veiculo> veiculos) {
        if (veiculos == null) {
            return null;
        }

        return veiculos.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Converte um VeiculoDto para entidade Veiculo (sem relacionamento com Proprietário)
     * @param dto DTO a ser convertido
     * @return entidade resultante
     */
    public Veiculo toEntity(VeiculoDto dto) {
        if (dto == null) {
            return null;
        }

        Veiculo veiculo = new Veiculo();
        veiculo.setId(dto.getId());
        veiculo.setMarca(dto.getMarca());
        veiculo.setModelo(dto.getModelo());
        veiculo.setAno(dto.getAno());
        veiculo.setCor(dto.getCor());
        veiculo.setPlaca(dto.getPlaca());
        veiculo.setTipo(dto.getTipo());
        veiculo.setImagemUrl(dto.getImagemUrl());
        veiculo.setAtivo(dto.isAtivo());

        return veiculo;
    }

    /**
     * Converte um VeiculoDto para entidade Veiculo e define o relacionamento com Proprietário
     * @param dto DTO a ser convertido
     * @param proprietario entidade Usuario a ser associada como proprietário
     * @return entidade resultante
     */
    public Veiculo toEntity(VeiculoDto dto, Usuario proprietario) {
        Veiculo veiculo = toEntity(dto);
        if (veiculo != null) {
            veiculo.setProprietario(proprietario);
        }
        return veiculo;
    }

    /**
     * Atualiza uma entidade existente com dados do DTO
     * @param veiculo entidade a ser atualizada
     * @param dto DTO com os novos dados
     * @return entidade atualizada
     */
    public Veiculo updateEntityFromDto(Veiculo veiculo, VeiculoDto dto) {
        if (veiculo == null || dto == null) {
            return veiculo;
        }

        veiculo.setMarca(dto.getMarca());
        veiculo.setModelo(dto.getModelo());
        veiculo.setAno(dto.getAno());
        veiculo.setCor(dto.getCor());
        veiculo.setPlaca(dto.getPlaca());
        veiculo.setTipo(dto.getTipo());

        // Atualizar imagem apenas se fornecida
        if (dto.getImagemUrl() != null && !dto.getImagemUrl().isEmpty()) {
            veiculo.setImagemUrl(dto.getImagemUrl());
        }

        veiculo.setAtivo(dto.isAtivo());

        return veiculo;
    }
}
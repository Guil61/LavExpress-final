package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.dtos.UsuarioDto;
import com.lavexpress.laveexpress.dtos.VeiculoDto;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.entities.Veiculo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para conversão entre Entity e DTO de Usuário
 */
@Component
public class UsuarioMapper {

    @Autowired
    private VeiculoMapper veiculoMapper;

    /**
     * Converte uma entidade Usuario para UsuarioDto
     * @param usuario entidade a ser convertida
     * @return DTO resultante
     */
    public UsuarioDto toDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        UsuarioDto dto = new UsuarioDto();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setCpf(usuario.getCpf());
        dto.setTelefone(usuario.getTelefone());
        dto.setPhotoPath(usuario.getPhotoPath());

        // Mapear veículos se presentes
        if (usuario.getVeiculos() != null && !usuario.getVeiculos().isEmpty()) {
            List<VeiculoDto> veiculoDtos = usuario.getVeiculos().stream()
                    .map(veiculoMapper::toDto)
                    .collect(Collectors.toList());
            dto.setVeiculos(veiculoDtos);
        }

        return dto;
    }

    /**
     * Converte uma lista de entidades para lista de DTOs
     * @param usuarios lista de entidades
     * @return lista de DTOs
     */
    public List<UsuarioDto> toDtoList(List<Usuario> usuarios) {
        if (usuarios == null) {
            return null;
        }

        return usuarios.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Converte um UsuarioDto para entidade Usuario (sem veículos)
     * @param dto DTO a ser convertido
     * @return entidade resultante
     */
    public Usuario toEntity(UsuarioDto dto) {
        if (dto == null) {
            return null;
        }

        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setTelefone(dto.getTelefone());
        usuario.setPhotoPath(dto.getPhotoPath());

        return usuario;
    }

    /**
     * Atualiza uma entidade existente com dados do DTO (sem atualizar veículos)
     * @param usuario entidade a ser atualizada
     * @param dto DTO com os novos dados
     * @return entidade atualizada
     */
    public Usuario updateEntityFromDto(Usuario usuario, UsuarioDto dto) {
        if (usuario == null || dto == null) {
            return usuario;
        }

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setTelefone(dto.getTelefone());

        // Atualizar foto apenas se fornecida
        if (dto.getPhotoPath() != null && !dto.getPhotoPath().isEmpty()) {
            usuario.setPhotoPath(dto.getPhotoPath());
        }

        return usuario;
    }

    /**
     * Versão simplificada do DTO sem veículos e informações sensíveis
     * @param usuario entidade a ser convertida
     * @return DTO simplificado
     */
    public UsuarioDto toDtoSimplificado(Usuario usuario) {
        UsuarioDto dto = toDto(usuario);
        if (dto != null) {
            // Remover veículos para versão simplificada
            dto.setVeiculos(null);
        }
        return dto;
    }
}
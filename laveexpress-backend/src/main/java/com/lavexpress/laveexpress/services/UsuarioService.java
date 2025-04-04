package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.bases.BaseService;
import com.lavexpress.laveexpress.dtos.UsuarioDto;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.mappers.UsuarioMapper;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public class UsuarioService extends BaseService<Usuario> {

    private final UsuarioRepository usuarioRepository;

    private final UsuarioMapper mapper;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
    }

    @Override
    public JpaRepository<Usuario, Long> getRepository() {
        return usuarioRepository;
    }

    public Usuario create(UsuarioDto usuarioDto) {
        var usuario = mapper.dtoToEntity(usuarioDto);
        return usuarioRepository.save(usuario);
    }



}

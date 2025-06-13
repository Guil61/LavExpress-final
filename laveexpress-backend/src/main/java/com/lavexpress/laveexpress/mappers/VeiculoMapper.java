package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.bases.BaseMapper;
import com.lavexpress.laveexpress.dtos.*;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.entities.Veiculo;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import com.lavexpress.laveexpress.services.VeiculoService;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public abstract class VeiculoMapper extends BaseMapper<Veiculo, VeiculoRequest, VeiculoResponse, VeiculoFilter> {
    @Autowired
    protected UsuarioRepository usuarioRepository;

    @Override
    @Mapping(target = "proprietario", expression = "java(this.findUsuarioById(veiculoRequest.usuarioId()))")
    public abstract Veiculo requestToEntity(VeiculoRequest veiculoRequest);

    @Override
    @Mapping(target = "usuarioId", source = "proprietario.id")
    public abstract VeiculoResponse entityToResponse(Veiculo veiculo);


    public Usuario findUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Usuario nao encontrado com o id" + id));
    }



}

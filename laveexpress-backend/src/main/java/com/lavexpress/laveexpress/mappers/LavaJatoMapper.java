package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.bases.BaseMapper;
import com.lavexpress.laveexpress.dtos.*;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Servico;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Mapper(componentModel = "spring")
public abstract class LavaJatoMapper extends BaseMapper<LavaJato, LavaJatoRequest, LavaJatoResponse, LavaJatoFilter> {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    ServicoMapper servicoMapper;



    @Override
    @Mapping(target = "proprietario", expression = "java(this.findUsuarioById(lavaJatoRequest.proprietarioId()))")
    @Mapping(target = "servicos", source = "servicos")
    public abstract LavaJato requestToEntity(LavaJatoRequest lavaJatoRequest);

    @Override
    @Mapping(target = "proprietarioId", source = "proprietario.id")
    @Mapping(target = "servicos", source = "servicos")
    public abstract LavaJatoResponse entityToResponse(LavaJato lavaJato);

    protected List<Servico> mapServicoRequestList(List<ServicoRequest> servicos) {
        if (servicos == null) {
            return new ArrayList<>();
        }
        return servicos.stream()
                .map(servicoMapper::requestToEntity)
                .collect(Collectors.toList());
    }

    protected List<ServicoResponse> mapServicoList(List<Servico> servicos) {
        if (servicos == null) {
            return new ArrayList<>();
        }
        return servicos.stream()
                .map(servicoMapper::entityToResponse)
                .collect(Collectors.toList());
    }

    public Usuario findUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Usuario nao encontrado com o id" + id));
    }
}

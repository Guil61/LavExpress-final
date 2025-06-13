package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.bases.BaseMapper;
import com.lavexpress.laveexpress.dtos.ServicoFilter;
import com.lavexpress.laveexpress.dtos.ServicoRequest;
import com.lavexpress.laveexpress.dtos.ServicoResponse;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Servico;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public abstract class ServicoMapper extends BaseMapper<Servico, ServicoRequest, ServicoResponse, ServicoFilter> {

    @Autowired
    LavaJatoRepository lavaJatoRepository;


    @Override
    @Mapping(target = "lavaJato", expression = "java(this.findLavaJatoById(request.lavaJatoId()))")
    public abstract Servico requestToEntity(ServicoRequest request);

    @Override
    @Mapping(target = "lavaJatoId", source = "lavaJato.id")
    public abstract ServicoResponse entityToResponse(Servico servico);



    public LavaJato findLavaJatoById(Long id){
        return lavaJatoRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Lavajato nao encontrado"));
    }



}

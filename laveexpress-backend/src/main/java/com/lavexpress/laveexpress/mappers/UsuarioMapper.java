package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.bases.BaseMapper;
import com.lavexpress.laveexpress.dtos.CadastroRequest;
import com.lavexpress.laveexpress.dtos.UsuarioRequest;
import com.lavexpress.laveexpress.dtos.UsuarioResponse;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.filters.UsuarioFilter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public abstract class UsuarioMapper extends BaseMapper<Usuario, UsuarioRequest, UsuarioResponse, UsuarioFilter> {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "veiculos", ignore = true)
    public abstract Usuario cadastroRequestToUsuario(CadastroRequest request);

}

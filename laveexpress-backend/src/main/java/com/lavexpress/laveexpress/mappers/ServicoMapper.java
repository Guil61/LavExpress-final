package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.bases.BaseMapper;
import com.lavexpress.laveexpress.dtos.ServicoDto;
import com.lavexpress.laveexpress.entities.Servico;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public abstract class ServicoMapper extends BaseMapper<Servico, ServicoDto> {
}

package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.bases.BaseMapper;
import com.lavexpress.laveexpress.dtos.VeiculoDto;
import com.lavexpress.laveexpress.dtos.VeiculoFilter;
import com.lavexpress.laveexpress.dtos.VeiculoRequest;
import com.lavexpress.laveexpress.dtos.VeiculoResponse;
import com.lavexpress.laveexpress.entities.Veiculo;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public abstract class VeiculoMapper extends BaseMapper<Veiculo, VeiculoRequest, VeiculoResponse, VeiculoFilter> {

}

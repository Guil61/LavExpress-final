package com.lavexpress.laveexpress.mappers;

import com.lavexpress.laveexpress.bases.BaseMapper;
import com.lavexpress.laveexpress.dtos.AgendamentoFilter;
import com.lavexpress.laveexpress.dtos.AgendamentoRequest;
import com.lavexpress.laveexpress.dtos.AgendamentoResponse;
import com.lavexpress.laveexpress.dtos.LavaJatoResponse;
import com.lavexpress.laveexpress.entities.*;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import com.lavexpress.laveexpress.repositories.ServicoRepository;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import com.lavexpress.laveexpress.repositories.VeiculoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public abstract class AgendamentoMapper extends BaseMapper<Agendamento, AgendamentoRequest, AgendamentoResponse, AgendamentoFilter> {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    LavaJatoRepository lavaJatoRepository;

    @Autowired
    VeiculoRepository veiculoRepository;

    @Autowired
    ServicoRepository servicoRepository;


    @Override
    @Mapping(target = "veiculo", expression = "java(this.findVeiculoById(request.veiculoId()))")
    @Mapping(target = "servico", expression = "java(this.findServicoById(request.servicoId()))")
    @Mapping(target = "usuario", expression = "java(this.findUsuarioById(request.usuarioId()))")
    @Mapping(target = "lavaJato", expression = "java(this.findLavaJatoById(request.lavaJatoId()))")
    public abstract Agendamento requestToEntity(AgendamentoRequest request);



    @Override
    @Mapping(target = "veiculoId", source = "veiculo.id")
    @Mapping(target = "servicoId", source = "servico.id")
    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "lavaJatoId", source = "lavaJato.id")
    public abstract AgendamentoResponse entityToResponse(Agendamento agendamento);




    public Servico findServicoById(Long id) {
        return servicoRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Servico nao encontrado com o id" + id));
    }

    public Usuario findUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Usuario nao encontrado com o id" + id));
    }

    public LavaJato findLavaJatoById(Long id) {
        return lavaJatoRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("LavaJato nao encontrado com o id" + id));
    }

    public Veiculo findVeiculoById(Long id) {
        return veiculoRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Veículo nao encontrado com o id" + id));
    }

}

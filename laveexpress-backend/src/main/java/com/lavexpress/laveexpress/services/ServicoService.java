package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.bases.BaseService;
import com.lavexpress.laveexpress.dtos.LavaJatoResponse;
import com.lavexpress.laveexpress.dtos.ServicoRequest;
import com.lavexpress.laveexpress.dtos.ServicoResponse;
import com.lavexpress.laveexpress.entities.Servico;
import com.lavexpress.laveexpress.mappers.ServicoMapper;
import com.lavexpress.laveexpress.repositories.ServicoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicoService extends BaseService<Servico> {

    private static final Logger log = LoggerFactory.getLogger(ServicoService.class);


    private final ServicoRepository servicoRepository;
    private final ServicoMapper servicoMapper;


    public ServicoService(ServicoRepository servicoRepository, ServicoMapper servicoMapper) {
        this.servicoRepository = servicoRepository;
        this.servicoMapper = servicoMapper;
    }


    @Override
    public JpaRepository<Servico, Long> getRepository() {
        return servicoRepository;
    }

    public ServicoResponse create(ServicoRequest request) {
       var entity = servicoMapper.requestToEntity(request);
       getRepository().save(entity);
       return servicoMapper.entityToResponse(entity);
    }

    public ServicoResponse update(ServicoRequest request, Long id) {
        var entity = servicoRepository.findById(id)
                .map(servico -> {
                    if (request.descricao() != null)
                        servico.setDescricao(request.descricao());

                    if (request.valor() != null)
                        servico.setValor(request.valor());

                    return servicoRepository.save(servico);
                })
                .orElseThrow(() -> {
                    log.error("Servico não encontrado para atualização. ID: {}", id);
                    return new RuntimeException("Não foi possível encontrar o servico");
                });

        log.info("Lava-jato atualizado com sucesso: {} (ID: {})", entity.getDescricao(), entity.getId());
        return servicoMapper.entityToResponse(entity);
    }

    public ServicoResponse findByIdResponse(Long id) {
        return servicoMapper.entityToResponse(servicoRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("servico nao encontrado")));
    }

    public List<ServicoResponse> findByLavajatoId(Long lavajatoId) {
        List<Servico> servicos = servicoRepository.findByLavaJatoId(lavajatoId);
        return servicos.stream()
                .map(servicoMapper::entityToResponse)
                .collect(Collectors.toList());
    }

}

package com.lavexpress.laveexpress.services;


import com.lavexpress.laveexpress.bases.BaseService;
import com.lavexpress.laveexpress.dtos.VeiculoRequest;
import com.lavexpress.laveexpress.dtos.VeiculoResponse;
import com.lavexpress.laveexpress.entities.Veiculo;
import com.lavexpress.laveexpress.mappers.VeiculoMapper;
import com.lavexpress.laveexpress.repositories.VeiculoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class VeiculoService extends BaseService<Veiculo> {

    private final VeiculoRepository veiculoRepository;
    private final VeiculoMapper veiculoMapper;

    public VeiculoService(VeiculoRepository veiculoRepository, VeiculoMapper veiculoMapper) {
        this.veiculoRepository = veiculoRepository;
        this.veiculoMapper = veiculoMapper;
    }

    @Override
    public JpaRepository<Veiculo, Long> getRepository() {
        return veiculoRepository;
    }

    public VeiculoResponse create (VeiculoRequest request) {
        Veiculo entity = veiculoMapper.requestToEntity(request);
        getRepository().save(entity);
        return veiculoMapper.entityToResponse(entity);
    }

    public VeiculoResponse update(VeiculoRequest request, Long id) {

        var entity = veiculoRepository.findById(id)
                .map(veiculo -> {
                    if (request.placa() != null)
                        veiculo.setPlaca(request.placa());

                    if (request.modelo() != null)
                        veiculo.setModelo(request.modelo());

                    if (request.ano() != null)
                        veiculo.setAno(request.ano());

                    if (request.marca() != null)
                        veiculo.setMarca(request.marca());

                    return veiculoRepository.save(veiculo);
                })
                .orElseThrow(() -> new RuntimeException("Não foi possível encontrar o veiculo"));

        return veiculoMapper.entityToResponse(entity);
    }

    public VeiculoResponse findByIdResponse(Long id) {
        return veiculoMapper.entityToResponse(veiculoRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Veículo nao encontrado")));
    }

    public Veiculo findById(Long id) {
        return veiculoRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Veiculo nao encontrado para o id" + id));
    }



}

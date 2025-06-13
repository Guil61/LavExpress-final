package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.bases.BaseRepository;
import com.lavexpress.laveexpress.entities.Veiculo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VeiculoRepository extends BaseRepository<Veiculo> {
    List<Veiculo> findByProprietarioId(Long usuarioId);
}

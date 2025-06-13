package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.bases.BaseRepository;
import com.lavexpress.laveexpress.entities.Servico;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicoRepository extends BaseRepository<Servico> {
    List<Servico> findByLavaJatoId(Long lavajatoId);
}

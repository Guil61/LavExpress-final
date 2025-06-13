package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.bases.BaseRepository;
import com.lavexpress.laveexpress.entities.Agendamento;
import com.lavexpress.laveexpress.entities.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgendamentoRepository extends BaseRepository<Agendamento> {

    List<Agendamento> findByUsuarioId(Long usuarioId);
    List<Agendamento> findByVeiculoId(Long veiculoId);
    List<Agendamento> findByLavaJatoId(Long usuarioId);


}

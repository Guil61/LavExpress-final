package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.entities.Agendamento;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository para a entidade Agendamento
 */
@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    /**
     * Busca agendamentos de um usuário específico
     * @param usuario usuário para filtro
     * @return lista de agendamentos do usuário
     */
    List<Agendamento> findByUsuario(Usuario usuario);

    /**
     * Busca agendamentos de um lava jato específico
     * @param lavaJato lava jato para filtro
     * @return lista de agendamentos do lava jato
     */
    List<Agendamento> findByLavaJato(LavaJato lavaJato);

    /**
     * Verifica se existe agendamento para um lava jato em uma data/hora específica
     * @param lavaJatoId ID do lava jato
     * @param dataHora data e hora para verificação
     * @return true se já existe agendamento, false caso contrário
     */
    boolean existsByLavaJatoIdAndDataHora(Long lavaJatoId, LocalDateTime dataHora);

    /**
     * Verifica se existe agendamento para um lava jato em uma data/hora específica, excluindo um agendamento específico
     * @param lavaJatoId ID do lava jato
     * @param dataHora data e hora para verificação
     * @param id ID do agendamento a ser excluído da verificação
     * @return true se já existe outro agendamento, false caso contrário
     */
    boolean existsByLavaJatoIdAndDataHoraAndIdNot(Long lavaJatoId, LocalDateTime dataHora, Long id);

    /**
     * Busca agendamentos em um período de tempo
     * @param inicio data/hora inicial
     * @param fim data/hora final
     * @return lista de agendamentos no período
     */
    List<Agendamento> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);

    /**
     * Busca os agendamentos próximos de um usuário (data atual em diante)
     * @param usuario usuário para filtro
     * @param dataAtual data atual
     * @return lista de agendamentos futuros do usuário
     */
    @Query("SELECT a FROM Agendamento a WHERE a.usuario = :usuario AND a.dataHora >= :dataAtual ORDER BY a.dataHora")
    List<Agendamento> findProximosByUsuario(@Param("usuario") Usuario usuario, @Param("dataAtual") LocalDateTime dataAtual);

    /**
     * Busca os agendamentos próximos de um lava jato (data atual em diante)
     * @param lavaJato lava jato para filtro
     * @param dataAtual data atual
     * @return lista de agendamentos futuros do lava jato
     */
    @Query("SELECT a FROM Agendamento a WHERE a.lavaJato = :lavaJato AND a.dataHora >= :dataAtual ORDER BY a.dataHora")
    List<Agendamento> findProximosByLavaJato(@Param("lavaJato") LavaJato lavaJato, @Param("dataAtual") LocalDateTime dataAtual);

    /**
     * Conta o número de agendamentos por status
     * @param status status para contagem
     * @return número de agendamentos com o status informado
     */
    long countByStatus(String status);
}
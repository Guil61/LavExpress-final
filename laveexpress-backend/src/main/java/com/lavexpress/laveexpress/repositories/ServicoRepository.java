package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository para a entidade Servico
 */
@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {

    /**
     * Busca serviços de um lava-jato específico
     * @param lavaJato lava-jato para filtro
     * @return lista de serviços do lava-jato
     */
    List<Servico> findByLavaJato(LavaJato lavaJato);

    /**
     * Busca serviços por categoria
     * @param categoria categoria do serviço
     * @return lista de serviços da categoria
     */
    List<Servico> findByCategoria(String categoria);

    /**
     * Verifica se existe serviço com o mesmo nome no mesmo lava-jato
     * @param nome nome do serviço
     * @param lavaJato lava-jato
     * @return true se já existe, false caso contrário
     */
    boolean existsByNomeAndLavaJato(String nome, LavaJato lavaJato);

    /**
     * Verifica se existe outro serviço com o mesmo nome no mesmo lava-jato
     * @param nome nome do serviço
     * @param lavaJato lava-jato
     * @param id ID do serviço a ser excluído da verificação
     * @return true se já existe outro, false caso contrário
     */
    boolean existsByNomeAndLavaJatoAndIdNot(String nome, LavaJato lavaJato, Long id);

    /**
     * Conta o número de agendamentos vinculados a um serviço
     * @param servicoId ID do serviço
     * @return número de agendamentos
     */
    @Query("SELECT COUNT(a) FROM Agendamento a WHERE a.servico.id = :servicoId")
    long countAgendamentosByServicoId(@Param("servicoId") Long servicoId);

    /**
     * Busca os serviços mais populares (com mais agendamentos)
     * @param limit limite de resultados
     * @return lista de serviços mais populares
     */
    @Query(value =
            "SELECT s.* FROM servico s " +
                    "JOIN (SELECT servico_id, COUNT(*) as total " +
                    "FROM agendamento " +
                    "GROUP BY servico_id " +
                    "ORDER BY total DESC " +
                    "LIMIT :limit) a " +
                    "ON s.id = a.servico_id " +
                    "WHERE s.ativo = true",
            nativeQuery = true)
    List<Servico> findMostPopularServices(@Param("limit") int limit);

    /**
     * Busca serviços ativos de um lava-jato
     * @param lavaJato lava-jato para filtro
     * @return lista de serviços ativos do lava-jato
     */
    List<Servico> findByLavaJatoAndAtivoTrue(LavaJato lavaJato);

    /**
     * Busca serviços por faixa de preço
     * @param precoMinimo preço mínimo
     * @param precoMaximo preço máximo
     * @return lista de serviços na faixa de preço
     */
    List<Servico> findByPrecoGreaterThanEqualAndPrecoLessThanEqual(BigDecimal precoMinimo, BigDecimal precoMaximo);

    /**
     * Busca serviços por nome (busca parcial case insensitive)
     * @param nome parte do nome para busca
     * @return lista de serviços encontrados
     */
    List<Servico> findByNomeContainingIgnoreCase(String nome);
}
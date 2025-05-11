package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.entities.LavaJato;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para a entidade LavaJato
 */
@Repository
public interface LavaJatoRepository extends JpaRepository<LavaJato, Long> {

    /**
     * Busca lava-jatos por nome ou cidade (busca parcial case insensitive)
     * @param nome termo para busca no nome
     * @param cidade termo para busca na cidade
     * @return lista de lava-jatos encontrados
     */
    List<LavaJato> findByNomeContainingIgnoreCaseOrCidadeContainingIgnoreCase(String nome, String cidade);

    /**
     * Busca lava-jatos por cidade (case insensitive)
     * @param cidade nome da cidade
     * @return lista de lava-jatos na cidade
     */
    List<LavaJato> findByCidadeIgnoreCase(String cidade);

    /**
     * Verifica se existe lava-jato com o mesmo nome no mesmo endereço
     * @param nome nome do lava-jato
     * @param endereco endereço do lava-jato
     * @return true se já existe, false caso contrário
     */
    boolean existsByNomeAndEndereco(String nome, String endereco);

    /**
     * Verifica se existe outro lava-jato com o mesmo nome no mesmo endereço
     * @param nome nome do lava-jato
     * @param endereco endereço do lava-jato
     * @param id ID do lava-jato a ser excluído da verificação
     * @return true se já existe outro, false caso contrário
     */
    boolean existsByNomeAndEnderecoAndIdNot(String nome, String endereco, Long id);

    /**
     * Conta o número de agendamentos vinculados a um lava-jato
     * @param lavaJatoId ID do lava-jato
     * @return número de agendamentos
     */
    @Query("SELECT COUNT(a) FROM Agendamento a WHERE a.lavaJato.id = :lavaJatoId")
    long countAgendamentosByLavaJatoId(@Param("lavaJatoId") Long lavaJatoId);

    /**
     * Busca os lava-jatos mais bem avaliados
     * @param pageable objeto de paginação para limitar o número de resultados
     * @return lista paginada de lava-jatos ordenados por avaliação
     */
    @Query("SELECT l FROM LavaJato l WHERE l.ativo = true ORDER BY l.avaliacaoMedia DESC")
    List<LavaJato> findTopByOrderByAvaliacaoMediaDesc(Pageable pageable);

    /**
     * Busca lava-jatos próximos a uma coordenada geográfica
     * @param latitude latitude do ponto de referência
     * @param longitude longitude do ponto de referência
     * @param raioKm raio de busca em quilômetros
     * @return lista de lava-jatos dentro do raio
     */
    @Query(value =
            "SELECT * FROM lava_jato " +
                    "WHERE " +
                    "  ativo = true AND " +
                    "  (6371 * acos(cos(radians(:latitude)) * " +
                    "  cos(radians(latitude)) * " +
                    "  cos(radians(longitude) - " +
                    "  radians(:longitude)) + " +
                    "  sin(radians(:latitude)) * " +
                    "  sin(radians(latitude)))) < :raioKm " +
                    "ORDER BY " +
                    "  (6371 * acos(cos(radians(:latitude)) * " +
                    "  cos(radians(latitude)) * " +
                    "  cos(radians(longitude) - " +
                    "  radians(:longitude)) + " +
                    "  sin(radians(:latitude)) * " +
                    "  sin(radians(latitude))))",
            nativeQuery = true)
    List<LavaJato> findNearbyLavaJatos(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("raioKm") Double raioKm);

    /**
     * Busca lava-jatos ativos
     * @return lista de lava-jatos ativos
     */
    List<LavaJato> findByAtivoTrue();

    /**
     * Busca lava-jatos por avaliação mínima
     * @param avaliacaoMinima avaliação mínima
     * @return lista de lava-jatos com avaliação maior ou igual
     */
    List<LavaJato> findByAvaliacaoMediaGreaterThanEqual(Double avaliacaoMinima);

    /**
     * Busca lava-jatos por estado
     * @param estado sigla do estado
     * @return lista de lava-jatos no estado
     */
    List<LavaJato> findByEstadoIgnoreCase(String estado);
}
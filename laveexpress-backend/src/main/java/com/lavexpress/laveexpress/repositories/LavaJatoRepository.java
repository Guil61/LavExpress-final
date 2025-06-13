package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.bases.BaseRepository;
import com.lavexpress.laveexpress.entities.LavaJato;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LavaJatoRepository extends BaseRepository<LavaJato> {

    Page<LavaJato> findAll(Pageable pageable);

    // Busca por nome (para a barra de pesquisa)
    @Query("SELECT l FROM LavaJato l WHERE LOWER(l.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    Page<LavaJato> findByNomeContainingIgnoreCase(@Param("nome") String nome, Pageable pageable);

    // Busca com filtro de avaliação mínima (JPQL)
    @Query("SELECT l FROM LavaJato l LEFT JOIN l.avaliacoes a " +
            "GROUP BY l.id, l.nome, l.endereco, l.telefone, l.email, l.cnpj, l.latLong, l.proprietario " +
            "HAVING (:avaliacaoMinima IS NULL OR :avaliacaoMinima = 0 OR AVG(COALESCE(a.nota, 0)) >= :avaliacaoMinima)")
    Page<LavaJato> findByAvaliacaoMinima(@Param("avaliacaoMinima") Integer avaliacaoMinima, Pageable pageable);

    // Query nativa PostgreSQL SIMPLES para busca por distância
    @Query(value = "SELECT * FROM (" +
            "  SELECT l.*, " +
            "    (6371 * acos(" +
            "      cos(radians(:latitude)) * " +
            "      cos(radians(CAST(split_part(l.lat_long, ',', 1) AS NUMERIC))) * " +
            "      cos(radians(CAST(split_part(l.lat_long, ',', 2) AS NUMERIC)) - radians(:longitude)) + " +
            "      sin(radians(:latitude)) * " +
            "      sin(radians(CAST(split_part(l.lat_long, ',', 1) AS NUMERIC)))" +
            "    )) AS distancia_calculada " +
            "  FROM lava_jato l " +
            "  WHERE l.lat_long IS NOT NULL " +
            "  AND l.lat_long != '' " +
            "  AND l.lat_long ~ '^-?[0-9]+\\.?[0-9]*,-?[0-9]+\\.?[0-9]*$' " +
            ") AS resultado " +
            "WHERE resultado.distancia_calculada <= :raioKm " +
            "ORDER BY resultado.distancia_calculada",
            countQuery = "SELECT COUNT(*) FROM lava_jato l " +
                    "WHERE l.lat_long IS NOT NULL " +
                    "AND l.lat_long != '' " +
                    "AND l.lat_long ~ '^-?[0-9]+\\.?[0-9]*,-?[0-9]+\\.?[0-9]*$'",
            nativeQuery = true)
    Page<LavaJato> findByDistancia(@Param("latitude") Double latitude,
                                   @Param("longitude") Double longitude,
                                   @Param("raioKm") Double raioKm,
                                   Pageable pageable);

    @Query(value = "SELECT * FROM (" +
            "  SELECT l.*, " +
            "    COALESCE((" +
            "      SELECT AVG(a.nota) " +
            "      FROM avaliacao a " +
            "      WHERE a.lavajato_id = l.id" +
            "    ), 0) as avaliacao_media, " +
            "    (6371 * acos(" +
            "      cos(radians(:latitude)) * " +
            "      cos(radians(CAST(split_part(l.lat_long, ',', 1) AS NUMERIC))) * " +
            "      cos(radians(CAST(split_part(l.lat_long, ',', 2) AS NUMERIC)) - radians(:longitude)) + " +
            "      sin(radians(:latitude)) * " +
            "      sin(radians(CAST(split_part(l.lat_long, ',', 1) AS NUMERIC)))" +
            "    )) AS distancia_calculada " +
            "  FROM lava_jato l " +
            "  WHERE l.lat_long IS NOT NULL " +
            "  AND l.lat_long != '' " +
            "  AND l.lat_long ~ '^-?[0-9]+\\.?[0-9]*,-?[0-9]+\\.?[0-9]*$' " +
            ") AS resultado " +
            "WHERE resultado.distancia_calculada <= :raioKm " +
            "AND (:avaliacaoMinima IS NULL OR :avaliacaoMinima = 0 OR resultado.avaliacao_media >= :avaliacaoMinima) " +
            "ORDER BY resultado.distancia_calculada",
            countQuery = "SELECT COUNT(*) FROM lava_jato l " +
                    "WHERE l.lat_long IS NOT NULL " +
                    "AND l.lat_long != '' " +
                    "AND l.lat_long ~ '^-?[0-9]+\\.?[0-9]*,-?[0-9]+\\.?[0-9]*$'",
            nativeQuery = true)
    Page<LavaJato> findWithFilters(@Param("latitude") Double latitude,
                                   @Param("longitude") Double longitude,
                                   @Param("raioKm") Double raioKm,
                                   @Param("avaliacaoMinima") Integer avaliacaoMinima,
                                   Pageable pageable);

    // Query simples para buscar com filtro de nome (nativa)
    @Query(value = "SELECT l.* FROM lava_jato l " +
            "WHERE (:nome IS NULL OR LOWER(l.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) " +
            "ORDER BY l.nome",
            nativeQuery = true)
    Page<LavaJato> findWithNameFilter(@Param("nome") String nome, Pageable pageable);

    // Query otimizada com CTE para avaliação
    @Query(value = "WITH avaliacao_stats AS (" +
            "  SELECT " +
            "    a.lavajato_id, " +
            "    AVG(a.nota) as media_nota, " +
            "    COUNT(a.id) as total_avaliacoes " +
            "  FROM avaliacao a " +
            "  GROUP BY a.lavajato_id" +
            ") " +
            "SELECT l.* " +
            "FROM lava_jato l " +
            "LEFT JOIN avaliacao_stats av ON l.id = av.lavajato_id " +
            "WHERE (:avaliacaoMinima IS NULL OR :avaliacaoMinima = 0 OR COALESCE(av.media_nota, 0) >= :avaliacaoMinima) " +
            "ORDER BY COALESCE(av.media_nota, 0) DESC, l.nome",
            countQuery = "WITH avaliacao_stats AS (" +
                    "  SELECT a.lavajato_id, AVG(a.nota) as media_nota " +
                    "  FROM avaliacao a GROUP BY a.lavajato_id" +
                    ") " +
                    "SELECT COUNT(*) FROM lava_jato l " +
                    "LEFT JOIN avaliacao_stats av ON l.id = av.lavajato_id " +
                    "WHERE (:avaliacaoMinima IS NULL OR :avaliacaoMinima = 0 OR COALESCE(av.media_nota, 0) >= :avaliacaoMinima)",
            nativeQuery = true)
    Page<LavaJato> findByAvaliacaoMinimaOptimized(@Param("avaliacaoMinima") Integer avaliacaoMinima, Pageable pageable);

    // Query ainda mais simples para teste
    @Query(value = "SELECT l.* FROM lava_jato l " +
            "WHERE l.lat_long IS NOT NULL " +
            "ORDER BY l.id " +
            "LIMIT 20",
            nativeQuery = true)
    List<LavaJato> findAllSimple();

    // Verificar se tabela avaliacao existe e tem dados
    @Query(value = "SELECT COUNT(*) FROM information_schema.tables " +
            "WHERE table_name = 'avaliacao'",
            nativeQuery = true)
    Integer checkAvaliacaoTableExists();

    // Backup: busca simples sem filtros complexos
    @Query(value = "SELECT l.* FROM lava_jato l ORDER BY l.nome",
            nativeQuery = true)
    Page<LavaJato> findAllSimplePaged(Pageable pageable);
}

package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.entities.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para a entidade Veiculo
 */
@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    /**
     * Busca veículos de um proprietário específico
     * @param proprietario proprietário para filtro
     * @return lista de veículos do proprietário
     */
    List<Veiculo> findByProprietario(Usuario proprietario);

    /**
     * Verifica se existe veículo com a mesma placa
     * @param placa placa do veículo
     * @return true se já existe, false caso contrário
     */
    boolean existsByPlaca(String placa);

    /**
     * Verifica se existe outro veículo com a mesma placa
     * @param placa placa do veículo
     * @param id ID do veículo a ser excluído da verificação
     * @return true se já existe outro, false caso contrário
     */
    boolean existsByPlacaAndIdNot(String placa, Long id);

    /**
     * Conta o número de agendamentos vinculados a um veículo
     * @param veiculoId ID do veículo
     * @return número de agendamentos
     */
    @Query("SELECT COUNT(a) FROM Agendamento a WHERE a.veiculo.id = :veiculoId")
    long countAgendamentosByVeiculoId(@Param("veiculoId") Long veiculoId);

    /**
     * Busca veículos por marca ou modelo (busca parcial case insensitive)
     * @param marca parte da marca para busca
     * @param modelo parte do modelo para busca
     * @return lista de veículos encontrados
     */
    List<Veiculo> findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(String marca, String modelo);

    /**
     * Busca veículos ativos de um proprietário
     * @param proprietario proprietário para filtro
     * @return lista de veículos ativos do proprietário
     */
    List<Veiculo> findByProprietarioAndAtivoTrue(Usuario proprietario);

    /**
     * Busca veículos por ano
     * @param ano ano do veículo
     * @return lista de veículos do ano especificado
     */
    List<Veiculo> findByAno(Integer ano);

    /**
     * Busca veículos por marca exata (case insensitive)
     * @param marca marca do veículo
     * @return lista de veículos da marca
     */
    List<Veiculo> findByMarcaIgnoreCase(String marca);

    /**
     * Busca por placa
     * @param placa placa do veículo
     * @return veículo encontrado ou null
     */
    Veiculo findByPlaca(String placa);
}
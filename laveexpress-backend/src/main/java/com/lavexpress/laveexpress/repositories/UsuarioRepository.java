package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para a entidade Usuario
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca usuário pelo email
     * @param email email do usuário
     * @return usuário encontrado ou empty
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Busca usuário pelo CPF
     * @param cpf CPF do usuário
     * @return usuário encontrado ou empty
     */
    Optional<Usuario> findByCpf(String cpf);

    /**
     * Verifica se existe usuário com o email informado
     * @param email email para verificação
     * @return true se já existe, false caso contrário
     */
    boolean existsByEmail(String email);

    /**
     * Verifica se existe usuário com o CPF informado
     * @param cpf CPF para verificação
     * @return true se já existe, false caso contrário
     */
    boolean existsByCpf(String cpf);

    /**
     * Busca usuários pelo nome (busca parcial case insensitive)
     * @param nome parte do nome para busca
     * @return lista de usuários encontrados
     */
    List<Usuario> findByNomeContainingIgnoreCase(String nome);

    /**
     * Conta o número de agendamentos de um usuário
     * @param usuarioId ID do usuário
     * @return número de agendamentos
     */
    @Query("SELECT COUNT(a) FROM Agendamento a WHERE a.usuario.id = :usuarioId")
    long countAgendamentosByUsuarioId(@Param("usuarioId") Long usuarioId);

    /**
     * Conta o número de veículos de um usuário
     * @param usuarioId ID do usuário
     * @return número de veículos
     */
    @Query("SELECT COUNT(v) FROM Veiculo v WHERE v.proprietario.id = :usuarioId")
    long countVeiculosByUsuarioId(@Param("usuarioId") Long usuarioId);

    /**
     * Busca usuário por email e senha para autenticação
     * @param email email do usuário
     * @param senha senha do usuário
     * @return usuário encontrado ou empty
     */
    Optional<Usuario> findByEmailAndSenha(String email, String senha);
}
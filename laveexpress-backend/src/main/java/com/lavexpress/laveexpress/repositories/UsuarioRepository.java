package com.lavexpress.laveexpress.repositories;

import com.lavexpress.laveexpress.bases.BaseRepository;
import com.lavexpress.laveexpress.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends BaseRepository<Usuario> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}

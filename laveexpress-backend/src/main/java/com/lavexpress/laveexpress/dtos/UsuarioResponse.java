package com.lavexpress.laveexpress.dtos;

import com.lavexpress.laveexpress.enums.TipoUsuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String cpf,
        String telefone,
        String photoPath,
        TipoUsuario tipoUsuario
) {
}

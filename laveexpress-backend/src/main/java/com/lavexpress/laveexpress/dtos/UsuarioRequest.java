package com.lavexpress.laveexpress.dtos;

import com.lavexpress.laveexpress.enums.TipoUsuario;

public record UsuarioRequest(
        String nome,
        String email,
        String senha,
        String cpf,
        String telefone,
        String photoPath,
        TipoUsuario tipoUsuario
) {}
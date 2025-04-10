package com.lavexpress.laveexpress.dtos;

import com.lavexpress.laveexpress.enums.TipoUsuario;

public record CadastroRequest(
        String nome,
        String email,
        String senha,
        String cpf,
        String telefone,
        TipoUsuario tipoUsuario,
        String photoPath
) {
}

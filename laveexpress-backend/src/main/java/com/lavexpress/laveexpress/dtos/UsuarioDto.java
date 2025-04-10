package com.lavexpress.laveexpress.dtos;

public record UsuarioDto(
        String nome,
        String email,
        String senha,
        String cpf,
        String telefone,
        String photoPath
) {}
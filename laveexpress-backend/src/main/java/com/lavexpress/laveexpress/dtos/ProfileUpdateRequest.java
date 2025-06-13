package com.lavexpress.laveexpress.dtos;

public record ProfileUpdateRequest(
        String nome,
        String email,
        String telefone
) {}
package com.lavexpress.laveexpress.dtos;

public record ServicoResponse(
        Long id,
        String descricao,
        String tipo,
        Double valor,
        Long lavaJatoId
) {}

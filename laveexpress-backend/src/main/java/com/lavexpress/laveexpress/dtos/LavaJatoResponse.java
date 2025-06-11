package com.lavexpress.laveexpress.dtos;

import java.util.List;

public record LavaJatoResponse(
        Long id,
        String nome,
        String endereco,
        String telefone,
        String email,
        String cnpj,
        String latLong,
        Long proprietarioId,
        List<ServicoResponse> servicos,
        String photoPath
) {}

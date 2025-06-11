package com.lavexpress.laveexpress.dtos;

import java.util.List;

public record LavaJatoRequest(
        String nome,
        String endereco,
        String telefone,
        String email,
        String cnpj,
        String latLong,
        Long proprietarioId,
        List<ServicoRequest> servicos,
        String photoPath

) {}

package com.lavexpress.laveexpress.dtos;

public record VeiculoResponse(
        Long id,
        String placa,
        String modelo,
        String ano,
        String marca,
        Long usuarioId
) {
}

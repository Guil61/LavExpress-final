package com.lavexpress.laveexpress.dtos;

public record VeiculoRequest(
        String placa,
        String modelo,
        String ano,
        String marca,
        String cor,
        Long usuarioId

) {
}

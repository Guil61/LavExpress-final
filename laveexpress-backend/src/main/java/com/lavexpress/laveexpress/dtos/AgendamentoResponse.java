package com.lavexpress.laveexpress.dtos;

import com.lavexpress.laveexpress.enums.StatusAgendamento;

import java.time.LocalDateTime;

public record AgendamentoResponse(
        Long id,
        StatusAgendamento statusAgendamento,
        LocalDateTime dataHorario,
        Long veiculoId,
        Long servicoId,
        Long usuarioId,
        Long lavaJatoId
) {
}

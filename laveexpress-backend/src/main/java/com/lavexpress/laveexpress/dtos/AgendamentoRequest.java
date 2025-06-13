package com.lavexpress.laveexpress.dtos;

import com.lavexpress.laveexpress.enums.StatusAgendamento;

import java.time.LocalDateTime;

public record AgendamentoRequest(
        StatusAgendamento statusAgendamento,
        LocalDateTime dataHorario,
        Long veiculoId,
        Long servicoId,
        Long usuarioId,
        Long lavaJatoId

) {
}

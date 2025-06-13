package com.lavexpress.laveexpress.enums;

public enum StatusAgendamento {

    AGENDADO("Agendamento confirmado"),
    SERVICO_EM_ANDAMENTO("Serviço em andamento"),
    FINALIZADO("Serviço finalizado"),
    CANCELADO("Agendamento cancelado");


    private final String descricao;

    StatusAgendamento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
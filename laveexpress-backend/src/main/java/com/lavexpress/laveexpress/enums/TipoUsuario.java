package com.lavexpress.laveexpress.enums;

public enum TipoUsuario {

    CLIENTE("Usuário cliente"),
    EMPRESAIRO("Usuário empresário, dono de lavajato");

    private final String descricao;

    TipoUsuario(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}

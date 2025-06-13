package com.lavexpress.laveexpress.dtos;

public record PasswordChangeRequest(
        String senhaAtual,
        String novaSenha
) {}
package com.lavexpress.laveexpress.dtos;

import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.enums.TipoUsuario;

public record AuthResponse(
        String token,
        Long id,
        String nome,
        String email,
        TipoUsuario tipoUsuario,
        String photoPath
) {
    public static AuthResponse fromUsuario(Usuario usuario, String token) {
        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoUsuario(),
                usuario.getPhotoPath()
        );
    }
}
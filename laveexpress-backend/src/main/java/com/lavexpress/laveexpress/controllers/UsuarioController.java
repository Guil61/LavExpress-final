package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;


    @PostMapping("/usuarios")
    public ResponseEntity<String> cadastrarUsuario(@RequestParam String nome,
                                                   @RequestParam String email,
                                                   @RequestParam String senha,
                                                   @RequestParam String cpf,
                                                   @RequestParam String telefone) {

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha(senha);
        usuario.setCpf(cpf);
        usuario.setTelefone(telefone);

        usuarioRepository.save(usuario);

        return ResponseEntity.status(201).body("Usuário cadastrado com sucesso!");
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email,
                                        @RequestParam String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getSenha().equals(senha)) {
                return ResponseEntity.ok("Login realizado com sucesso!");
            } else {
                return ResponseEntity.status(401).body("Senha incorreta.");
            }
        } else {
            return ResponseEntity.status(404).body("Usuário não encontrado.");
        }
    }
}

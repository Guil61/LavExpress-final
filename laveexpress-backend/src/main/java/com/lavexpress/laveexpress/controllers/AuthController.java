package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.LoginRequest;
import com.lavexpress.laveexpress.dtos.CadastroRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {

        if ("guilherme@email.com".equals(loginRequest.getEmail()) &&
                "123456".equals(loginRequest.getSenha())) {
            return ResponseEntity.ok("Login realizado com sucesso");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastro(@RequestBody CadastroRequest cadastroRequest) {

        return ResponseEntity.ok("Usuário cadastrado com sucesso");
    }
}

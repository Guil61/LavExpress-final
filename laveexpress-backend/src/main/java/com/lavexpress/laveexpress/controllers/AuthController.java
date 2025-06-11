package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.AuthResponse;
import com.lavexpress.laveexpress.dtos.CadastroRequest;
import com.lavexpress.laveexpress.dtos.LoginRequest;
import com.lavexpress.laveexpress.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody CadastroRequest cadastroRequest) {
        AuthResponse response = authService.register(cadastroRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verificar")
    public ResponseEntity<Boolean> verificarToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        boolean valido = authService.verificarToken(token);
        return ResponseEntity.ok(valido);
    }
}
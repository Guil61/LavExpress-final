package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.*;
import com.lavexpress.laveexpress.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(@RequestBody ProfileUpdateRequest profileUpdateRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthResponse response = authService.updateProfile(profileUpdateRequest, email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        authService.changePassword(passwordChangeRequest, email);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile/photo")
    public ResponseEntity<AuthResponse> updateProfilePhoto(@RequestBody PhotoUploadRequest photoUploadRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthResponse response = authService.updateProfilePhoto(photoUploadRequest, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/profile/photo")
    public ResponseEntity<AuthResponse> removeProfilePhoto() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthResponse response = authService.removeProfilePhoto(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthResponse response = authService.getCurrentUser(email);
        return ResponseEntity.ok(response);
    }
}
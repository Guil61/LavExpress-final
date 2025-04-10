package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.dtos.AuthResponse;
import com.lavexpress.laveexpress.dtos.CadastroRequest;
import com.lavexpress.laveexpress.dtos.LoginRequest;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.mappers.UsuarioMapper;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(UsuarioRepository usuarioRepository,
                       UsuarioMapper mapper,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       @Lazy AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    public AuthResponse authenticate(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.senha()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtService.generateToken(loginRequest.email());

        Usuario usuario = (Usuario) authentication.getPrincipal();
        return AuthResponse.fromUsuario(usuario, token);
    }

    public AuthResponse register(CadastroRequest cadastroRequest) {
        if (usuarioRepository.existsByEmail(cadastroRequest.email())) {
            throw new RuntimeException("Email já está em uso");
        }

        if (usuarioRepository.existsByCpf(cadastroRequest.cpf())) {
            throw new RuntimeException("CPF já está em uso");
        }

        Usuario usuario = mapper.cadastroRequestToUsuario(cadastroRequest);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario.getEmail());
        return AuthResponse.fromUsuario(usuario, token);
    }

    public boolean verificarToken(String token) {
        return jwtService.validateToken(token);
    }
}
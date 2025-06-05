package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.dtos.AuthResponse;
import com.lavexpress.laveexpress.dtos.CadastroRequest;
import com.lavexpress.laveexpress.dtos.LoginRequest;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.mappers.UsuarioMapper;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

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
        log.debug("Carregando usuário por email: {}", email);
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Usuário não encontrado: {}", email);
                    return new UsernameNotFoundException("Usuário não encontrado: " + email);
                });
    }

    public AuthResponse authenticate(LoginRequest loginRequest) {
        log.info("Iniciando autenticação para email: {}", loginRequest.email());

        try {
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.email())
                    .orElseThrow(() -> {
                        log.warn("Tentativa de login com email inexistente: {}", loginRequest.email());
                        return new UsernameNotFoundException("Usuário não encontrado");
                    });

            log.debug("Usuário encontrado: {}", usuario.getEmail());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.senha()
                    )
            );

            log.info("Autenticação bem-sucedida para: {}", loginRequest.email());

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtService.generateToken(loginRequest.email());

            Usuario usuarioAutenticado = (Usuario) authentication.getPrincipal();
            AuthResponse response = AuthResponse.fromUsuario(usuarioAutenticado, token);

            log.debug("Token JWT gerado com sucesso para: {}", loginRequest.email());
            return response;

        } catch (UsernameNotFoundException e) {
            log.warn("Falha na autenticação - usuário não encontrado: {}", loginRequest.email());
            throw new RuntimeException("Email ou senha incorretos");
        } catch (Exception e) {
            log.error("Erro inesperado na autenticação para {}: {} - {}",
                    loginRequest.email(), e.getClass().getSimpleName(), e.getMessage(), e);
            throw new RuntimeException("Email ou senha incorretos");
        }
    }

    public AuthResponse register(CadastroRequest cadastroRequest) {
        log.info("Iniciando cadastro para email: {}", cadastroRequest.email());

        if (usuarioRepository.existsByEmail(cadastroRequest.email())) {
            log.warn("Tentativa de cadastro com email já existente: {}", cadastroRequest.email());
            throw new RuntimeException("Email já está em uso");
        }

        if (usuarioRepository.existsByCpf(cadastroRequest.cpf())) {
            log.warn("Tentativa de cadastro com CPF já existente: {}", cadastroRequest.cpf());
            throw new RuntimeException("CPF já está em uso");
        }

        Usuario usuario = mapper.cadastroRequestToUsuario(cadastroRequest);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario.getEmail());

        log.info("Cadastro realizado com sucesso para: {}", usuario.getEmail());
        return AuthResponse.fromUsuario(usuario, token);
    }

    public boolean verificarToken(String token) {
        log.debug("Verificando validade do token JWT");
        return jwtService.validateToken(token);
    }
}
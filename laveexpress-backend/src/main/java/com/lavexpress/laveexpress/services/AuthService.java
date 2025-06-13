package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.dtos.*;
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

import java.util.Arrays;
import java.util.Base64;
import java.util.List;

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

        if (cadastroRequest.photoPath() != null && !cadastroRequest.photoPath().isEmpty()) {
            log.debug("Validando foto de perfil fornecida no cadastro");
            if (!isValidBase64Image(cadastroRequest.photoPath())) {
                log.warn("Formato de imagem inválido fornecido no cadastro para: {}", cadastroRequest.email());
                throw new RuntimeException("Formato de imagem inválido");
            }
            log.debug("Foto de perfil validada com sucesso");
        }

        Usuario usuario = mapper.cadastroRequestToUsuario(cadastroRequest);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        if (cadastroRequest.photoPath() != null && !cadastroRequest.photoPath().isEmpty()) {
            usuario.setPhotoPath(cadastroRequest.photoPath());
            log.debug("Foto de perfil definida para o usuário: {}", cadastroRequest.email());
        }

        usuario = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario.getEmail());

        log.info("Cadastro realizado com sucesso para: {}", usuario.getEmail());
        return AuthResponse.fromUsuario(usuario, token);
    }

    public boolean verificarToken(String token) {
        log.debug("Verificando validade do token JWT");
        return jwtService.validateToken(token);
    }


    private boolean isValidBase64Image(String base64String) {
        if (base64String == null || base64String.trim().isEmpty()) {
            log.debug("String base64 é nula ou vazia");
            return false;
        }

        if (!base64String.startsWith("data:image/")) {
            log.debug("String base64 não começa com data:image/");
            return false;
        }

        try {
            String[] parts = base64String.split(",");
            if (parts.length != 2) {
                log.debug("Formato base64 inválido - não contém exatamente 2 partes");
                return false;
            }

            String header = parts[0];
            String base64Data = parts[1];

            List<String> tiposPermitidos = Arrays.asList(
                    "data:image/jpeg;base64",
                    "data:image/jpg;base64",
                    "data:image/png;base64"
            );

            if (!tiposPermitidos.contains(header.toLowerCase())) {
                log.debug("Tipo de imagem não permitido: {}", header);
                return false;
            }

            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

            if (decodedBytes.length > 5 * 1024 * 1024) {
                log.warn("Imagem muito grande: {} bytes (máximo: 5MB)", decodedBytes.length);
                throw new RuntimeException("Arquivo muito grande! Tamanho máximo permitido: 5MB");
            }

            log.debug("Imagem base64 validada com sucesso - tamanho: {} bytes", decodedBytes.length);
            return true;

        } catch (IllegalArgumentException e) {
            log.debug("Erro ao decodificar base64: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Erro inesperado ao validar imagem base64: {}", e.getMessage());
            return false;
        }
    }


    public boolean isBase64Image(String referenciaFoto) {
        return referenciaFoto != null && referenciaFoto.startsWith("data:image/");
    }
    public AuthResponse updateProfile(ProfileUpdateRequest request, String email) {
        log.info("Atualizando perfil para email: {}", email);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Usuário não encontrado para atualização: {}", email);
                    return new RuntimeException("Usuário não encontrado");
                });

        if (!request.email().equals(usuario.getEmail()) &&
                usuarioRepository.existsByEmail(request.email())) {
            log.warn("Tentativa de alterar para email já em uso: {}", request.email());
            throw new RuntimeException("Email já está em uso");
        }

        if (request.nome() != null && !request.nome().trim().isEmpty()) {
            usuario.setNome(request.nome().trim());
        }

        if (request.email() != null && !request.email().trim().isEmpty()) {
            usuario.setEmail(request.email().trim());
        }

        if (request.telefone() != null) {
            usuario.setTelefone(request.telefone().trim());
        }

        usuario = usuarioRepository.save(usuario);

        String newToken = jwtService.generateToken(usuario.getEmail());

        log.info("Perfil atualizado com sucesso para: {}", usuario.getEmail());
        return AuthResponse.fromUsuario(usuario, newToken);
    }


    public void changePassword(PasswordChangeRequest request, String email) {
        log.info("Alterando senha para email: {}", email);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Usuário não encontrado para alteração de senha: {}", email);
                    return new RuntimeException("Usuário não encontrado");
                });

        if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenha())) {
            log.warn("Senha atual incorreta para: {}", email);
            throw new RuntimeException("Senha atual incorreta");
        }

        if (request.novaSenha() == null || request.novaSenha().length() < 6) {
            log.warn("Nova senha inválida para: {}", email);
            throw new RuntimeException("A nova senha deve ter pelo menos 6 caracteres");
        }

        usuario.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);

        log.info("Senha alterada com sucesso para: {}", email);
    }


    public AuthResponse updateProfilePhoto(PhotoUploadRequest request, String email) {
        log.info("Atualizando foto de perfil para email: {}", email);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Usuário não encontrado para atualização de foto: {}", email);
                    return new RuntimeException("Usuário não encontrado");
                });

        if (request.photoPath() != null && !request.photoPath().trim().isEmpty()) {
            if (!isValidBase64Image(request.photoPath())) {
                log.warn("Formato de imagem inválido para: {}", email);
                throw new RuntimeException("Formato de imagem inválido");
            }
            usuario.setPhotoPath(request.photoPath());
            log.debug("Foto de perfil atualizada para: {}", email);
        } else {
            log.warn("Dados de imagem não fornecidos para: {}", email);
            throw new RuntimeException("Dados da imagem são obrigatórios");
        }

        usuario = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario.getEmail());

        log.info("Foto de perfil atualizada com sucesso para: {}", email);
        return AuthResponse.fromUsuario(usuario, token);
    }


    public AuthResponse removeProfilePhoto(String email) {
        log.info("Removendo foto de perfil para email: {}", email);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Usuário não encontrado para remoção de foto: {}", email);
                    return new RuntimeException("Usuário não encontrado");
                });

        usuario.setPhotoPath(null);
        usuario = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario.getEmail());

        log.info("Foto de perfil removida com sucesso para: {}", email);
        return AuthResponse.fromUsuario(usuario, token);
    }


    public AuthResponse getCurrentUser(String email) {
        log.debug("Buscando dados atuais do usuário: {}", email);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Usuário não encontrado: {}", email);
                    return new RuntimeException("Usuário não encontrado");
                });

        String token = jwtService.generateToken(usuario.getEmail());
        return AuthResponse.fromUsuario(usuario, token);
    }

}
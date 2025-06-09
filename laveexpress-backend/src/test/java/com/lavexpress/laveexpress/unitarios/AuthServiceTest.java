package com.lavexpress.laveexpress.unitarios;

import com.lavexpress.laveexpress.dtos.AuthResponse;
import com.lavexpress.laveexpress.dtos.CadastroRequest;
import com.lavexpress.laveexpress.dtos.LoginRequest;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.mappers.UsuarioMapper;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import com.lavexpress.laveexpress.services.AuthService;
import com.lavexpress.laveexpress.services.JwtService;
import com.lavexpress.laveexpress.enums.TipoUsuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("AuthService")
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioMapper usuarioMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private Authentication authentication;

    private Usuario usuario;
    private LoginRequest loginRequest;
    private CadastroRequest cadastroRequest;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("João Silva");
        usuario.setEmail("joao@test.com");
        usuario.setSenha("senha123");
        usuario.setCpf("12345678901");

        loginRequest = new LoginRequest("joao@test.com", "senha123");

        cadastroRequest = new CadastroRequest(
                "João Silva",
                "joao@test.com",
                "senha123",
                "12345678901",
                "11987654321",
                TipoUsuario.CLIENTE,
                null
        );

        authResponse = AuthResponse.fromUsuario(usuario, "jwt-token");
    }

    // ========== TESTES DO loadUserByUsername ==========

    @Test
    @DisplayName("Deve carregar usuário por email com sucesso")
    public void loadUserByUsernameSucesso() {
        when(usuarioRepository.findByEmail("joao@test.com"))
                .thenReturn(Optional.of(usuario));

        var result = authService.loadUserByUsername("joao@test.com");

        assertNotNull(result);
        assertEquals(usuario, result);
        verify(usuarioRepository).findByEmail("joao@test.com");
    }

    @Test
    @DisplayName("Deve lançar exceção quando usuário não for encontrado")
    public void loadUserByUsernameNaoEncontrado() {
        when(usuarioRepository.findByEmail("inexistente@test.com"))
                .thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, () -> {
            authService.loadUserByUsername("inexistente@test.com");
        });

        assertEquals("Usuário não encontrado: inexistente@test.com", exception.getMessage());
        verify(usuarioRepository).findByEmail("inexistente@test.com");
    }

    // ========== TESTES DO authenticate ==========

    @Test
    @DisplayName("Deve autenticar usuário com sucesso")
    public void authenticateSucesso() {
        when(usuarioRepository.findByEmail("joao@test.com"))
                .thenReturn(Optional.of(usuario));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal())
                .thenReturn(usuario);
        when(jwtService.generateToken("joao@test.com"))
                .thenReturn("jwt-token");

        var result = authService.authenticate(loginRequest);

        assertNotNull(result);
        assertEquals("jwt-token", result.token());
        verify(usuarioRepository).findByEmail("joao@test.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService).generateToken("joao@test.com");
    }

    @Test
    @DisplayName("Deve lançar exceção quando email não existir na autenticação")
    public void authenticateEmailNaoExiste() {
        when(usuarioRepository.findByEmail("inexistente@test.com"))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.authenticate(new LoginRequest("inexistente@test.com", "senha123"));
        });

        assertEquals("Email ou senha incorretos", exception.getMessage());
        verify(usuarioRepository).findByEmail("inexistente@test.com");
        verify(authenticationManager, never()).authenticate(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando autenticação falhar")
    public void authenticateFalhaAutenticacao() {
        when(usuarioRepository.findByEmail("joao@test.com"))
                .thenReturn(Optional.of(usuario));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Credenciais inválidas"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.authenticate(loginRequest);
        });

        assertEquals("Email ou senha incorretos", exception.getMessage());
        verify(usuarioRepository).findByEmail("joao@test.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    // ========== TESTES DO register ==========

    @Test
    @DisplayName("Deve registrar usuário com sucesso")
    public void registerSucesso() {
        when(usuarioRepository.existsByEmail("joao@test.com")).thenReturn(false);
        when(usuarioRepository.existsByCpf("12345678901")).thenReturn(false);
        when(usuarioMapper.cadastroRequestToUsuario(cadastroRequest)).thenReturn(usuario);
        when(passwordEncoder.encode("senha123")).thenReturn("senha-encoded");
        when(usuarioRepository.save(usuario)).thenReturn(usuario);
        when(jwtService.generateToken("joao@test.com")).thenReturn("jwt-token");

        var result = authService.register(cadastroRequest);

        assertNotNull(result);
        assertEquals("jwt-token", result.token());
        verify(usuarioRepository).existsByEmail("joao@test.com");
        verify(usuarioRepository).existsByCpf("12345678901");
        verify(usuarioMapper).cadastroRequestToUsuario(cadastroRequest);
        verify(passwordEncoder).encode("senha123");
        verify(usuarioRepository).save(usuario);
        verify(jwtService).generateToken("joao@test.com");
    }

    @Test
    @DisplayName("Deve lançar exceção quando email já existir no registro")
    public void registerEmailJaExiste() {
        when(usuarioRepository.existsByEmail("joao@test.com")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(cadastroRequest);
        });

        assertEquals("Email já está em uso", exception.getMessage());
        verify(usuarioRepository).existsByEmail("joao@test.com");
        verify(usuarioRepository, never()).existsByCpf(anyString());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando CPF já existir no registro")
    public void registerCpfJaExiste() {
        when(usuarioRepository.existsByEmail("joao@test.com")).thenReturn(false);
        when(usuarioRepository.existsByCpf("12345678901")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(cadastroRequest);
        });

        assertEquals("CPF já está em uso", exception.getMessage());
        verify(usuarioRepository).existsByEmail("joao@test.com");
        verify(usuarioRepository).existsByCpf("12345678901");
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve registrar usuário com foto base64 válida")
    public void registerComFotoValida() {
        String fotoBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

        CadastroRequest cadastroComFoto = new CadastroRequest(
                "João Silva",
                "joao@test.com",
                "senha123",
                "12345678901",
                "11987654321",
                TipoUsuario.CLIENTE,
                fotoBase64
        );

        when(usuarioRepository.existsByEmail("joao@test.com")).thenReturn(false);
        when(usuarioRepository.existsByCpf("12345678901")).thenReturn(false);
        when(usuarioMapper.cadastroRequestToUsuario(cadastroComFoto)).thenReturn(usuario);
        when(passwordEncoder.encode("senha123")).thenReturn("senha-encoded");
        when(usuarioRepository.save(usuario)).thenReturn(usuario);
        when(jwtService.generateToken("joao@test.com")).thenReturn("jwt-token");

        var result = authService.register(cadastroComFoto);

        assertNotNull(result);
        assertEquals("jwt-token", result.token());
        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve lançar exceção para foto base64 inválida")
    public void registerComFotoInvalida() {
        String fotoInvalida = "data:image/gif;base64,invalid";

        CadastroRequest cadastroComFotoInvalida = new CadastroRequest(
                "João Silva",
                "joao@test.com",
                "senha123",
                "12345678901",
                "11987654321",
                TipoUsuario.CLIENTE,
                fotoInvalida
        );

        when(usuarioRepository.existsByEmail("joao@test.com")).thenReturn(false);
        when(usuarioRepository.existsByCpf("12345678901")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(cadastroComFotoInvalida);
        });

        assertEquals("Formato de imagem inválido", exception.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    // ========== TESTES DO verificarToken ==========

    @Test
    @DisplayName("Deve verificar token válido")
    public void verificarTokenValido() {
        when(jwtService.validateToken("token-valido")).thenReturn(true);

        boolean result = authService.verificarToken("token-valido");

        assertTrue(result);
        verify(jwtService).validateToken("token-valido");
    }

    @Test
    @DisplayName("Deve verificar token inválido")
    public void verificarTokenInvalido() {
        when(jwtService.validateToken("token-invalido")).thenReturn(false);

        boolean result = authService.verificarToken("token-invalido");

        assertFalse(result);
        verify(jwtService).validateToken("token-invalido");
    }

    // ========== TESTES DO isBase64Image ==========

    @Test
    @DisplayName("Deve identificar string base64 como imagem")
    public void isBase64ImageTrue() {
        String base64Image = "data:image/jpeg;base64,abc123";

        boolean result = authService.isBase64Image(base64Image);

        assertTrue(result);
    }

    @Test
    @DisplayName("Deve identificar string não base64 como não imagem")
    public void isBase64ImageFalse() {
        assertFalse(authService.isBase64Image(null));
        assertFalse(authService.isBase64Image(""));
        assertFalse(authService.isBase64Image("http://example.com/image.jpg"));
        assertFalse(authService.isBase64Image("plain text"));
    }

    // ==========   ==========

    @Test
    @DisplayName("Deve lidar com foto vazia no cadastro")
    public void registerComFotoVazia() {
        CadastroRequest cadastroFotoVazia = new CadastroRequest(
                "João Silva",
                "joao@test.com",
                "senha123",
                "12345678901",
                "11987654321",
                TipoUsuario.CLIENTE,
                ""
        );

        when(usuarioRepository.existsByEmail("joao@test.com")).thenReturn(false);
        when(usuarioRepository.existsByCpf("12345678901")).thenReturn(false);
        when(usuarioMapper.cadastroRequestToUsuario(cadastroFotoVazia)).thenReturn(usuario);
        when(passwordEncoder.encode("senha123")).thenReturn("senha-encoded");
        when(usuarioRepository.save(usuario)).thenReturn(usuario);
        when(jwtService.generateToken("joao@test.com")).thenReturn("jwt-token");

        var result = authService.register(cadastroFotoVazia);

        assertNotNull(result);
        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve lidar com foto null no cadastro")
    public void registerComFotoNull() {
        CadastroRequest cadastroFotoNull = new CadastroRequest(
                "João Silva",
                "joao@test.com",
                "senha123",
                "12345678901",
                "11987654321",
                TipoUsuario.CLIENTE,
                null
        );

        when(usuarioRepository.existsByEmail("joao@test.com")).thenReturn(false);
        when(usuarioRepository.existsByCpf("12345678901")).thenReturn(false);
        when(usuarioMapper.cadastroRequestToUsuario(cadastroFotoNull)).thenReturn(usuario);
        when(passwordEncoder.encode("senha123")).thenReturn("senha-encoded");
        when(usuarioRepository.save(usuario)).thenReturn(usuario);
        when(jwtService.generateToken("joao@test.com")).thenReturn("jwt-token");

        var result = authService.register(cadastroFotoNull);

        assertNotNull(result);
        verify(usuarioRepository).save(usuario);
    }
}
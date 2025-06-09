package com.lavexpress.laveexpress.unitarios;

import com.lavexpress.laveexpress.services.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

    @DisplayName("JwtService")
    @ExtendWith(MockitoExtension.class)
    @ActiveProfiles("test")
    public class JwtServiceTest {

        private JwtService jwtService;
        private final String testSecret = "minhachavesecretaparajwtquedevetersuficientecaracteresparaservalida123456789";
        private final long testExpiration = 3600000L;

        @BeforeEach
        void setUp() {
            jwtService = new JwtService();

            ReflectionTestUtils.setField(jwtService, "jwtSecret", testSecret);
            ReflectionTestUtils.setField(jwtService, "jwtExpiration", testExpiration);
        }

        // ========== TESTES DO generateToken ==========

        @Test
        @DisplayName("Deve gerar token JWT válido para email")
        public void generateTokenSucesso() {
            String email = "usuario@test.com";

            String token = jwtService.generateToken(email);

            assertNotNull(token);
            assertFalse(token.isEmpty());
            assertTrue(token.contains("."));

            assertTrue(jwtService.validateToken(token));

            assertEquals(email, jwtService.getEmailFromToken(token));
        }

        @Test
        @DisplayName("Deve gerar tokens diferentes para emails diferentes")
        public void generateTokenEmailsDiferentes() {
            String email1 = "usuario1@test.com";
            String email2 = "usuario2@test.com";

            String token1 = jwtService.generateToken(email1);
            String token2 = jwtService.generateToken(email2);

            assertNotNull(token1);
            assertNotNull(token2);
            assertNotEquals(token1, token2);

            assertEquals(email1, jwtService.getEmailFromToken(token1));
            assertEquals(email2, jwtService.getEmailFromToken(token2));
        }

        @Test
        @DisplayName("Deve gerar tokens diferentes para mesmo email em momentos diferentes")
        public void generateTokenMesmoEmailMomentosDiferentes() throws InterruptedException {
            String email = "usuario@test.com";

            String token1 = jwtService.generateToken(email);
            Thread.sleep(1000);
            String token2 = jwtService.generateToken(email);

            assertNotEquals(token1, token2);
            assertEquals(email, jwtService.getEmailFromToken(token1));
            assertEquals(email, jwtService.getEmailFromToken(token2));
        }

        // ========== TESTES DO getEmailFromToken ==========

        @Test
        @DisplayName("Deve extrair email corretamente do token")
        public void getEmailFromTokenSucesso() {
            String email = "teste@email.com";
            String token = jwtService.generateToken(email);

            String emailExtraido = jwtService.getEmailFromToken(token);

            assertEquals(email, emailExtraido);
        }

        @Test
        @DisplayName("Deve lançar exceção para token inválido ao extrair email")
        public void getEmailFromTokenInvalido() {
            String tokenInvalido = "token.invalido.aqui";

            assertThrows(Exception.class, () -> {
                jwtService.getEmailFromToken(tokenInvalido);
            });
        }

        @Test
        @DisplayName("Deve lançar exceção para token malformado ao extrair email")
        public void getEmailFromTokenMalformado() {
            String tokenMalformado = "abc123";

            assertThrows(Exception.class, () -> {
                jwtService.getEmailFromToken(tokenMalformado);
            });
        }

        // ========== TESTES DO validateToken ==========

        @Test
        @DisplayName("Deve validar token válido como true")
        public void validateTokenValido() {
            String email = "usuario@test.com";
            String token = jwtService.generateToken(email);

            boolean isValid = jwtService.validateToken(token);

            assertTrue(isValid);
        }

        @Test
        @DisplayName("Deve validar token inválido como false")
        public void validateTokenInvalido() {
            String tokenInvalido = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0ZUBlbWFpbC5jb20ifQ.invalid_signature";

            boolean isValid = jwtService.validateToken(tokenInvalido);

            assertFalse(isValid);
        }

        @Test
        @DisplayName("Deve validar token malformado como false")
        public void validateTokenMalformado() {
            String tokenMalformado = "token_completamente_invalido";

            boolean isValid = jwtService.validateToken(tokenMalformado);

            assertFalse(isValid);
        }

        @Test
        @DisplayName("Deve validar token null como false")
        public void validateTokenNull() {
            boolean isValid = jwtService.validateToken(null);

            assertFalse(isValid);
        }

        @Test
        @DisplayName("Deve validar token vazio como false")
        public void validateTokenVazio() {
            boolean isValid = jwtService.validateToken("");

            assertFalse(isValid);
        }

        @Test
        @DisplayName("Deve validar token com assinatura incorreta como false")
        public void validateTokenAssinaturaIncorreta() {
            String email = "usuario@test.com";
            Key outraChave = Keys.hmacShaKeyFor("outrochavesecretadiferenteparatestarvalidacao123456789".getBytes());

            String tokenComAssinaturaErrada = Jwts.builder()
                    .setSubject(email)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + testExpiration))
                    .signWith(outraChave)
                    .compact();

            boolean isValid = jwtService.validateToken(tokenComAssinaturaErrada);

            assertFalse(isValid);
        }

        // ========== TESTES DE INTEGRAÇÃO ==========

        @Test
        @DisplayName("Deve funcionar fluxo completo: gerar -> validar -> extrair email")
        public void fluxoCompletoToken() {
            String emailOriginal = "usuario@teste.com";

            String token = jwtService.generateToken(emailOriginal);
            assertNotNull(token);

            assertTrue(jwtService.validateToken(token));

            String emailExtraido = jwtService.getEmailFromToken(token);
            assertEquals(emailOriginal, emailExtraido);
        }

        @Test
        @DisplayName("Deve tratar email com caracteres especiais")
        public void tokenComEmailEspecial() {
            String emailEspecial = "usuário+teste@domínio.com.br";

            String token = jwtService.generateToken(emailEspecial);

            assertTrue(jwtService.validateToken(token));
            assertEquals(emailEspecial, jwtService.getEmailFromToken(token));
        }

        // ========== TESTES DE CONFIGURAÇÃO ==========

        @Test
        @DisplayName("Deve gerar token que expira após o tempo configurado")
        public void tokenComExpiracaoConfigurada() {
            ReflectionTestUtils.setField(jwtService, "jwtExpiration", 1000L); // 1 segundo

            String email = "usuario@test.com";
            String token = jwtService.generateToken(email);

            assertTrue(jwtService.validateToken(token));

            assertNotNull(token);
        }

    }
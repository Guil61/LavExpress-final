package com.lavexpress.laveexpress.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuração de segurança da aplicação
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos que não requerem autenticação
                        .requestMatchers(
                                "/api/usuarios/**",
                                "/api/auth/**",
                                "/api/login",
                                "/api/lavajatos/**",
                                "/api/servicos/**",
                                "/api/agendamentos/verificar-disponibilidade",
                                "/api/uploads/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        // Todos os outros endpoints requerem autenticação
                        .anyRequest().authenticated()
                )
                // Desabilitar autenticação básica HTTP
                .httpBasic(AbstractHttpConfigurer::disable)
                // Desabilitar formulário de login
                .formLogin(AbstractHttpConfigurer::disable)
                // Configurar para ser stateless (sem sessão)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Habilitar configuração CORS
                .cors(cors -> {});

        return http.build();
    }
}
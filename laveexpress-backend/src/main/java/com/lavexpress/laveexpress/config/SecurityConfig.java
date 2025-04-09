package com.lavexpress.laveexpress.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/usuarios", "/api/auth/login", "/api/auth/cadastro").permitAll() // Permitir acesso sem autenticação
                                .anyRequest().authenticated()
                )
                .httpBasic().disable()
                .formLogin().disable()
                .cors();

        return http.build();
    }
}

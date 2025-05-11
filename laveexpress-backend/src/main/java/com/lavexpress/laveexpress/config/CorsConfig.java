package com.lavexpress.laveexpress.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração de CORS para permitir requisições do frontend
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Permitir origens - adicionar URL de produção quando necessário
                .allowedOrigins("http://localhost:5175", "http://localhost:3000")
                // Permitir todos os métodos HTTP necessários
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                // Permitir todos os headers
                .allowedHeaders("*")
                // Permitir envio de credenciais (cookies, autenticação)
                .allowCredentials(true)
                // Duração de cache para requisições preflight (1 hora)
                .maxAge(3600);
    }
}
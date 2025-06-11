package com.lavexpress.laveexpress.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Permite qualquer origem
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH") // Todos os métodos
                .allowedHeaders("*") // Todos os headers
                .allowCredentials(true) // Permite cookies/credentials
                .maxAge(3600); // Cache preflight por 1 hora
    }
}
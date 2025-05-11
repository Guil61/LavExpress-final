package com.lavexpress.laveexpress;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Classe principal de inicialização da aplicação Spring Boot LavExpress
 */
@SpringBootApplication
public class LavexpressApplication {

	/**
	 * Método principal para iniciar a aplicação
	 * @param args argumentos de linha de comando
	 */
	public static void main(String[] args) {
		SpringApplication.run(LavexpressApplication.class, args);
	}

	/**
	 * Configuração para recursos da web, incluindo CORS e manipuladores de recursos
	 * @return configurador WebMvc
	 */
	@Bean
	public WebMvcConfigurer webMvcConfigurer() {
		return new WebMvcConfigurer() {
			/**
			 * Configura diretórios de upload e recursos estáticos
			 * @param registry registro de manipuladores de recursos
			 */
			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
				// Mapear diretórios de upload para URLs
				registry.addResourceHandler("/api/uploads/**")
						.addResourceLocations("file:uploads/");

				// Adicionar manipuladores de recursos estáticos padrão
				registry.addResourceHandler("/**")
						.addResourceLocations("classpath:/static/");
			}

			/**
			 * Configura CORS para permitir requisições de origens diferentes
			 * @param registry registro de mapeamentos CORS
			 */
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
		};
	}
}
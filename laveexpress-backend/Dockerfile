# Etapa de build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar arquivos de dependência primeiro para cache de layers
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fonte e fazer build
COPY src ./src
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Etapa de runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Instalar curl para health checks
RUN apk add --no-cache curl

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copiar o JAR da etapa de build
COPY --from=build /app/target/lavexpress-0.0.1-SNAPSHOT.jar app.jar

# Dar permissões ao usuário
RUN chown appuser:appgroup app.jar

# Mudar para usuário não-root
USER appuser

# Configurar variáveis de ambiente padrão
ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Expor a porta
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

# Comando para executar a aplicação
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar -Dserver.port=${PORT} app.jar"]
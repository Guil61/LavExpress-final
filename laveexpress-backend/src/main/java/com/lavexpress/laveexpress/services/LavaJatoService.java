package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.bases.BaseService;
import com.lavexpress.laveexpress.dtos.LavaJatoFilter;
import com.lavexpress.laveexpress.dtos.LavaJatoRequest;
import com.lavexpress.laveexpress.dtos.LavaJatoResponse;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.mappers.LavaJatoMapper;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LavaJatoService extends BaseService<LavaJato> {

    private static final Logger log = LoggerFactory.getLogger(LavaJatoService.class);

    private final LavaJatoRepository lavaJatoRepository;
    private final LavaJatoMapper lavaJatoMapper;

    public LavaJatoService(LavaJatoRepository lavaJatoRepository, LavaJatoMapper lavaJatoMapper) {
        this.lavaJatoRepository = lavaJatoRepository;
        this.lavaJatoMapper = lavaJatoMapper;
    }

    @Override
    public JpaRepository<LavaJato, Long> getRepository() {
        return lavaJatoRepository;
    }

    public LavaJatoResponse create(LavaJatoRequest lavaJatoRequest) {

        if (lavaJatoRequest.photoPath() != null && !lavaJatoRequest.photoPath().isEmpty()) {
            log.debug("Validando foto fornecida para o lava-jato");
            if (!isValidBase64Image(lavaJatoRequest.photoPath())) {
                log.warn("Formato de imagem inválido fornecido para: {}", lavaJatoRequest.nome());
                throw new RuntimeException("Formato de imagem inválido");
            }
            log.debug("Foto validada com sucesso");
        }

        var entity = lavaJatoMapper.requestToEntity(lavaJatoRequest);
        getRepository().save(entity);

        return lavaJatoMapper.entityToResponse(entity);
    }

    public LavaJatoResponse update(LavaJatoRequest request, Long id) {
        log.info("Iniciando atualização de lava-jato ID: {}", id);

        var entity = lavaJatoRepository.findById(id)
                .map(lavaJato -> {
                    if (request.nome() != null)
                        lavaJato.setNome(request.nome());

                    if (request.endereco() != null)
                        lavaJato.setEndereco(request.endereco());

                    if (request.telefone() != null)
                        lavaJato.setTelefone(request.telefone());

                    if (request.email() != null)
                        lavaJato.setEmail(request.email());

                    if (request.cnpj() != null)
                        lavaJato.setCnpj(request.cnpj());

                    if (request.latLong() != null)
                        lavaJato.setLatLong(request.latLong());

                    // Validar e atualizar foto se fornecida
                    if (request.photoPath() != null) {
                        if (!request.photoPath().isEmpty()) {
                            log.debug("Validando nova foto para lava-jato ID: {}", id);
                            if (!isValidBase64Image(request.photoPath())) {
                                log.warn("Formato de imagem inválido fornecido para atualização do lava-jato ID: {}", id);
                                throw new RuntimeException("Formato de imagem inválido");
                            }
                            log.debug("Nova foto validada com sucesso");
                        }
                        lavaJato.setPhotoPath(request.photoPath());
                    }

                    return lavaJatoRepository.save(lavaJato);
                })
                .orElseThrow(() -> {
                    log.error("Lava-jato não encontrado para atualização. ID: {}", id);
                    return new RuntimeException("Não foi possível encontrar o lava-jato");
                });

        log.info("Lava-jato atualizado com sucesso: {} (ID: {})", entity.getNome(), entity.getId());
        return lavaJatoMapper.entityToResponse(entity);
    }

    public LavaJatoResponse findByIdResponse(Long id) {
        return lavaJatoMapper.entityToResponse(lavaJatoRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("lavajato nao encontrado")));
    }

    // LISTAGEM E FILTROS

    public Page<LavaJatoResponse> findAll(int page, int size, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.ASC, sortBy != null ? sortBy : "nome");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<LavaJato> lavaJatos = lavaJatoRepository.findAll(pageable);
        return lavaJatos.map(lavaJatoMapper::entityToResponse);
    }

    public Page<LavaJatoResponse> findByNome(String nome, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LavaJato> lavaJatos = lavaJatoRepository.findByNomeContainingIgnoreCase(nome, pageable);
        return lavaJatos.map(lavaJatoMapper::entityToResponse);
    }

    public Page<LavaJatoResponse> findWithFilters(LavaJatoFilter filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        try {
            if (filter.latLong() != null && !filter.latLong().isEmpty()) {
                String[] coords = filter.latLong().split(",");
                if (coords.length == 2) {
                    Double latitude = Double.parseDouble(coords[0].trim());
                    Double longitude = Double.parseDouble(coords[1].trim());
                    Double raioKm = 10.0; // Raio padrão de 10km

                    Page<LavaJato> lavaJatos;

                    if (filter.avaliacao() > 0) {
                        lavaJatos = lavaJatoRepository.findWithFilters(
                                latitude, longitude, raioKm, filter.avaliacao(), pageable
                        );
                    } else {
                        lavaJatos = lavaJatoRepository.findByDistancia(
                                latitude, longitude, raioKm, pageable
                        );
                    }

                    return lavaJatos.map(lavaJatoMapper::entityToResponse);
                }
            }

            if (filter.avaliacao() > 0) {
                Page<LavaJato> lavaJatos = lavaJatoRepository.findByAvaliacaoMinimaOptimized(
                        filter.avaliacao(), pageable
                );
                return lavaJatos.map(lavaJatoMapper::entityToResponse);
            }

        } catch (Exception e) {
            System.err.println("Erro ao aplicar filtros: " + e.getMessage());
            e.printStackTrace();
        }

        Page<LavaJato> lavaJatos = lavaJatoRepository.findAllSimplePaged(pageable);
        return lavaJatos.map(lavaJatoMapper::entityToResponse);
    }

    public List<LavaJatoResponse> findAllSimpleTest() {
        try {
            List<LavaJato> lavaJatos = lavaJatoRepository.findAllSimple();
            return lavaJatos.stream()
                    .map(lavaJatoMapper::entityToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Erro no teste simples: " + e.getMessage());
            return List.of();
        }
    }

    /**
     * Busca lava-jatos próximos a uma coordenada
     */
    public List<LavaJatoResponse> findNearby(String latLong, Double raioKm) {
        if (latLong == null || latLong.isEmpty()) {
            return List.of();
        }

        String[] coords = latLong.split(",");
        if (coords.length != 2) {
            return List.of();
        }

        try {
            Double latitude = Double.parseDouble(coords[0].trim());
            Double longitude = Double.parseDouble(coords[1].trim());
            Double raio = raioKm != null ? raioKm : 5.0; // 5km por padrão

            Pageable pageable = PageRequest.of(0, 50);
            Page<LavaJato> lavaJatos = lavaJatoRepository.findByDistancia(
                    latitude, longitude, raio, pageable
            );

            return lavaJatos.getContent().stream()
                    .map(lavaJatoMapper::entityToResponse)
                    .collect(Collectors.toList());

        } catch (NumberFormatException e) {
            return List.of();
        }
    }

    // =============== MÉTODOS DE VALIDAÇÃO DE IMAGEM ===============

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

    public boolean isBase64Image(String photoPath) {
        return photoPath != null && photoPath.startsWith("data:image/");
    }
}
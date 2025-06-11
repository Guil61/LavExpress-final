package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.LavaJatoFilter;
import com.lavexpress.laveexpress.dtos.LavaJatoRequest;
import com.lavexpress.laveexpress.dtos.LavaJatoResponse;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import com.lavexpress.laveexpress.services.LavaJatoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/lava-jato")
public class LavaJatoController {

    private final LavaJatoService lavaJatoService;
    private final LavaJatoRepository lavaJatoRepository;

    public LavaJatoController(LavaJatoService lavaJatoService, LavaJatoRepository lavaJatoRepository) {
        this.lavaJatoService = lavaJatoService;
        this.lavaJatoRepository = lavaJatoRepository;
    }

    protected LavaJatoService getEntityService() {
        return lavaJatoService;
    }


    @GetMapping(value = "/{id}")
    public ResponseEntity<LavaJatoResponse> buscarPeloId(@PathVariable Long id) {
        var response = getEntityService().findByIdResponse(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(value = "/new")
    public ResponseEntity<LavaJatoResponse> createNew(@RequestBody LavaJatoRequest request) {
        var response = getEntityService().create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<LavaJatoResponse> update(@RequestBody LavaJatoRequest request, @PathVariable Long id) {
        var response = getEntityService().update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            Optional<LavaJato> entity = lavaJatoRepository.findById(id);

            if (entity.isPresent()) {
                getEntityService().delete(entity.get());
                return ResponseEntity.ok("Entity deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


    /**
     * Lista todos os lava-jatos com paginação
     * GET /lava-jato?page=0&size=10&sortBy=nome
     */
    @GetMapping
    public ResponseEntity<Page<LavaJatoResponse>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy) {

        Page<LavaJatoResponse> lavaJatos = lavaJatoService.findAll(page, size, sortBy);
        return ResponseEntity.ok(lavaJatos);
    }

    /**
     * Busca lava-jatos por nome
     * GET /lava-jato/buscar?nome=premium&page=0&size=10
     */
    @GetMapping("/buscar")
    public ResponseEntity<Page<LavaJatoResponse>> buscarPorNome(
            @RequestParam String nome,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<LavaJatoResponse> lavaJatos = lavaJatoService.findByNome(nome, page, size);
        return ResponseEntity.ok(lavaJatos);
    }

    /**
     * Aplica filtros (avaliação e/ou localização)
     * POST /lava-jato/filtrar
     * Body: { "avaliacao": 4, "latLong": "-15.7942,-47.8825" }
     */
    @PostMapping("/filtrar")
    public ResponseEntity<Page<LavaJatoResponse>> filtrar(
            @RequestBody LavaJatoFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<LavaJatoResponse> lavaJatos = lavaJatoService.findWithFilters(filter, page, size);
        return ResponseEntity.ok(lavaJatos);
    }

    /**
     * Busca lava-jatos próximos
     * GET /lava-jato/proximos?latLong=-15.7942,-47.8825&raio=5
     */
    @GetMapping("/proximos")
    public ResponseEntity<List<LavaJatoResponse>> buscarProximos(
            @RequestParam String latLong,
            @RequestParam(required = false) Double raio) {

        List<LavaJatoResponse> lavaJatos = lavaJatoService.findNearby(latLong, raio);
        return ResponseEntity.ok(lavaJatos);
    }

    /**
     * Endpoint para testar se a API está funcionando
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("LavaJato API funcionando!");
    }

    /**
     * Endpoint de teste simples para debug
     */
    @GetMapping("/teste")
    public ResponseEntity<List<LavaJatoResponse>> teste() {
        try {
            List<LavaJatoResponse> lavaJatos = lavaJatoService.findAllSimpleTest();
            return ResponseEntity.ok(lavaJatos);
        } catch (Exception e) {
            System.err.println("Erro no teste: " + e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Verificar estrutura da tabela
     */
    @GetMapping("/debug")
    public ResponseEntity<String> debug() {
        try {
            Integer tabelaExiste = lavaJatoRepository.checkAvaliacaoTableExists();
            long totalLavaJatos = lavaJatoRepository.count();

            return ResponseEntity.ok(String.format(
                    "Tabela avaliacao existe: %s, Total lava-jatos: %d",
                    tabelaExiste > 0 ? "SIM" : "NÃO",
                    totalLavaJatos
            ));
        } catch (Exception e) {
            return ResponseEntity.ok("Erro no debug: " + e.getMessage());
        }
    }
}
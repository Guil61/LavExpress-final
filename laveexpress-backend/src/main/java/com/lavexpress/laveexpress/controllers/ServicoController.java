package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.ServicoRequest;
import com.lavexpress.laveexpress.dtos.ServicoResponse;
import com.lavexpress.laveexpress.entities.Servico;
import com.lavexpress.laveexpress.repositories.ServicoRepository;
import com.lavexpress.laveexpress.services.ServicoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("servicos")
public class ServicoController {
    private final ServicoService servicoService;
    private final ServicoRepository servicoRepository;


    public ServicoController(ServicoService servicoService, ServicoRepository servicoRepository) {
        this.servicoService = servicoService;
        this.servicoRepository = servicoRepository;
    }

    protected ServicoService getEntityService() {
        return servicoService;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ServicoResponse> buscarPeloId(@PathVariable Long id) {
        var response = getEntityService().findByIdResponse(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(value = "/new")
    public ResponseEntity<ServicoResponse> createNew(@RequestBody ServicoRequest request) {
        var response = getEntityService().create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ServicoResponse> update(@RequestBody ServicoRequest request, @PathVariable Long id) {
        var response = getEntityService().update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            Optional<Servico> entity = servicoRepository.findById(id);

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

    @GetMapping("/lavajato/{lavajatoId}")
    public ResponseEntity<List<ServicoResponse>> buscarServicosPorLavajato(@PathVariable Long lavajatoId) {
        List<ServicoResponse> servicos = servicoService.findByLavajatoId(lavajatoId);
        return ResponseEntity.ok(servicos);
    }

}

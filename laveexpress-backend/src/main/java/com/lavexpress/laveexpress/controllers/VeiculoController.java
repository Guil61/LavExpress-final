package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.VeiculoRequest;
import com.lavexpress.laveexpress.dtos.VeiculoResponse;
import com.lavexpress.laveexpress.entities.Veiculo;
import com.lavexpress.laveexpress.repositories.VeiculoRepository;
import com.lavexpress.laveexpress.services.VeiculoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/veiculo")
public class VeiculoController  {

    private final VeiculoService veiculoService;
    private final VeiculoRepository veiculoRepository;

    public VeiculoController(VeiculoService veiculoService, VeiculoRepository veiculoRepository) {
        this.veiculoService = veiculoService;
        this.veiculoRepository = veiculoRepository;
    }

    protected VeiculoService getEntityService() {
        return veiculoService;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<VeiculoResponse> buscarPeloId(@PathVariable Long id) {
        var veiculo = getEntityService().findByIdResponse(id);
        return new ResponseEntity<>(veiculo, HttpStatus.OK);
    }

    @PostMapping(value = "/new")
    public ResponseEntity<VeiculoResponse> createNew(VeiculoRequest request) {
        var response = getEntityService().create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<VeiculoResponse> update(VeiculoRequest request, @PathVariable Long id) {
        var response = getEntityService().update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            Optional<Veiculo> entity = veiculoRepository.findById(id);

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
}
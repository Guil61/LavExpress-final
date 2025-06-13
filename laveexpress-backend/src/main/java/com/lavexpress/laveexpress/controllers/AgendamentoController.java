package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.AgendamentoRequest;
import com.lavexpress.laveexpress.dtos.AgendamentoResponse;
import com.lavexpress.laveexpress.entities.Agendamento;
import com.lavexpress.laveexpress.repositories.AgendamentoRepository;
import com.lavexpress.laveexpress.services.AgendamentoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("agendamento")
public class AgendamentoController {
    private final AgendamentoService agendamentoService;
    private final AgendamentoRepository agendamentoRepository;

    public AgendamentoController(AgendamentoService agendamentoService, AgendamentoRepository agendamentoRepository) {
        this.agendamentoService = agendamentoService;
        this.agendamentoRepository = agendamentoRepository;
    }

    protected AgendamentoService getEntityService() {
        return agendamentoService;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<AgendamentoResponse> buscarPeloId(@PathVariable Long id) {
        var response = getEntityService().findByIdResponse(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(value = "/new")
    public ResponseEntity<AgendamentoResponse> createNew(@RequestBody AgendamentoRequest request) {
        var response = getEntityService().create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<AgendamentoResponse> update(@RequestBody AgendamentoRequest request, @PathVariable Long id) {
        var response = getEntityService().update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            Optional<Agendamento> entity = agendamentoRepository.findById(id);

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

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<AgendamentoResponse>> buscarPorUsuario(@PathVariable Long usuarioId) {
        List<AgendamentoResponse> agendamentos = agendamentoService.findByUsuario(usuarioId);
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/veiculo/{veiculoId}")
    public ResponseEntity<List<AgendamentoResponse>> buscarPorVeiculo(@PathVariable Long veiculoId) {
        List<AgendamentoResponse> agendamentos = agendamentoService.findByVeiculo(veiculoId);
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/lavajato/{lavajatoId}")
    public ResponseEntity<List<AgendamentoResponse>> buscarPorLavaJato(@PathVariable Long lavajatoId) {
        List<AgendamentoResponse> agendamentos = agendamentoService.findByLavaJato(lavajatoId);
        return ResponseEntity.ok(agendamentos);
    }
}
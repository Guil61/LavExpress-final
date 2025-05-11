package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.ServicoDto;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Servico;
import com.lavexpress.laveexpress.mappers.ServicoMapper;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import com.lavexpress.laveexpress.repositories.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/servicos")
@CrossOrigin(origins = "*")
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private LavaJatoRepository lavaJatoRepository;

    @Autowired
    private ServicoMapper servicoMapper;

    /**
     * Lista todos os serviços
     * @return Lista de serviços
     */
    @GetMapping
    public ResponseEntity<List<ServicoDto>> listarTodos() {
        List<Servico> servicos = servicoRepository.findAll();
        List<ServicoDto> servicoDtos = servicos.stream()
                .map(servicoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(servicoDtos);
    }

    /**
     * Lista os serviços de um lava-jato específico
     * @param lavaJatoId ID do lava-jato
     * @return Lista de serviços do lava-jato
     */
    @GetMapping("/lavajato/{lavaJatoId}")
    public ResponseEntity<List<ServicoDto>> listarPorLavaJato(@PathVariable Long lavaJatoId) {
        LavaJato lavaJato = lavaJatoRepository.findById(lavaJatoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        List<Servico> servicos = servicoRepository.findByLavaJato(lavaJato);
        List<ServicoDto> servicoDtos = servicos.stream()
                .map(servicoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(servicoDtos);
    }

    /**
     * Lista os serviços por categoria
     * @param categoria Categoria de serviço
     * @return Lista de serviços da categoria
     */
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ServicoDto>> listarPorCategoria(@PathVariable String categoria) {
        List<Servico> servicos = servicoRepository.findByCategoria(categoria);
        List<ServicoDto> servicoDtos = servicos.stream()
                .map(servicoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(servicoDtos);
    }

    /**
     * Obtém um serviço específico pelo ID
     * @param id ID do serviço
     * @return Serviço encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServicoDto> buscarPorId(@PathVariable Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        return ResponseEntity.ok(servicoMapper.toDto(servico));
    }

    /**
     * Cria um novo serviço
     * @param servicoDto Dados do serviço
     * @return Serviço criado
     */
    @PostMapping
    public ResponseEntity<ServicoDto> criar(@RequestBody ServicoDto servicoDto) {
        // Validações
        validarServico(servicoDto);

        // Verificar se o lava-jato existe
        LavaJato lavaJato = lavaJatoRepository.findById(servicoDto.getLavaJatoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        // Verificar se já existe um serviço com o mesmo nome para este lava-jato
        if (servicoRepository.existsByNomeAndLavaJato(servicoDto.getNome(), lavaJato)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um serviço com este nome para este lava-jato");
        }

        // Criar e salvar o serviço
        Servico servico = servicoMapper.toEntity(servicoDto);
        servico.setLavaJato(lavaJato);
        servico.setAtivo(true); // Por padrão, o serviço é criado como ativo

        servico = servicoRepository.save(servico);

        return ResponseEntity.status(HttpStatus.CREATED).body(servicoMapper.toDto(servico));
    }

    /**
     * Atualiza um serviço existente
     * @param id ID do serviço
     * @param servicoDto Novos dados do serviço
     * @return Serviço atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<ServicoDto> atualizar(@PathVariable Long id, @RequestBody ServicoDto servicoDto) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        // Validações
        validarServico(servicoDto);

        // Se for alterar o lava-jato, verificar se o novo lava-jato existe
        if (!servico.getLavaJato().getId().equals(servicoDto.getLavaJatoId())) {
            LavaJato novoLavaJato = lavaJatoRepository.findById(servicoDto.getLavaJatoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

            // Verificar se já existe um serviço com o mesmo nome para o novo lava-jato
            if (servicoRepository.existsByNomeAndLavaJato(servicoDto.getNome(), novoLavaJato)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Já existe um serviço com este nome para este lava-jato");
            }

            servico.setLavaJato(novoLavaJato);
        }
        // Se não alterou o lava-jato, mas alterou o nome, verificar se o nome já existe
        else if (!servico.getNome().equals(servicoDto.getNome())) {
            if (servicoRepository.existsByNomeAndLavaJatoAndIdNot(
                    servicoDto.getNome(), servico.getLavaJato(), id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Já existe um serviço com este nome para este lava-jato");
            }
        }

        // Atualizar campos
        servico.setNome(servicoDto.getNome());
        servico.setDescricao(servicoDto.getDescricao());
        servico.setPreco(servicoDto.getPreco());
        servico.setDuracaoMinutos(servicoDto.getDuracaoMinutos());
        servico.setCategoria(servicoDto.getCategoria());

        // Se o campo ativo for fornecido, atualizá-lo também
        if (servicoDto.isAtivo() != servico.isAtivo()) {
            servico.setAtivo(servicoDto.isAtivo());
        }

        servico = servicoRepository.save(servico);

        return ResponseEntity.ok(servicoMapper.toDto(servico));
    }

    /**
     * Ativa ou desativa um serviço
     * @param id ID do serviço
     * @param ativoMap Mapa contendo o novo estado (ativo: true/false)
     * @return Serviço atualizado
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ServicoDto> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> ativoMap) {
        Boolean ativo = ativoMap.get("ativo");

        if (ativo == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo 'ativo' não informado");
        }

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        servico.setAtivo(ativo);
        servico = servicoRepository.save(servico);

        return ResponseEntity.ok(servicoMapper.toDto(servico));
    }

    /**
     * Atualiza o preço de um serviço
     * @param id ID do serviço
     * @param precoMap Mapa contendo o novo preço
     * @return Serviço atualizado
     */
    @PatchMapping("/{id}/preco")
    public ResponseEntity<ServicoDto> atualizarPreco(@PathVariable Long id, @RequestBody Map<String, BigDecimal> precoMap) {
        BigDecimal preco = precoMap.get("preco");

        if (preco == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo 'preco' não informado");
        }

        if (preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preço deve ser maior que zero");
        }

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        servico.setPreco(preco);
        servico = servicoRepository.save(servico);

        return ResponseEntity.ok(servicoMapper.toDto(servico));
    }

    /**
     * Exclui um serviço
     * @param id ID do serviço
     * @return Confirmação de exclusão
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> excluir(@PathVariable Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        // Verificar se existem agendamentos vinculados a este serviço
        long agendamentosCount = servicoRepository.countAgendamentosByServicoId(id);

        if (agendamentosCount > 0) {
            // Em vez de excluir, apenas desativar
            servico.setAtivo(false);
            servicoRepository.save(servico);

            Map<String, String> response = new HashMap<>();
            response.put("mensagem", "Serviço desativado pois possui agendamentos vinculados");
            return ResponseEntity.ok(response);
        }

        // Se não houver agendamentos, excluir
        servicoRepository.delete(servico);

        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Serviço excluído com sucesso");
        return ResponseEntity.ok(response);
    }

    /**
     * Lista os serviços mais populares
     * @param limit Limite de resultados
     * @return Lista de serviços ordenados por popularidade
     */
    @GetMapping("/populares")
    public ResponseEntity<List<ServicoDto>> listarPopulares(@RequestParam(defaultValue = "5") int limit) {
        List<Servico> servicosPopulares = servicoRepository.findMostPopularServices(limit);

        List<ServicoDto> servicoDtos = servicosPopulares.stream()
                .map(servicoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(servicoDtos);
    }

    /**
     * Método auxiliar para validar os dados do serviço
     * @param servicoDto DTO do serviço a ser validado
     */
    private void validarServico(ServicoDto servicoDto) {
        if (servicoDto.getNome() == null || servicoDto.getNome().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome é obrigatório");
        }

        if (servicoDto.getPreco() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preço é obrigatório");
        }

        if (servicoDto.getPreco().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preço deve ser maior que zero");
        }

        if (servicoDto.getDuracaoMinutos() == null || servicoDto.getDuracaoMinutos() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duração deve ser maior que zero");
        }

        if (servicoDto.getLavaJatoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lava-jato é obrigatório");
        }
    }
}
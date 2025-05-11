package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.LavaJatoDto;
import com.lavexpress.laveexpress.dtos.ServicoDto;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Servico;
import com.lavexpress.laveexpress.mappers.LavaJatoMapper;
import com.lavexpress.laveexpress.mappers.ServicoMapper;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import com.lavexpress.laveexpress.repositories.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lavajatos")
@CrossOrigin(origins = "*")
public class LavaJatoController {

    private static final String UPLOAD_DIR = "uploads/lavajatos/";

    @Autowired
    private LavaJatoRepository lavaJatoRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private LavaJatoMapper lavaJatoMapper;

    @Autowired
    private ServicoMapper servicoMapper;

    /**
     * Lista todos os lava-jatos com paginação
     * @param page Número da página (começa em 0)
     * @param size Tamanho da página
     * @param sort Campo para ordenação
     * @param direction Direção da ordenação (asc ou desc)
     * @return Lista paginada de lava-jatos
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sort,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<LavaJato> lavaJatoPage = lavaJatoRepository.findAll(pageable);
        List<LavaJatoDto> lavaJatoDtos = lavaJatoPage.getContent()
                .stream()
                .map(lavaJatoMapper::toDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("lavaJatos", lavaJatoDtos);
        response.put("currentPage", lavaJatoPage.getNumber());
        response.put("totalItems", lavaJatoPage.getTotalElements());
        response.put("totalPages", lavaJatoPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    /**
     * Busca lava-jatos por nome ou cidade (busca parcial)
     * @param termo Termo para busca
     * @return Lista de lava-jatos que correspondem ao termo
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<LavaJatoDto>> buscar(@RequestParam String termo) {
        List<LavaJato> lavaJatos = lavaJatoRepository.findByNomeContainingIgnoreCaseOrCidadeContainingIgnoreCase(termo, termo);
        List<LavaJatoDto> lavaJatoDtos = lavaJatos.stream()
                .map(lavaJatoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lavaJatoDtos);
    }

    /**
     * Busca lava-jatos pela cidade
     * @param cidade Nome da cidade
     * @return Lista de lava-jatos na cidade especificada
     */
    @GetMapping("/cidade/{cidade}")
    public ResponseEntity<List<LavaJatoDto>> buscarPorCidade(@PathVariable String cidade) {
        List<LavaJato> lavaJatos = lavaJatoRepository.findByCidadeIgnoreCase(cidade);
        List<LavaJatoDto> lavaJatoDtos = lavaJatos.stream()
                .map(lavaJatoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lavaJatoDtos);
    }

    /**
     * Obtém um lava-jato específico pelo ID
     * @param id ID do lava-jato
     * @return Lava-jato encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<LavaJatoDto> buscarPorId(@PathVariable Long id) {
        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        return ResponseEntity.ok(lavaJatoMapper.toDto(lavaJato));
    }

    /**
     * Lista os serviços oferecidos por um lava-jato
     * @param id ID do lava-jato
     * @return Lista de serviços do lava-jato
     */
    @GetMapping("/{id}/servicos")
    public ResponseEntity<List<ServicoDto>> listarServicos(@PathVariable Long id) {
        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        List<Servico> servicos = servicoRepository.findByLavaJato(lavaJato);
        List<ServicoDto> servicoDtos = servicos.stream()
                .map(servicoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(servicoDtos);
    }

    /**
     * Cria um novo lava-jato
     * @param lavaJatoDto Dados do lava-jato
     * @return Lava-jato criado
     */
    @PostMapping
    public ResponseEntity<LavaJatoDto> criar(@RequestBody LavaJatoDto lavaJatoDto) {
        // Validações
        if (lavaJatoDto.getNome() == null || lavaJatoDto.getNome().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome é obrigatório");
        }

        if (lavaJatoDto.getEndereco() == null || lavaJatoDto.getEndereco().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endereço é obrigatório");
        }

        if (lavaJatoDto.getCidade() == null || lavaJatoDto.getCidade().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cidade é obrigatória");
        }

        if (lavaJatoDto.getTelefone() == null || lavaJatoDto.getTelefone().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefone é obrigatório");
        }

        // Verificar se já existe lava-jato com o mesmo nome no mesmo endereço
        if (lavaJatoRepository.existsByNomeAndEndereco(lavaJatoDto.getNome(), lavaJatoDto.getEndereco())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um lava-jato com o mesmo nome neste endereço");
        }

        // Criar e salvar o lava-jato
        LavaJato lavaJato = lavaJatoMapper.toEntity(lavaJatoDto);
        lavaJato.setAtivo(true); // Por padrão, o lava-jato é criado como ativo

        lavaJato = lavaJatoRepository.save(lavaJato);

        return ResponseEntity.status(HttpStatus.CREATED).body(lavaJatoMapper.toDto(lavaJato));
    }

    /**
     * Atualiza um lava-jato existente
     * @param id ID do lava-jato
     * @param lavaJatoDto Novos dados do lava-jato
     * @return Lava-jato atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<LavaJatoDto> atualizar(@PathVariable Long id, @RequestBody LavaJatoDto lavaJatoDto) {
        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        // Validações
        if (lavaJatoDto.getNome() == null || lavaJatoDto.getNome().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome é obrigatório");
        }

        if (lavaJatoDto.getEndereco() == null || lavaJatoDto.getEndereco().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endereço é obrigatório");
        }

        // Verificar se já existe outro lava-jato com o mesmo nome no mesmo endereço
        if (!lavaJato.getNome().equals(lavaJatoDto.getNome()) ||
                !lavaJato.getEndereco().equals(lavaJatoDto.getEndereco())) {

            boolean exists = lavaJatoRepository.existsByNomeAndEnderecoAndIdNot(
                    lavaJatoDto.getNome(), lavaJatoDto.getEndereco(), id);

            if (exists) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Já existe um lava-jato com o mesmo nome neste endereço");
            }
        }

        // Atualizar campos
        lavaJato.setNome(lavaJatoDto.getNome());
        lavaJato.setEndereco(lavaJatoDto.getEndereco());
        lavaJato.setCidade(lavaJatoDto.getCidade());
        lavaJato.setEstado(lavaJatoDto.getEstado());
        lavaJato.setCep(lavaJatoDto.getCep());
        lavaJato.setTelefone(lavaJatoDto.getTelefone());
        lavaJato.setEmail(lavaJatoDto.getEmail());
        lavaJato.setHorarioAbertura(lavaJatoDto.getHorarioAbertura());
        lavaJato.setHorarioFechamento(lavaJatoDto.getHorarioFechamento());
        lavaJato.setDescricao(lavaJatoDto.getDescricao());

        // Manter a imagem atual se não for fornecida uma nova
        if (lavaJatoDto.getImagemUrl() != null && !lavaJatoDto.getImagemUrl().isEmpty()) {
            lavaJato.setImagemUrl(lavaJatoDto.getImagemUrl());
        }

        // Se o campo ativo for fornecido, atualizá-lo também
        if (lavaJatoDto.isAtivo() != lavaJato.isAtivo()) {
            lavaJato.setAtivo(lavaJatoDto.isAtivo());
        }

        lavaJato = lavaJatoRepository.save(lavaJato);

        return ResponseEntity.ok(lavaJatoMapper.toDto(lavaJato));
    }

    /**
     * Ativa ou desativa um lava-jato
     * @param id ID do lava-jato
     * @param ativoMap Mapa contendo o novo estado (ativo: true/false)
     * @return Lava-jato atualizado
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<LavaJatoDto> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> ativoMap) {
        Boolean ativo = ativoMap.get("ativo");

        if (ativo == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo 'ativo' não informado");
        }

        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        lavaJato.setAtivo(ativo);
        lavaJato = lavaJatoRepository.save(lavaJato);

        return ResponseEntity.ok(lavaJatoMapper.toDto(lavaJato));
    }

    /**
     * Upload de imagem para um lava-jato
     * @param id ID do lava-jato
     * @param file Arquivo de imagem
     * @return URL da imagem salva
     */
    @PostMapping("/{id}/imagem")
    public ResponseEntity<Map<String, String>> uploadImagem(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        // Validar arquivo
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas imagens são permitidas");
        }

        try {
            // Criar diretório se não existir
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único para o arquivo
            String fileExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            // Salvar arquivo
            Path filePath = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), filePath);

            // Atualizar URL da imagem no lava-jato
            String imageUrl = "/api/uploads/lavajatos/" + newFileName;
            lavaJato.setImagemUrl(imageUrl);
            lavaJatoRepository.save(lavaJato);

            // Retornar URL da imagem
            Map<String, String> response = new HashMap<>();
            response.put("imagemUrl", imageUrl);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao salvar imagem: " + e.getMessage());
        }
    }

    /**
     * Exclui um lava-jato
     * @param id ID do lava-jato
     * @return Confirmação de exclusão
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> excluir(@PathVariable Long id) {
        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        // Verificar se existem agendamentos vinculados a este lava-jato
        long agendamentosCount = lavaJatoRepository.countAgendamentosByLavaJatoId(id);

        if (agendamentosCount > 0) {
            // Em vez de excluir, apenas desativar
            lavaJato.setAtivo(false);
            lavaJatoRepository.save(lavaJato);

            Map<String, String> response = new HashMap<>();
            response.put("mensagem", "Lava-jato desativado pois possui agendamentos vinculados");
            return ResponseEntity.ok(response);
        }

        // Se não houver agendamentos, excluir
        lavaJatoRepository.delete(lavaJato);

        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Lava-jato excluído com sucesso");
        return ResponseEntity.ok(response);
    }

    /**
     * Lista os lava-jatos mais bem avaliados
     * @param limit Limite de resultados
     * @return Lista de lava-jatos ordenados por avaliação
     */
    @GetMapping("/melhores")
    public ResponseEntity<List<LavaJatoDto>> listarMelhores(@RequestParam(defaultValue = "5") int limit) {
        List<LavaJato> melhoresLavaJatos = lavaJatoRepository.findTopByOrderByAvaliacaoMediaDesc(
                PageRequest.of(0, limit));

        List<LavaJatoDto> lavaJatoDtos = melhoresLavaJatos.stream()
                .map(lavaJatoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lavaJatoDtos);
    }

    /**
     * Lista lava-jatos próximos com base em coordenadas
     * @param latitude Latitude atual
     * @param longitude Longitude atual
     * @param raioKm Raio de busca em quilômetros
     * @return Lista de lava-jatos dentro do raio especificado
     */
    @GetMapping("/proximos")
    public ResponseEntity<List<LavaJatoDto>> buscarProximos(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double raioKm) {

        List<LavaJato> lavaJatosProximos = lavaJatoRepository.findNearbyLavaJatos(
                latitude, longitude, raioKm);

        List<LavaJatoDto> lavaJatoDtos = lavaJatosProximos.stream()
                .map(lavaJatoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lavaJatoDtos);
    }
}
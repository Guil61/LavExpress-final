package com.lavexpress.laveexpress.controllers;

import com.lavexpress.laveexpress.dtos.VeiculoDto;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.entities.Veiculo;
import com.lavexpress.laveexpress.mappers.VeiculoMapper;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import com.lavexpress.laveexpress.repositories.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/veiculos")
@CrossOrigin(origins = "*")
public class VeiculoController {

    private static final String UPLOAD_DIR = "uploads/veiculos/";

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VeiculoMapper veiculoMapper;

    /**
     * Lista todos os veículos
     * @return Lista de veículos
     */
    @GetMapping
    public ResponseEntity<List<VeiculoDto>> listarTodos() {
        List<Veiculo> veiculos = veiculoRepository.findAll();
        List<VeiculoDto> veiculoDtos = veiculos.stream()
                .map(veiculoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(veiculoDtos);
    }

    /**
     * Lista os veículos de um usuário específico
     * @param usuarioId ID do usuário
     * @return Lista de veículos do usuário
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<VeiculoDto>> listarPorUsuario(@PathVariable Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        List<Veiculo> veiculos = veiculoRepository.findByProprietario(usuario);
        List<VeiculoDto> veiculoDtos = veiculos.stream()
                .map(veiculoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(veiculoDtos);
    }

    /**
     * Obtém um veículo específico pelo ID
     * @param id ID do veículo
     * @return Veículo encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<VeiculoDto> buscarPorId(@PathVariable Long id) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        return ResponseEntity.ok(veiculoMapper.toDto(veiculo));
    }

    /**
     * Cria um novo veículo
     * @param veiculoDto Dados do veículo
     * @return Veículo criado
     */
    @PostMapping
    public ResponseEntity<VeiculoDto> criar(@RequestBody VeiculoDto veiculoDto) {
        // Validações
        validarVeiculo(veiculoDto);

        // Verificar se o usuário existe
        Usuario proprietario = usuarioRepository.findById(veiculoDto.getProprietarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        // Verificar se já existe um veículo com a mesma placa
        if (veiculoRepository.existsByPlaca(veiculoDto.getPlaca())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um veículo cadastrado com esta placa");
        }

        // Criar e salvar o veículo
        Veiculo veiculo = veiculoMapper.toEntity(veiculoDto);
        veiculo.setProprietario(proprietario);
        veiculo.setAtivo(true); // Por padrão, o veículo é criado como ativo

        veiculo = veiculoRepository.save(veiculo);

        return ResponseEntity.status(HttpStatus.CREATED).body(veiculoMapper.toDto(veiculo));
    }

    /**
     * Atualiza um veículo existente
     * @param id ID do veículo
     * @param veiculoDto Novos dados do veículo
     * @return Veículo atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<VeiculoDto> atualizar(@PathVariable Long id, @RequestBody VeiculoDto veiculoDto) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        // Validações
        validarVeiculo(veiculoDto);

        // Se for alterar a placa, verificar se a nova placa já existe
        if (!veiculo.getPlaca().equals(veiculoDto.getPlaca())) {
            if (veiculoRepository.existsByPlacaAndIdNot(veiculoDto.getPlaca(), id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Já existe um veículo cadastrado com esta placa");
            }
        }

        // Se for alterar o proprietário, verificar se o novo proprietário existe
        if (!veiculo.getProprietario().getId().equals(veiculoDto.getProprietarioId())) {
            Usuario novoProprietario = usuarioRepository.findById(veiculoDto.getProprietarioId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

            veiculo.setProprietario(novoProprietario);
        }

        // Atualizar campos
        veiculo.setMarca(veiculoDto.getMarca());
        veiculo.setModelo(veiculoDto.getModelo());
        veiculo.setAno(veiculoDto.getAno());
        veiculo.setCor(veiculoDto.getCor());
        veiculo.setPlaca(veiculoDto.getPlaca());
        veiculo.setTipo(veiculoDto.getTipo());

        // Manter a imagem atual se não for fornecida uma nova
        if (veiculoDto.getImagemUrl() != null && !veiculoDto.getImagemUrl().isEmpty()) {
            veiculo.setImagemUrl(veiculoDto.getImagemUrl());
        }

        // Se o campo ativo for fornecido, atualizá-lo também
        if (veiculoDto.isAtivo() != veiculo.isAtivo()) {
            veiculo.setAtivo(veiculoDto.isAtivo());
        }

        veiculo = veiculoRepository.save(veiculo);

        return ResponseEntity.ok(veiculoMapper.toDto(veiculo));
    }

    /**
     * Ativa ou desativa um veículo
     * @param id ID do veículo
     * @param ativoMap Mapa contendo o novo estado (ativo: true/false)
     * @return Veículo atualizado
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<VeiculoDto> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> ativoMap) {
        Boolean ativo = ativoMap.get("ativo");

        if (ativo == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo 'ativo' não informado");
        }

        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        veiculo.setAtivo(ativo);
        veiculo = veiculoRepository.save(veiculo);

        return ResponseEntity.ok(veiculoMapper.toDto(veiculo));
    }

    /**
     * Upload de imagem para um veículo
     * @param id ID do veículo
     * @param file Arquivo de imagem
     * @return URL da imagem salva
     */
    @PostMapping("/{id}/imagem")
    public ResponseEntity<Map<String, String>> uploadImagem(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

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

            // Atualizar URL da imagem no veículo
            String imageUrl = "/api/uploads/veiculos/" + newFileName;
            veiculo.setImagemUrl(imageUrl);
            veiculoRepository.save(veiculo);

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
     * Exclui um veículo
     * @param id ID do veículo
     * @return Confirmação de exclusão
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> excluir(@PathVariable Long id) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        // Verificar se existem agendamentos vinculados a este veículo
        long agendamentosCount = veiculoRepository.countAgendamentosByVeiculoId(id);

        if (agendamentosCount > 0) {
            // Em vez de excluir, apenas desativar
            veiculo.setAtivo(false);
            veiculoRepository.save(veiculo);

            Map<String, String> response = new HashMap<>();
            response.put("mensagem", "Veículo desativado pois possui agendamentos vinculados");
            return ResponseEntity.ok(response);
        }

        // Se não houver agendamentos, excluir
        veiculoRepository.delete(veiculo);

        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Veículo excluído com sucesso");
        return ResponseEntity.ok(response);
    }

    /**
     * Busca veículos por marca e modelo
     * @param termo Termo para busca
     * @return Lista de veículos que correspondem ao termo
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<VeiculoDto>> buscar(@RequestParam String termo) {
        List<Veiculo> veiculos = veiculoRepository.findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(termo, termo);
        List<VeiculoDto> veiculoDtos = veiculos.stream()
                .map(veiculoMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(veiculoDtos);
    }

    /**
     * Método auxiliar para validar os dados do veículo
     * @param veiculoDto DTO do veículo a ser validado
     */
    private void validarVeiculo(VeiculoDto veiculoDto) {
        if (veiculoDto.getMarca() == null || veiculoDto.getMarca().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Marca é obrigatória");
        }

        if (veiculoDto.getModelo() == null || veiculoDto.getModelo().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Modelo é obrigatório");
        }

        if (veiculoDto.getPlaca() == null || veiculoDto.getPlaca().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Placa é obrigatória");
        }

        if (veiculoDto.getAno() == null || veiculoDto.getAno() < 1900 || veiculoDto.getAno() > java.time.Year.now().getValue() + 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ano inválido");
        }

        if (veiculoDto.getProprietarioId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Proprietário é obrigatório");
        }

        // Validar formato da placa (padrão brasileiro)
        String placaRegex = "^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$"; // Formato placa Mercosul: AAA0A00
        String placaAntiga = "^[A-Z]{3}\\-[0-9]{4}$"; // Formato placa antiga: AAA-0000

        if (!veiculoDto.getPlaca().matches(placaRegex) && !veiculoDto.getPlaca().matches(placaAntiga)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Formato de placa inválido. Use o formato Mercosul (AAA0A00) ou o formato antigo (AAA-0000)");
        }
    }
}
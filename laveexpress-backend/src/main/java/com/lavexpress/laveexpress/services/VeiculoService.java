package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.dtos.VeiculoDto;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.entities.Veiculo;
import com.lavexpress.laveexpress.mappers.VeiculoMapper;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
import com.lavexpress.laveexpress.repositories.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Serviço para operações relacionadas a veículos
 */
@Service
public class VeiculoService {

    private static final String UPLOAD_DIR = "uploads/veiculos/";

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VeiculoMapper veiculoMapper;

    /**
     * Lista todos os veículos
     * @return Lista de DTOs de veículos
     */
    @Transactional(readOnly = true)
    public List<VeiculoDto> listarTodos() {
        List<Veiculo> veiculos = veiculoRepository.findAll();
        return veiculoMapper.toDtoList(veiculos);
    }

    /**
     * Lista os veículos de um usuário
     * @param usuarioId ID do usuário
     * @return Lista de DTOs de veículos do usuário
     */
    @Transactional(readOnly = true)
    public List<VeiculoDto> listarPorUsuario(Long usuarioId) {
        Usuario proprietario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        List<Veiculo> veiculos = veiculoRepository.findByProprietario(proprietario);
        return veiculoMapper.toDtoList(veiculos);
    }

    /**
     * Lista os veículos ativos de um usuário
     * @param usuarioId ID do usuário
     * @return Lista de DTOs de veículos ativos do usuário
     */
    @Transactional(readOnly = true)
    public List<VeiculoDto> listarAtivosPorUsuario(Long usuarioId) {
        Usuario proprietario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        List<Veiculo> veiculos = veiculoRepository.findByProprietarioAndAtivoTrue(proprietario);
        return veiculoMapper.toDtoList(veiculos);
    }

    /**
     * Busca um veículo pelo ID
     * @param id ID do veículo
     * @return DTO do veículo
     */
    @Transactional(readOnly = true)
    public VeiculoDto buscarPorId(Long id) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        return veiculoMapper.toDto(veiculo);
    }

    /**
     * Busca um veículo pela placa
     * @param placa Placa do veículo
     * @return DTO do veículo
     */
    @Transactional(readOnly = true)
    public VeiculoDto buscarPorPlaca(String placa) {
        Veiculo veiculo = veiculoRepository.findByPlaca(placa);
        if (veiculo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado");
        }

        return veiculoMapper.toDto(veiculo);
    }

    /**
     * Busca veículos por marca ou modelo
     * @param termo Termo para busca
     * @return Lista de DTOs de veículos encontrados
     */
    @Transactional(readOnly = true)
    public List<VeiculoDto> buscarPorMarcaOuModelo(String termo) {
        List<Veiculo> veiculos = veiculoRepository.findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(termo, termo);
        return veiculoMapper.toDtoList(veiculos);
    }

    /**
     * Cria um novo veículo
     * @param veiculoDto Dados do veículo
     * @return DTO do veículo criado
     */
    @Transactional
    public VeiculoDto criar(VeiculoDto veiculoDto) {
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

        return veiculoMapper.toDto(veiculo);
    }

    /**
     * Atualiza um veículo existente
     * @param id ID do veículo
     * @param veiculoDto Novos dados do veículo
     * @return DTO do veículo atualizado
     */
    @Transactional
    public VeiculoDto atualizar(Long id, VeiculoDto veiculoDto) {
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
        veiculo = veiculoMapper.updateEntityFromDto(veiculo, veiculoDto);
        veiculo = veiculoRepository.save(veiculo);

        return veiculoMapper.toDto(veiculo);
    }

    /**
     * Atualiza o status de um veículo
     * @param id ID do veículo
     * @param ativoMap Mapa contendo o novo estado (ativo: true/false)
     * @return DTO do veículo atualizado
     */
    @Transactional
    public VeiculoDto atualizarStatus(Long id, Map<String, Boolean> ativoMap) {
        Boolean ativo = ativoMap.get("ativo");

        if (ativo == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo 'ativo' não informado");
        }

        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        veiculo.setAtivo(ativo);
        veiculo = veiculoRepository.save(veiculo);

        return veiculoMapper.toDto(veiculo);
    }

    /**
     * Upload de imagem para um veículo
     * @param id ID do veículo
     * @param file Arquivo de imagem
     * @return URL da imagem salva
     */
    @Transactional
    public String uploadImagem(Long id, MultipartFile file) {
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

            return imageUrl;

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao salvar imagem: " + e.getMessage());
        }
    }

    /**
     * Exclui um veículo
     * @param id ID do veículo
     * @return Mensagem de confirmação
     */
    @Transactional
    public String excluir(Long id) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));

        // Verificar se existem agendamentos vinculados a este veículo
        long agendamentosCount = veiculoRepository.countAgendamentosByVeiculoId(id);

        if (agendamentosCount > 0) {
            // Em vez de excluir, apenas desativar
            veiculo.setAtivo(false);
            veiculoRepository.save(veiculo);

            return "Veículo desativado pois possui agendamentos vinculados";
        }

        // Se não houver agendamentos, excluir
        veiculoRepository.delete(veiculo);

        return "Veículo excluído com sucesso";
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

        if (veiculoDto.getAno() == null || veiculoDto.getAno() < 1900 || veiculoDto.getAno() > Year.now().getValue() + 1) {
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
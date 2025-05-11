package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.dtos.LavaJatoDto;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.mappers.LavaJatoMapper;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Serviço para operações relacionadas a lava-jatos
 */
@Service
public class LavaJatoService {

    private static final String UPLOAD_DIR = "uploads/lavajatos/";

    @Autowired
    private LavaJatoRepository lavaJatoRepository;

    @Autowired
    private LavaJatoMapper lavaJatoMapper;

    /**
     * Lista todos os lava-jatos paginados
     * @param page Número da página
     * @param size Tamanho da página
     * @param sort Campo para ordenação
     * @param direction Direção da ordenação
     * @return Lista paginada de DTOs de lava-jatos
     */
    @Transactional(readOnly = true)
    public List<LavaJatoDto> listarTodosPaginados(int page, int size, String sort, String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        List<LavaJato> lavaJatos = lavaJatoRepository.findAll(pageRequest).getContent();
        return lavaJatoMapper.toDtoList(lavaJatos);
    }

    /**
     * Lista todos os lava-jatos ativos
     * @return Lista de DTOs de lava-jatos ativos
     */
    @Transactional(readOnly = true)
    public List<LavaJatoDto> listarAtivos() {
        List<LavaJato> lavaJatos = lavaJatoRepository.findByAtivoTrue();
        return lavaJatoMapper.toDtoList(lavaJatos);
    }

    /**
     * Busca lava-jatos por cidade
     * @param cidade Nome da cidade
     * @return Lista de DTOs de lava-jatos na cidade
     */
    @Transactional(readOnly = true)
    public List<LavaJatoDto> buscarPorCidade(String cidade) {
        List<LavaJato> lavaJatos = lavaJatoRepository.findByCidadeIgnoreCase(cidade);
        return lavaJatoMapper.toDtoList(lavaJatos);
    }

    /**
     * Busca lava-jatos por estado
     * @param estado Sigla do estado
     * @return Lista de DTOs de lava-jatos no estado
     */
    @Transactional(readOnly = true)
    public List<LavaJatoDto> buscarPorEstado(String estado) {
        List<LavaJato> lavaJatos = lavaJatoRepository.findByEstadoIgnoreCase(estado);
        return lavaJatoMapper.toDtoList(lavaJatos);
    }

    /**
     * Busca lava-jatos por nome ou cidade
     * @param termo Termo para busca
     * @return Lista de DTOs de lava-jatos encontrados
     */
    @Transactional(readOnly = true)
    public List<LavaJatoDto> buscarPorNomeOuCidade(String termo) {
        List<LavaJato> lavaJatos = lavaJatoRepository.findByNomeContainingIgnoreCaseOrCidadeContainingIgnoreCase(termo, termo);
        return lavaJatoMapper.toDtoList(lavaJatos);
    }

    /**
     * Busca lava-jatos por avaliação mínima
     * @param avaliacaoMinima Avaliação mínima
     * @return Lista de DTOs de lava-jatos com avaliação maior ou igual
     */
    @Transactional(readOnly = true)
    public List<LavaJatoDto> buscarPorAvaliacaoMinima(Double avaliacaoMinima) {
        List<LavaJato> lavaJatos = lavaJatoRepository.findByAvaliacaoMediaGreaterThanEqual(avaliacaoMinima);
        return lavaJatoMapper.toDtoList(lavaJatos);
    }

    /**
     * Busca os lava-jatos mais bem avaliados
     * @param limit Limite de resultados
     * @return Lista de DTOs de lava-jatos mais bem avaliados
     */
    @Transactional(readOnly = true)
    public List<LavaJatoDto> buscarMelhoresAvaliados(int limit) {
        List<LavaJato> lavaJatos = lavaJatoRepository.findTopByOrderByAvaliacaoMediaDesc(PageRequest.of(0, limit));
        return lavaJatoMapper.toDtoList(lavaJatos);
    }

    /**
     * Busca lava-jatos próximos a uma coordenada
     * @param latitude Latitude
     * @param longitude Longitude
     * @param raioKm Raio em quilômetros
     * @return Lista de DTOs de lava-jatos dentro do raio
     */
    @Transactional(readOnly = true)
    public List<LavaJatoDto> buscarProximos(Double latitude, Double longitude, Double raioKm) {
        List<LavaJato> lavaJatos = lavaJatoRepository.findNearbyLavaJatos(latitude, longitude, raioKm);
        return lavaJatoMapper.toDtoList(lavaJatos);
    }

    /**
     * Busca um lava-jato pelo ID
     * @param id ID do lava-jato
     * @return DTO do lava-jato
     */
    @Transactional(readOnly = true)
    public LavaJatoDto buscarPorId(Long id) {
        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        return lavaJatoMapper.toDto(lavaJato);
    }

    /**
     * Cria um novo lava-jato
     * @param lavaJatoDto Dados do lava-jato
     * @return DTO do lava-jato criado
     */
    @Transactional
    public LavaJatoDto criar(LavaJatoDto lavaJatoDto) {
        // Validações
        validarLavaJato(lavaJatoDto);

        // Verificar se já existe lava-jato com o mesmo nome no mesmo endereço
        if (lavaJatoRepository.existsByNomeAndEndereco(lavaJatoDto.getNome(), lavaJatoDto.getEndereco())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um lava-jato com o mesmo nome neste endereço");
        }

        // Criar e salvar o lava-jato
        LavaJato lavaJato = lavaJatoMapper.toEntity(lavaJatoDto);
        lavaJato.setAtivo(true); // Por padrão, o lava-jato é criado como ativo
        lavaJato.setAvaliacaoMedia(0.0); // Inicialmente sem avaliações

        lavaJato = lavaJatoRepository.save(lavaJato);

        return lavaJatoMapper.toDto(lavaJato);
    }

    /**
     * Atualiza um lava-jato existente
     * @param id ID do lava-jato
     * @param lavaJatoDto Novos dados do lava-jato
     * @return DTO do lava-jato atualizado
     */
    @Transactional
    public LavaJatoDto atualizar(Long id, LavaJatoDto lavaJatoDto) {
        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        // Validações
        validarLavaJato(lavaJatoDto);

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
        lavaJato.setLatitude(lavaJatoDto.getLatitude());
        lavaJato.setLongitude(lavaJatoDto.getLongitude());

        // Manter a imagem atual se não for fornecida uma nova
        if (lavaJatoDto.getImagemUrl() != null && !lavaJatoDto.getImagemUrl().isEmpty()) {
            lavaJato.setImagemUrl(lavaJatoDto.getImagemUrl());
        }

        // Se o campo ativo for fornecido, atualizá-lo também
        if (lavaJatoDto.isAtivo() != lavaJato.isAtivo()) {
            lavaJato.setAtivo(lavaJatoDto.isAtivo());
        }

        lavaJato = lavaJatoRepository.save(lavaJato);

        return lavaJatoMapper.toDto(lavaJato);
    }

    /**
     * Atualiza o status de um lava-jato
     * @param id ID do lava-jato
     * @param ativoMap Mapa contendo o novo estado (ativo: true/false)
     * @return DTO do lava-jato atualizado
     */
    @Transactional
    public LavaJatoDto atualizarStatus(Long id, Map<String, Boolean> ativoMap) {
        Boolean ativo = ativoMap.get("ativo");

        if (ativo == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo 'ativo' não informado");
        }

        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        lavaJato.setAtivo(ativo);
        lavaJato = lavaJatoRepository.save(lavaJato);

        return lavaJatoMapper.toDto(lavaJato);
    }

    /**
     * Upload de imagem para um lava-jato
     * @param id ID do lava-jato
     * @param file Arquivo de imagem
     * @return URL da imagem salva
     */
    @Transactional
    public String uploadImagem(Long id, MultipartFile file) {
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

            return imageUrl;

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao salvar imagem: " + e.getMessage());
        }
    }

    /**
     * Exclui um lava-jato
     * @param id ID do lava-jato
     * @return Mensagem de confirmação
     */
    @Transactional
    public String excluir(Long id) {
        LavaJato lavaJato = lavaJatoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        // Verificar se existem agendamentos vinculados a este lava-jato
        long agendamentosCount = lavaJatoRepository.countAgendamentosByLavaJatoId(id);

        if (agendamentosCount > 0) {
            // Em vez de excluir, apenas desativar
            lavaJato.setAtivo(false);
            lavaJatoRepository.save(lavaJato);

            return "Lava-jato desativado pois possui agendamentos vinculados";
        }

        // Se não houver agendamentos, excluir
        lavaJatoRepository.delete(lavaJato);

        return "Lava-jato excluído com sucesso";
    }

    /**
     * Método auxiliar para validar os dados do lava-jato
     * @param lavaJatoDto DTO do lava-jato a ser validado
     */
    private void validarLavaJato(LavaJatoDto lavaJatoDto) {
        if (lavaJatoDto.getNome() == null || lavaJatoDto.getNome().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome é obrigatório");
        }

        if (lavaJatoDto.getEndereco() == null || lavaJatoDto.getEndereco().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endereço é obrigatório");
        }

        if (lavaJatoDto.getCidade() == null || lavaJatoDto.getCidade().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cidade é obrigatória");
        }

        if (lavaJatoDto.getEstado() == null || lavaJatoDto.getEstado().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado é obrigatório");
        }

        if (lavaJatoDto.getTelefone() == null || lavaJatoDto.getTelefone().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefone é obrigatório");
        }
    }
}
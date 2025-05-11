package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.dtos.ServicoDto;
import com.lavexpress.laveexpress.entities.LavaJato;
import com.lavexpress.laveexpress.entities.Servico;
import com.lavexpress.laveexpress.mappers.ServicoMapper;
import com.lavexpress.laveexpress.repositories.LavaJatoRepository;
import com.lavexpress.laveexpress.repositories.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Serviço para operações relacionadas a serviços de lavagem
 */
@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private LavaJatoRepository lavaJatoRepository;

    @Autowired
    private ServicoMapper servicoMapper;

    /**
     * Lista todos os serviços
     * @return Lista de DTOs de serviços
     */
    @Transactional(readOnly = true)
    public List<ServicoDto> listarTodos() {
        List<Servico> servicos = servicoRepository.findAll();
        return servicoMapper.toDtoList(servicos);
    }

    /**
     * Lista os serviços de um lava-jato específico
     * @param lavaJatoId ID do lava-jato
     * @return Lista de DTOs de serviços do lava-jato
     */
    @Transactional(readOnly = true)
    public List<ServicoDto> listarPorLavaJato(Long lavaJatoId) {
        LavaJato lavaJato = lavaJatoRepository.findById(lavaJatoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        List<Servico> servicos = servicoRepository.findByLavaJato(lavaJato);
        return servicoMapper.toDtoList(servicos);
    }

    /**
     * Lista os serviços ativos de um lava-jato
     * @param lavaJatoId ID do lava-jato
     * @return Lista de DTOs de serviços ativos do lava-jato
     */
    @Transactional(readOnly = true)
    public List<ServicoDto> listarAtivosPorLavaJato(Long lavaJatoId) {
        LavaJato lavaJato = lavaJatoRepository.findById(lavaJatoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lava-jato não encontrado"));

        List<Servico> servicos = servicoRepository.findByLavaJatoAndAtivoTrue(lavaJato);
        return servicoMapper.toDtoList(servicos);
    }

    /**
     * Lista os serviços por categoria
     * @param categoria Categoria de serviço
     * @return Lista de DTOs de serviços da categoria
     */
    @Transactional(readOnly = true)
    public List<ServicoDto> listarPorCategoria(String categoria) {
        List<Servico> servicos = servicoRepository.findByCategoria(categoria);
        return servicoMapper.toDtoList(servicos);
    }

    /**
     * Busca um serviço pelo ID
     * @param id ID do serviço
     * @return DTO do serviço
     */
    @Transactional(readOnly = true)
    public ServicoDto buscarPorId(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        return servicoMapper.toDto(servico);
    }

    /**
     * Busca serviços por nome (busca parcial)
     * @param nome Parte do nome para busca
     * @return Lista de DTOs de serviços encontrados
     */
    @Transactional(readOnly = true)
    public List<ServicoDto> buscarPorNome(String nome) {
        List<Servico> servicos = servicoRepository.findByNomeContainingIgnoreCase(nome);
        return servicoMapper.toDtoList(servicos);
    }

    /**
     * Busca serviços por faixa de preço
     * @param precoMinimo Preço mínimo
     * @param precoMaximo Preço máximo
     * @return Lista de DTOs de serviços na faixa de preço
     */
    @Transactional(readOnly = true)
    public List<ServicoDto> buscarPorFaixaDePreco(BigDecimal precoMinimo, BigDecimal precoMaximo) {
        List<Servico> servicos = servicoRepository.findByPrecoGreaterThanEqualAndPrecoLessThanEqual(precoMinimo, precoMaximo);
        return servicoMapper.toDtoList(servicos);
    }

    /**
     * Lista os serviços mais populares
     * @param limit Limite de resultados
     * @return Lista de DTOs de serviços mais populares
     */
    @Transactional(readOnly = true)
    public List<ServicoDto> listarMaisPopulares(int limit) {
        List<Servico> servicos = servicoRepository.findMostPopularServices(limit);
        return servicoMapper.toDtoList(servicos);
    }

    /**
     * Cria um novo serviço
     * @param servicoDto Dados do serviço
     * @return DTO do serviço criado
     */
    @Transactional
    public ServicoDto criar(ServicoDto servicoDto) {
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

        return servicoMapper.toDto(servico);
    }

    /**
     * Atualiza um serviço existente
     * @param id ID do serviço
     * @param servicoDto Novos dados do serviço
     * @return DTO do serviço atualizado
     */
    @Transactional
    public ServicoDto atualizar(Long id, ServicoDto servicoDto) {
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

        return servicoMapper.toDto(servico);
    }

    /**
     * Atualiza o status de um serviço
     * @param id ID do serviço
     * @param ativoMap Mapa contendo o novo estado (ativo: true/false)
     * @return DTO do serviço atualizado
     */
    @Transactional
    public ServicoDto atualizarStatus(Long id, Map<String, Boolean> ativoMap) {
        Boolean ativo = ativoMap.get("ativo");

        if (ativo == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo 'ativo' não informado");
        }

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        servico.setAtivo(ativo);
        servico = servicoRepository.save(servico);

        return servicoMapper.toDto(servico);
    }

    /**
     * Atualiza o preço de um serviço
     * @param id ID do serviço
     * @param precoMap Mapa contendo o novo preço
     * @return DTO do serviço atualizado
     */
    @Transactional
    public ServicoDto atualizarPreco(Long id, Map<String, BigDecimal> precoMap) {
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

        return servicoMapper.toDto(servico);
    }

    /**
     * Exclui um serviço
     * @param id ID do serviço
     * @return Mensagem de confirmação
     */
    @Transactional
    public String excluir(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        // Verificar se existem agendamentos vinculados a este serviço
        long agendamentosCount = servicoRepository.countAgendamentosByServicoId(id);

        if (agendamentosCount > 0) {
            // Em vez de excluir, apenas desativar
            servico.setAtivo(false);
            servicoRepository.save(servico);

            return "Serviço desativado pois possui agendamentos vinculados";
        }

        // Se não houver agendamentos, excluir
        servicoRepository.delete(servico);

        return "Serviço excluído com sucesso";
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
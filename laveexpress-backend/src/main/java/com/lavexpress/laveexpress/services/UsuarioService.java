package com.lavexpress.laveexpress.services;

import com.lavexpress.laveexpress.dtos.CadastroRequest;
import com.lavexpress.laveexpress.dtos.LoginRequest;
import com.lavexpress.laveexpress.dtos.UsuarioDto;
import com.lavexpress.laveexpress.entities.Usuario;
import com.lavexpress.laveexpress.mappers.UsuarioMapper;
import com.lavexpress.laveexpress.repositories.UsuarioRepository;
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
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Serviço para operações relacionadas a usuários
 */
@Service
public class UsuarioService {

    private static final String UPLOAD_DIR = "uploads/usuarios/";

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    /**
     * Lista todos os usuários
     * @return Lista de DTOs de usuários
     */
    @Transactional(readOnly = true)
    public List<UsuarioDto> listarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarioMapper.toDtoList(usuarios);
    }

    /**
     * Busca um usuário pelo ID
     * @param id ID do usuário
     * @return DTO do usuário
     */
    @Transactional(readOnly = true)
    public UsuarioDto buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        return usuarioMapper.toDto(usuario);
    }

    /**
     * Busca um usuário pelo email
     * @param email Email do usuário
     * @return DTO do usuário
     */
    @Transactional(readOnly = true)
    public UsuarioDto buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        return usuarioMapper.toDto(usuario);
    }

    /**
     * Busca usuários por nome (busca parcial)
     * @param nome Parte do nome para busca
     * @return Lista de DTOs de usuários encontrados
     */
    @Transactional(readOnly = true)
    public List<UsuarioDto> buscarPorNome(String nome) {
        List<Usuario> usuarios = usuarioRepository.findByNomeContainingIgnoreCase(nome);
        return usuarioMapper.toDtoList(usuarios);
    }

    /**
     * Cadastra um novo usuário
     * @param cadastroRequest Dados de cadastro
     * @return DTO do usuário cadastrado
     */
    @Transactional
    public UsuarioDto cadastrar(CadastroRequest cadastroRequest) {
        // Validações
        validarCadastro(cadastroRequest);

        // Verificar se email já existe
        if (usuarioRepository.existsByEmail(cadastroRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }

        // Verificar se CPF já existe
        if (usuarioRepository.existsByCpf(cadastroRequest.getCpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }

        // Criar usuário
        Usuario usuario = new Usuario();
        usuario.setNome(cadastroRequest.getNome());
        usuario.setEmail(cadastroRequest.getEmail());
        usuario.setSenha(cadastroRequest.getSenha()); // Em produção, usar hash de senha
        usuario.setCpf(cadastroRequest.getCpf());
        usuario.setTelefone(cadastroRequest.getTelefone());

        usuario = usuarioRepository.save(usuario);

        return usuarioMapper.toDto(usuario);
    }

    /**
     * Autentica um usuário
     * @param loginRequest Dados de login
     * @return DTO do usuário autenticado
     */
    @Transactional(readOnly = true)
    public UsuarioDto login(LoginRequest loginRequest) {
        // Em produção, usar verificação de hash de senha
        Optional<Usuario> usuario = usuarioRepository.findByEmailAndSenha(
                loginRequest.getEmail(), loginRequest.getSenha());

        if (usuario.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        return usuarioMapper.toDto(usuario.get());
    }

    /**
     * Atualiza um usuário existente
     * @param id ID do usuário
     * @param usuarioDto Novos dados do usuário
     * @return DTO do usuário atualizado
     */
    @Transactional
    public UsuarioDto atualizar(Long id, UsuarioDto usuarioDto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        // Validações
        validarUsuario(usuarioDto);

        // Verificar se email já existe para outro usuário
        if (!usuario.getEmail().equals(usuarioDto.getEmail()) &&
                usuarioRepository.existsByEmail(usuarioDto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado para outro usuário");
        }

        // Verificar se CPF já existe para outro usuário
        if (!usuario.getCpf().equals(usuarioDto.getCpf()) &&
                usuarioRepository.existsByCpf(usuarioDto.getCpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado para outro usuário");
        }

        // Atualizar campos
        usuario = usuarioMapper.updateEntityFromDto(usuario, usuarioDto);
        usuario = usuarioRepository.save(usuario);

        return usuarioMapper.toDto(usuario);
    }

    /**
     * Altera a senha de um usuário
     * @param id ID do usuário
     * @param senhaMap Mapa contendo senha atual e nova senha
     * @return Mensagem de confirmação
     */
    @Transactional
    public String alterarSenha(Long id, Map<String, String> senhaMap) {
        String senhaAtual = senhaMap.get("senhaAtual");
        String novaSenha = senhaMap.get("novaSenha");

        if (senhaAtual == null || novaSenha == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual e nova senha são obrigatórias");
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        // Verificar senha atual
        if (!usuario.getSenha().equals(senhaAtual)) { // Em produção, usar verificação de hash
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha atual incorreta");
        }

        // Validar nova senha
        if (novaSenha.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nova senha deve ter pelo menos 6 caracteres");
        }

        // Atualizar senha
        usuario.setSenha(novaSenha); // Em produção, salvar hash da senha
        usuarioRepository.save(usuario);

        return "Senha alterada com sucesso";
    }

    /**
     * Upload de foto de perfil
     * @param id ID do usuário
     * @param file Arquivo de imagem
     * @return URL da imagem salva
     */
    @Transactional
    public String uploadFoto(Long id, MultipartFile file) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

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

            // Atualizar URL da foto no usuário
            String photoUrl = "/api/uploads/usuarios/" + newFileName;
            usuario.setPhotoPath(photoUrl);
            usuarioRepository.save(usuario);

            return photoUrl;

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao salvar imagem: " + e.getMessage());
        }
    }

    /**
     * Exclui um usuário
     * @param id ID do usuário
     * @return Mensagem de confirmação
     */
    @Transactional
    public String excluir(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        // Verificar se existem agendamentos ou veículos vinculados
        long agendamentosCount = usuarioRepository.countAgendamentosByUsuarioId(id);
        long veiculosCount = usuarioRepository.countVeiculosByUsuarioId(id);

        if (agendamentosCount > 0 || veiculosCount > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Não é possível excluir usuário com agendamentos ou veículos vinculados");
        }

        usuarioRepository.delete(usuario);

        return "Usuário excluído com sucesso";
    }

    /**
     * Método auxiliar para validar os dados de cadastro
     * @param cadastroRequest Dados de cadastro
     */
    private void validarCadastro(CadastroRequest cadastroRequest) {
        if (cadastroRequest.getNome() == null || cadastroRequest.getNome().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome é obrigatório");
        }

        if (cadastroRequest.getEmail() == null || cadastroRequest.getEmail().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email é obrigatório");
        }

        if (cadastroRequest.getSenha() == null || cadastroRequest.getSenha().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha é obrigatória");
        }

        if (cadastroRequest.getSenha().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha deve ter pelo menos 6 caracteres");
        }

        if (!cadastroRequest.getSenha().equals(cadastroRequest.getConfirmacaoSenha())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senhas não coincidem");
        }

        if (cadastroRequest.getCpf() == null || cadastroRequest.getCpf().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CPF é obrigatório");
        }

        // Validar formato do CPF (xxx.xxx.xxx-xx ou xxxxxxxxxxx)
        String cpfRegex = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}|\\d{11}";
        if (!cadastroRequest.getCpf().matches(cpfRegex)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de CPF inválido");
        }
    }

    /**
     * Método auxiliar para validar os dados do usuário
     * @param usuarioDto DTO do usuário
     */
    private void validarUsuario(UsuarioDto usuarioDto) {
        if (usuarioDto.getNome() == null || usuarioDto.getNome().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome é obrigatório");
        }

        if (usuarioDto.getEmail() == null || usuarioDto.getEmail().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email é obrigatório");
        }

        if (usuarioDto.getCpf() == null || usuarioDto.getCpf().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CPF é obrigatório");
        }

        // Validar formato do CPF (xxx.xxx.xxx-xx ou xxxxxxxxxxx)
        String cpfRegex = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}|\\d{11}";
        if (!usuarioDto.getCpf().matches(cpfRegex)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de CPF inválido");
        }
    }
}
package com.lavexpress.laveexpress.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um estabelecimento de lava-jato
 */
@Entity
@Table(name = "lava_jato")
public class LavaJato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 200)
    private String endereco;

    @Column(nullable = false, length = 100)
    private String cidade;

    @Column(nullable = false, length = 2)
    private String estado;

    @Column(length = 10)
    private String cep;

    @Column(nullable = false, length = 20)
    private String telefone;

    @Column(length = 100)
    private String email;

    @Column(name = "horario_abertura", length = 8)
    private String horarioAbertura;

    @Column(name = "horario_fechamento", length = 8)
    private String horarioFechamento;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "imagem_url", length = 255)
    private String imagemUrl;

    @Column(precision = 10, scale = 6)
    private Double latitude;

    @Column(precision = 10, scale = 6)
    private Double longitude;

    @Column(name = "avaliacao_media", nullable = false)
    private Double avaliacaoMedia = 0.0;

    @Column(nullable = false)
    private boolean ativo = true;

    @OneToMany(mappedBy = "lavaJato", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Servico> servicos = new ArrayList<>();

    /**
     * Construtor padrão
     */
    public LavaJato() {
    }

    /**
     * Construtor com todos os campos
     */
    public LavaJato(Long id, String nome, String endereco, String cidade, String estado, String cep,
                    String telefone, String email, String horarioAbertura, String horarioFechamento,
                    String descricao, String imagemUrl, Double latitude, Double longitude,
                    Double avaliacaoMedia, boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.telefone = telefone;
        this.email = email;
        this.horarioAbertura = horarioAbertura;
        this.horarioFechamento = horarioFechamento;
        this.descricao = descricao;
        this.imagemUrl = imagemUrl;
        this.latitude = latitude;
        this.longitude = longitude;
        this.avaliacaoMedia = avaliacaoMedia != null ? avaliacaoMedia : 0.0;
        this.ativo = ativo;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHorarioAbertura() {
        return horarioAbertura;
    }

    public void setHorarioAbertura(String horarioAbertura) {
        this.horarioAbertura = horarioAbertura;
    }

    public String getHorarioFechamento() {
        return horarioFechamento;
    }

    public void setHorarioFechamento(String horarioFechamento) {
        this.horarioFechamento = horarioFechamento;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getAvaliacaoMedia() {
        return avaliacaoMedia;
    }

    public void setAvaliacaoMedia(Double avaliacaoMedia) {
        this.avaliacaoMedia = avaliacaoMedia;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public List<Servico> getServicos() {
        return servicos;
    }

    public void setServicos(List<Servico> servicos) {
        this.servicos = servicos;
    }

    /**
     * Adiciona um serviço à lista de serviços do lava-jato
     * @param servico serviço a ser adicionado
     */
    public void addServico(Servico servico) {
        servicos.add(servico);
        servico.setLavaJato(this);
    }

    /**
     * Remove um serviço da lista de serviços do lava-jato
     * @param servico serviço a ser removido
     */
    public void removeServico(Servico servico) {
        servicos.remove(servico);
        servico.setLavaJato(null);
    }
}
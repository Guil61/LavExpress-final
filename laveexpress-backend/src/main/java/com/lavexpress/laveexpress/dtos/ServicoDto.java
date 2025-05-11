package com.lavexpress.laveexpress.dtos;

import java.math.BigDecimal;

/**
 * DTO para transferência de dados de Serviço
 */
public class ServicoDto {

    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer duracaoMinutos;
    private String categoria;
    private boolean ativo;
    private Long lavaJatoId;
    private String lavaJatoNome;

    // Construtores
    public ServicoDto() {
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public void setDuracaoMinutos(Integer duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public Long getLavaJatoId() {
        return lavaJatoId;
    }

    public void setLavaJatoId(Long lavaJatoId) {
        this.lavaJatoId = lavaJatoId;
    }

    public String getLavaJatoNome() {
        return lavaJatoNome;
    }

    public void setLavaJatoNome(String lavaJatoNome) {
        this.lavaJatoNome = lavaJatoNome;
    }
}
package com.lavexpress.laveexpress.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para transferência de dados de Agendamento
 */
public class AgendamentoDto {

    private Long id;
    private LocalDateTime dataHora;
    private String observacoes;
    private String status;
    private BigDecimal valorTotal;
    private Long usuarioId;
    private String usuarioNome;
    private Long veiculoId;
    private String veiculoDescricao;
    private Long lavaJatoId;
    private String lavaJatoNome;
    private Long servicoId;
    private String servicoNome;

    // Construtores
    public AgendamentoDto() {
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public void setUsuarioNome(String usuarioNome) {
        this.usuarioNome = usuarioNome;
    }

    public Long getVeiculoId() {
        return veiculoId;
    }

    public void setVeiculoId(Long veiculoId) {
        this.veiculoId = veiculoId;
    }

    public String getVeiculoDescricao() {
        return veiculoDescricao;
    }

    public void setVeiculoDescricao(String veiculoDescricao) {
        this.veiculoDescricao = veiculoDescricao;
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

    public Long getServicoId() {
        return servicoId;
    }

    public void setServicoId(Long servicoId) {
        this.servicoId = servicoId;
    }

    public String getServicoNome() {
        return servicoNome;
    }

    public void setServicoNome(String servicoNome) {
        this.servicoNome = servicoNome;
    }
}
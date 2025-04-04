package com.lavexpress.laveexpress.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "servico")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    private String tipo;

    private Double valor;

    @ManyToOne
    @JoinColumn(name = "lava_jato_id", nullable = false)
    private LavaJato lavaJato;


    public Servico() {
    }

    public Servico(String descricao, String tipo, Double valor, LavaJato lavaJato) {
        this.descricao = descricao;
        this.tipo = tipo;
        this.valor = valor;
        this.lavaJato = lavaJato;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public LavaJato getLavaJato() {
        return lavaJato;
    }

    public void setLavaJato(LavaJato lavaJato) {
        this.lavaJato = lavaJato;
    }
}
package com.lavexpress.laveexpress.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime horario;

    private Double valor;

    private String tipo;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToOne
    @JoinColumn(name = "lava_jato_id", nullable = false)
    private LavaJato lavaJato;


    public Agendamento() {
    }

    public Agendamento(LocalDateTime horario, Double valor, String tipo, Servico servico, Usuario usuario, LavaJato lavaJato) {
        this.horario = horario;
        this.valor = valor;
        this.tipo = tipo;
        this.servico = servico;
        this.usuario = usuario;
        this.lavaJato = lavaJato;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getHorario() {
        return horario;
    }

    public void setHorario(LocalDateTime horario) {
        this.horario = horario;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LavaJato getLavaJato() {
        return lavaJato;
    }

    public void setLavaJato(LavaJato lavaJato) {
        this.lavaJato = lavaJato;
    }
}
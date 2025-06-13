package com.lavexpress.laveexpress.entities;

import com.lavexpress.laveexpress.enums.StatusAgendamento;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private StatusAgendamento statusAgendamento;

    private LocalDateTime dataHorario;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "lava_jato_id", nullable = false)
    private LavaJato lavaJato;


    public Agendamento() {
    }

    public Agendamento(LocalDateTime dataHorario, Servico servico, Usuario usuario, LavaJato lavaJato, StatusAgendamento statusAgendamento) {
        this.dataHorario = dataHorario;
        this.servico = servico;
        this.usuario = usuario;
        this.lavaJato = lavaJato;
        this.statusAgendamento = statusAgendamento;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataHorario() {
        return dataHorario;
    }

    public void setDataHorario(LocalDateTime dataHorario) {
        this.dataHorario = dataHorario;
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

    public StatusAgendamento getStatusAgendamento() {
        return statusAgendamento;
    }

    public void setStatusAgendamento(StatusAgendamento statusAgendamento) {
        this.statusAgendamento = statusAgendamento;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
}
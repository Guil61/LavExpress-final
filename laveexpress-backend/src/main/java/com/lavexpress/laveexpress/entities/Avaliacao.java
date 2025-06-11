package com.lavexpress.laveexpress.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Entity
@Table(name = "avaliacao")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "lavajato_id")
    private LavaJato lavaJato;


    @Min(1)
    @Max(5)
    private int nota;

    public Avaliacao() {
    }

    public Avaliacao(Long id, Usuario usuario, LavaJato lavaJato, int nota) {
        this.id = id;
        this.usuario = usuario;
        this.lavaJato = lavaJato;
        this.nota = nota;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public int getNota() {
        return nota;
    }

    public void setNota(int nota) {
        this.nota = nota;
    }
}

package com.lavexpress.laveexpress.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "lavaJato")
public class LavaJato {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String endereco;

    private String telefone;

    private String email;

    private String cnpj;

    private String latLong;


    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario proprietario;

    public LavaJato() {
    }

    public LavaJato(Long id, String nome, String endereco, String telefone, String email, String cnpj, Usuario proprietario, String latLong) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.cnpj = cnpj;
        this.proprietario = proprietario;
        this.latLong = latLong;
    }

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

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public Usuario getProprietario() {
        return proprietario;
    }

    public void setProprietario(Usuario proprietario) {
        this.proprietario = proprietario;
    }

    public String getLatLong() {return latLong;}

    public void setLatLong(String latLong) {this.latLong = latLong;}
}
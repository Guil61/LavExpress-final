package com.lavexpress.laveexpress.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

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

    @Column(columnDefinition = "TEXT")
    private String photoPath;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario proprietario;

    @OneToMany(mappedBy = "lavaJato", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avaliacao> avaliacoes = new ArrayList<>();

    @OneToMany(mappedBy = "lavaJato", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Servico> servicos = new ArrayList<>();

    public LavaJato() {
    }

    public LavaJato(Long id, String nome, String endereco, String telefone, String email, String cnpj, Usuario proprietario, String latLong, String photoPath) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.cnpj = cnpj;
        this.proprietario = proprietario;
        this.latLong = latLong;
        this.photoPath = photoPath;
    }

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public Usuario getProprietario() { return proprietario; }
    public void setProprietario(Usuario proprietario) { this.proprietario = proprietario; }

    public String getLatLong() { return latLong; }
    public void setLatLong(String latLong) { this.latLong = latLong; }

    public List<Avaliacao> getAvaliacoes() { return avaliacoes; }
    public void setAvaliacoes(List<Avaliacao> avaliacoes) { this.avaliacoes = avaliacoes; }

    public List<Servico> getServicos() { return servicos; }
    public void setServicos(List<Servico> servicos) { this.servicos = servicos; }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }
}

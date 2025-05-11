package com.lavexpress.laveexpress.dtos;

import java.util.List;

/**
 * DTO para transferência de dados de Usuário
 */
public class UsuarioDto {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private String photoPath;
    private List<VeiculoDto> veiculos;

    // Construtores
    public UsuarioDto() {
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public List<VeiculoDto> getVeiculos() {
        return veiculos;
    }

    public void setVeiculos(List<VeiculoDto> veiculos) {
        this.veiculos = veiculos;
    }
}
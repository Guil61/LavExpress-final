package com.lavexpress.laveexpress.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "veiculo")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String placa;
    private String modelo;
    private String ano;
    private String marca;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false) // Chave estrangeira para o usuário
    private Usuario proprietario;

    // Construtores
    public Veiculo() {
    }

    public Veiculo(long id, String placa, String modelo, String ano, String marca, Usuario proprietario) {
        this.id = id;
        this.placa = placa;
        this.modelo = modelo;
        this.ano = ano;
        this.marca = marca;
        this.proprietario = proprietario;
    }

    // Getters e setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getAno() {
        return ano;
    }

    public void setAno(String ano) {
        this.ano = ano;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public Usuario getProprietario() {
        return proprietario;
    }

    public void setProprietario(Usuario proprietario) {
        this.proprietario = proprietario;
    }
}
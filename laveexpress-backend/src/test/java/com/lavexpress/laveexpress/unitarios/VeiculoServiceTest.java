package com.lavexpress.laveexpress.unitarios;

import com.lavexpress.laveexpress.dtos.VeiculoRequest;
import com.lavexpress.laveexpress.dtos.VeiculoResponse;
import com.lavexpress.laveexpress.entities.Veiculo;
import com.lavexpress.laveexpress.mappers.VeiculoMapper;
import com.lavexpress.laveexpress.repositories.VeiculoRepository;
import com.lavexpress.laveexpress.services.VeiculoService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("VeiculoService")
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class VeiculoServiceTest {

    @InjectMocks
    private VeiculoService veiculoService;

    @Mock
    private VeiculoRepository veiculoRepository;

    @Mock
    private VeiculoMapper veiculoMapper;

    private Veiculo veiculo;
    private VeiculoRequest veiculoRequest;
    private VeiculoResponse veiculoResponse;

    @BeforeEach
    void setUp() {
        veiculo = new Veiculo();
        veiculo.setId(1L);
        veiculo.setPlaca("ABC-1234");
        veiculo.setModelo("Civic");
        veiculo.setAno("2020");
        veiculo.setMarca("Honda");

        veiculoRequest = new VeiculoRequest(
                "ABC-1234",
                "Civic",
                "2020",
                "Honda",
                1L
        );

        veiculoResponse = new VeiculoResponse(
                1L,
                "ABC-1234",
                "Civic",
                "2020",
                "Honda",
                1L
        );
    }

    // ========== TESTES DO getRepository ==========

    @Test
    @DisplayName("Deve retornar o repository correto")
    public void getRepositorySucesso() {
        var repository = veiculoService.getRepository();

        assertNotNull(repository);
        assertEquals(veiculoRepository, repository);
    }

    // ========== TESTES DO create ==========

    @Test
    @DisplayName("Deve criar um veículo com sucesso")
    public void createVeiculoSucesso() {
        when(veiculoMapper.requestToEntity(veiculoRequest)).thenReturn(veiculo);
        when(veiculoRepository.save(veiculo)).thenReturn(veiculo);
        when(veiculoMapper.entityToResponse(veiculo)).thenReturn(veiculoResponse);

        var result = veiculoService.create(veiculoRequest);

        assertNotNull(result);
        assertEquals(veiculoResponse, result);
        verify(veiculoMapper).requestToEntity(veiculoRequest);
        verify(veiculoRepository).save(veiculo);
        verify(veiculoMapper).entityToResponse(veiculo);
    }

    // ========== TESTES DO update ==========

    @Test
    @DisplayName("Deve atualizar um veículo com sucesso")
    public void updateVeiculoSucesso() {
        var updateRequest = new VeiculoRequest(
                "XYZ-9876",
                "Corolla",
                "2022",
                "Toyota",
                1L
        );

        when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
        when(veiculoRepository.save(any(Veiculo.class))).thenReturn(veiculo);
        when(veiculoMapper.entityToResponse(veiculo)).thenReturn(veiculoResponse);

        var result = veiculoService.update(updateRequest, 1L);

        assertNotNull(result);
        assertEquals(veiculoResponse, result);
        verify(veiculoRepository).findById(1L);
        verify(veiculoRepository).save(veiculo);
        verify(veiculoMapper).entityToResponse(veiculo);
    }

    @Test
    @DisplayName("Deve atualizar apenas campos não nulos")
    public void updateApenasCaracteristicasNaoNulas() {
        var updateParcial = new VeiculoRequest(
                "XYZ-9876",
                null,
                null,
                "Toyota",
                1L
        );

        when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
        when(veiculoRepository.save(any(Veiculo.class))).thenReturn(veiculo);
        when(veiculoMapper.entityToResponse(veiculo)).thenReturn(veiculoResponse);

        veiculoService.update(updateParcial, 1L);

        assertEquals("XYZ-9876", veiculo.getPlaca());
        assertEquals("Civic", veiculo.getModelo());
        assertEquals("2020", veiculo.getAno());
        assertEquals("Toyota", veiculo.getMarca());

        verify(veiculoRepository).findById(1L);
        verify(veiculoRepository).save(veiculo);
    }

    @Test
    @DisplayName("Deve lançar exceção quando veículo não for encontrado para atualização")
    public void updateVeiculoNaoEncontrado() {
        when(veiculoRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            veiculoService.update(veiculoRequest, 1L);
        });

        assertEquals("Não foi possível encontrar o veiculo", exception.getMessage());
        verify(veiculoRepository).findById(1L);
        verify(veiculoRepository, never()).save(any());
        verify(veiculoMapper, never()).entityToResponse(any());
    }

    // ========== TESTES DO findByIdResponse ==========

    @Test
    @DisplayName("Deve buscar veículo por ID e retornar response")
    public void findByIdResponseSucesso() {
        when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
        when(veiculoMapper.entityToResponse(veiculo)).thenReturn(veiculoResponse);

        var result = veiculoService.findByIdResponse(1L);

        assertNotNull(result);
        assertEquals(veiculoResponse, result);
        verify(veiculoRepository).findById(1L);
        verify(veiculoMapper).entityToResponse(veiculo);
    }

    @Test
    @DisplayName("Deve lançar exceção quando veículo não for encontrado por ID para response")
    public void findByIdResponseNaoEncontrado() {
        when(veiculoRepository.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            veiculoService.findByIdResponse(1L);
        });

        assertEquals("Veículo nao encontrado", exception.getMessage());
        verify(veiculoRepository).findById(1L);
        verify(veiculoMapper, never()).entityToResponse(any());
    }

    // ========== TESTES DO findById ==========

    @Test
    @DisplayName("Deve buscar veículo por ID e retornar entidade")
    public void findByIdSucesso() {
        when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));

        var result = veiculoService.findById(1L);

        assertNotNull(result);
        assertEquals(veiculo, result);
        verify(veiculoRepository).findById(1L);
    }

    @Test
    @DisplayName("Deve lançar exceção quando veículo não for encontrado por ID")
    public void findByIdNaoEncontrado() {
        when(veiculoRepository.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            veiculoService.findById(1L);
        });

        assertEquals("Veiculo nao encontrado para o id1", exception.getMessage());
        verify(veiculoRepository).findById(1L);
    }

    // ========== TESTES EDGE CASES ==========

    @Test
    @DisplayName("Deve lidar com request com todos os campos nulos na atualização")
    public void updateComTodosCamposNulos() {
        var requestNulos = new VeiculoRequest(null, null, null, null, null);
        String placaOriginal = veiculo.getPlaca();
        String modeloOriginal = veiculo.getModelo();
        String anoOriginal = veiculo.getAno();
        String marcaOriginal = veiculo.getMarca();

        when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
        when(veiculoRepository.save(any(Veiculo.class))).thenReturn(veiculo);
        when(veiculoMapper.entityToResponse(veiculo)).thenReturn(veiculoResponse);

        veiculoService.update(requestNulos, 1L);

        assertEquals(placaOriginal, veiculo.getPlaca());
        assertEquals(modeloOriginal, veiculo.getModelo());
        assertEquals(anoOriginal, veiculo.getAno());
        assertEquals(marcaOriginal, veiculo.getMarca());

        verify(veiculoRepository).findById(1L);
        verify(veiculoRepository).save(veiculo);
    }

    @Test
    @DisplayName("Deve criar veículo mesmo com ano nulo")
    public void createVeiculoComAnoNulo() {
        var requestAnoNulo = new VeiculoRequest(
                "ABC-1234",
                "Civic",
                null,
                "Honda",
                1L
        );

        var veiculoAnoNulo = new Veiculo();
        veiculoAnoNulo.setPlaca("ABC-1234");
        veiculoAnoNulo.setModelo("Civic");
        veiculoAnoNulo.setAno(null);
        veiculoAnoNulo.setMarca("Honda");

        when(veiculoMapper.requestToEntity(requestAnoNulo)).thenReturn(veiculoAnoNulo);
        when(veiculoRepository.save(veiculoAnoNulo)).thenReturn(veiculoAnoNulo);
        when(veiculoMapper.entityToResponse(veiculoAnoNulo)).thenReturn(veiculoResponse);

        var result = veiculoService.create(requestAnoNulo);

        assertNotNull(result);
        verify(veiculoMapper).requestToEntity(requestAnoNulo);
        verify(veiculoRepository).save(veiculoAnoNulo);
        verify(veiculoMapper).entityToResponse(veiculoAnoNulo);
    }

    @Test
    @DisplayName("Deve atualizar veículo com ID diferente")
    public void updateVeiculoIdDiferente() {
        Long idDiferente = 999L;

        when(veiculoRepository.findById(idDiferente)).thenReturn(Optional.of(veiculo));
        when(veiculoRepository.save(any(Veiculo.class))).thenReturn(veiculo);
        when(veiculoMapper.entityToResponse(veiculo)).thenReturn(veiculoResponse);

        var result = veiculoService.update(veiculoRequest, idDiferente);

        assertNotNull(result);
        verify(veiculoRepository).findById(idDiferente);
        verify(veiculoRepository).save(veiculo);
    }
}
// inicio.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Service e interfaces
import { LavajatosService, Lavajato, LavajatoFilter, PageResponse } from '../../services/lavajatos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio-component.html',
  styleUrls: ['./inicio-component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class InicioComponent implements OnInit {

  searchForm: FormGroup;
  filtersForm: FormGroup;

  lavajatosList: any[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';

  userLocation = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private lavajatosService: LavajatosService
  ) {
    this.searchForm = this.formBuilder.group({
      searchQuery: ['']
    });

    this.filtersForm = this.formBuilder.group({
      avaliacao: [0],
      proximidade: [false]
    });
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setupFormSubscriptions();
  }

  private async initializeComponent(): Promise<void> {
    try {
      this.userLocation = await this.lavajatosService.obterLocalizacaoUsuario();
      console.log('Localização do usuário:', this.userLocation);

      this.loadLavajatosProximos();

    } catch (error) {
      console.error('Erro na inicialização:', error);
      this.handleError('Erro ao inicializar aplicação');
    }
  }

  private setupFormSubscriptions(): void {
    this.searchForm.get('searchQuery')?.valueChanges.subscribe(value => {
      if (value && value.trim().length > 2) {
        this.onSearchChange(value.trim());
      } else if (!value || value.trim().length === 0) {
        this.loadLavajatosProximos();
      }
    });

    // Observar mudanças nos filtros
    this.filtersForm.valueChanges.subscribe(filters => {
      this.onFiltersChange(filters);
    });
  }

  // =============== MÉTODOS DE CARREGAMENTO ===============

  loadLavaJatos(): void {
    this.loadLavajatosProximos();
  }

  loadLavajatosProximos(): void {
    if (!this.userLocation) {
      this.loadLavajatosDefault();
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    this.lavajatosService.buscarProximos(this.userLocation, 10) // 10km de raio
      .subscribe({
        next: (lavajatos) => {
          this.lavajatosList = this.transformData(lavajatos);
          this.isLoading = false;
          console.log('Lava-jatos próximos carregados:', this.lavajatosList.length);
        },
        error: (error) => {
          console.error('Erro ao carregar lava-jatos próximos:', error);
          this.loadLavajatosDefault();
        }
      });
  }

  loadLavajatosDefault(): void {
    this.isLoading = true;
    this.hasError = false;

    this.lavajatosService.getLavajatos(0, 10)
      .subscribe({
        next: (response: PageResponse<Lavajato>) => {
          this.lavajatosList = this.transformData(response.content);
          this.isLoading = false;
          console.log('Lava-jatos carregados:', this.lavajatosList.length);
        },
        error: (error) => {
          console.error('Erro ao carregar lava-jatos:', error);
          this.handleError('Não foi possível carregar os lava-jatos. Verifique sua conexão.');
        }
      });
  }

  // =============== MÉTODOS DE BUSCA E FILTROS ===============

  onSearchChange(searchQuery: string): void {
    this.isLoading = true;

    this.lavajatosService.buscarPorNome(searchQuery, 0, 10)
      .subscribe({
        next: (response: PageResponse<Lavajato>) => {
          this.lavajatosList = this.transformData(response.content);
          this.isLoading = false;
          console.log('Busca realizada:', searchQuery, 'Resultados:', this.lavajatosList.length);
        },
        error: (error) => {
          console.error('Erro na busca:', error);
          this.handleError('Erro ao realizar busca. Tente novamente.');
        }
      });
  }

  onFiltersChange(filters: any): void {
    if (!filters.avaliacao && !filters.proximidade) {
      this.loadLavajatosProximos();
      return;
    }

    this.isLoading = true;

    const filter: LavajatoFilter = {
      avaliacao: filters.avaliacao || 0,
      latLong: filters.proximidade ? this.userLocation : ''
    };

    this.lavajatosService.filtrarLavajatos(filter, 0, 10)
      .subscribe({
        next: (response: PageResponse<Lavajato>) => {
          this.lavajatosList = this.transformData(response.content);
          this.isLoading = false;
          console.log('Filtros aplicados:', filter, 'Resultados:', this.lavajatosList.length);
        },
        error: (error) => {
          console.error('Erro ao aplicar filtros:', error);
          this.handleError('Erro ao aplicar filtros. Tente novamente.');
        }
      });
  }

  onFilterChange(filterType: string, value: string): void {
    // Método mantido para compatibilidade
    console.log('Filtro aplicado:', filterType, value);
  }


  verDetalhes(lavajatoId: number): void {
    this.router.navigate(['/lavajato', lavajatoId]);
  }

  agendar(lavajatoId: number): void {
    this.router.navigate(['/lavajato', lavajatoId]);
  }

  navigateTo(route: string): void {
    switch(route) {
      case 'home':
        this.router.navigate(['/inicio']);
        break;
      case 'search':
        this.router.navigate(['/busca']);
        break;
      case 'appointments':
        this.router.navigate(['/agendamentos']);
        break;
      case 'profile':
        this.router.navigate(['/perfil']);
        break;
    }
  }

  onRefresh(): void {
    this.searchForm.patchValue({ searchQuery: '' });
    this.filtersForm.patchValue({ avaliacao: 0, proximidade: false });
    this.loadLavajatosProximos();
  }


  private transformData(lavajatos: Lavajato[]): any[] {
    return lavajatos.map(lavajato => ({
      id: lavajato.id,
      nome: lavajato.nome,
      endereco: lavajato.endereco,
      telefone: lavajato.telefone,
      imagem: lavajato.photoPath || 'assets/images/lavajato-default.jpg',
      avaliacao: lavajato.avaliacaoMedia || 0,
      precoMinimo: 20,
      tipos: lavajato.tipos || ['Lavagem Completa'],
      status: lavajato.status || 'aberto'
    }));
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    this.lavajatosList = [];
  }

  applyQuickFilter(filterType: string): void {
    switch(filterType) {
      case 'todos':
        this.filtersForm.patchValue({ avaliacao: 0, proximidade: false });
        break;
      case 'bem-avaliados':
        this.filtersForm.patchValue({ avaliacao: 4, proximidade: false });
        break;
      case 'proximos':
        this.filtersForm.patchValue({ avaliacao: 0, proximidade: true });
        break;
    }
  }

  getStarsArray(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);

    if (hasHalfStar) {
      stars += '☆';
    }

    const emptyStars = 5 - Math.ceil(rating);
    stars += '☆'.repeat(emptyStars);

    return stars;
  }

  calculateDistance(lat: number, lng: number): string {
    // TODO: Implementar cálculo de distância real usando coordenadas do usuário
    return '0.5 km'; // Mock
  }

  sortBy(criteria: 'distance' | 'rating' | 'price'): void {
    switch(criteria) {
      case 'distance':
        // TODO: Implementar ordenação por distância
        break;
      case 'rating':
        this.lavajatosList.sort((a, b) => b.avaliacao - a.avaliacao);
        break;
      case 'price':
        this.lavajatosList.sort((a, b) => a.precoMinimo - b.precoMinimo);
        break;
    }
  }
}

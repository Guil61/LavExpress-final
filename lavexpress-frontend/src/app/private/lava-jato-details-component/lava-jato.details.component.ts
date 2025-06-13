import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { LavajatosService, Lavajato } from '../../services/lavajatos.service';
import { ServicosService, Servico } from '../../services/services/servicos.service';

@Component({
  selector: 'app-lavajato-details',
  templateUrl: './lava-jato.details.component.html',
  styleUrls: ['./lava-jato.details.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class LavajatoDetailsComponent implements OnInit {

  lavajato: any = null;
  lavajatoId: number = 0;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  servicos: Servico[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lavajatosService: LavajatosService,
    private servicosService: ServicosService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.lavajatoId = +params['id'];
      this.loadLavajatoDetails();
    });
  }

  loadLavajatoDetails(): void {
    this.isLoading = true;
    this.hasError = false;

    this.lavajatosService.getLavajatoById(this.lavajatoId)
      .subscribe({
        next: (response: any) => {
          this.lavajato = this.transformLavajatoData(response);
          console.log('Detalhes do lavajato carregados:', this.lavajato);

          this.loadServicos();
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes do lavajato:', error);
          this.handleError('Não foi possível carregar os detalhes do lavajato.');
        }
      });
  }

  loadServicos(): void {
    this.servicosService.getServicosPorLavajato(this.lavajatoId)
      .subscribe({
        next: (servicos: Servico[]) => {
          this.servicos = servicos;
          this.isLoading = false;
          console.log('Serviços carregados:', this.servicos);
        },
        error: (error) => {
          console.error('Erro ao carregar serviços:', error);
          this.isLoading = false;
          this.servicos = [];
        }
      });
  }

  private transformLavajatoData(response: any): any {
    return {
      id: response.id,
      nome: response.nome,
      endereco: response.endereco,
      telefone: response.telefone,
      email: response.email,
      cnpj: response.cnpj,
      imagem: response.photoPath || 'assets/images/lavajato-default.jpg',
      avaliacao: response.avaliacaoMedia || 0,
      totalAvaliacoes: response.totalAvaliacoes || 0,
      latLong: response.latLong
    };
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }

  agendar(): void {
    this.router.navigate(['/agendar'], {
      queryParams: {
        lavajatoId: this.lavajatoId
      }
    });
  }

  formatarPreco(preco: number): string {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  trackByServiceId(index: number, servico: Servico): number {
    return servico.id;
  }
}

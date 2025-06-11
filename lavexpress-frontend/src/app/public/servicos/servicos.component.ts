import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss']
})
export class ServicosComponent {
  lavajatoId: number | null = null;
  servicos: Servico[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.lavajatoId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.lavajatoId === 1) {
      this.servicos = [
        { id: 1, nome: 'Lavagem Completa', descricao: 'Lavagem interna e externa', preco: 70 },
        { id: 2, nome: 'Lavagem Externa', descricao: 'Só lavagem externa', preco: 40 },
      ];
    } else if (this.lavajatoId === 2) {
      this.servicos = [
        { id: 3, nome: 'Lavagem Rápida', descricao: 'Lavagem rápida e eficiente', preco: 30 },
        { id: 4, nome: 'Polimento', descricao: 'Polimento completo do carro', preco: 120 },
      ];
    } else {
      this.servicos = [
        { id: 5, nome: 'Lavagem Simples', descricao: 'Lavagem básica', preco: 25 }
      ];
    }
  }

  selecionarServico(servico: Servico) {
    alert(`Serviço selecionado: ${servico.nome} por R$${servico.preco}`);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LavajatosService, Lavajato } from '../../services/lavajatos.service';

@Component({
  selector: 'app-lavajato-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lavajato-detail.component.html',
  styleUrls: ['./lavajato-detail.component.scss']
})
export class LavajatoDetailComponent implements OnInit {
  lavajato: Lavajato | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private lavajatosService: LavajatosService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.lavajatosService.getLavajatoById(id).subscribe({
        next: (data) => {
          if (data) {
            this.lavajato = data;
          } else {
            this.errorMessage = 'Lavajato não encontrado.';
          }
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Erro ao carregar os dados.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'ID inválido.';
      this.isLoading = false;
    }
  }
}

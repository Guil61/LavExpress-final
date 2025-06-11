import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; //
import { RouterModule, Router } from '@angular/router';
import { LavajatosService, Lavajato } from '../../services/lavajatos.service';
@Component({
  selector: 'app-lavajatos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './lavajatos-list.component.html',
  styleUrls: ['./lavajatos-list.component.scss']
})
export class LavajatosListComponent implements OnInit {

  lavajatos: Lavajato[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private lavajatosService: LavajatosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLavajatos();
  }

  loadLavajatos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.lavajatosService.getLavajatos().subscribe({
      next: (data) => {
        console.log('Lavajatos carregados:', data);
        this.lavajatos = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar lavajatos. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  selectLavajato(id: number): void {
    this.router.navigate(['/lavajato', id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; //
import { RouterModule, Router } from '@angular/router';
import {LavajatosService, Lavajato} from '../../public/services/lava-jato.service';

@Component({
  selector: 'app-inicio-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './inicio-component.html',
  styleUrls: ['./inicio-component.scss']
})
export class InicioComponent implements OnInit {

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

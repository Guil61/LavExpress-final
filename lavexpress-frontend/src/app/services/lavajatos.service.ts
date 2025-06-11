import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Lavajato {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  avaliacao: number;
  imagemUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class LavajatosService {


  private lavajatosMock: Lavajato[] = [
    {
      id: 1,
      nome: 'Lavajato andrezão',
      endereco: 'Rua A, 123',
      telefone: '(11) 99999-9999',
      avaliacao: 4.5,
      imagemUrl: ''
    },
    {
      id: 2,
      nome: 'Lavajato naka',
      endereco: 'Av. B, 456',
      telefone: '(11) 98888-8888',
      avaliacao: 4.0,
      imagemUrl: ''
    }
  ];

  constructor() { }

  getLavajatos(): Observable<Lavajato[]> {
    return of(this.lavajatosMock);
  }

  getLavajatoById(id: number): Observable<Lavajato | undefined> {
    const lavajato = this.lavajatosMock.find(l => l.id === id);
    return of(lavajato);
  }
}

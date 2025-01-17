import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nave, RespostaAPI } from './naves.interface';

@Injectable({
  providedIn: 'root',
})
export class NavesService {
  private apiUrl = 'https://swapi.dev/api/starships';

  constructor(private http: HttpClient) {}

  /**
   * Obtém as naves da API com suporte a paginação e busca.
   * @param page Número da página (opcional, padrão: 1)
   * @param search Termo de busca (opcional)
   * @returns Observable contendo os dados da resposta da API.
   */
  getNaves(page: number = 1, pageSize: number = 5): Observable<RespostaAPI<Nave>> {
    const url = `${this.apiUrl}/?page=${page}&pageSize=${pageSize}`;
    return this.http.get<RespostaAPI<Nave>>(url);
  }
}

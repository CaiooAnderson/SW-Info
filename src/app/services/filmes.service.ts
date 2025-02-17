import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Filme, RespostaAPI } from './filmes.interface';

@Injectable({
  providedIn: 'root',
})
export class FilmesService {
  private readonly apiUrl = 'https://swapi.dev/api/films';

  constructor(private http: HttpClient) {}

  getFilmePorId(id: string): Observable<Filme> {
    return this.http.get<Filme>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => new Error('Filme não encontrado'));
      })
    );
  }

  getFilmes(search?: string): Observable<RespostaAPI<Filme>> {
    return this.http.get<RespostaAPI<Filme>>(`${this.apiUrl}${search ? `?search=${search}` : ''}`);
  }

  getPlaneta(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}

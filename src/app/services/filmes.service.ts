import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filme, RespostaAPI } from './filmes.interface';

@Injectable({
  providedIn: 'root',
})
export class FilmesService {
  private apiUrl = 'https://swapi.dev/api/films';

  constructor(private http: HttpClient) {}

  getFilmePorId(id: string): Observable<Filme> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Filme>(url);
  }
  
  getFilmes(search?: string): Observable<RespostaAPI<Filme>> {
    const url = search ? `${this.apiUrl}?search=${search}` : this.apiUrl;
    return this.http.get<RespostaAPI<Filme>>(url);
  }
}


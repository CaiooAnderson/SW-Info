import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filme, RespostaAPI } from './filmes.interface';

@Injectable({
  providedIn: 'root',
})
export class FilmesService {
  private apiUrl = 'https://swapi.py4e.com/api/films';

  constructor(private http: HttpClient) {}

  getFilmes(): Observable<RespostaAPI<Filme>> {
    return this.http.get<RespostaAPI<Filme>>(this.apiUrl);
  }
}
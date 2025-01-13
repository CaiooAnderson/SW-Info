import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FilmesService {
  private filmesUrl = 'assets/filmes.json';

  constructor(private http: HttpClient) {}

  getFilmes(): Observable<any[]> {
    return this.http.get<any>(this.filmesUrl).pipe(
      map((response) => response.results)
    );
  }
}
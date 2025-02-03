import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Nave } from './naves.interface';

@Injectable({
  providedIn: 'root',
})
export class NavesService {
  private apiUrl = 'https://swapi.dev/api/starships/';

  constructor(private http: HttpClient) {}

  /**
   * @returns
   */
  getTodasNaves(): Observable<Nave[]> {
    let allNaves: Nave[] = [];

    const fetchPage = (url: string): Observable<any> => {
      return this.http.get<any>(url).pipe(
        switchMap(response => {
          allNaves = [...allNaves, ...response.results];
          return response.next ? fetchPage(response.next) : of(allNaves);
        })
      );
    };

    return fetchPage(this.apiUrl);
  }

  getNavePorId(id: string): Observable<Nave> {
    return this.http.get<Nave>(`${this.apiUrl}${id}/`);
  }
  
  getFilmesETripulantes(urls: string[]): Observable<any[]> {
    return urls.length
      ? forkJoin(urls.map(url => this.http.get(url)))
      : of([]);
  }
}
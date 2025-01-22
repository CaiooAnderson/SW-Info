import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
}
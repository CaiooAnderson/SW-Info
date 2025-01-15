import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nave, RespostaAPI } from './naves.interface';

@Injectable({
  providedIn: 'root',
})
export class NavesService {
  private apiUrl = 'https://swapi.py4e.com/api/starships';

  constructor(private http: HttpClient) {}

  getNaves(search?: string): Observable<RespostaAPI<Nave>> {
    const url = search ? `${this.apiUrl}?search=${search}` : this.apiUrl;
    return this.http.get<RespostaAPI<Nave>>(url);
  }
}
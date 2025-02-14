import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';
import { Personagem } from './inicio.interface';

@Injectable({
  providedIn: 'root',
})
export class InicioService {
  private apiUrl = 'https://swapi.dev/api/people/';
  private isSearchActive = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  buscarTodosOsPersonagens(): Observable<Personagem[]> {
    const fetchPage = (url: string): Observable<Personagem[]> => {
      return this.http.get<{ results: any[], next: string | null }>(url).pipe(
        switchMap(response => {
          const personagensObservables = response.results.map(character => this.processarPersonagem(character));
          return forkJoin(personagensObservables).pipe(
            switchMap(personagens => {
              if (response.next) {
                return fetchPage(response.next).pipe(map(nextPageResults => [...personagens, ...nextPageResults]));
              } else {
                return of(personagens);
              }
            })
          );
        })
      );
    };
  
    return fetchPage(this.apiUrl);
  }

  buscarTodasEspecies(): Observable<any[]> {
    let allSpecies: any[] = [];
    let url = 'https://swapi.dev/api/species/';
  
    const fetchPage = (url: string): Observable<any[]> => {
      return this.http.get<any>(url).pipe(
        switchMap(response => {
          allSpecies = [...allSpecies, ...response.results]; 
  
          return response.next ? fetchPage(response.next) : of(allSpecies);
        })
      );
    };
  
    return fetchPage(url);
  }

  buscarPersonagens(searchTerm: string): Observable<Personagem[]> {
    this.isSearchActive.next(true);
    return this.http.get<{ results: any[] }>(`${this.apiUrl}?search=${searchTerm}`).pipe(
      switchMap(response => {
        const personagensObservables = response.results.map(character => this.processarPersonagem(character));
        return forkJoin(personagensObservables);
      }),
      finalize(() => this.isSearchActive.next(false))
    );
  }

  carregarPersonagensAleatorios(): Observable<Personagem[]> {
    if (this.isSearchActive.getValue()) {
      return of([]);
    }

    const randomIndexes = this.getUniqueRandomIndexes(2, 1, 82);
    const requests = randomIndexes.map(index => this.http.get<any>(`${this.apiUrl}${index}/`));

    return forkJoin(requests).pipe(
      switchMap(results => {
        const personagensObservables = results.map(character => this.processarPersonagem(character));
        return forkJoin(personagensObservables);
      })
    );
  }

  buscarPersonagensPorFiltro(gender: string, species: string[]): Observable<Personagem[]> {
    return this.buscarTodosOsPersonagens().pipe(
      map(personagens => 
        personagens.filter(p =>
          (gender ? p.gender.toLowerCase() === gender.toLowerCase() : true) &&
          (species.length > 0 ? species.includes(p.species) : true)
        )
      )
    );
  }

  private processarPersonagem(character: any): Observable<Personagem> {
    const speciesUrl = character.species[0];

    return speciesUrl
      ? this.http.get<{ name: string }>(speciesUrl).pipe(
          map(speciesData => ({
            name: character.name,
            img: this.getPersonagemImage(character.name),
            species: speciesData.name || 'Desconhecido',
            gender: character.gender || 'Desconhecido',
          }))
        )
      : of({
          name: character.name,
          img: this.getPersonagemImage(character.name),
          species: 'Desconhecido',
          gender: character.gender || 'Desconhecido',
        });
  }

  private getPersonagemImage(name: string): string {
    const images: { [key: string]: string } = {
      'Luke Skywalker': '../../assets/characters/Luke_Skywalker.svg',
      'Darth Vader': '../../assets/characters/Darth_Vader.svg',
      'Leia Organa': '../../assets/characters/Leia_Organa.svg',
      'Obi-Wan Kenobi': '../../assets/characters/Obi_Wan_Kenobi.svg',
      'Yoda': '../../assets/characters/Yoda.svg',
    };
    return images[name] || '../../assets/characters/Unknown_Character.svg';
  }

  private getUniqueRandomIndexes(count: number, min: number, max: number): number[] {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      indexes.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(indexes);
  }
}

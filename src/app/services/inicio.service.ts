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
  private speciesMap: { [key: string]: string } = {};

  constructor(private http: HttpClient) {}

  buscarTodosOsPersonagens(): Observable<Personagem[]> {
    return this.buscarTodasEspecies().pipe(
      switchMap(speciesList => {
        this.speciesMap = speciesList.reduce((map, species) => {
          map[species.url] = species.name;
          return map;
        }, {});
  
        return this.fetchAllCharacters();
      })
    );
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
            img: this.getPersonagemImage(character.name).img, 
            title: this.getPersonagemImage(character.name).title,
            species: speciesData.name || 'Desconhecido',
            gender: character.gender || 'Desconhecido',
          }))
        )
      : of({
          name: character.name,
          img: this.getPersonagemImage(character.name).img,
          title: this.getPersonagemImage(character.name).title,
          species: 'Desconhecido',
          gender: character.gender || 'Desconhecido',
        });
  }

  private getPersonagemImage(name: string): { img: string, title: string } {
    const images: { [key: string]: { img: string, title: string } } = {
      'Luke Skywalker': { 
        img: '../../assets/characters/Luke_Skywalker.svg',
        title: 'Jedi'
      },
      'Darth Vader': {
        img: '../../assets/characters/Darth_Vader.svg',
        title: 'Sith'
      },
      'Leia Organa': {
        img: '../../assets/characters/Leia_Organa.svg',
        title: 'Rebelde'
      },
      'Obi-Wan Kenobi': {
        img: '../../assets/characters/Obi_Wan_Kenobi.svg',
        title: 'Jedi'
      },
      'Yoda': {
        img: '../../assets/characters/Yoda.svg',
        title: 'Jedi'
      },
    };
    return images[name] || { img: '../../assets/characters/Unknown_Character.svg', title: 'Desconhecido' };
  }

  private getUniqueRandomIndexes(count: number, min: number, max: number): number[] {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      indexes.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(indexes);
  }

  private fetchAllCharacters(): Observable<Personagem[]> {
    const totalPages = 9;
    const requests = [];
  
    for (let i = 1; i <= totalPages; i++) {
      requests.push(this.http.get<{ results: any[] }>(`${this.apiUrl}?page=${i}`));
    }
  
    return forkJoin(requests).pipe(
      map(responses => responses.flatMap(response => response.results)),
      switchMap(personagens => {
        const personagensCompletos = personagens.map(character => this.processarPersonagem(character));
        return forkJoin(personagensCompletos);
      })
    );
  }
}

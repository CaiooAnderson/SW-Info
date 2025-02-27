import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';
import { Personagem } from './inicio.interface';

@Injectable({ providedIn: 'root' })
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
    const fetchPage = (url: string, allSpecies: any[] = []): Observable<any[]> =>
      this.http.get<any>(url).pipe(
        switchMap(response => 
          response.next ? fetchPage(response.next, [...allSpecies, ...response.results]) : of([...allSpecies, ...response.results])
        )
      );

    return fetchPage('https://swapi.dev/api/species/');
  }

  buscarPersonagens(searchTerm: string): Observable<Personagem[]> {
    this.isSearchActive.next(true);
    return this.http.get<{ results: any[] }>(`${this.apiUrl}?search=${searchTerm}`).pipe(
      switchMap(response => forkJoin(response.results.map(character => this.processarPersonagem(character)))),
      finalize(() => this.isSearchActive.next(false))
    );
  }

  carregarPersonagensAleatorios(): Observable<Personagem[]> {
    if (this.isSearchActive.getValue()) return of([]);
    const randomIndexes = this.getUniqueRandomIndexes(2, 1, 82);
    return forkJoin(randomIndexes.map(index => this.http.get<any>(`${this.apiUrl}${index}/`))).pipe(
      switchMap(results => forkJoin(results.map(character => this.processarPersonagem(character))))
    );
  }

  buscarPersonagensPorFiltro(gender: string, species: string[]): Observable<Personagem[]> {
    return this.buscarTodosOsPersonagens().pipe(
      map(personagens =>
        personagens.filter(p =>
          (gender ? p.gender.toLowerCase() === gender.toLowerCase() : true) &&
          (species.length ? species.includes(p.species) : true)
        )
      )
    );
  }

  private processarPersonagem(character: any): Observable<Personagem> {
    const { name, species } = character;
    const speciesUrl = species[0];
    const personagemImage = this.getPersonagemImage(name);

    return speciesUrl
      ? this.http.get<{ name: string }>(speciesUrl).pipe(
          map(speciesData => ({
            name,
            img: personagemImage.img,
            title: personagemImage.title,
            species: speciesData.name || 'Desconhecido',
            gender: character.gender || 'Desconhecido',
          }))
        )
      : of({
          name,
          img: personagemImage.img,
          title: personagemImage.title,
          species: 'Desconhecido',
          gender: character.gender || 'Desconhecido',
        });
  }

  private getPersonagemImage(name: string): { img: string, title: string } {
    const roles: { [key: string]: string } = {
      'luke_skywalker': 'Jedi', 'c-3po': 'Droide', 'r2-d2': 'Droide',
      'darth_vader': 'Sith', 'leia_organa': 'Rebelde', 'owen_lars': 'Fazendeiro',
      'beru_whitesun_lars': 'Fazendeira', 'r5-d4': 'Droide', 'biggs_darklighter': 'Piloto Rebelde',
      'obi-wan_kenobi': 'Jedi', 'anakin_skywalker': 'Jedi/Sith', 'wilhuff_tarkin': 'Governador Imperial',
      'chewbacca': 'Wookiee', 'han_solo': 'Contrabandista', 'greedo': 'Caçador de Recompensas',
      'jabba_desilijic_tiure': 'Senhor do Crime', 'wedge_antilles': 'Piloto Rebelde',
      'jek_tono_porkins': 'Piloto Rebelde', 'yoda': 'Jedi', 'palpatine': 'Imperador Sith',
      'boba_fett': 'Caçador de Recompensas', 'ig-88': 'Caçador de Recompensas',
      'bossk': 'Caçador de Recompensas', 'lando_calrissian': 'Líder Rebelde', 'lobot': 'Assistente de Lando',
      'ackbar': 'Almirante Rebelde', 'mon_mothma': 'Líder Rebelde', 'arvel_crynyd': 'Piloto Rebelde',
      'wicket_systri_warrick': 'Ewok', 'nien_nunb': 'Copiloto', 'qui-gon_jinn': 'Jedi',
      'nute_gunray': 'Vice-rei da Federação', 'finis_valorum': 'Chanceler Supremo',
      'padme_amidala': 'Rainha/Senadora', 'jar_jar_binks': 'Gungan', 'roos_tarpals': 'General Gungan',
      'rugor_nass': 'Líder Gungan', 'ric_olie': 'Piloto', 'watto': 'Comerciante',
      'sebulba': 'Piloto de Podracer', 'quarsh_panaka': 'Capitão da Guarda',
      'shmi_skywalker': 'Mãe de Anakin', 'darth_maul': 'Sith', 'bib_fortuna': 'Assistente de Jabba',
      'ayla_secura': 'Jedi', 'ratts_tyerel': 'Piloto de Podracer', 'dud_bolt': 'Piloto de Podracer',
      'gasgano': 'Piloto de Podracer', 'ben_quadinaros': 'Piloto de Podracer', 'mace_windu': 'Jedi',
      'ki-adi-mundi': 'Jedi', 'kit_fisto': 'Jedi', 'eeth_koth': 'Jedi', 'adi_gallia': 'Jedi',
      'saesee_tiin': 'Jedi', 'yarael_poof': 'Jedi', 'plo_koon': 'Jedi', 'mas_amedda': 'Político',
      'gregar_typho': 'Capitão da Guarda', 'corde': 'Serva da Rainha', 'cliegg_lars': 'Fazendeiro',
      'poggle_the_lesser': 'Líder Geonosiano', 'luminara_unduli': 'Jedi', 'barriss_offee': 'Jedi',
      'dorme': 'Serva de Padmé', 'dooku': 'Sith', 'bail_prestor_organa': 'Senador',
      'jango_fett': 'Caçador de Recompensas', 'zam_wesell': 'Caçadora de Recompensas',
      'dexter_jettster': 'Dono de Lanchonete', 'lama_su': 'Primeiro-Ministro Kaminoano',
      'taun_we': 'Assistente Kaminoana', 'jocasta_nu': 'Bibliotecária Jedi', 'r4-p17': 'Droide',
      'wat_tambor': 'Líder Separatista', 'san_hill': 'Líder Separatista', 'shaak_ti': 'Jedi',
      'grievous': 'General Separatista', 'tarfful': 'Líder Wookiee', 'raymus_antilles': 'Capitão da Tantive IV',
    };

    const formattedName = name.trim().toLowerCase().replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return { img: `../../assets/characters/${formattedName}.svg`, title: roles[formattedName] || 'Desconhecido' };
  }

  private getUniqueRandomIndexes(count: number, min: number, max: number): number[] {
    const indexes = new Set<number>();
    while (indexes.size < count) indexes.add(Math.floor(Math.random() * (max - min + 1)) + min);
    return [...indexes];
  }

  private fetchAllCharacters(): Observable<Personagem[]> {
    const totalPages = 9;
    const requests = Array.from({ length: totalPages }, (_, i) => this.http.get<{ results: any[] }>(`${this.apiUrl}?page=${i + 1}`));
    return forkJoin(requests).pipe(
      map(responses => responses.flatMap(response => response.results)),
      switchMap(personagens => forkJoin(personagens.map(character => this.processarPersonagem(character))))
    );
  }
}

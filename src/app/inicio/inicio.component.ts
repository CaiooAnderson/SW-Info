import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { InicioService } from '../services/inicio.service';
import { Personagem } from '../services/inicio.interface';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  animations: [
    trigger('fadeAnimationWithDelay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fadeAnimationNoDelay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class InicioComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;

  isLoading: boolean = true;
  searchTerm: string = '';
  personagens: Personagem[] = [];
  leftCharacter: Personagem | null = null;
  rightCharacter: Personagem | null = null;
  filterOptionsVisible: boolean = false;
  useNoDelayAnimation: boolean = false;
  allCharacters: Personagem[] = [];
  filteredCharacters: Personagem[] = [];
  selectedSpecies: { [key: string]: boolean } = {};
  selectedSpeciesMap: { [key: string]: boolean } = {};
  speciesList: any[] = [];
  filteredOptions: string[] = [];
  private intervalId: any = null;
  searchControl: FormControl = new FormControl();
  selectedGender: { [key: string]: boolean } = { male: false, female: false, 'n/a': false };

  constructor(private inicioService: InicioService) {}

  ngOnInit(): void {
    this.isLoading = true;
    const startTime = Date.now();
  
    forkJoin({
      personagens: this.inicioService.buscarTodosOsPersonagens(),
      especies: this.inicioService.buscarTodasEspecies()
    }).subscribe({
      next: ({ personagens, especies }) => {
        this.allCharacters = personagens;
        this.filteredCharacters = personagens;
        this.speciesList = especies;
  
        console.log(`Tempo total de carregamento: ${Date.now() - startTime}ms`);
  
        if (this.filteredCharacters.length > 1) {
          this.startCharacterSwap(this.filteredCharacters);
        } else if (this.filteredCharacters.length === 1) {
          this.updateCharacters(this.filteredCharacters);
          this.stopAutoChangeCharacters();
        }
  
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar dados:", error);
        this.isLoading = false;
      }
    });
  
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.filterCharacters(value))
      )
      .subscribe(filteredNames => {
        this.filteredOptions = filteredNames;
      });
  }  

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onSearch() {
    if (!this.searchTerm) return;
  
    this.inicioService.buscarPersonagens(this.searchTerm).subscribe({
      next: (response: Personagem[]) => {
        if (response.length > 0) {
          this.updateCharacters(response);
          this.restartAutoChangeCharacters();
        } else {
          alert('Personagem não encontrado!');
        }
        this.searchTerm = '';
        this.stopAutoChangeCharacters();
      },
      error: (error: any) => {
        console.error('Erro ao buscar personagens:', error);
      }
    });
  }

  toggleFilterOptions() {
    this.filterOptionsVisible = !this.filterOptionsVisible;
  }

  applyFilter() {
    const selectedGenders = Object.keys(this.selectedGender).filter(g => this.selectedGender[g]);
    const selectedSpeciesList = Object.keys(this.selectedSpecies).filter(s => this.selectedSpecies[s]);
  
    console.log("Filtros selecionados: Gênero:", selectedGenders, "Espécie:", selectedSpeciesList);
  
    let filteredCharacters = this.allCharacters;
  
    if (selectedGenders.length > 0) {
      filteredCharacters = filteredCharacters.filter(character =>
        selectedGenders.includes(character.gender.toLowerCase())
      );
    }
  
    if (selectedSpeciesList.length > 0) {
      filteredCharacters = filteredCharacters.filter(character => {
        const speciesValue = character.species ? character.species.toString().toLowerCase().trim() : "unknown";
        console.log(`Comparando espécies: ${speciesValue} com ${selectedSpeciesList}`);
        const match = selectedSpeciesList.some(species => species.toLowerCase().trim() === speciesValue);
        return match;
      });
    }
  
    console.log("Personagens filtrados:", filteredCharacters);
  
    if (filteredCharacters.length === 1) {
      this.leftCharacter = filteredCharacters[0];
      this.rightCharacter = null; 
      this.stopAutoChangeCharacters();
    } else if (filteredCharacters.length > 1) {
      this.filteredCharacters = filteredCharacters;
      this.startCharacterSwap(this.filteredCharacters);
    } else {
      this.clearFilters();
    }
  }  

applyGenderFilter() {
  const selectedGenders = Object.keys(this.selectedGender).filter(gender => this.selectedGender[gender]);

  let filteredCharacters = this.filteredCharacters;

  if (selectedGenders.length > 0) {
      filteredCharacters = filteredCharacters.filter(character =>
          selectedGenders.includes(character.gender.toLowerCase())
      );
  }

  this.filteredCharacters = filteredCharacters;

  if (this.filteredCharacters.length > 0) {
      this.loadRandomCharacters(this.filteredCharacters);
      this.startCharacterSwap(this.filteredCharacters);
  } else {
      console.warn("Nenhum personagem encontrado para o gênero selecionado.");
      this.clearFilters();
  }
}
  
applySpeciesFilter() {
  const selectedSpecies = Object.keys(this.selectedSpecies).filter(species => this.selectedSpecies[species]);

  let filteredCharacters = this.filteredCharacters;

  if (selectedSpecies.length > 0) {
      filteredCharacters = filteredCharacters.filter(character => {
          const speciesValue = character.species ? character.species.toString().toLowerCase().trim() : "unknown";
          const match = selectedSpecies.some(species => species.toLowerCase().trim() === speciesValue);
          return match;
      });
  }

  this.filteredCharacters = filteredCharacters;

  if (this.filteredCharacters.length > 0) {
      this.loadRandomCharacters(this.filteredCharacters);
      this.startCharacterSwap(this.filteredCharacters);
  } else {
      console.warn("Nenhum personagem encontrado para a espécie selecionada.");
      this.clearFilters();
  }
}

loadSpecies(): void {
  this.inicioService.buscarTodasEspecies().subscribe({
    next: (species) => {
      this.speciesList = species;
    },
    error: (err) => {
      console.error("Erro ao carregar as espécies:", err);
    }
  });
}

  filterCharacters(value: string = ''): Observable<string[]> {
    return this.inicioService.buscarTodosOsPersonagens().pipe(
      map((personagens: Personagem[]) => {
        return personagens
          .filter((personagem) =>
            personagem.name.toLowerCase().includes(value.toLowerCase())
          )
          .map((personagem) => personagem.name);
      })
    );
  }

  clearFilters() {
    this.selectedGender = { male: false, female: false, 'n/a': false };
    this.selectedSpecies = {};

    this.loadRandomCharacters(this.allCharacters);
    this.startCharacterSwap(this.allCharacters);
}
  
  updateCharacters(results: Personagem[]) {
    if (results.length === 0) {
      this.leftCharacter = null;
      this.rightCharacter = null;
    } else if (results.length === 1) {
      this.leftCharacter = results[0];
      this.rightCharacter = null;
    } else {
      this.leftCharacter = results[0];
      this.rightCharacter = results[1];
    }
  }

  loadAllCharacters() {
    this.inicioService.buscarTodosOsPersonagens().subscribe({
      next: (response: Personagem[]) => {
        this.allCharacters = response;
        this.updateCharacters(response);
      },
      error: (error: any) => {
        console.error('Erro ao carregar personagens:', error);
      },
    });
  }

  loadRandomCharacters(filteredCharacters: Personagem[]) {
    if (filteredCharacters.length > 0) {
      const randomIndices = this.getRandomIndices(filteredCharacters.length);
      const randomCharacters = randomIndices.map(index => filteredCharacters[index]);
  
      this.updateCharacters(randomCharacters);
    } else {
      this.updateCharacters([]);
    }
  }
  
  getRandomIndices(length: number): number[] {
    const indices: number[] = [];
  
    while (indices.length < 2) {
      const randomIndex = Math.floor(Math.random() * length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
  
    return indices;
  }

  startCharacterSwap(filteredCharacters: Personagem[] = this.allCharacters) {
    clearInterval(this.intervalId);

    if (filteredCharacters.length === 0) {
        this.updateCharacters([]);
        return;
    }

    this.intervalId = setInterval(() => {
        this.loadRandomCharacters(filteredCharacters);
    }, 5000);
  }
  
  stopAutoChangeCharacters() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  restartAutoChangeCharacters() {
    this.stopAutoChangeCharacters();
    this.startCharacterSwap(this.filteredCharacters);
  }

  scrollToNextSection() {
    const nextSection = document.querySelector('.container');
    if (nextSection) {
      window.scrollTo({
        top: nextSection.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth',
      });
    }
  }
}

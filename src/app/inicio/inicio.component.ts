import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { InicioService } from '../services/inicio.service';
import { Personagem } from '../services/inicio.interface';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslationService } from '../services/translation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class InicioComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger) trigger?: MatMenuTrigger;
  isLoading = true;
  searchTerm = '';
  personagens: Personagem[] = [];
  leftCharacter: Personagem | null = null;
  rightCharacter: Personagem | null = null;
  filterOptionsVisible = false;
  allCharacters: Personagem[] = [];
  filteredCharacters: Personagem[] = [];
  selectedSpecies: Record<string, boolean> = {};
  selectedGender: Record<string, boolean> = { male: false, female: false, 'n/a': false };
  speciesList: any[] = [];
  searchControl = new FormControl();
  private intervalId: any = null;

  constructor(
    private inicioService: InicioService,
    public translationService: TranslationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    forkJoin({
      personagens: this.inicioService.buscarTodosOsPersonagens(),
      especies: this.inicioService.buscarTodasEspecies()
    }).subscribe(({ personagens, especies }) => {
      this.allCharacters = this.filteredCharacters = personagens;
      this.speciesList = especies;
      if (this.filteredCharacters.length) this.startCharacterSwap();
      this.isLoading = false;
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.filterCharacters(value))
    ).subscribe(filteredNames => this.searchControl.setValue(filteredNames, { emitEvent: false }));
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  onSearch() {
    if (!this.searchTerm) return;
    this.inicioService.buscarPersonagens(this.searchTerm).subscribe(response => {
      response.length ? this.updateCharacters(response) : alert('Personagem não encontrado!');
      this.searchTerm = '';
      this.stopAutoChangeCharacters();
    });
  }

  applyFilter() {
    const selectedGenders = Object.keys(this.selectedGender).filter(g => this.selectedGender[g]);
    const selectedSpeciesList = Object.keys(this.selectedSpecies).filter(s => this.selectedSpecies[s]);
    this.filteredCharacters = this.allCharacters.filter(c =>
      (!selectedGenders.length || selectedGenders.includes(c.gender.toLowerCase())) &&
      (!selectedSpeciesList.length || selectedSpeciesList.some(s => s.toLowerCase().trim() === c.species?.toLowerCase().trim()))
    );

    if (this.filteredCharacters.length) {
      this.startCharacterSwap();
    } else {
      this.showNoResultsSnackbar();
      setTimeout(() => {
        this.clearFilters();
      }, 300);
    }
  }

  filterCharacters(value: string = ''): Observable<string[]> {
    return this.inicioService.buscarTodosOsPersonagens().pipe(
      map(personagens => personagens.filter(p => p.name.toLowerCase().includes(value.toLowerCase())).map(p => p.name))
    );
  }

  clearFilters() {
    this.selectedGender = { male: false, female: false, 'n/a': false };
    this.selectedSpecies = {};
    this.filteredCharacters = [...this.allCharacters];
    this.loadRandomCharacters(true);
    this.startCharacterSwap();
  }

  updateCharacters(results: Personagem[]) {
    this.leftCharacter = null;
    this.rightCharacter = null;
    setTimeout(() => {
      [this.leftCharacter, this.rightCharacter] = results.length ? results : [null, null];
    }, 300);
  }

  loadRandomCharacters(isRandom: boolean = false) {
    const charactersToDisplay = isRandom ? this.allCharacters : this.filteredCharacters;
  
    this.updateCharacters(charactersToDisplay.length ? this.getRandomIndices(charactersToDisplay.length).map(i => charactersToDisplay[i]) : []);
  }

  getRandomIndices(length: number): number[] {
    const indices = new Set<number>();
    while (indices.size < 2) indices.add(Math.floor(Math.random() * length));
    return Array.from(indices);
  }

  startCharacterSwap() {
    clearInterval(this.intervalId);
    if (!this.filteredCharacters.length) return this.updateCharacters([]);
    this.intervalId = setInterval(() => this.loadRandomCharacters(), 5000);
  }

  stopAutoChangeCharacters() {
    clearInterval(this.intervalId);
  }

  restartAutoChangeCharacters() {
    this.stopAutoChangeCharacters();
    this.startCharacterSwap();
  }

  scrollToNextSection() {
    document.querySelector('.container')?.scrollIntoView({ behavior: 'smooth' });
  }

  private showNoResultsSnackbar() {
    this.snackBar.open('Não há personagens com esses filtros', 'X', {
    duration: undefined,
    });
  }
}

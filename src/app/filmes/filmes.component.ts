import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from "@angular/animations";
import { Router } from '@angular/router';
import { FilmesService } from '../services/filmes.service';
import { Filme } from '../services/filmes.interface';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.scss'],
  animations: [
    trigger('filterTransition', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fadeInHeader', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class FilmesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'release_date', 'director'];
  filmes: Filme[] = [];
  highlightedFilm: Filme | null = null;
  isLoading = false;
  searchTitle = '';
  noResults = false;

  constructor(
    private filmesService: FilmesService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadFilmes();
  }

  loadFilmes(search?: string): void {
    this.isLoading = true;
    this.filmesService.getFilmes(search).subscribe({
      next: (data) => {
        this.filmes = data.results.sort((a, b) => a.episode_id - b.episode_id);
        this.isLoading = false;
        this.noResults = this.filmes.length === 0;
      },
      error: (err) => {
        console.error('Erro ao carregar os filmes:', err);
        this.isLoading = false;
      },
    });
  }

  highlightRow(filme: Filme): void {
    this.highlightedFilm = filme;
  }

  removeHighlight(): void {
    this.highlightedFilm = null;
  }

  navegarParaDetalhes(filme: Filme): void {
    this.router.navigate([`/filmes/${filme.episode_id}`]);
  }

  onSearch(): void {
    this.loadFilmes(this.searchTitle.trim());
  }

  reloadFilmes(): void {
    this.searchTitle = '';
    this.loadFilmes();
  }

  getTituloTraduzido(titulo: string): string {
    return this.translationService.traduzirTitulo(titulo);
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilmesService } from '../services/filmes.service';
import { Filme } from '../services/filmes.interface';

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.scss'],
})
export class FilmesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'release_date', 'director'];
  filmes: Filme[] = [];
  highlightedFilm: Filme | null = null;
  isLoading = false;
  searchTitle = '';

  constructor(private filmesService: FilmesService, private router: Router) {}

  ngOnInit(): void {
      this.loadFilmes();
  }

  loadFilmes(search?: string): void {
    this.isLoading = true;
    this.filmesService.getFilmes(search).subscribe({
      next: (data) => {
        this.filmes = data.results.sort((a, b) => a.episode_id - b.episode_id);
        this.isLoading = false;
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
}
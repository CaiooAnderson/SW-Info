import { Component, OnInit } from '@angular/core';
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
  isLoading = false;
  searchTitle = '';

  constructor(private filmesService: FilmesService) {}

  ngOnInit(): void {
      this.loadFilmes();
  }

  loadFilmes(search?: string): void {
    this.isLoading = true;
    this.filmesService.getFilmes(search).subscribe({
      next: (data) => {
        this.filmes = data.results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar os filmes:', err);
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.loadFilmes(this.searchTitle.trim());
  }
}
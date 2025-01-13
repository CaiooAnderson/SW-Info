import { Component, OnInit } from '@angular/core';
import { FilmesService } from '../services/filmes.service';
import { Filme, RespostaAPI } from '../services/filmes.interface';

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.scss'],
})
export class FilmesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'release_date', 'director'];
  filmes: Filme[] = [];

  constructor(private filmesService: FilmesService) {}

  ngOnInit(): void {
    this.filmesService.getFilmes().subscribe({
      next: (data) => {
        this.filmes = data.results;
        console.log(this.filmes);
      },
      error: (err) => {
        console.error('Erro ao carregar os filmes:', err);
      },
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmesService } from '../services/filmes.service';
import { Filme } from '../services/filmes.interface';

@Component({
  selector: 'app-filme-detalhe',
  templateUrl: './filme-detalhe.component.html',
  styleUrls: ['./filme-detalhe.component.scss']
})
export class FilmeDetalheComponent implements OnInit {
  filme: Filme | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private filmesService: FilmesService
  ) {}

  ngOnInit(): void {
    const episodeId = this.route.snapshot.paramMap.get('id');
    if (episodeId) {
      this.filmesService.getFilmes().subscribe({
        next: (data) => {
          this.filme = data.results.find(filme => filme.episode_id.toString() === episodeId) || null;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do filme', err);
          this.isLoading = false;
        }
      });
    }
  }
}
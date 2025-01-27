import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmesService } from '../services/filmes.service';
import { Filme } from '../services/filmes.interface';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-filme-detalhe',
  templateUrl: './filme-detalhe.component.html',
  styleUrls: ['./filme-detalhe.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FilmeDetalheComponent implements OnInit {
  filme: Filme | null = null;
  isLoading = true;
  isDescriptionVisible = false;

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
          this.showDescription();
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do filme', err);
          this.isLoading = false;
        }
      });
    }
  }

  getBackgroundImage(): string {
    if (this.filme) {
      const backgrounds: { [key: string]: string } = {
        'The Phantom Menace': '../../assets/The_Phantom_Menace.svg',
        'Attack of the Clones': '../../assets/Attack_of_the_Clones.svg',
        'Revenge of the Sith': '../../assets/Revenge_of_the_Sith.svg',
        'A New Hope': '../../assets/A_New_Hope.svg',
        'The Empire Strikes Back': '../../assets/The_Empire_Strikes_Back.svg',
        'Return of the Jedi': '../../assets/Return_of_the_Jedi.svg',
      };

      return backgrounds[this.filme.title] || '../../assets/starwars.jpg';
    }

    return '../../assets/starwars.jpg';
  }

  showDescription(): void {
    setTimeout(() => {
      this.isDescriptionVisible = true; 
    }, 500);
  }

  voltarPagina(): void {
    window.history.back();
  }
}
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
  allPlanetsDisplayed = false;
  planetNames: { [url: string]: string } = {};
  displayedPlanets: { [url: string]: boolean } = {};
  planetImages: { [planetName: string]: string } = {
    'Alderaan': '../../assets/planets/Alderaan.svg',
    'Bespin': '../../assets/planets/Bespin.svg',
    'Cato Neimoidia': '../../assets/planets/Cato_Neimoidia.svg',
    'Coruscant': '../../assets/planets/Coruscant.svg',
    'Dagobah': '../../assets/planets/Dagobah.svg',
    'Endor': '../../assets/planets/Endor.svg',
    'Felucia': '../../assets/planets/Felucia.svg',
    'Geonosis': '../../assets/planets/Geonosis.svg',
    'Hoth': '../../assets/planets/Hoth.svg',
    'Kamino': '../../assets/planets/Kamino.svg',
    'Kashyyyk': '../../assets/planets/Kashyyyk.svg',
    'Mustafar': '../../assets/planets/Mustafar.svg',
    'Mygeeto': '../../assets/planets/Mygeeto.svg',
    'Naboo': '../../assets/planets/Naboo.svg',
    'Ord Mantell': '../../assets/planets/Ord_Mantell.svg',
    'Polis Massa': '../../assets/planets/Polis_Massa.svg',
    'Saleucami': '../../assets/planets/Saleucami.svg',
    'Tatooine': '../../assets/planets/Tatooine.svg',
    'Utapau': '../../assets/planets/Utapau.svg',
    'Yavin IV': '../../assets/planets/Yavin_IV.svg',
    'Unknown': '../../assets/planets/Unknown.svg'
  };

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
          this.loadPlanetNames();
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do filme', err);
          this.isLoading = false;
        }
      });
    }
  }

  getBackgroundImage(): string {
    if (this.isLoading) {
      return '../../assets/vader_loading.gif';
    }

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

  loadPlanetNames(): void {
    if (this.filme?.planets) {
      this.filme.planets.forEach(url => {
        this.fetchPlanetName(url);
      });
    }
  }

  showAllPlanets(): void {
    if (this.filme?.planets) {
      this.filme.planets.forEach(planetUrl => {
        this.displayedPlanets[planetUrl] = true;
      });
      this.allPlanetsDisplayed = true;
    }
  }

  fetchPlanetName(url: string): void {
    this.filmesService.getPlaneta(url).subscribe({
      next: (planet) => {
        this.planetNames[url] = planet.name;
      },
      error: (err) => {
        console.error(`Erro ao carregar o planeta ${url}`, err);
      }
    });
  }

  showPlanetImage(url: string): void {
    this.displayedPlanets[url] = true;
    this.checkAllPlanetsDisplayed();
  }

  checkAllPlanetsDisplayed(): void {
    if (this.filme?.planets) {
      this.allPlanetsDisplayed = this.filme.planets.every(url => this.displayedPlanets[url]);
    }
  }

  voltarPagina(): void {
    window.history.back();
  }
}

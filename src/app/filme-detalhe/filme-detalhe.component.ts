import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmesService } from '../services/filmes.service';
import { Filme } from '../services/filmes.interface';
import { catchError, of } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-filme-detalhe',
  templateUrl: './filme-detalhe.component.html',
  styleUrls: ['./filme-detalhe.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FilmeDetalheComponent implements OnInit {
  filme: Filme | null = null;
  isLoading = true;
  erro404 = false;
  isDescriptionVisible = false;
  planetNames: Record<string, string> = {};
  loadingPlanets: Record<string, boolean> = {};
  displayedPlanets: Record<string, boolean> = {};
  allPlanetsDisplayed = false;
  planetImages: Record<string, string> = {
    'Alderaan': '../../assets/planets/Alderaan.svg', 'Bespin': '../../assets/planets/Bespin.svg',
    'Cato Neimoidia': '../../assets/planets/Cato_Neimoidia.svg', 'Coruscant': '../../assets/planets/Coruscant.svg',
    'Dagobah': '../../assets/planets/Dagobah.svg', 'Endor': '../../assets/planets/Endor.svg',
    'Felucia': '../../assets/planets/Felucia.svg', 'Geonosis': '../../assets/planets/Geonosis.svg',
    'Hoth': '../../assets/planets/Hoth.svg', 'Kamino': '../../assets/planets/Kamino.svg',
    'Kashyyyk': '../../assets/planets/Kashyyyk.svg', 'Mustafar': '../../assets/planets/Mustafar.svg',
    'Mygeeto': '../../assets/planets/Mygeeto.svg', 'Naboo': '../../assets/planets/Naboo.svg',
    'Ord Mantell': '../../assets/planets/Ord_Mantell.svg', 'Polis Massa': '../../assets/planets/Polis_Massa.svg',
    'Saleucami': '../../assets/planets/Saleucami.svg', 'Tatooine': '../../assets/planets/Tatooine.svg',
    'Utapau': '../../assets/planets/Utapau.svg', 'Yavin IV': '../../assets/planets/Yavin_IV.svg',
    'Unknown': '../../assets/planets/Unknown.svg'
  };

  constructor(
    private route: ActivatedRoute,
    private filmesService: FilmesService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const episodeId = this.route.snapshot.paramMap.get('id');
    if (!episodeId) return;
  
    this.isLoading = true;
    this.filmesService.getFilmes().subscribe({
      next: (data) => {
        this.filme = data.results.find(f => f.episode_id.toString() === episodeId) || null;
        this.isLoading = false;
        if (this.filme) {
          this.showDescription();
          this.loadPlanetNames();
        } else {
          this.erro404 = true;
        }
      },
      error: () => {
        this.isLoading = false;
        this.erro404 = true;
      }
    });
  }

  getBackgroundImage(): string {
    if (this.isLoading) return '../../assets/vader_loading.gif';
    if (!this.filme) return '../../assets/starwars.jpg';
    return {
      'The Phantom Menace': 'The_Phantom_Menace', 'Attack of the Clones': 'Attack_of_the_Clones',
      'Revenge of the Sith': 'Revenge_of_the_Sith', 'A New Hope': 'A_New_Hope',
      'The Empire Strikes Back': 'The_Empire_Strikes_Back', 'Return of the Jedi': 'Return_of_the_Jedi'
    }[this.filme.title] ? this.getImageByRatio(this.filme.title.replace(/ /g, '_')) : '../../assets/starwars.jpg';
  }

  getImageByRatio(title: string): string {
    return `../../assets/films/${title}-${window.innerWidth / window.innerHeight >= 1.77 ? '16-9' : '4-3'}.svg`;
  }

  showDescription(): void {
    setTimeout(() => (this.isDescriptionVisible = true), 500);
  }

  loadPlanetNames(): void {
    this.filme?.planets.forEach(url => {
      this.loadingPlanets[url] = true;
      this.filmesService.getPlaneta(url).subscribe({
        next: (planet) => (this.planetNames[url] = planet.name),
        complete: () => (this.loadingPlanets[url] = false)
      });
    });
  }

  showAllPlanets(): void {
    if (!this.filme) return;
    this.filme.planets.forEach(url => (this.displayedPlanets[url] = true));
    this.allPlanetsDisplayed = true;
  }

  showPlanetImage(url: string): void {
    if (!this.loadingPlanets[url]) this.displayedPlanets[url] = true;
    this.allPlanetsDisplayed = this.filme?.planets.every(url => this.displayedPlanets[url]) ?? false;
  }

  voltarPagina(): void {
    window.history.back();
  }

  getDescricaoTraduzida(): string {
    return this.filme ? this.translationService.traduzirDescricao(`episodio-${this.filme.episode_id}`) : '';
  }
}

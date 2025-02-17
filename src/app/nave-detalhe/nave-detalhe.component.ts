import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavesService } from '../services/naves.service';
import { Nave } from '../services/naves.interface';

@Component({
  selector: 'app-nave-detalhe',
  templateUrl: './nave-detalhe.component.html',
  styleUrls: ['./nave-detalhe.component.scss'],
})
export class NaveDetalheComponent implements OnInit {
  nave: Nave | null = null;
  films: string[] = [];
  pilots: string[] = [];
  isLoading = true;
  erro404 = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navesService: NavesService
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) this.buscarDetalhesNave(name);
  }

  buscarDetalhesNave(name: string) {
    this.navesService.getTodasNaves().subscribe((naves) => {
      this.nave = naves.find(n => n.name === name) || null;
      if (!this.nave) return this.handleError(name);
      this.isLoading = false;

      const requests = [...this.nave.films, ...this.nave.pilots];
      if (!requests.length) return;

      this.navesService.getFilmesETripulantes(requests).subscribe((data) => {
        this.films = data.filter(d => d.title).map(f => f.title);
        this.pilots = data.filter(d => d.name).map(p => p.name);
      });
    });
  }

  handleError(name: string) {
    console.error(`Nave com nome ${name} não encontrada.`);
    this.isLoading = false;
    this.erro404 = true;
  }

  getFilmBackgroundImage(film: string): string {
    const formattedTitle = film.replace(/ /g, '_');
    return `../../assets/films/${formattedTitle}-16-9.svg`;
  }

  hasPilots(): boolean {
    return this.pilots.length > 0;
  }

  voltar() {
    this.router.navigate(['/naves']);
  }
}

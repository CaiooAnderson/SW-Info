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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navesService: NavesService
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.buscarDetalhesNave(name);
    }
  }

  buscarDetalhesNave(name: string) {
    this.navesService.getTodasNaves().subscribe((naves) => {
      this.nave = naves.find(n => n.name === name) || null;

      if (this.nave) {
        this.isLoading = false;
        this.navesService
          .getFilmesETripulantes(this.nave.films)
          .subscribe((filmes) => {
            this.films = filmes.map((film: any) => film.title);
          });

        this.navesService
          .getFilmesETripulantes(this.nave.pilots)
          .subscribe((pilots) => {
            this.pilots = pilots.map((pilot: any) => pilot.name);
          });
      } else {
        console.error(`Nave com nome ${name} não encontrada.`);
        this.isLoading = false
      }
    });
  }

  voltar() {
    this.router.navigate(['/naves']);
  }
}
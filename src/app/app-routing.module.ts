import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { FilmesComponent } from './filmes/filmes.component';
import { NavesComponent } from './naves/naves.component';
import { FilmeDetalheComponent } from './filme-detalhe/filme-detalhe.component';
import { NaveDetalheComponent } from './nave-detalhe/nave-detalhe.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';

const routes: Routes = [
  { 
    path: '',
    component: InicioComponent
  }, 
  { 
    path: 'filmes',
    component: FilmesComponent 
  }, 
  {
    path: 'filmes/:id',
    component: FilmeDetalheComponent
  },
  { 
    path: 'naves',
    component: NavesComponent 
  },
  {
    path: 'nave-detalhe/:name',
    component: NaveDetalheComponent
  },
  {
    path: 'pagina-nao-encontrada',
    component: PaginaNaoEncontradaComponent
  },
  { 
    path: '**', 
    redirectTo: '/pagina-nao-encontrada'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule],
})
export class AppRoutingModule { }
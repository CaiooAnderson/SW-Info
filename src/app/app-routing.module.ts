import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { FilmesComponent } from './filmes/filmes.component';
import { NavesComponent } from './naves/naves.component';

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
    path: 'naves',
    component: NavesComponent 
  },   
  { 
    path: '**', 
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule],
})
export class AppRoutingModule { }
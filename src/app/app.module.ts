import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { FilmesComponent } from './filmes/filmes.component';
import { NavesComponent } from './naves/naves.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    FilmesComponent,
    NavesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

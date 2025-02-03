import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { FilmesComponent } from './filmes/filmes.component';
import { NavesComponent } from './naves/naves.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FilmeDetalheComponent } from './filme-detalhe/filme-detalhe.component';
import { NaveDetalheComponent } from './nave-detalhe/nave-detalhe.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    FilmesComponent,
    NavesComponent,
    HeaderComponent,
    FilmeDetalheComponent,
    NaveDetalheComponent,
  ],
  imports: [
    MatTableModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

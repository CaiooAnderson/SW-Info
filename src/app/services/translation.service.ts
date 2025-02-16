import { Injectable } from '@angular/core';
import { FILMES_TRADUZIDOS, FILMES_DESCRICOES_TRADUZIDOS, GENEROS_TRADUZIDOS, ESPECIES_TRADUZIDAS } from '../custom-translation';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  traduzirTitulo(titulo: string): string {
    return FILMES_TRADUZIDOS[titulo] || titulo;
  }

  traduzirDescricao(descricao: string): string {
    return FILMES_DESCRICOES_TRADUZIDOS[descricao] || descricao;
  }

  traduzirGenero(genero: string): string {
    return GENEROS_TRADUZIDOS[genero.toLowerCase()] || genero;
  }

  traduzirEspecie(especie: string): string {
    return ESPECIES_TRADUZIDAS[especie] || especie;
  }
}
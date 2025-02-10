import { Injectable } from '@angular/core';
import { FILMES_TRADUZIDOS, FILMES_DESCRICOES_TRADUZIDOS } from '../custom-translation';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  traduzirTitulo(titulo: string): string {
    return FILMES_TRADUZIDOS[titulo] || titulo;
  }

  traduzirDescricao(descricao: string): string {
    return FILMES_DESCRICOES_TRADUZIDOS[descricao] || descricao;
  }
}
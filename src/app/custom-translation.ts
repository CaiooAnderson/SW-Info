import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const FILMES_TRADUZIDOS: { [key: string]: string } = {
  'A New Hope': 'Uma Nova Esperança',
  'The Empire Strikes Back': 'O Império Contra-Ataca',
  'Return of the Jedi': 'O Retorno de Jedi',
  'The Phantom Menace': 'A Ameaça Fantasma',
  'Attack of the Clones': 'O Ataque dos Clones',
  'Revenge of the Sith': 'A Vingança dos Sith',
};

export const FILMES_DESCRICOES_TRADUZIDOS: { [key: string]: string } = {
  'episodio-1': 'A turbulência tomou conta da República Galáctica. A tributação das rotas comerciais para sistemas estelares distantes está em disputa. Na tentativa de resolver a questão com um bloqueio de naves de batalha mortais, a gananciosa Federação do Comércio interrompeu todo o transporte para o pequeno planeta Naboo. Enquanto o Congresso da República debate sem fim essa alarmante cadeia de eventos, o Chanceler Supremo secretamente despachou dois Cavaleiros Jedi, os guardiões da paz e da justiça na galáxia, para resolver o conflito....',

  'episodio-2': 'Há agitação no Senado Galáctico. Milhares de sistemas solares declararam suas intenções de deixar a República. Esse movimento separatista, sob a liderança do misterioso Conde Dooku, dificultou para o número limitado de Cavaleiros Jedi manterem a paz e a ordem na galáxia. A Senadora Amidala, a ex-Rainha de Naboo, está retornando ao Senado Galáctico para votar sobre a questão crítica da criação de um EXÉRCITO DA REPÚBLICA para ajudar os Jedi sobrecarregados....',
  
  'episodio-3': 'Guerra! A República está desmoronando sob os ataques do implacável Lorde Sith, Conde Dooku. Há heróis de ambos os lados. O mal está por toda parte. Em um movimento surpreendente, o malévolo líder droide, General Grievous, invadiu a capital da República e sequestrou o Chanceler Palpatine, líder do Senado Galáctico. Enquanto o Exército Droide Separatista tenta fugir da capital sitiada com seu valioso refém, dois Cavaleiros Jedi lideram uma missão desesperada para resgatar o Chanceler cativo....',
  
  'episodio-4': 'É um período de guerra civil. Naves rebeldes, atacando de uma base secreta, conquistaram sua primeira vitória contra o malvado Império Galáctico. Durante a batalha, espiões rebeldes conseguiram roubar planos secretos da arma final do Império, a ESTRELA DA MORTE, uma estação espacial blindada com poder suficiente para destruir um planeta inteiro. Perseguida pelos agentes sinistros do Império, a Princesa Leia acelera para casa a bordo de sua nave, guardiã dos planos roubados que podem salvar seu povo e restaurar a liberdade na galáxia....',
  
  'episodio-5': 'É um tempo sombrio para a Rebelião. Embora a Estrela da Morte tenha sido destruída, as tropas Imperiais expulsaram as forças rebeldes de sua base secreta e as perseguiram pela galáxia. Evadindo a temida Frota Estelar Imperial, um grupo de combatentes da liberdade liderados por Luke Skywalker estabeleceu uma nova base secreta no remoto mundo gelado de Hoth. O malvado senhor Darth Vader, obcecado em encontrar o jovem Skywalker, enviou milhares de sondas remotas para os confins do espaço....',
  
  'episodio-6': 'Luke Skywalker retornou ao seu planeta natal, Tatooine, na tentativa de resgatar seu amigo Han Solo das garras do vil gangster Jabba the Hutt. Mal sabe Luke que o IMPÉRIO GALÁCTICO iniciou secretamente a construção de uma nova estação espacial blindada ainda mais poderosa do que a primeira temida Estrela da Morte. Quando concluída, essa arma definitiva significará a condenação certa para o pequeno grupo de rebeldes que lutam para restaurar a liberdade na galáxia...',
};

export const GENEROS_TRADUZIDOS: { [key: string]: string } = {
  'male': 'Masculino', 'female': 'Feminino', 'hermaphrodite': 'Hermafrodita',
  'none': 'Nenhum', 'n/a': 'Desconhecido'
};

export const ESPECIES_TRADUZIDAS: { [key: string]: string } = {
  'Human': 'Humano', 'Droid': 'Dróide', 'Wookie': 'Wookiee', 'Twi\'lek': 'Twi’lek',
  'Rodian': 'Rodiano', 'Hutt': 'Hutt', 'Yoda\'s species': 'Espécies de Yoda', 'Trandoshan': 'Trandoshano',
  'Mon Calamari': 'Mon Calamariano', 'Ewok': 'Ewok', 'Sullustan': 'Sullustano', 'Neimodian': 'Neimodiano',
  'Toydarian': 'Toydariano', 'Vulptereen': 'Vulptereeno', 'Cerean': 'Cereano', 'Nautolan': 'Nautolano',
  'Tholothian': 'Tolothiano', 'Quermian': 'Quermiano', 'Chagrian': 'Chagriano', 'Geonosian': 'Geonosiano',
  'Mirialan': 'Mirialano', 'Kaminoan': 'Kaminoano', 'Skakoan': 'Skakoano', 'Pau\'an': 'Pau’ano'
};

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página:';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = function (page: number, pageSize: number, length: number) {
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}
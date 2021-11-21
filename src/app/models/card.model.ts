import { CardCategoryEnum } from '../constants/card-category.enum';

export interface Card {
  id?: string;
  titulo: string;
  conteudo: string;
  lista?: CardCategoryEnum;
}

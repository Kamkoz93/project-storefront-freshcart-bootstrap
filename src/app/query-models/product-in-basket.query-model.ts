import { ProductWithRatingOptionsQueryModel } from './product-with-rating-options.query-model';

export interface ProductInBasketQueryModel {
  readonly name: string;
  readonly price: number;
  readonly categoryId: string;
  readonly ratingValue: number;
  readonly ratingOptions: number[];
  readonly ratingCount: number;
  readonly imageUrl: string;
  readonly featureValue: number;
  readonly storeIds: string[];
  readonly id: string;
  readonly similarProds?: ProductWithRatingOptionsQueryModel[];
  quantity: number;
}

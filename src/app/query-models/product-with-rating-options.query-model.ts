export interface ProductWithRatingOptionsQueryModel {
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
  quantity: number;
}

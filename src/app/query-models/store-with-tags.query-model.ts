export interface StoreWithTagsQueryModel {
  readonly name: string;
  readonly logoUrl: string;
  readonly distanceInMeters: number;
  readonly tagIds: string[];
  readonly id: string;
  readonly tagNames: string[];
}

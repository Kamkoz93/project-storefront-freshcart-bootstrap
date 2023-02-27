import { InjectionToken } from '@angular/core';

export const TOKEN_STORAGE = new InjectionToken<tokenStorage>('TOKEN_STORAGE');

export interface tokenStorage {
  getItem(key: string): string | null;

  setItem(key: string, value: string): void;

  removeItem(key: string): void;
}

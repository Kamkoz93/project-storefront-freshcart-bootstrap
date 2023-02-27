import { CredentialsModel } from '../models/credentials.model';
import { HasDataModel } from '../models/has-data.model';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { tokenStorage, TOKEN_STORAGE } from './tokenStorage';

@Injectable({ providedIn: 'root' })
export class RegisterUserService {
  constructor(
    private _httpClient: HttpClient,
    @Inject(TOKEN_STORAGE) private _tokenStorage: tokenStorage
  ) {}

  registerUser(regObject: HasDataModel<CredentialsModel>): any {
    return this._httpClient.post<HasDataModel<CredentialsModel>>(
      'https://us-central1-courses-auth.cloudfunctions.net/auth/register', // this link is not valid, it is mocked for test purposes
      regObject
    );
  }

  private _loggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(!!this._tokenStorage.getItem('accessToken'));

  public loggedIn$: Observable<boolean> = this._loggedInSubject.asObservable();

  private _accessToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(this._tokenStorage.getItem('accessToken'));

  public accessToken$: Observable<string | null> =
    this._accessToken.asObservable();

  private _refreshToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(this._tokenStorage.getItem('refreshToken'));

  public refreshToken$: Observable<string | null> =
    this._refreshToken.asObservable();

  loginUser(email: string, password: string): Observable<any> {
    return this._httpClient
      .post<any>(
        'https://us-central1-courses-auth.cloudfunctions.net/auth/login', // this link is not valid, it is mocked for test purposes
        {
          data: {
            email,
            password,
          },
        }
      )
      .pipe(
        tap((res) => {
          this._tokenStorage.setItem('accessToken', res.data.accessToken);
          this._tokenStorage.setItem('refreshToken', res.data.refreshToken);
          of(this._loggedInSubject.next(true));
        })
      );
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this._httpClient
      .post<any>(
        'https://us-central1-courses-auth.cloudfunctions.net/auth/refresh',
        {
          data: {
            refreshToken: refreshToken,
          },
        }
      )
      .pipe(
        tap((res) => {
          this._tokenStorage.setItem('accessToken', res.data.accessToken);
          this._tokenStorage.setItem('refreshToken', res.data.refreshToken);
          this._accessToken.next(this._tokenStorage.getItem('accessToken'));
          this._refreshToken.next(this._tokenStorage.getItem('refreshToken'));
          of(this._loggedInSubject.next(true));
        })
      );
  }
}

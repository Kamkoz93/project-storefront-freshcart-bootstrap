import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CredentialsModel } from '../models/credentials.model';
import { HasDataModel } from '../models/has-data.model';

@Injectable({ providedIn: 'root' })
export class RegisterUserService {
  constructor(private _httpClient: HttpClient) {}

  registerUser(regObject: HasDataModel<CredentialsModel>): any {
    return this._httpClient.post<HasDataModel<CredentialsModel>>(
      'https://us-central1-courses-auth.cloudfunctions.net/auth/register', // this link is not valid, it is mocked for test purposes
      regObject
    );
  }
}

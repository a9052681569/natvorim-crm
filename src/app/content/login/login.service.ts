import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, UserCredentials } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class LoginService {

	constructor(private http: HttpClient) { }

	auth(credentials: UserCredentials): Observable<User> {
		return this.http.post<User>(environment.apiEndpoints.auth, credentials);
	}

	tokenToLocalStorage(user: User): Observable<User> {
		localStorage.setItem('token', JSON.stringify(user));
		return of(user);
	}

	getTokenFromLocalStorage(): Observable<User | null> {
		const userString = localStorage.getItem('token');
		if (userString) {
			return of(JSON.parse(userString));
		}
		return of(null);
	}

	removeTokenFromLocalStorage(): Observable<boolean> {
		localStorage.removeItem('token');
		return of(true);
	}
}

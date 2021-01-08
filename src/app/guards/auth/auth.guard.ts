import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store';


@Injectable()
export class AuthGuard implements CanActivate {

	public constructor(
		private router: Router,
		private store: Store<RootState>
		) {}

	public canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
		): Observable<boolean> {
		const {url} = state;
		return this.store.select('auth', 'isLogged')
			.pipe(
				take(1),
				switchMap((isLogged: boolean) => {
					if (!isLogged && url === '/login') {
						return of(true);
					}
					if (isLogged && url === '/login') {
						this.router.navigate(['/backoffice']);
						return of(true);
					}
					if (!isLogged) {
						this.router.navigate(['/login']);
					}
					return of(isLogged);
				})
			);
	}
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { mergeMap, map, catchError, tap, switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/content/login/login.service';
import { User } from 'src/app/models/user';
import { AuthActions, AuthActionsNames, LoginPendingProps, LoginSuccessProps } from '../actions/auth.actions';

@Injectable()
export class AuthEffects {

	login$ = createEffect(() => this.actions$.pipe(
		ofType(AuthActionsNames.LOGIN_PENDING),
		mergeMap(({credentials}: LoginPendingProps) => {
			return this.loginService.auth(credentials)
				.pipe(
					switchMap((user: User) => {
						return this.loginService.tokenToLocalStorage(user);
					}),
					map((user: User) => AuthActions.loginSuccess({ user })),
					tap(({ user }) => {

						if (user.name.includes('Саша')) {
							this.snack.open(`Привет ${user.name}?`, 'лучше всех');
						} else {
							this.snack.open(`Привет ${user.name}`, 'хеллоу');
						}
					}),
					catchError(_ => of(AuthActions.loginError()))
				);
		})
	));

	onLoginSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(AuthActionsNames.LOGIN_SUCCESS),
		mergeMap(({ user }: LoginSuccessProps) => {
			if (this.router.url === '/login') {
				this.router.navigate(['/backoffice']);
			}

			return of(AuthActions.loginEnd());
		})
	));

	check$ = createEffect(() => this.actions$.pipe(
		ofType(ROOT_EFFECTS_INIT),
		switchMap(() => {
			return this.loginService.getTokenFromLocalStorage()
				.pipe(
					mergeMap((user: User | null) => {
						if (!user) {
							return of(AuthActions.loginError());
						}

						return of(AuthActions.loginSuccess({ user }));
					}),
					catchError(() => of(AuthActions.loginError()))
				);
		})
	));

	constructor(
		private actions$: Actions,
		private loginService: LoginService,
		private router: Router,
		private snack: MatSnackBar
	) {}
}

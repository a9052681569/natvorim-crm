import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PeopleService } from 'src/app/content/backoffice/content/people/people.service';
import { Person } from 'src/app/models/people';
import { CustomersActions, CustomersActionsNames } from '../actions/costomers.actions';

@Injectable()
export class CustomersEffects {

	setCustomers$ = createEffect(() => this.actions$.pipe(
		ofType(CustomersActionsNames.SET_СUSTOMERS_PENDING),
		mergeMap(({_start, _end}) => {
			return this.peopleService.getCustomers({_start, _end})
				.pipe(
					map((customers: Person[]) => CustomersActions.setSuccess({ customers })),
					catchError(() => of(CustomersActions.setError()))
				);
		})
	));

	constructor(
		private actions$: Actions,
		private peopleService: PeopleService
	) {}
}

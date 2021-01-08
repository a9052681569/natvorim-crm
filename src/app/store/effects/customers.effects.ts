import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PeopleService } from 'src/app/content/backoffice/content/people/people.service';
import { Person } from 'src/app/models/people';
import { CustomersActions, CustomersActionsNames } from '../actions/costomers.actions';

@Injectable()
export class CustomersEffects {

	setCustomers$ = createEffect(() => this.actions$.pipe(
		ofType(CustomersActionsNames.SEARCH_СUSTOMERS_PENDING),
		mergeMap(({name}) => {
			return this.peopleService.getCustomers(name)
				.pipe(
					map((customers: Person[]) => CustomersActions.searchSuccess({ customers })),
					catchError(() => of(CustomersActions.searchError()))
				);
		})
	));

	patchCustomer$ = createEffect(() => this.actions$.pipe(
		ofType(CustomersActionsNames.PATCH_СUSTOMER_PENDING),
		mergeMap(({customer}) => {
			return this.peopleService.patchCustomer(customer)
				.pipe(
					map((cust: Person) => {
						this.dialog.closeAll();
						return CustomersActions.patchSuccess({ customer: cust });
					}),
					catchError(() => of(CustomersActions.patchError()))
				);
		})
	));

	constructor(
		private actions$: Actions,
		private peopleService: PeopleService,
		private dialog: MatDialog
	) {}
}

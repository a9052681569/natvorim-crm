import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
		mergeMap(({query}) => {
			return this.peopleService.searchCustomers(query)
				.pipe(
					map((customers: Person[]) => {
						console.log(customers);
						return CustomersActions.searchSuccess({ customers });
					}),
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

	removeCustomer$ = createEffect(() => this.actions$.pipe(
		ofType(CustomersActionsNames.REMOVE_CUSTOMER_PENDING),
		mergeMap(({customerId}) => {
			return this.peopleService.removeCustomer(customerId)
				.pipe(
					map(({id}: {id: string}) => {
						this.snack.open('Успешно удалили клиента', undefined, {duration: 3000});
						return CustomersActions.removeSuccess({ customerId: id });
					}),
					catchError(() => {
						this.snack.open('Ошибка при удалении клиента клиента', undefined, {duration: 3000});
						return of(CustomersActions.removeError());
					})
				);
		})
	));

	constructor(
		private actions$: Actions,
		private peopleService: PeopleService,
		private dialog: MatDialog,
		private snack: MatSnackBar
	) {}
}

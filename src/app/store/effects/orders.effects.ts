import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PeopleService } from 'src/app/content/backoffice/content/people/people.service';
import { Order } from '../../models/order';
import { OrdersActions, OrdersActionsNames } from '../actions/orders.actions';

@Injectable()
export class OrdersEffects {

	// addOrders$ = createEffect(() => this.actions$.pipe(
	// 	ofType(OrdersActionsNames.ADD_ORDERS_PENDING),
	// 	mergeMap(({ personId }) => {
	// 		return this.peopleService.getOrders({ personId })
	// 			.pipe(
	// 				map((orders: Order[]) => OrdersActions.addOrdersSuccess({orders})),
	// 				catchError(() => of(OrdersActions.addOrdersError()))
	// 			);
	// 	})
	// ));

	constructor(
		private actions$: Actions,
		private peopleService: PeopleService
	) {}
}

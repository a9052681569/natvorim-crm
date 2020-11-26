import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { RootState } from 'src/app/store';
import { OrdersActions } from 'src/app/store/actions/orders.actions';
import { OrdersState } from 'src/app/store/reducers/orders.reducer';
import { PeopleService } from '../../people.service';

@Component({
  selector: 'ntv-person-orders',
  templateUrl: './person-orders.component.html',
  styleUrls: ['./person-orders.component.scss']
})
export class PersonOrdersComponent implements OnInit, OnDestroy {

	@Input() personId: number;

	localState: OrdersLocalState = {
		loading: false,
		err: false,
		orders: []
	};

	destroy$$ = new Subject();

	constructor(
		public store: Store<RootState>,
		private peopleService: PeopleService) { }

	ngOnInit(): void {
		this.getOrders();

		this.store.select('orders')
			.pipe(takeUntil(this.destroy$$))
			.subscribe((ordersState: OrdersState) => {
				this.localState.orders = ordersState.orders.filter(o => o.personId === this.personId);
			});
	}

	ngOnDestroy(): void {
		this.destroy$$.next();
		this.destroy$$.complete();
	}

	getOrders(): void {
		this.localState.loading = true;
		this.localState.err = false;

		this.peopleService.getOrders({ personId: this.personId })
			.pipe(
				tap((orders: Order[]) => {
					this.store.dispatch(OrdersActions.addOrdersSuccess({ orders }));
					this.localState.err = false;
				}),
				catchError(err => {
					this.store.dispatch(OrdersActions.addOrdersError());
					this.localState.err = true;
					return throwError(err);
				}),
				finalize(() => {
					this.localState.loading = false;
				})
			).subscribe();
	}

}

export interface OrdersLocalState {
	loading: boolean;
	err: boolean;
	orders: Order[];
}

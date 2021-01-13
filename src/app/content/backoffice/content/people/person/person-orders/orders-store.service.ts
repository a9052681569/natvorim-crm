import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Order } from 'src/app/models/order';
import { OrdersService } from './orders.service';

/**
 * индивидуальное хранилище данных для каждого инстанса {@link PersonOrdersComponent}
 */
@Injectable()
export class OrdersStore extends ComponentStore<OrdersState> {

	constructor(
		private ordersService: OrdersService,
		private snack: MatSnackBar) {
		super(initialState);
	}

	/**
	 * запускает цепочку действий для получения заказов пользователя, обработки ошибок и записи всего этого в стор
	 */
	readonly getOrders = this.effect((personId$: Observable<string>) => {
		return personId$.pipe(
			switchMap((id: string) => {

				// запускаем лоадер
				this.addOrdersPending();

				// запрашиваем заказы
				return this.ordersService.getOrders(id).pipe(
					tap((o: Order[]) => {
						console.log(o);
						// в случае успеха добавляем заказы в стор
						this.addOrdersSuccess(o);
					}),
					// обрабатываем ошибку
					catchError(err => {
						this.addOrdersError();
						return throwError(err);
					})
				);
			})
		);
	});

	/**
	 * запускает цепочку действий для удаления заказа пользователя, обработки ошибок и записи всего этого в стор
	 */
	readonly removeOrder = this.effect((orderId$: Observable<string>) => {
		return orderId$.pipe(
			switchMap((orderId: string) => {

				return this.ordersService.removeOrder(orderId).pipe(
					tap(({ id }: { id: string }) => {
						this.snack.open('Успешно удалили заказ', undefined, { duration: 3000 });
						this.removeOrderSuccess(id);
					}),
					catchError(err => {
						this.snack.open('Ошибка при удалении заказа', undefined, { duration: 3000 });
						return throwError(err);
					})
				);
			})
		);
	});

	/**
	 * удаляет заказ из стора
	 */
	private readonly removeOrderSuccess = this.updater((st: OrdersState, id: string) => {
		const filteredOrders = st.orders.slice().filter(order => order.id !== id);

		return {
			...st,
			orders: filteredOrders,
			removeLoadingState: LOADING_STATES.default
		};
	});

	/**
	 * обновляет данные о конкретном заказе
	 */
	readonly patchOrder = this.updater((st: OrdersState, order: Order) => {
		const patchedOrders = st.orders.slice();
		patchedOrders[patchedOrders.findIndex(o => o.id === order.id)] = { ...order };

		return {
			...st,
			orders: patchedOrders
		};
	});

	/**
	 * обновляет стор данными о том что происходит запрос
	 */
	private readonly addOrdersPending = this.updater((st: OrdersState) => ({ ...st, loading: true }));

	/**
	 * добавляет в стор переданные заказы, сбрасывает лоадер и ошибки.
	 */
	private readonly addOrdersSuccess = this.updater((st: OrdersState, orders: Order[]): OrdersState => {
		return ({
			...st,
			orders: [...st.orders, ...orders],
			loading: false,
			err: false,
		});
	});

	/**
	 * обновляет стор информацией об ошибке, сбрасывает лоадер
	 */
	private readonly addOrdersError = this.updater((st: OrdersState) => ({ ...st, err: true, loading: false }));
}

/**
 * объект состояния заказов клиента
 */
export interface OrdersState {
	/**
	 * массив заказов
	 */
	orders: Order[];
	/**
	 * состояние загрузки
	 */
	loading: boolean;
	/**
	 * состояние ошибки
	 */
	err: boolean;
}
/**
 * изначальное состояние стора
 */
const initialState: OrdersState = {
	orders: [],
	loading: false,
	err: false,
};

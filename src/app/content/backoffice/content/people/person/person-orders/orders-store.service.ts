import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { OrdersService } from './orders.service';

/**
 * индивидуальное хранилище данных для каждого инстанса {@link PersonOrdersComponent}
 */
@Injectable()
export class OrdersStore extends ComponentStore<OrdersState> {

	constructor(private ordersService: OrdersService) {
		super(initialState);
	}

	/**
	 * запускает цепочку действий для получения заказов пользователя, обработки ошибок и записи всего этого в стор
	 */
	readonly getOrders = this.effect((personId$: Observable<number>) => {
		return personId$.pipe(
			switchMap((id: number) => {

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
			orders: [...st.orders, ...orders],
			loading: false,
			err: false
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
	err: false
};

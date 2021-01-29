import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError, debounceTime } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { OrderTypes } from 'src/app/enums/order/order-enums';
import { Order } from 'src/app/models/order';
import { Person } from 'src/app/models/people';
import { AddOrderService } from './add-order.service';
import { AddOrderFormState, ADD_ORDER_FORM_INITIAL_STATE, SaveForm, SaveFormResponse } from './models/add-order-form';

/**
 * хранилище добавления нового заказа
 */
@Injectable()
export class AddOrderStoreService extends ComponentStore<AddOrderFormState> {

	constructor(
		private addOrderService: AddOrderService,
		private snack: MatSnackBar) {
		super(ADD_ORDER_FORM_INITIAL_STATE);
	}

	/**
	 * сохраняет данные одной из форм для последующего доступа к ним
	 */
	readonly saveForm = this.effect((dataToSave$: Observable<SaveForm>) => {
		return dataToSave$.pipe(
			switchMap((dataToSave: SaveForm) => {

				// запускаем лоадер
				this.reqFormPending();

				// делаем запрос на сохранение переданных данных
				return this.addOrderService.updateFormData(dataToSave).pipe(
					tap((data: SaveFormResponse) => {

						// в случае успеха добавляем заказы в стор
						this.reqFormSuccess(data);
					}),
					// обрабатываем ошибку
					catchError(err => {
						this.reqFormError();
						return throwError(err);
					})
				);
			})
		);
	});

	/**
	 * пытается установить сохраненные данные формы
	 */
	readonly setFormData = this.effect((origin$: Observable<void>) => {
		return origin$.pipe(
			switchMap(() => {
				this.reqFormPending();

				return this.addOrderService.getFormData().pipe(
					tap((data: SaveFormResponse) => {
						this.reqFormSuccess(data);
					}),
					catchError(err => {
						this.reqFormError();
						return throwError(err);
					})
				);
			})
		);
	});

	/**
	 * пытается добавить новый заказ\заказы и человека в БД
	 */
	readonly registerNewOrder = this.effect((state$: Observable<AddOrderFormState>) => {
		return state$.pipe(
			switchMap((state: AddOrderFormState) => {

				// запускаем лоадер
				this.reqFormPending();

				const ordersToPost: Order[] = [];

				// на сервер необходимо отправить массив заказов
				// в данных подписки заказы уже в массиве, в данных пробного заказа один заказ
				// его необходимо добавить в массив
				if (state.orderType === OrderTypes.subscription) {
					ordersToPost.push(...state.subscriptionsOrders.orders);
				} else if (state.orderType === OrderTypes.check) {
					ordersToPost.push(state.onceOrder.order);
				}

				// если у введенного пользователя есть id значит он уже есть в системе, постим его заказ
				if (state.customer.customer.id) {
					ordersToPost.forEach((order: Order) => {
						order.personId = state.customer.customer.id;
					});

					return this.addOrderService.postOrders(ordersToPost).pipe(
						tap(() => {
							this.resetState();
							this.addOrderService.resetFormData();
							this.snack.open('Успешно добавили заказ', undefined, { duration: 3000 });
							this.toInitialState();
						})
					);
				}

				// если id отсутствует - необходимо добавить и заказ и нового клиента
				return this.addOrderService.postCustomer(state.customer.customer).pipe(
					switchMap(([customer]: Person[]) => {

						ordersToPost.forEach((order: Order) => {
							order.personId = customer.id;
						});

						return this.addOrderService.postOrders(ordersToPost).pipe(
							tap(() => {
								this.resetState();
								this.addOrderService.resetFormData();
								this.snack.open('Успешно добавили заказ и нового пользователя', undefined, { duration: 3000 });
								this.toInitialState();
							})
						);
					}),
					catchError(err => {
						this.reqFormError();
						return throwError(err);
					})
				);
			}),
			catchError(err => {
				this.reqFormError();
				return throwError(err);
			})
		);
	});

	/**
	 * указывает на необходимость всем формам сбросить свои значения
	 */
	private readonly resetState = this.updater((st: AddOrderFormState) => ({
		...ADD_ORDER_FORM_INITIAL_STATE,
		resetForm: true
	}));

	/**
	 * возвращает стор к дефолтному состоянию
	 */
	private readonly toInitialState = this.updater((st: AddOrderFormState) => ({
		...ADD_ORDER_FORM_INITIAL_STATE
	}));

	/**
	 * указывает состояние загрузки "в процессе"
	 */
	private readonly reqFormPending = this.updater((st: AddOrderFormState) => ({ ...st, loadingState: LOADING_STATES.loading }));

	/**
	 * патчит стор переданными данными
	 */
	private readonly reqFormSuccess = this.updater((st: AddOrderFormState, formData: SaveFormResponse) => {
		return {
			...st,
			...formData,
			loadingState: null,
		};
	});

	/**
	 * указывает состояние загрузки "ошибка"
	 */
	private readonly reqFormError = this.updater((st: AddOrderFormState) => ({ ...st, loadingState: LOADING_STATES.err }));
}


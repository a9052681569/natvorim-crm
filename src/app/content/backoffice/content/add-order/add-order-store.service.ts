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

@Injectable()
export class AddOrderStoreService extends ComponentStore<AddOrderFormState> {

	constructor(
		private addOrderService: AddOrderService,
		private snack: MatSnackBar) {
		super(ADD_ORDER_FORM_INITIAL_STATE);
	}

	readonly saveForm = this.effect((dataToSave$: Observable<SaveForm>) => {
		return dataToSave$.pipe(
			switchMap((dataToSave: SaveForm) => {

				// запускаем лоадер
				this.reqFormPending();

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

	readonly registerNewOrder = this.effect((state$: Observable<AddOrderFormState>) => {
		return state$.pipe(
			switchMap((state: AddOrderFormState) => {
				this.reqFormPending();

				let ordersToPost: Order[];
				console.log('начинаем сохранять');

				if (state.orderType === OrderTypes.subscription) {
					ordersToPost = state.subscriptionsOrders.orders;
				} else if (state.orderType === OrderTypes.check) {
					ordersToPost = [state.onceOrder.order];
				}

				return this.addOrderService.getPersonsByName(state.customer.customer.name).pipe(
					switchMap((customers: Person[]) => {
						if (!!customers.length) {

							ordersToPost.forEach((order: Order) => {
								order.personId = customers[0].id;
							});

							return this.addOrderService.postOrders(ordersToPost).pipe(
								tap(() => {
									this.resetState();
									this.addOrderService.resetFormData();
									this.snack.open('Успешно добавили заказ', undefined, {duration: 3000});
								})
							);
						}
						return this.addOrderService.postCustomer(state.customer.customer).pipe(
							switchMap(([customer]: Person[]) => {

								ordersToPost.forEach((order: Order) => {
									order.personId = customer.id;
								});

								return this.addOrderService.postOrders(ordersToPost).pipe(
									tap(() => {
										this.resetState();
										this.addOrderService.resetFormData();
										this.snack.open('Успешно добавили заказ и нового пользователя', undefined, {duration: 3000});
									})
								);
							})
						);
					}),
					catchError(err => {
						this.reqFormError();
						return throwError(err);
					})
				);
			})
		);
	});



	private readonly resetState = this.updater((st: AddOrderFormState) => ({
		...ADD_ORDER_FORM_INITIAL_STATE,
		resetForm: true
	}));

	private readonly reqFormPending = this.updater((st: AddOrderFormState) => ({ ...st, loadingState: LOADING_STATES.loading }));

	private readonly reqFormSuccess = this.updater((st: AddOrderFormState, formData: SaveFormResponse) => {
		return {
			...st,
			...formData,
			loadingState: null,
		};
	});

	private readonly reqFormError = this.updater((st: AddOrderFormState) => ({ ...st, loadingState: LOADING_STATES.err }));
}


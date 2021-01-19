import { Injectable } from '@angular/core';
import { ActualShipmentService } from './actual-shipment.service';
import { ComponentStore } from '@ngrx/component-store';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { ASFilterFormData } from './as-filter-form/models/form';
import { ActualShipmentOrder, ASOrderTypeState, ASShipmentTypeState } from 'src/app/models/actual-shipment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeAllSendedData } from './models/change-all-sended';

@Injectable()
export class ActualShipmentStoreService extends ComponentStore<ActualShipmentState> {

	constructor(
		private asService: ActualShipmentService,
		private snack: MatSnackBar) {
		super(ACTUAL_SHIPMENT_INIT_STATE);
	}

	readonly search = this.effect((data$: Observable<ASFilterFormData>) => {
		return data$.pipe(
			switchMap((formData: ASFilterFormData) => {

				this.searchPending();

				return this.asService.search(formData).pipe(
					tap((data: ASShipmentTypeState[]) => {
						// в случае успеха добавляем заказы в стор
						console.log('ответ от сервера', data);
						this.searchSuccess(data);
					}),
					// обрабатываем ошибку
					catchError(err => {
						this.searchError();
						return throwError(err);
					})
				);
			})
		);
	});

	readonly sendedChange = this.effect((data$: Observable<ChangeAllSendedData>) => {
		return data$.pipe(
			switchMap((data: ChangeAllSendedData) => {

				return this.asService.sendedStatusChange(data).pipe(
					tap((d: ChangeAllSendedData) => {

						this.sendedChangeSuccess(d);
					}),
					catchError(err => {
						this.snack.open('Ошибка при изменении статуса отправленности', undefined, { duration: 3000 });

						return throwError(err);
					})
				);
			})
		);
	});

	private readonly sendedChangeSuccess = this.updater((st: ActualShipmentState, data: ChangeAllSendedData) => {
		const patchedData = st.data.slice();

		patchedData.forEach((state: ASShipmentTypeState) => {
			state.ordersByType.forEach((ordersByType: ASOrderTypeState) => {
				ordersByType.orders.forEach((o: ActualShipmentOrder) => {
					const included = data.ids.includes(o.orderId);

					if (included) {
						o.sended = data.sended;
					}
				});
			});
		});

		return {
			...st,
			data: patchedData
		};

	});

	private readonly searchPending = this.updater((st: ActualShipmentState) => ({
		...st,
		data: [],
		loadingState: LOADING_STATES.loading
	}));

	private readonly searchSuccess = this.updater((st: ActualShipmentState, data: ASShipmentTypeState[]) => {
		return {
			...st,
			data,
			loadingState: LOADING_STATES.default
		};
	});

	private readonly searchError = this.updater((st: ActualShipmentState) => ({ ...st, loadingState: LOADING_STATES.err }));
}

export interface ActualShipmentState {
	data: ASShipmentTypeState[];
	loadingState: LOADING_STATES;
}

export const ACTUAL_SHIPMENT_INIT_STATE: ActualShipmentState = {
	data: [],
	loadingState: LOADING_STATES.default
};

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

/**
 * хранилище данных отправки заказов
 */
@Injectable()
export class ActualShipmentStoreService extends ComponentStore<ActualShipmentState> {

	constructor(
		private asService: ActualShipmentService,
		private snack: MatSnackBar) {
		super(ACTUAL_SHIPMENT_INIT_STATE);
	}

	/**
	 * ищет заказы по переданным критериям
	 *
	 * @param data$ критерии поиска
	 */
	readonly search = this.effect((data$: Observable<ASFilterFormData>) => {
		return data$.pipe(
			switchMap((formData: ASFilterFormData) => {

				// меняем статус запроса на "загрузка"
				this.searchPending();

				// пытаемся найти заказы с переданными критериями
				return this.asService.search(formData).pipe(
					tap((data: ASShipmentTypeState[]) => {
						// в случае успеха добавляем заказы в стор
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

	/**
	 * делает запрос на изменение статуса отправленности заказов
	 *
	 * @param data$ данные о заказах и новом статусе отправленности
	 */
	readonly sendedChange = this.effect((data$: Observable<ChangeAllSendedData>) => {
		return data$.pipe(
			switchMap((data: ChangeAllSendedData) => {

				// делаем запрос на изменение статуса отправленности
				return this.asService.sendedStatusChange(data).pipe(
					tap((d: ChangeAllSendedData) => {
						// в случае успеха обновляем стор
						this.sendedChangeSuccess(d);
					}),
					// обрабатываем ошибку
					catchError(err => {
						this.snack.open('Ошибка при изменении статуса отправленности', undefined, { duration: 3000 });

						return throwError(err);
					})
				);
			})
		);
	});

	/**
	 * обновляет статус отправленности у заказов в сторе
	 */
	private readonly sendedChangeSuccess = this.updater((st: ActualShipmentState, data: ChangeAllSendedData) => {
		const patchedData = st.data.slice();

		// ищет в сложной структуре нужные заказы и изменяет их статус отправленности
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

	/**
	 * устанавливает статус загрузки и сбрасыват имеющиеся данные - идет новый запрос => старые данные больше не нужны
	 */
	private readonly searchPending = this.updater((st: ActualShipmentState) => ({
		...st,
		data: [],
		loadingState: LOADING_STATES.loading
	}));

	/**
	 * устанавливает в стор переданные данные, сбрасывает состояние загрузки
	 */
	private readonly searchSuccess = this.updater((st: ActualShipmentState, data: ASShipmentTypeState[]) => {
		return {
			...st,
			data,
			loadingState: LOADING_STATES.default
		};
	});

	/**
	 * устанавливает состояние ошибки
	 */
	private readonly searchError = this.updater((st: ActualShipmentState) => ({ ...st, loadingState: LOADING_STATES.err }));
}

/**
 * состояние страницы отправки заказов
 */
export interface ActualShipmentState {
	/**
	 * данные для отправки заказов
	 */
	data: ASShipmentTypeState[];
	/**
	 * состояние запроса к серверу
	 */
	loadingState: LOADING_STATES;
}

/**
 * дефолтное состояние стора отправки заказов
 */
export const ACTUAL_SHIPMENT_INIT_STATE: ActualShipmentState = {
	data: [],
	loadingState: LOADING_STATES.default
};

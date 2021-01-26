import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { ShipmentPreparingOrder } from 'src/app/models/shipment-preparing-order';
import { SPFilterFormData } from './sp-filter-form/models/form';
import { ShipmentPreparingService } from './shipment-preparing.service';

/**
 * хранилище данных подготовки отправки заказов
 */
@Injectable()
export class ShipmentPreparingStoreService extends ComponentStore<ShipmentPreparingState> {

	constructor(private spService: ShipmentPreparingService) {
		super(shipmentPreparingInitialState);
	}

	/**
	 * ищет заказы по переданным критериям
	 *
	 * @param data$ критерии поиска
	 */
	readonly search = this.effect((data$: Observable<SPFilterFormData>) => {
		return data$.pipe(
			switchMap((formData: SPFilterFormData) => {

				this.searchPending();

				return this.spService.search(formData).pipe(
					tap((data: ShipmentPreparingOrder[]) => {
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
	 * устанавливает статус загрузки и сбрасыват имеющиеся данные - идет новый запрос => старые данные больше не нужны
	 */
	private readonly searchPending = this.updater((st: ShipmentPreparingState) => ({ ...st, loadingState: LOADING_STATES.loading }));

	/**
	 * устанавливает в стор переданные данные, сбрасывает состояние загрузки
	 */
	private readonly searchSuccess = this.updater((st: ShipmentPreparingState, orders: ShipmentPreparingOrder[]) => {
		return {
			...st,
			orders,
			loadingState: null
		};
	});

	/**
	 * устанавливает состояние ошибки
	 */
	private readonly searchError = this.updater((st: ShipmentPreparingState) => ({ ...st, loadingState: LOADING_STATES.err }));
}

/**
 * состояние страницы подготовки отправки заказов
 */
export interface ShipmentPreparingState {
	/**
	 * массив заказов для подготовки отправки
	 */
	orders: ShipmentPreparingOrder[];
	/**
	 * состояние запроса к серверу
	 */
	loadingState: LOADING_STATES | null;
}

export const shipmentPreparingInitialState: ShipmentPreparingState = {
	orders: [],
	loadingState: null
};

import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { ShipmentPreparingOrder } from 'src/app/models/shipment-preparing-order';
import { FilterFormData } from './filter-form/models/form';
import { ShipmentPreparingService } from './shipment-preparing.service';

@Injectable({
  	providedIn: 'root'
})
export class ShipmentPreparingStoreService extends ComponentStore<ShipmentPreparingState> {

	constructor(private spService: ShipmentPreparingService) {
		super(shipmentPreparingInitialState);
	}

	readonly search = this.effect((data$: Observable<FilterFormData>) => {
		return data$.pipe(
			switchMap((formData: FilterFormData) => {

				this.searchPending();

				return this.spService.search(formData).pipe(
					tap((data: ShipmentPreparingOrder[]) => {
						// в случае успеха добавляем заказы в стор
						console.log(data);
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

	private readonly searchPending = this.updater((st: ShipmentPreparingState) => ({ ...st, loadingState: LOADING_STATES.loading }));

	private readonly searchSuccess = this.updater((st: ShipmentPreparingState, orders: ShipmentPreparingOrder[]) => {
		return {
			...st,
			orders,
			loadingState: null
		};
	});

	private readonly searchError = this.updater((st: ShipmentPreparingState) => ({ ...st, loadingState: LOADING_STATES.err }));
}

export interface ShipmentPreparingState {
	orders: ShipmentPreparingOrder[];
	loadingState: LOADING_STATES | null;
}

export const shipmentPreparingInitialState: ShipmentPreparingState = {
	orders: [],
	loadingState: null
};

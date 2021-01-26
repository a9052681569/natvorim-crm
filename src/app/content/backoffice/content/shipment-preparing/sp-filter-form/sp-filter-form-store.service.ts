import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { SPFilterFormService } from './sp-filter-form.service';
import { SPFilterFormState, SP_FILTER_FORM_INIT_STATE, SPFilterFormData } from './models/form';

/**
 * хранилище данных формы фильтров для подготовки отправки
 */
@Injectable({
  providedIn: 'root'
})
export class SPFilterFormStoreService extends ComponentStore<SPFilterFormState> {

	constructor(private ffs: SPFilterFormService) {
		super(SP_FILTER_FORM_INIT_STATE);
	}

	/**
	 * пытается сохранить данные формы,
	 * в случае успеха обновляет данные в хранилище
	 *
	 * @param data$ данные формы фильтров на странице подготовки отправки
	 */
	readonly saveForm = this.effect((data$: Observable<SPFilterFormData>) => {
		return data$.pipe(
			switchMap((formData: SPFilterFormData) => {

				return this.ffs.updateFormData(formData).pipe(
					tap((data: SPFilterFormData) => {

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
	 * запрашивает сохраненные данные для формы,
	 * в случае успеха обновляет данные в хранилище
	 */
	readonly setFormData = this.effect((origin$: Observable<void>) => {
		return origin$.pipe(
			switchMap(() => {
				return this.ffs.getFormData().pipe(
					tap((data: SPFilterFormData) => {
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
	 * патчит стор переданными данными, сбрасывает состояние загрузки
	 */
	private readonly reqFormSuccess = this.updater((st: SPFilterFormState, formData: SPFilterFormData) => {
		return {
			...st,
			data: formData,
			loadingState: null
		};
	});
	/**
	 * патчит стор данными о ошибке загрузки
	 */
	private readonly reqFormError = this.updater((st: SPFilterFormState) => ({ ...st, loadingState: LOADING_STATES.err }));
}

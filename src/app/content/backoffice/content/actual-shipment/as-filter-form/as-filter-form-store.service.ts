import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { ASFilterFormState, AS_FILTER_FORM_INIT_STATE, ASFilterFormData } from './models/form';
import { FilterFormService } from './as-filter-form.service';

/**
 * хранилище данных формы фильтров для отправки
 */
@Injectable({
  	providedIn: 'root'
})
export class FilterFormStoreService extends ComponentStore<ASFilterFormState> {

	constructor(private ffs: FilterFormService) {
		super(AS_FILTER_FORM_INIT_STATE);
	}

	/**
	 * пытается сохранить данные формы,
	 * в случае успеха обновляет данные в хранилище
	 *
	 * @param data$ данные формы фильтров на странице отправки
	 */
	readonly saveForm = this.effect((data$: Observable<ASFilterFormData>) => {
		return data$.pipe(
			switchMap((formData: ASFilterFormData) => {

				// пытаемся сохранить данные
				return this.ffs.updateFormData(formData).pipe(
					tap((data: ASFilterFormData) => {

						// в случае успеха добавляем данные в стор
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
				// запрашиваем сохраненные данные
				return this.ffs.getFormData().pipe(
					tap((data: ASFilterFormData) => {
						// в случае успеха добавляем данные в стор
						this.reqFormSuccess(data);
					}),
					catchError(err => {
						// обрабатываем ошибку
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
	private readonly reqFormSuccess = this.updater((st: ASFilterFormState, formData: ASFilterFormData) => {
		return {
			...st,
			data: formData,
			loadingState: LOADING_STATES.default
		};
	});

	/**
	 * патчит стор данными о ошибке загрузки
	 */
	private readonly reqFormError = this.updater((st: ASFilterFormState) => ({ ...st, loadingState: LOADING_STATES.err }));
}

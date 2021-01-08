import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { FilterFormService } from './filter-form.service';
import { FilterFormState, filterFormInitialState, FilterFormData } from './models/form';

@Injectable({
  providedIn: 'root'
})
export class FilterFormStoreService extends ComponentStore<FilterFormState> {

	constructor(private ffs: FilterFormService) {
		super(filterFormInitialState);
	}

	readonly saveForm = this.effect((data$: Observable<FilterFormData>) => {
		return data$.pipe(
			switchMap((formData: FilterFormData) => {

				return this.ffs.updateFormData(formData).pipe(
					tap((data: FilterFormData) => {

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
				return this.ffs.getFormData().pipe(
					tap((data: FilterFormData) => {
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

	private readonly reqFormSuccess = this.updater((st: FilterFormState, formData: FilterFormData) => {
		return {
			...st,
			data: formData,
			loadingState: null
		};
	});

	private readonly reqFormError = this.updater((st: FilterFormState) => ({ ...st, loadingState: LOADING_STATES.err }));
}

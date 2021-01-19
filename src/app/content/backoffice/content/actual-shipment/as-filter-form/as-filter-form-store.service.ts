import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { ASFilterFormState, AS_FILTER_FORM_INIT_STATE, ASFilterFormData } from './models/form';
import { FilterFormService } from './as-filter-form.service';

@Injectable({
  	providedIn: 'root'
})
export class FilterFormStoreService extends ComponentStore<ASFilterFormState> {

	constructor(private ffs: FilterFormService) {
		super(AS_FILTER_FORM_INIT_STATE);
	}

	readonly saveForm = this.effect((data$: Observable<ASFilterFormData>) => {
		return data$.pipe(
			switchMap((formData: ASFilterFormData) => {

				return this.ffs.updateFormData(formData).pipe(
					tap((data: ASFilterFormData) => {

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
					tap((data: ASFilterFormData) => {
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

	private readonly reqFormSuccess = this.updater((st: ASFilterFormState, formData: ASFilterFormData) => {
		return {
			...st,
			data: formData,
			loadingState: LOADING_STATES.default
		};
	});

	private readonly reqFormError = this.updater((st: ASFilterFormState) => ({ ...st, loadingState: LOADING_STATES.err }));
}

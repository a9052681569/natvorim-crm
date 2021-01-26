import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SP_FILTER_FORM_INIT_STATE, SPFilterFormData } from './models/form';

@Injectable({
  	providedIn: 'root'
})
export class SPFilterFormService {

	constructor() { }

	/**
	 * обновляет сохраненные данные формы
	 *
	 * @param data данные формы
	 */
	updateFormData(data: SPFilterFormData): Observable<SPFilterFormData> {

		localStorage.setItem('ntv-sp-filter-form-data', JSON.stringify(data));

		return of(data);
	}

	/**
	 * запрашивает сохраненные данные формы,
	 * если сохраненных данных нет - возвращает дефолтные данные формы
	 */
	getFormData(): Observable<SPFilterFormData> {
		const formDataString = localStorage.getItem('ntv-sp-filter-form-data');

		const formData: SPFilterFormData = formDataString ? JSON.parse(formDataString) : SP_FILTER_FORM_INIT_STATE.data;

		return of(formData);
	}
}

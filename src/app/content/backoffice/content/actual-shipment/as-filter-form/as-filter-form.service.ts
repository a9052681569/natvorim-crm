import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AS_FILTER_FORM_INIT_STATE, ASFilterFormData } from './models/form';

@Injectable({
  	providedIn: 'root'
})
export class FilterFormService {

	constructor() { }

	updateFormData(data: ASFilterFormData): Observable<ASFilterFormData> {

		localStorage.setItem('ntv-as-filter-form-data', JSON.stringify(data));

		return of(data);
	}

	getFormData(): Observable<ASFilterFormData> {
		const formDataString = localStorage.getItem('ntv-as-filter-form-data');

		const formData: ASFilterFormData = formDataString ? JSON.parse(formDataString) : AS_FILTER_FORM_INIT_STATE.data;

		return of(formData);
	}
}

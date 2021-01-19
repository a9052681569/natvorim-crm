import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SP_FILTER_FORM_INIT_STATE, SPFilterFormData } from './models/form';

@Injectable({
  	providedIn: 'root'
})
export class SPFilterFormService {

	constructor() { }

	updateFormData(data: SPFilterFormData): Observable<SPFilterFormData> {

		localStorage.setItem('ntv-sp-filter-form-data', JSON.stringify(data));

		return of(data);
	}

	getFormData(): Observable<SPFilterFormData> {
		const formDataString = localStorage.getItem('ntv-sp-filter-form-data');

		const formData: SPFilterFormData = formDataString ? JSON.parse(formDataString) : SP_FILTER_FORM_INIT_STATE.data;

		return of(formData);
	}
}

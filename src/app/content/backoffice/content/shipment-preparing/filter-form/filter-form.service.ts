import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filterFormInitialState, FilterFormData } from './models/form';

@Injectable({
  	providedIn: 'root'
})
export class FilterFormService {

	constructor() { }

	updateFormData(data: FilterFormData): Observable<FilterFormData> {

		localStorage.setItem('ntv-filter-form-data', JSON.stringify(data));

		return of(data);
	}

	getFormData(): Observable<FilterFormData> {
		const formDataString = localStorage.getItem('ntv-filter-form-data');

		const formData: FilterFormData = formDataString ? JSON.parse(formDataString) : filterFormInitialState.data;

		return of(formData);
	}
}

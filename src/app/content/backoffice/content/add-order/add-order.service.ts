import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrderTypes } from 'src/app/enums/order/order-enums';
import { Order } from 'src/app/models/order';
import { Person } from 'src/app/models/people';
import { environment } from 'src/environments/environment';
import { ADD_ORDER_FORM_INITIAL_STATE, SaveForm, SaveFormResponse } from './models/add-order-form';

@Injectable({
  	providedIn: 'root'
})
export class AddOrderService {

	formDataInitState: SaveFormResponse = {
		onceOrder: ADD_ORDER_FORM_INITIAL_STATE.onceOrder,
		orderType: ADD_ORDER_FORM_INITIAL_STATE.orderType,
		subscriptionsOrders: ADD_ORDER_FORM_INITIAL_STATE.subscriptionsOrders,
		customer: ADD_ORDER_FORM_INITIAL_STATE.customer
	};

	constructor(private http: HttpClient) { }

	updateFormData(data: SaveForm): Observable<SaveFormResponse> {
		const formDataString = localStorage.getItem('ntv-add-order-form-data');

		let patchData: SaveFormResponse;

		if (formDataString) {
			patchData = {
				...JSON.parse(formDataString),
				...data
			};
		} else {
			patchData = {
				...this.formDataInitState,
				...data
			};
		}
		localStorage.setItem('ntv-add-order-form-data', JSON.stringify(patchData));

		return of(patchData);
	}

	getFormData(): Observable<SaveFormResponse> {
		const formDataString = localStorage.getItem('ntv-add-order-form-data');

		const formData: SaveFormResponse = formDataString ? JSON.parse(formDataString) : this.formDataInitState;

		return of(formData);
	}

	resetFormData(): void {
		localStorage.removeItem('ntv-add-order-form-data');
	}

	getPersonsByName(name: string): Observable<Person[]> {
		return this.http.post<Person[]>(environment.apiEndpoints.customersForAutocomplete, {name});
	}

	postOrders(orders: Order[]): Observable<Order[]> {
		return this.http.post<Order[]>(environment.apiEndpoints.postOrders, orders);
	}

	postCustomer(customer: Person): Observable<Person[]> {
		return this.http.post<Person[]>(environment.apiEndpoints.postCustomer, customer);
	}

}

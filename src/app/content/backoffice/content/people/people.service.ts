import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from 'src/app/models/people';
import { Paging } from 'src/app/models/paging';
import { AddOrdersPendingProps } from 'src/app/store/actions/orders.actions';
import { Order } from 'src/app/models/order';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

	constructor(private http: HttpClient) { }

	getCustomers(paging: Paging): Observable<Person[]> {
		return this.http.post<Person[]>('http://localhost:3000/people/paging', paging);
	}

	getOrders({personId}: AddOrdersPendingProps): Observable<Order[]> {
		return this.http.get<Order[]>(`http://localhost:3000/orders?personId=${personId}`);
	}
}

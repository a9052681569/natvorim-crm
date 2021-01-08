import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from 'src/app/models/people';
import { Paging } from 'src/app/models/paging';
import { Order } from 'src/app/models/order';
import { environment } from 'src/environments/environment';

/**
 * сервис для запросов, которые касаются информации о клиентах
 */
@Injectable({
  providedIn: 'root'
})
export class PeopleService {

	constructor(private http: HttpClient) { }

	/**
	 * запрашивает пользователей без какой-либо фильтрации.
	 *
	 * @param paging объект с данными пагинации
	 * @returns поток содержащий массив клиентов
	 */
	getCustomers(name: string): Observable<Person[]> {
		return this.http.post<Person[]>(environment.apiEndpoints.getCustomers, {name});
	}

	/**
	 * отправляет запрос на изменение данных клиента
	 *
	 * @param customer объект с данными о клиенте
	 * @returns поток содержащий объект с данными о клиенте
	 */
	patchCustomer(customer: Person): Observable<Person> {
		return this.http.post<Person>(environment.apiEndpoints.patchCustomer, customer);
	}

}

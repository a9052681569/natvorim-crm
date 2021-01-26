import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { environment } from 'src/environments/environment';

/**
 * Отвечает за запросы, касающиеся информации о заказах
 */
@Injectable({
  	providedIn: 'root'
})
export class OrdersService {

	constructor(private http: HttpClient) { }

	/**
	 * запрашивает заказы конкретного клиента
	 *
	 * @param personId идентификатор клиента, по нему мы получаем заказы конкретного клиента
	 */
	getOrders(personId: string): Observable<Order[]> {
		return this.http.post<Order[]>(environment.apiEndpoints.getOrdersById, {personId});
	}

	removeOrder(id: string): Observable<{id: string}> {
		return this.http.post<{id: string}>(environment.apiEndpoints.removeOrder, { id });
	}

	/**
	 * изменяет данные заказа
	 *
	 * @param order заказ, данные которого будут изменены
	 */
	patchOrder(order: Order): Observable<Order> {
		return this.http.post<Order>(environment.apiEndpoints.patchOrder, order);
	}

	/**
	 * делает запрос на изменение статуса отправленности заказа
	 *
	 * @param id идентификатор заказа
	 * @param sended новый статус отправленности
	 */
	patchOrderSended(id: string, sended: boolean): Observable<boolean> {
		return this.http.post<boolean>(environment.apiEndpoints.patchOrderSended, {id, sended});
	}

	/**
	 * делает запрос на изменение номера отправления заказа
	 *
	 * @param id идентификатор заказа
	 * @param trackNumber новый номер отправления
	 */
	patchOrderTrack(id: string, trackNumber: string): Observable<string> {
		return this.http.post<string>(environment.apiEndpoints.patchOrderTrack, {id, trackNumber});
	}
}

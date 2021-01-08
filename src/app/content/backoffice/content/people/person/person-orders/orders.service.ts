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
	getOrders(personId: number): Observable<Order[]> {
		return this.http.post<Order[]>(environment.apiEndpoints.getOrdersById, {personId});
	}

	/**
	 * изменяет данные заказа
	 *
	 * @param order заказ, данные которого будут изменены
	 */
	patchOrder(order: Order): Observable<Order> {
		return this.http.post<Order>(environment.apiEndpoints.patchOrder, order);
	}

	patchOrderSended(id: string, sended: boolean): Observable<boolean> {
		return this.http.post<boolean>(environment.apiEndpoints.patchOrderSended, {id, sended});
	}

	patchOrderTrack(id: string, trackNumber: string): Observable<string> {
		return this.http.post<string>(environment.apiEndpoints.patchOrderTrack, {id, trackNumber});
	}
}

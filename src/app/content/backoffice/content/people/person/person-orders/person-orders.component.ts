import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersState, OrdersStore } from './orders-store.service';

@Component({
	selector: 'ntv-person-orders',
	templateUrl: './person-orders.component.html',
	styleUrls: ['./person-orders.component.scss'],
	providers: [OrdersStore]
})
export class PersonOrdersComponent implements OnInit {

	/**
	 * идентификатор клиента, чьи заказы необходимо отрисовать
	 */
	@Input() personId: number;

	/**
	 * состояние заказов клиента (загрузка, ошибка, массив заказов)
	 */
	state$: Observable<OrdersState>;

	constructor(private readonly ordersStore: OrdersStore) { }

	ngOnInit(): void {
		this.state$ = this.ordersStore.select(s => s);

		this.getOrders();

	}

	/**
	 * запрашивает заказы клиента
	 */
	getOrders(): void {
		this.ordersStore.getOrders(this.personId);
	}

}

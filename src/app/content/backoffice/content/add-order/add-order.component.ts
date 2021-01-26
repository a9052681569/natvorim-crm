import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { OrderTypes } from 'src/app/enums/order/order-enums';
import { AddOrderStoreService } from './add-order-store.service';
import { AddOrderFormState } from './models/add-order-form';

@Component({
	selector: 'ntv-add-order',
	templateUrl: './add-order.component.html',
	styleUrls: ['./add-order.component.scss'],
	providers: [AddOrderStoreService]
})
export class AddOrderComponent implements OnInit {

	/**
	 * возможные состояния загрузки для доступа в шаблоне
	 */
	loadingStates = LOADING_STATES;

	/**
	 * текущее состояние загрузки
	 */
	loadingState$: Observable<LOADING_STATES | null>;

	/**
	 * состояние хранилища добавления нового заказа
	 */
	state$: Observable<AddOrderFormState>;

	/**
	 * флаг говорящий о валидности всех форм на экране добавления заказа
	 */
	readyToSend: boolean;

	constructor(private store: AddOrderStoreService) { }

	ngOnInit(): void {
		this.store.setFormData();

		this.loadingState$ = this.store.select(s => s.loadingState).pipe(debounceTime(200));

		this.state$ = this.store.select(s => {

			if (s.orderType === OrderTypes.subscription) {
				this.readyToSend = s.customer.isValid && s.subscriptionsOrders.isValid;
			} else {
				this.readyToSend = s.customer.isValid && s.onceOrder.isValid;
			}

			return s;
		});
	}

	/**
	 * регистрирует новый заказ
	 */
	registerNewOrder(state: AddOrderFormState): void {
		this.store.registerNewOrder(state);
	}

}

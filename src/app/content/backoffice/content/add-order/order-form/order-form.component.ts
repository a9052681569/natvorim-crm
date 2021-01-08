import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { OrderTypes } from 'src/app/enums/order/order-enums';
import { Order } from 'src/app/models/order';
import { AddOrderStoreService } from '../add-order-store.service';


@Component({
  selector: 'ntv-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent {

	orderTypes = OrderTypes;

	constructor(private store: AddOrderStoreService) { }

	setCurrentOrderType(e: MatTabChangeEvent): void {

		const orderType = Object.values(OrderTypes).reduce((res: OrderTypes, item: OrderTypes) => {
			if (item === e.tab.textLabel.toLowerCase()) {
				res = item;
			}
			return res;
		}, OrderTypes.subscription);

		this.store.saveForm({ orderType });
	}
}

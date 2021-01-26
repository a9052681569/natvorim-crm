import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ASOrderTypeState } from 'src/app/models/actual-shipment';
import { ActualShipmentStoreService } from '../../actual-shipment-store.service';
import { ChangeAllSendedData } from '../../models/change-all-sended';

@Component({
  selector: 'ntv-actual-order-type',
  templateUrl: './actual-order-type.component.html',
  styleUrls: ['./actual-order-type.component.scss']
})
export class ActualOrderTypeComponent {

	/**
	 * объект с типом заказа в разрезе отправки (сложный, театр, 2-3 и т.д)
	 * и массивом заказов для отправки
	 */
	@Input() orderType: ASOrderTypeState;

	constructor(private store: ActualShipmentStoreService) { }

	/**
	 * отражает статус отправленности всех заказов в {@link orderType.orders}
	 */
	get isAllSended(): boolean {
		return this.orderType.orders.every(o => o.sended);
	}

	/**
	 * пытается изменить статус отправленности всех заказов в {@link orderType.orders}
	 *
	 * @param e событие клика на чекбокс
	 */
	changeAllSended(e: MatCheckboxChange): void {

		e.source.checked = !e.checked;

		const data: ChangeAllSendedData = {
			ids: this.orderType.orders.map(o => o.orderId),
			sended: e.checked
		};

		this.store.sendedChange(data);
	}

}

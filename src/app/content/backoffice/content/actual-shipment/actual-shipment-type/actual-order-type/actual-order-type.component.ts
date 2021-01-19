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

	@Input() orderType: ASOrderTypeState;

	constructor(private store: ActualShipmentStoreService) { }

	get isAllSended(): boolean {
		return this.orderType.orders.every(o => o.sended);
	}

	changeAllSended(e: MatCheckboxChange): void {

		e.source.checked = !e.checked;

		const data: ChangeAllSendedData = {
			ids: this.orderType.orders.map(o => o.orderId),
			sended: e.checked
		};

		this.store.sendedChange(data);
	}

}

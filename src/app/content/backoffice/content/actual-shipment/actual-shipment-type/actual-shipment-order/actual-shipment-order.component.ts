import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { ShipmentOrderTypes } from 'src/app/enums/order/order-enums';
import { ActualShipmentOrder } from 'src/app/models/actual-shipment';
import { ActualShipmentStoreService } from '../../actual-shipment-store.service';
import { ChangeAllSendedData } from '../../models/change-all-sended';

@Component({
	selector: 'ntv-actual-shipment-order',
	templateUrl: './actual-shipment-order.component.html',
	styleUrls: ['./actual-shipment-order.component.scss']
})
export class ActualShipmentOrderComponent implements OnInit {

	@Input() order: ActualShipmentOrder;

	@Input() orderType: ShipmentOrderTypes;

	showStructure = false;

	showAddress = false;

	constructor(private store: ActualShipmentStoreService) { }

	ngOnInit(): void {
		if (this.orderType === ShipmentOrderTypes.complicated) {
			this.showStructure = true;
		}

		if (this.orderType === ShipmentOrderTypes.theatres) {
			this.showStructure = true;
			this.showAddress = true;
		}
	}

	changeSended(val: boolean): void {

		const data: ChangeAllSendedData = {
			ids: [this.order.orderId],
			sended: val
		};

		this.store.sendedChange(data);
	}

}

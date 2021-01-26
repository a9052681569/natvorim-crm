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

	/**
	 * объект с данными о заказе для отправки
	 */
	@Input() order: ActualShipmentOrder;

	/**
	 * тип заказа в контексте отправки (сложный, театр, 2-3 и т.д)
	 */
	@Input() orderType: ShipmentOrderTypes;

	/**
	 * маркер отвечает за необходимость отрисовки структуры заказа
	 */
	showStructure = false;

	/**
	 * маркер отвечает за необходимость отрисовки адреса
	 */
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

	/**
	 * пытается изменить статус отправленности {@link order}
	 *
	 * @param sended значение для статуса отправленности
	 */
	changeSended(sended: boolean): void {

		const data: ChangeAllSendedData = {
			ids: [this.order.orderId],
			sended
		};

		this.store.sendedChange(data);
	}

}

import { Component, Input } from '@angular/core';
import { ShipmentPreparingOrder } from 'src/app/models/shipment-preparing-order';

@Component({
	selector: 'ntv-preparing-order',
	templateUrl: './preparing-order.component.html',
	styleUrls: ['./preparing-order.component.scss']
})
export class PreparingOrderComponent {

	/**
	 * заказ для подготовки отправки
	 */
	@Input() order: ShipmentPreparingOrder;

}

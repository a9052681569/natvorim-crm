import { Component, Input } from '@angular/core';
import { ASShipmentTypeState } from 'src/app/models/actual-shipment';
import { Order } from 'src/app/models/order';

@Component({
	selector: 'ntv-actual-shipment-type',
	templateUrl: './actual-shipment-type.component.html',
	styleUrls: ['./actual-shipment-type.component.scss']
})
export class ActualShipmentTypeComponent {

	@Input() type: ASShipmentTypeState;

}

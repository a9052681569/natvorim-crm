import { Component, Input, OnInit } from '@angular/core';
import { ShipmentPreparingOrder } from 'src/app/models/shipment-preparing-order';
import { ClipService } from 'src/app/shared/services/clip.service';

@Component({
	selector: 'ntv-preparing-order',
	templateUrl: './preparing-order.component.html',
	styleUrls: ['./preparing-order.component.scss']
})
export class PreparingOrderComponent implements OnInit {

	@Input() order: ShipmentPreparingOrder;

	constructor() { }

	ngOnInit(): void {
	}

}

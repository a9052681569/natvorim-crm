import { Component, OnInit } from '@angular/core';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { ShipmentPreparingStoreService } from './shipment-preparing-store.service';

@Component({
	selector: 'ntv-shipment-preparing',
	templateUrl: './shipment-preparing.component.html',
	styleUrls: ['./shipment-preparing.component.scss'],
	providers: [ShipmentPreparingStoreService]
})
export class ShipmentPreparingComponent implements OnInit {

	loadingStates = LOADING_STATES;

	constructor(public preparingStore: ShipmentPreparingStoreService) { }

	ngOnInit(): void {
	}

}

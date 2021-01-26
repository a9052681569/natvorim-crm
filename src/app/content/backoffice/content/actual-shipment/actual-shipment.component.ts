import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { ActualShipmentState, ActualShipmentStoreService } from './actual-shipment-store.service';

@Component({
	selector: 'ntv-actual-shipment',
	templateUrl: './actual-shipment.component.html',
	styleUrls: ['./actual-shipment.component.scss'],
	providers: [ActualShipmentStoreService]
})
export class ActualShipmentComponent implements OnInit {

	/**
	 * состояние хранилища отправки {@link ActualShipmentStoreService}
	 */
	actualShipmentState$: Observable<ActualShipmentState>;

	/**
	 * состояние загрузки запросов хранилища {@link ActualShipmentStoreService}
	 */
	loadingStates = LOADING_STATES;

	constructor(private store: ActualShipmentStoreService) { }

	ngOnInit(): void {

		this.actualShipmentState$ = this.store.select(s => s);
	}

}

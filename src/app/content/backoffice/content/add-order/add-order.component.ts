import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { AddOrderStoreService } from './add-order-store.service';
import { AddOrderFormState } from './models/add-order-form';

@Component({
	selector: 'ntv-add-order',
	templateUrl: './add-order.component.html',
	styleUrls: ['./add-order.component.scss'],
	providers: [AddOrderStoreService]
})
export class AddOrderComponent implements OnInit {

	loadingStates = LOADING_STATES;

	loadingState$: Observable<LOADING_STATES | null>;

	state$: Observable<AddOrderFormState>;

	constructor(private store: AddOrderStoreService) { }

	ngOnInit(): void {
		this.store.setFormData();

		this.loadingState$ = this.store.select(s => s.loadingState).pipe(debounceTime(200));

		this.state$ = this.store.select(s => s);
	}

	registerNewOrder(state: AddOrderFormState): void {
		this.store.registerNewOrder(state);
	}

}
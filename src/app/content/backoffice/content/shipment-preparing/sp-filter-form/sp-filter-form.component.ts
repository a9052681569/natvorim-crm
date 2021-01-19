import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, tap, debounceTime, take } from 'rxjs/operators';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { OrderAges, ShipmentOrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { ShipmentPreparingStoreService } from '../shipment-preparing-store.service';
import { SPFilterFormStoreService } from './sp-filter-form-store.service';
import {
	SPFilterFormData,
	SP_FILTER_FORM_INIT_STATE,
	SPFilterFormState,
	ShipmentPreparingOrderTypes,
	ShipmentPreparingShipmentTypes
} from './models/form';

@Component({
	selector: 'ntv-sp-filter-form',
	templateUrl: './sp-filter-form.component.html',
	styleUrls: ['./sp-filter-form.component.scss']
})
export class SPFilterFormComponent implements OnInit, OnDestroy {

	form: FormGroup;

	destroyer$$ = new Subject();

	/**
	 * массив возможных типов отпавки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	shipmentTypes: ShipmentPreparingShipmentTypes[] = [...Object.values(ShipmentTypes), 'все'];

	/**
	 * массив возможных диапазонов возрастов для контрола селект (наборы бывают для нескольких диапазов возрастов)
	 *
	 * @example ['2-3', '4-6']
	 */
	filterCriteria: ShipmentPreparingOrderTypes[] = [...Object.values(ShipmentOrderTypes), 'все'];

	/**
	 * возможные месяцы доставки
	 */
	months: Month[] = MONTHS;

	constructor(
		private fb: FormBuilder,
		private store: SPFilterFormStoreService,
		private spStore: ShipmentPreparingStoreService) { }

	ngOnInit(): void {
		this.initForm();

		this.store.setFormData();

		this.initFormSetter();

		this.initFormSaver();

		this.search();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	search(): void {
		this.spStore.search(this.form.value);
	}

	private initForm(): void {
		this.form = this.fb.group({
			shipmentDate: SP_FILTER_FORM_INIT_STATE.data.shipmentDate,
			shipmentType: SP_FILTER_FORM_INIT_STATE.data.shipmentType,
			ordersType: SP_FILTER_FORM_INIT_STATE.data.ordersType,
			noTrack: SP_FILTER_FORM_INIT_STATE.data.noTrack,
		});
	}

	private initFormSetter(): void {
		this.store.select(s => s)
			.pipe(
				take(1),
				tap((state: SPFilterFormState) => {
					this.form.setValue(state.data);
				})
			)
			.subscribe();
	}

	private initFormSaver(): void {
		this.form.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500),
			)
			.subscribe((v: SPFilterFormData) => {
				this.store.saveForm(v);
			});
	}

}



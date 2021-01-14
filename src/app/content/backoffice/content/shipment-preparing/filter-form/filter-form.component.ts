import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil, tap, debounceTime, take } from 'rxjs/operators';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { OrderAges, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { ShipmentPreparingStoreService } from '../shipment-preparing-store.service';
import { FilterFormStoreService } from './filter-form-store.service';
import {
	filterFormInitialState,
	FilterFormState,
	ShipmentPreparingOrderTypes,
	ShipmentPreparingOtherCriteriaEnum,
	ShipmentPreparingOtherCriteriaInterface
} from './models/form';

@Component({
	selector: 'ntv-filter-form',
	templateUrl: './filter-form.component.html',
	styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit, OnDestroy {

	form: FormGroup;

	destroyer$$ = new Subject();

	/**
	 * массив возможных типов отпавки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	shipmentTypes: ShipmentTypes[] = Object.values(ShipmentTypes);

	/**
	 * массив возможных диапазонов возрастов для контрола селект (наборы бывают для нескольких диапазов возрастов)
	 *
	 * @example ['2-3', '4-6']
	 */
	filterCriteria: ShipmentPreparingOrderTypes[] = Object.values(OrderAges);

	/**
	 * массив прочих фильтров
	 */
	otherCriteria: ShipmentPreparingOtherCriteriaEnum[] = Object.values(ShipmentPreparingOtherCriteriaEnum);

	/**
	 * возможные месяцы доставки
	 */
	months: Month[] = MONTHS;

	constructor(
		private fb: FormBuilder,
		private store: FilterFormStoreService,
		private spStore: ShipmentPreparingStoreService) { }

	get disableTypeControls(): boolean {
		return this.form.value.otherCriteria.all;
	}

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
			shipmentDate: filterFormInitialState.data.shipmentDate,
			shipmentType: filterFormInitialState.data.shipmentType,
			ordersType: filterFormInitialState.data.ordersType,
			otherCriteria: filterFormInitialState.data.otherCriteria,
			othersArr: []
		});

		this.filterCriteria.push('сложный');
		this.filterCriteria.push('театры');
	}

	private initFormSetter(): void {
		this.store.select(s => s)
			.pipe(
				take(1),
				tap((state: FilterFormState) => {
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
			.subscribe(v => {
				console.log(v);
				this.store.saveForm(v);
			});
	}

	setOtherCriteria(e: MatSelectChange): void {

		const otherCriteria: ShipmentPreparingOtherCriteriaInterface = {
			all: e.value.includes(ShipmentPreparingOtherCriteriaEnum.all),
			notSendedYet: e.value.includes(ShipmentPreparingOtherCriteriaEnum.notSendedYet)
		};

		this.form.patchValue({ otherCriteria });
	}

}



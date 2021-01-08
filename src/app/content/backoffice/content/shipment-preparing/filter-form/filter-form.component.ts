import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, tap, debounceTime } from 'rxjs/operators';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { OrderAges, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { ShipmentPreparingStoreService } from '../shipment-preparing-store.service';
import { FilterFormStoreService } from './filter-form-store.service';
import { filterFormInitialState, FilterFormState } from './models/form';

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
	ages: (OrderAges | 'сложный')[] = Object.values(OrderAges);

	/**
	 * возможные месяцы доставки
	 */
	months: Month[] = MONTHS;

	constructor(
		private fb: FormBuilder,
		private store: FilterFormStoreService,
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
			shipmentDate: filterFormInitialState.data.shipmentDate,
			shipmentType: filterFormInitialState.data.shipmentType,
			ordersType: filterFormInitialState.data.ordersType
		});

		this.ages.push('сложный');
	}

	private initFormSetter(): void {
		this.store.select(s => s)
			.pipe(
				takeUntil(this.destroyer$$),
				tap((state: FilterFormState) => {
					if (!this.isObjectsEqual(this.form.value, state.data)) {
						this.form.setValue(state.data);
					}
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
				this.store.saveForm(v);
			});
	}

	private isObjectsEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean {

		const vals1 = this.getDeepValues(Object.values(obj1));

		const vals2 = this.getDeepValues(Object.values(obj2));

		return vals1.every(item => vals2.includes(item));
	}

	private getDeepValues(arr: any[]): (string | number | boolean | null)[] {
		return arr.reduce((res: (string | number | boolean | null)[], item: any) => {
			if (typeof item !== 'object' || item === null) {
				res.push(item);
			} else {
				if (Array.isArray(item)) {
					res.push(...this.getDeepValues(item));
				} else {
					res.push(...this.getDeepValues(Object.values(item)));
				}
			}
			return res;
		}, []);
	}


}

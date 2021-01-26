import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, tap, takeUntil, debounceTime } from 'rxjs/operators';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { ShipmentTypes, OrderAges } from 'src/app/enums/order/order-enums';
import { ActualShipmentStoreService } from '../actual-shipment-store.service';
import { FilterFormStoreService } from './as-filter-form-store.service';
import { ASFilterFormData, ASShipmentTypes, AS_FILTER_FORM_INIT_STATE } from './models/form';

@Component({
	selector: 'ntv-as-filter-form',
	templateUrl: './as-filter-form.component.html',
	styleUrls: ['./as-filter-form.component.scss']
})
export class ASFilterFormComponent implements OnInit, OnDestroy {

	/**
	 * форма критериев фильтрации запроса заказов для отправки
	 */
	form: FormGroup;

	/**
	 * маркер уничтожения компонента, нужен для корректной отписки
	 */
	destroyer$$ = new Subject();

	/**
	 * массив возможных типов отпавки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	shipmentTypes: ASShipmentTypes[] = [...Object.values(ShipmentTypes), 'все'];

	/**
	 * возможные месяцы доставки
	 */
	months: Month[] = MONTHS;

	constructor(
		private fb: FormBuilder,
		private formStore: FilterFormStoreService,
		private asStore: ActualShipmentStoreService) { }

	ngOnInit(): void {
		this.initForm();

		this.formStore.setFormData();

		this.setFormDataFromSaved();

		this.initFormSaver();

		this.search();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	/**
	 * запускает поиск заказов для отправки с установленными в {@link form} критериями
	 */
	search(): void {
		this.asStore.search(this.form.value);
	}

	/**
	 * инициирует форму фильтров с дефолтными значениями
	 */
	private initForm(): void {
		this.form = this.fb.group(AS_FILTER_FORM_INIT_STATE.data);
	}

	/**
	 * устанавливает сохраненные в сторе данные значением формы
	 */
	private setFormDataFromSaved(): void {
		this.formStore.select(s => s.data)
			.pipe(
				take(1),
				tap((data: ASFilterFormData) => {
					this.form.setValue(data);
				})
			)
			.subscribe();
	}

	/**
	 * запускает механизм сохранения данных из формы
	 */
	private initFormSaver(): void {
		this.form.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500),
			)
			.subscribe((v: ASFilterFormData) => {
				this.formStore.saveForm(v);
			});
	}

}

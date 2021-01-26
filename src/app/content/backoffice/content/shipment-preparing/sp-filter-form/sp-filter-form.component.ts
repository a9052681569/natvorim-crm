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

	/**
	 * форма критериев фильтрации запроса заказов для подготовки отправки
	 */
	form: FormGroup;

	/**
	 * маркер уничтожения компонента, нужен для корректной отписки
	 */
	destroyer$$ = new Subject();

	/**
	 * массив возможных фильтров по типам отправки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	filterShipmentTypes: ShipmentPreparingShipmentTypes[] = [...Object.values(ShipmentTypes), 'все'];

	/**
	 * массив возможных фильтров по типам заказа
	 *
	 * @example ['2-3', '4-6']
	 */
	filterOrderTypes: ShipmentPreparingOrderTypes[] = [...Object.values(ShipmentOrderTypes), 'все'];

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

		this.setFormDataFromSaved();

		this.initFormSaver();

		this.search();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	/**
	 * запускает поиск заказов по выбранным критериям
	 */
	search(): void {
		this.spStore.search(this.form.value);
	}

	/**
	 * инициирует форму фильтров с дефолтными значениями
	 */
	private initForm(): void {
		this.form = this.fb.group({
			shipmentDate: SP_FILTER_FORM_INIT_STATE.data.shipmentDate,
			shipmentType: SP_FILTER_FORM_INIT_STATE.data.shipmentType,
			ordersType: SP_FILTER_FORM_INIT_STATE.data.ordersType,
			noTrack: SP_FILTER_FORM_INIT_STATE.data.noTrack,
		});
	}

	/**
	 * устанавливает сохраненные в сторе данные в качестве значения формы
	 */
	private setFormDataFromSaved(): void {
		this.store.select(s => s)
			.pipe(
				take(1),
				tap((state: SPFilterFormState) => {
					this.form.setValue(state.data);
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
			.subscribe((v: SPFilterFormData) => {
				this.store.saveForm(v);
			});
	}

}



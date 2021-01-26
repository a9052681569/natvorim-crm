import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { OrderAges, OrderTypes, ShipmentTypes, TheatreTypes } from 'src/app/enums/order/order-enums';
import { Kit, Order } from 'src/app/models/order';
import { Person } from 'src/app/models/people';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { AddOrderStoreService } from '../../add-order-store.service';
import { AddOrderFormOnceOrder, ADD_ORDER_FORM_INITIAL_STATE } from '../../models/add-order-form';

@Component({
  selector: 'ntv-once-form',
  templateUrl: './once-form.component.html',
  styleUrls: ['./once-form.component.scss']
})
export class OnceFormComponent implements OnInit, OnDestroy {

	/**
	 * форма добавления заказа
	 */
	addOrderForm: FormGroup;

	/**
	 * возможные месяцы доставки
	 */
	months: Month[] = MONTHS;

	/**
	 * текущий заказ, нужен для доступа к этой информации в шаблоне
	 */
	order: Order;

	/**
	 * массив возможных типов отпавки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	shipmentTypes: ShipmentTypes[] = Object.values(ShipmentTypes);

	/**
	 * маркер уничтожения компонента
	 */
	destroyer$$ = new Subject();

	constructor(
		private fb: FormBuilder,
		private store: AddOrderStoreService) { }

	/**
	 * форм контрол для компонента {@link OrderStructureFormComponent}
	 *
	 * Нужен для того чтобы изменения в {@link OrderStructureFormComponent}
	 * влияли сразу на {@link addOrderForm}
	 */
	get orderStructure(): FormGroup {
		return this.addOrderForm.get('orderStructure') as FormGroup;
	}

	ngOnInit(): void {
		// инициируем форму
		this.addOrderForm = this.fb.group({
			id: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.id,
			personId: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.personId,
			comment: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.comment,
			sended: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.sended,
			shipmentDate: ['', Validators.required],
			shipmentType: ['', Validators.required],
			trackNumber: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.trackNumber,
			type: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.type,
			orderStructure: this.fb.group({
				kits: this.fb.array([]),
				theatres: this.fb.array([])
			})
		});

		this.setFormFromStore();

		this.initFormSaver();

		this.initResetListener();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	/**
	 * Инициирует сохранение введенных в форму данных в {@link AddOrderStoreService}
	 */
	private initFormSaver(): void {
		this.addOrderForm.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500),
			)
			.subscribe((order: Order) => {
				this.store.saveForm({onceOrder: {order, isValid: this.addOrderForm.valid}});
			});
	}

	/**
	 * Устанавливает данные формы из сохраненных в {@link AddOrderStoreService}
	 */
	private setFormFromStore(): void {
		this.store.select(s => s.onceOrder)
		.pipe(
			take(1),
			tap((order: AddOrderFormOnceOrder) => {
				this.order = order.order;

				// tslint:disable-next-line:no-any
				const orderWithoutStructure: any = {...order.order};

				delete orderWithoutStructure.orderStructure;

				orderWithoutStructure.type = OrderTypes.check;

				this.addOrderForm.patchValue(orderWithoutStructure);

			})
		)
		.subscribe();
	}

	/**
	 * Инициирует слушатель сброса формы.
	 *
	 * Нужен для сброса формы внешним триггером
	 */
	private initResetListener(): void {
		this.store.select(s => s.resetForm)
			.pipe(
				takeUntil(this.destroyer$$),
				tap((isReset: boolean) => {
					if (isReset) {
						this.addOrderForm.reset();
					}
				})
			)
			.subscribe();
	}
}

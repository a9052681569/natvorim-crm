import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { OrderAges, OrderTypes, ShipmentTypes, TheatreTypes } from 'src/app/enums/order/order-enums';
import { Kit, Order } from 'src/app/models/order';
import { Person } from 'src/app/models/people';
import { AddOrderStoreService } from '../../add-order-store.service';
import { ADD_ORDER_FORM_INITIAL_STATE } from '../../models/add-order-form';

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

	months: Month[] = MONTHS;

	order: Order;

	/**
	 * массив возможных типов отпавки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	shipmentTypes: ShipmentTypes[] = Object.values(ShipmentTypes);

	destroyer$$ = new Subject();

	constructor(
		private fb: FormBuilder,
		private store: AddOrderStoreService) { }

	get orderStructure(): FormGroup {
		return this.addOrderForm.get('orderStructure') as FormGroup;
	}

	ngOnInit(): void {
		// инициируем форму
		this.addOrderForm = this.fb.group({
			id: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.id,
			personId: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.personId,
			comment: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.comment,
			sended: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.sended,
			shipmentDate: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.shipmentDate,
			shipmentType: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.shipmentType,
			trackNumber: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.trackNumber,
			type: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.type,
			orderStructure: this.fb.group({
				kits: this.fb.array([]),
				theatres: this.fb.array([])
			})
		});

		this.initFormSetter();

		this.initFormSaver();

		this.initResetListener();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	private initFormSaver(): void {
		this.addOrderForm.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500),
			)
			.subscribe((onceOrder: Order) => {
				this.store.saveForm({onceOrder});
			});
	}

	private initFormSetter(): void {
		this.store.select(s => s.onceOrder)
		.pipe(
			take(1),
			tap((order: Order) => {
				this.order = order;

				const orderWithoutStructure: any = {...order};

				delete orderWithoutStructure.orderStructure;

				orderWithoutStructure.type = OrderTypes.check;

				this.addOrderForm.patchValue(orderWithoutStructure);

			})
		)
		.subscribe();
	}

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

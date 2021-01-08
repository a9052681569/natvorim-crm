import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { OrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Order, OrderStructure } from 'src/app/models/order';
import { AddOrderStoreService } from '../../add-order-store.service';
import { AddOrderStructureDialogComponent } from './add-order-structure-dialog/add-order-structure-dialog.component';
import { Month, MONTHS, MONTH_NAMES } from 'src/app/enums/months/months';
import { ADD_ORDER_FORM_INITIAL_STATE } from '../../models/add-order-form';

@Component({
	selector: 'ntv-subscription-form',
	templateUrl: './subscription-form.component.html',
	styleUrls: ['./subscription-form.component.scss']
})
export class SubscriptionFormComponent implements OnInit, OnDestroy {

	/**
	 * массив возможных типов отпавки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	shipmentTypes: ShipmentTypes[] = Object.values(ShipmentTypes);

	addSubscriptionForm: FormGroup;

	months: Month[] = MONTHS;

	destroyer$$ = new Subject();

	constructor(
		private fb: FormBuilder,
		private store: AddOrderStoreService,
		private dialog: MatDialog) { }

	ngOnInit(): void {
		this.addSubscriptionForm = this.fb.group({
			months: '',
			shipmentType: '',
			orderStructure: ''
		});

		this.initFormSetter();

		this.initFormSaver();

		this.initResetListener();

	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	private initFormSetter(): void {
		this.store.select(s => s.subscriptionsOrders)
			.pipe(
				take(1),
				tap((orders: Order[]) => {
					if (orders.length) {

						const setObj = {
							months: orders.map(o => o.shipmentDate),
							shipmentType: orders[0].shipmentType,
							orderStructure: orders[0].orderStructure || ADD_ORDER_FORM_INITIAL_STATE.onceOrder.orderStructure
						};

						this.addSubscriptionForm.setValue(setObj);
					}

				})
			)
			.subscribe();
	}

	private initFormSaver(): void {
		this.addSubscriptionForm.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500)
			)
			.subscribe((v) => {
				if (Array.isArray(v.months)) {

					const subscriptionsOrders: Order[] = v.months.map((month: string) => {
						return {
							id: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.id,
							personId: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.personId,
							comment: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.comment,
							sended: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.sended,
							shipmentDate: month,
							shipmentType: v.shipmentType,
							trackNumber: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.trackNumber,
							type: OrderTypes.subscription,
							orderStructure: v.orderStructure,
							orderDate: new Date().toISOString()
						};
					});

					this.store.saveForm({subscriptionsOrders});
				}
			});
	}

	private initResetListener(): void {
		this.store.select(s => s.resetForm)
			.pipe(
				takeUntil(this.destroyer$$),
				tap((isReset: boolean) => {
					if (isReset) {
						this.addSubscriptionForm.reset();
					}
				})
			)
			.subscribe();
	}

	showOrderStructureSelectionDialog(): void {
		this.store.select(s => s.subscriptionsOrders)
			.pipe(take(1))
			.subscribe((o: Order[]) => {
				let data: Order;

				if (o.length) {
					data = o[0];
				} else {
					data = ADD_ORDER_FORM_INITIAL_STATE.onceOrder;
				}

				this.dialog.open(AddOrderStructureDialogComponent, { data })
					.afterClosed()
					.subscribe((orderStructure: OrderStructure) => {
						if (orderStructure) {
							this.addSubscriptionForm.patchValue({ orderStructure });
						}
					});
			});

	}
}
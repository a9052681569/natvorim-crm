import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { OrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Order, OrderStructure } from 'src/app/models/order';
import { AddOrderStoreService } from '../../add-order-store.service';
import { AddOrderStructureDialogComponent } from './add-order-structure-dialog/add-order-structure-dialog.component';
import { Month, MONTHS, MONTH_NAMES } from 'src/app/enums/months/months';
import { AddOrderFormSubscriptionsOrders, ADD_ORDER_FORM_INITIAL_STATE } from '../../models/add-order-form';

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

	/**
	 * форма конфигурирования подписки
	 */
	addSubscriptionForm: FormGroup;

	/**
	 * возможные месяцы доставки
	 */
	months: Month[] = MONTHS;

	/**
	 * маркер уничтожения компонента
	 */
	destroyer$$ = new Subject();

	constructor(
		private fb: FormBuilder,
		private store: AddOrderStoreService,
		private dialog: MatDialog) { }

	ngOnInit(): void {
		this.addSubscriptionForm = this.fb.group({
			months: ['', Validators.required],
			shipmentType: ['', Validators.required],
			orderStructure: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.orderStructure
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
	 * Устанавливает данные формы из сохраненных в {@link AddOrderStoreService}
	 */
	private setFormFromStore(): void {
		this.store.select(s => s.subscriptionsOrders)
			.pipe(
				take(1),
				tap((subscriptionsOrdersState: AddOrderFormSubscriptionsOrders) => {

					const orders = subscriptionsOrdersState.orders;

					if (orders.length) {

						const setObj = {
							months: orders.map(o => o.shipmentDate),
							shipmentType: orders[0].shipmentType,
							orderStructure: orders[0].orderStructure || ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.orderStructure
						};

						this.addSubscriptionForm.setValue(setObj);
					}
				})
			)
			.subscribe();
	}

	/**
	 * Инициирует сохранение введенных в форму данных в {@link AddOrderStoreService}.
	 *
	 * Введенные данные сначала конвертирутся в массив заказов и только потом сохраняются.
	 */
	private initFormSaver(): void {
		this.addSubscriptionForm.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500)
			)
			.subscribe((v) => {
				if (Array.isArray(v.months)) {

					let isValid = true;

					if (!v.orderStructure.kits.length && !v.orderStructure.theatres.length) {
						isValid = false;
					} else {
						isValid = this.addSubscriptionForm.valid;
					}

					const orders: Order[] = v.months.map((month: string) => {

						return {
							id: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.id,
							personId: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.personId,
							comment: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.comment,
							sended: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.sended,
							shipmentDate: month,
							shipmentType: v.shipmentType,
							trackNumber: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.trackNumber,
							type: OrderTypes.subscription,
							orderStructure: v.orderStructure,
							orderDate: new Date().toISOString()
						};
					});

					this.store.saveForm({subscriptionsOrders: {orders, isValid, subscriptionOrderStructure: v.orderStructure }});
				}
			});
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
						this.addSubscriptionForm.setValue({
							months: '',
							shipmentType: '',
							orderStructure: ADD_ORDER_FORM_INITIAL_STATE.onceOrder.order.orderStructure
						});
					}
				})
			)
			.subscribe();
	}

	/**
	 * открывает диалог выбора структуры заказа для всей подписки,
	 * после закрытия диалога, если вернулись данные структуры - патчит {@link addSubscriptionForm} полученными данными
	 */
	showOrderStructureSelectionDialog(): void {
		this.store.select(s => s.subscriptionsOrders)
			.pipe(take(1))
			.subscribe((s: AddOrderFormSubscriptionsOrders) => {

				const data: OrderStructure = s.subscriptionOrderStructure;

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

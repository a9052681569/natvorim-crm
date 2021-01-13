import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Order, OrderStructure } from 'src/app/models/order';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { AddOrderStoreService } from '../../../add-order-store.service';
import { AddOrderFormSubscriptionsOrders } from '../../../models/add-order-form';
import { AddOrderStructureDialogComponent } from '../add-order-structure-dialog/add-order-structure-dialog.component';

@Component({
	selector: 'ntv-subscription-orders-form',
	templateUrl: './subscription-orders-form.component.html',
	styleUrls: ['./subscription-orders-form.component.scss']
})
export class SubscriptionOrdersFormComponent implements OnInit, OnDestroy {

	@Input() orders: Order[] = [];

	ordersControls: FormArray;

	months: Month[] = MONTHS;

	/**
	 * массив возможных типов отпавки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	shipmentTypes: ShipmentTypes[] = Object.values(ShipmentTypes);

	destroyer$$ = new Subject();

	constructor(
		private fb: FormBuilder,
		private store: AddOrderStoreService,
		private dialog: MatDialog,
		public hs: HelpersService) { }

	ngOnInit(): void {
		this.ordersControls = this.fb.array([]);

		this.initFormSetter();

		this.initFormSaver();

		this.initResetListener();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	showOrderStructureDialog(data: Order, i: number): void {
		this.dialog.open(AddOrderStructureDialogComponent, { data })
			.afterClosed()
			.subscribe((orderStructure: OrderStructure) => {
				if (orderStructure) {
					const newControl = this.fb.group({
						...data,
						orderStructure
					});
					this.ordersControls.setControl(i, newControl);
				}
			});
	}

	private initFormSaver(): void {
		this.ordersControls.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500),
			)
			.subscribe((orders: Order[]) => {
				let isValid = false;

				if (orders.length) {
					isValid = orders.every(o => {
						return o.shipmentDate && o.shipmentType &&
							(o.orderStructure.kits.length || o.orderStructure.theatres.length);
					});
				}

				this.store.saveForm({subscriptionsOrders: {orders, isValid}});
			});
	}

	private initFormSetter(): void {
		this.store.select(s => s.subscriptionsOrders)
			.pipe(
				takeUntil(this.destroyer$$),
				tap((orders: AddOrderFormSubscriptionsOrders) => {
					if (orders.orders.length && !this.isOrdersEqual(orders.orders, this.ordersControls.value)) {

						this.ordersControls.clear();

						orders.orders.forEach((order: Order) => {
							this.addOrder(order);
						});

					}
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
						this.ordersControls.clear();
					}
				})
			)
			.subscribe();
	}

	private isOrdersEqual(orders1: Order[], orders2: Order[]): boolean {

		if (orders1.length !== orders2.length) {
			return false;
		}

		const vals1 = this.getDeepValues(orders1);

		const vals2 = this.getDeepValues(orders2);

		if (vals1.length !== vals2.length) {
			return false;
		}

		return vals1.every(item => vals2.includes(item));
	}

	// tslint:disable-next-line:no-any
	private getDeepValues(arr: any[]): (string | number | boolean | null)[] {
		// tslint:disable-next-line:no-any
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

	/**
	 * добавляем новый контрол в массив заказов
	 *
	 * @param order  значение полей контрола
	 */
	addOrder(order: Order): void {
		this.ordersControls.push(
			this.fb.group(order)
		);
	}
}

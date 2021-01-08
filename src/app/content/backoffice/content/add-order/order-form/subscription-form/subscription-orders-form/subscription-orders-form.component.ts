import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Order, OrderStructure } from 'src/app/models/order';
import { AddOrderStoreService } from '../../../add-order-store.service';
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
		private dialog: MatDialog) { }

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
			.subscribe((subscriptionsOrders: Order[]) => {
				this.store.saveForm({subscriptionsOrders});
			});
	}

	private initFormSetter(): void {
		this.store.select(s => s.subscriptionsOrders)
			.pipe(
				takeUntil(this.destroyer$$),
				tap((orders: Order[]) => {
					if (orders.length && !this.isOrdersEqual(orders, this.ordersControls.value)) {

						this.ordersControls.clear();

						orders.forEach((order: Order) => {
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

	/**
	 * приводит контрол к точному типу. В целом это грязных хак, обманывающий тайпскрипт, но как сделать по другому не придумал
	 *
	 * @param control результат метода {@link FormGroup.get()}
	 * @returns инстанс контрола
	 */
	getControl(control: AbstractControl | null): FormControl {
		return control as FormControl;
	}


}

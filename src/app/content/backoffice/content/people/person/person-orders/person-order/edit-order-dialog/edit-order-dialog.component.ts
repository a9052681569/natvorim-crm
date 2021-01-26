import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { OrderAges, OrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Kit, Order } from 'src/app/models/order';
import { OrdersStore } from '../../orders-store.service';
import { OrdersService } from '../../orders.service';

@Component({
	selector: 'ntv-edit-order-dialog',
	templateUrl: './edit-order-dialog.component.html',
	styleUrls: ['./edit-order-dialog.component.scss']
})
export class EditOrderDialogComponent implements OnInit {

	/**
	 * возможные состояния загрузки
	 */
	loadingStates = LOADING_STATES;

	/**
	 * возможные месяцы оправки заказа
	 */
	months: Month[] = MONTHS;

	/**
	 * форма редактирования заказа
	 */
	editOrderForm: FormGroup;

	/**
	 * массив возможных типов заказов для контрола селект
	 *
	 * @example ['подписка', 'пробный']
	 */
	orderTypes: OrderTypes[] = Object.values(OrderTypes);

	/**
	 * массив возможных типов отпавки заказа
	 *
	 * @example ['сдэк', 'почта']
	 */
	shipmentTypes: ShipmentTypes[] = Object.values(ShipmentTypes);

	/**
	 * текущее состояние загрузки
	 */
	loadingState: LOADING_STATES | null;

	constructor(
		private dialogRef: MatDialogRef<EditOrderDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public order: Order,
		private fb: FormBuilder,
		private ordersService: OrdersService) { }

	/**
	 * Группа отвечающая за структуру заказа. Жестко приведена к типу.
	 */
	get orderStructure(): FormGroup {
		return this.editOrderForm.get('orderStructure') as FormGroup;
	}

	ngOnInit(): void {

		// инициируем форму
		this.editOrderForm = this.fb.group({
			comment: this.order.comment,
			sended: this.order.sended,
			shipmentDate: this.order.shipmentDate,
			shipmentType: this.order.shipmentType,
			trackNumber: this.order.trackNumber,
			type: this.order.type,
			orderStructure: this.fb.group({
				kits: this.fb.array([]),
				theatres: this.fb.array([])
			})
		});

	}

	/**
	 * обновляет объект заказа на беке, основываясь на данных формы
	 */
	patchOrder(): void {
		// собираем новый объект заказа
		const patchedOrder: Order = {
			id: this.order.id,
			personId: this.order.personId,
			...this.editOrderForm.value
		};
		// отображаем для пользователя состояние загрузки
		this.loadingState = this.loadingStates.loading;

		// отправляем запрос на патч
		this.ordersService.patchOrder(patchedOrder)
			.pipe(
				// в случае успешного запроса сбрасываем состояние загрузки и закрываем диалог
				// патч внутреннего стора делает родитель т.к у диалога нет доступа к стору
				tap((o: Order) => {
					this.loadingState = null;
					// закрывая диалог передаем наружу обновленные данные о заказе
					this.dialogRef.close(o);
				}),
				// в случае ошибки отображаем для пользователя состояние ошибки, диалог не закрываем
				catchError(err => {
					this.loadingState = this.loadingStates.err;
					return throwError(err);
				})
			)
			.subscribe();
	}
}

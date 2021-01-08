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

	months: Month[] = MONTHS;

	/**
	 * форма редактирования заказа
	 */
	editOrderForm: FormGroup;

	/**
	 * массив возможных диапазонов возрастов для контрола селект (наборы бывают для нескольких диапазов возрастов)
	 *
	 * @example ['2-3', '4-6']
	 */
	ages: OrderAges[] = Object.values(OrderAges);

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
	 * начальное состояние группы заказа (когда добавляешь новый инстанс театра или набора)
	 */
	initialKitGroupState: Kit = {
		age: OrderAges.twoThree,
		count: 0
	};

	/**
	 * текущее состояние загрузки
	 */
	loadingState: LOADING_STATES | null;

	constructor(
		private dialogRef: MatDialogRef<EditOrderDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private order: Order,
		private fb: FormBuilder,
		private ordersService: OrdersService) { }

	/**
	 * массив форм контролов для наборов
	 */
	get kits(): FormArray {
		return (this.editOrderForm.get('orderStructure') as FormGroup).get('kits') as FormArray;
	}

	/**
	 * массив форм контролов для театров
	 */
	get theatres(): FormArray {
		return (this.editOrderForm.get('orderStructure') as FormGroup).get('theatres') as FormArray;
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

		// устанавливаем начальный массив контролов для наборов и театров
		this.initKitsAndTheatresControls();
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

	/**
	 * добавляем новый контрол в массив наборов
	 *
	 * @param kit начальное значение полей контрола
	 */
	addKit(kit: Kit): void {
		this.kits.push(
			this.fb.group(kit)
		);
	}
	/**
	 * добавляем новый контрол в массив театров
	 *
	 * @param theatre начальное значение полей контрола
	 */
	addTheatre(theatre: Kit): void {
		this.theatres.push(
			this.fb.group(theatre)
		);
	}

	/**
	 * удаляем контрол из массива наборов
	 *
	 * @param i индекс нужного контрола
	 */
	removeKit(i: number): void {
		this.kits.removeAt(i);
	}

	/**
	 * удаляем контрол из массива театров
	 *
	 * @param i индекс нужного контрола
	 */
	removeTheatre(i: number): void {
		this.theatres.removeAt(i);
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

	/**
	 *  устанавливает начальный массив контролов для наборов и театров
	 */
	initKitsAndTheatresControls(): void {
		this.order.orderStructure.kits.forEach((kit: Kit) => {
			this.addKit(kit);
		});

		this.order.orderStructure.theatres.forEach((theatre: Kit) => {
			this.addTheatre(theatre);
		});
	}
}

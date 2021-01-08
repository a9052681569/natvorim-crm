import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { OrderAges, OrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
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

	/**
	 * массив возможных диапазонов возрастов для контрола селект (наборы бывают для нескольких диапазов возрастов)
	 *
	 * @example ['2-3', '4-6']
	 */
	ages: OrderAges[] = Object.values(OrderAges);

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
		count: 1
	};

	destroyer$$ = new Subject();

	constructor(
		private fb: FormBuilder,
		private store: AddOrderStoreService) { }

	/**
	 * массив форм контролов для наборов
	 */
	get kits(): FormArray {
		return (this.addOrderForm.get('orderStructure') as FormGroup).get('kits') as FormArray;
	}

	/**
	 * массив форм контролов для театров
	 */
	get theatres(): FormArray {
		return (this.addOrderForm.get('orderStructure') as FormGroup).get('theatres') as FormArray;
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
					this.setKitsAndTheatresControls(order);

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
	setKitsAndTheatresControls(order: Order): void {
		order.orderStructure?.kits.forEach((kit: Kit) => {
			this.addKit(kit);
		});

		order.orderStructure?.theatres.forEach((theatre: Kit) => {
			this.addTheatre(theatre);
		});
	}

}

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, tap } from 'rxjs/operators';
import { OrderAges, ShipmentTypes, OrderTypes } from 'src/app/enums/order/order-enums';
import { Kit, Order } from 'src/app/models/order';

@Component({
	selector: 'ntv-add-order-structure-dialog',
	templateUrl: './add-order-structure-dialog.component.html',
	styleUrls: ['./add-order-structure-dialog.component.scss']
})
export class AddOrderStructureDialogComponent implements OnInit {

	orderStructureForm: FormGroup;

	/**
	 * массив возможных диапазонов возрастов для контрола селект (наборы бывают для нескольких диапазов возрастов)
	 *
	 * @example ['2-3', '4-6']
	 */
	ages: OrderAges[] = Object.values(OrderAges);

	/**
	 * начальное состояние группы заказа (когда добавляешь новый инстанс театра или набора)
	 */
	initialKitGroupState: Kit = {
		age: OrderAges.twoThree,
		count: 1
	};



	constructor(
		private dialogRef: MatDialogRef<AddOrderStructureDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private order: Order,
		private fb: FormBuilder) { }

	ngOnInit(): void {
		// инициируем форму
		this.orderStructureForm = this.fb.group({
			orderStructure: this.fb.group({
				kits: this.fb.array([]),
				theatres: this.fb.array([])
			})
		});

		this.setKitsAndTheatresControls(this.order);
	}

	/**
	 * массив форм контролов для наборов
	 */
	get kits(): FormArray {
		return (this.orderStructureForm.get('orderStructure') as FormGroup).get('kits') as FormArray;
	}

	/**
	 * массив форм контролов для театров
	 */
	get theatres(): FormArray {
		return (this.orderStructureForm.get('orderStructure') as FormGroup).get('theatres') as FormArray;
	}

	setStructure(): void {
		this.dialogRef.close(this.orderStructureForm.value.orderStructure);
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
		order.orderStructure?.kits?.forEach((kit: Kit) => {
			this.addKit(kit);
		});

		order.orderStructure?.theatres?.forEach((theatre: Kit) => {
			this.addTheatre(theatre);
		});
	}


}

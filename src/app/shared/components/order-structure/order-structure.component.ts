import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { OrderAges, TheatreTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Kit, Order } from 'src/app/models/order';

@Component({
	selector: 'ntv-order-structure',
	templateUrl: './order-structure.component.html',
	styleUrls: ['./order-structure.component.scss']
})
export class OrderStructureComponent implements OnInit {

	@Input() order: Order;
	@Input() orderStructureGroup: FormGroup;

	/**
	 * массив возможных диапазонов возрастов для контрола селект (наборы бывают для нескольких диапазов возрастов)
	 *
	 * @example ['2-3', '4-6']
	 */
	ages: OrderAges[] = Object.values(OrderAges);

	theatreTypes: TheatreTypes[] = Object.values(TheatreTypes);

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
		age: null,
		count: 1
	};

	constructor(private fb: FormBuilder) { }

	/**
	 * массив форм контролов для наборов
	 */
	get kits(): FormArray {
		return this.orderStructureGroup.get('kits') as FormArray;
	}

	/**
	 * массив форм контролов для театров
	 */
	get theatres(): FormArray {
		return this.orderStructureGroup.get('theatres') as FormArray;
	}

	ngOnInit(): void {
		this.setKitsAndTheatresControls(this.order);
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

		
		if (order.orderStructure?.kits) {
			order.orderStructure.kits.forEach((kit: Kit) => {
				console.log(order);
				this.addKit(kit);
			});
		}

		if (order.orderStructure?.theatres) {
			order.orderStructure.theatres.forEach((theatre: Kit) => {
				this.addTheatre(theatre);
			});
		}

	}

}

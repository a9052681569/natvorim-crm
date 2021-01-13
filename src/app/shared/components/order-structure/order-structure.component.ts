import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { OrderAges, TheatreTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Kit, Order, OrderStructure } from 'src/app/models/order';
import { HelpersService } from '../../services/helpers.service';

@Component({
	selector: 'ntv-order-structure',
	templateUrl: './order-structure.component.html',
	styleUrls: ['./order-structure.component.scss']
})
export class OrderStructureComponent implements OnInit {

	@Input() orderStructure: OrderStructure;
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

	constructor(
		private fb: FormBuilder,
		public hs: HelpersService) { }

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
		this.setKitsAndTheatresControls(this.orderStructure);

		this.orderStructureGroup.setValidators(this.atLeastOneKitRequiredValidator);
		this.orderStructureGroup.updateValueAndValidity();
	}

	/**
	 * добавляем новый контрол в массив наборов
	 *
	 * @param kit начальное значение полей контрола
	 */
	addKit(kit: Kit, arr: FormArray): void {
		const kitGroup: FormGroup = this.fb.group(kit);
		const countControl = kitGroup.get('count') as FormControl;
		const ageControl = kitGroup.get('age') as FormControl;

		countControl.setValidators([Validators.min(1), Validators.required]);
		countControl.updateValueAndValidity();

		ageControl.setValidators(Validators.required);
		ageControl.updateValueAndValidity();

		arr.push(kitGroup);
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
	 *  устанавливает начальный массив контролов для наборов и театров
	 */
	setKitsAndTheatresControls(orderStructure: OrderStructure): void {

		if (orderStructure?.kits) {
			orderStructure.kits.forEach((kit: Kit) => {
				this.addKit(kit, this.kits);
			});
		}

		if (orderStructure?.theatres) {
			orderStructure.theatres.forEach((theatre: Kit) => {
				this.addKit(theatre, this.theatres);
			});
		}

	}

	private atLeastOneKitRequiredValidator(control: AbstractControl): ValidationErrors | null {
		const value = control.value as { [key: string]: Kit[] };

		if (Object.values(value).every((v: Kit[]) => !v.length)) {
			return { oneKitRequired: 'необходимо добавить хотя бы один набор или театр' };
		}

		return null;
	}

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Person } from 'src/app/models/people';
import { AddOrderStoreService } from '../add-order-store.service';
import { AddOrderService } from '../add-order.service';
import { AddOrderFormCustomer, ADD_ORDER_FORM_INITIAL_STATE } from '../models/add-order-form';
import { HelpersService } from 'src/app/shared/services/helpers.service';

@Component({
  selector: 'ntv-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit, OnDestroy {

	/**
	 * форма добавления пользователя
	 */
	addCustomerForm: FormGroup;

	/**
	 * маркер уничтожения компонента
	 */
	destroyer$$ = new Subject();

	/**
	 * перечисление возможных состояний загрузки
	 */
	loadingStates = LOADING_STATES;

	/**
	 * актуальное состояние загрузки
	 */
	loadingState$: Observable<LOADING_STATES | null>;

	/**
	 * массив клиентов, который отображается в автокомплите
	 */
	autocompleteOptions: Person[] = [];

	constructor(
		private fb: FormBuilder,
		private store: AddOrderStoreService,
		private addOrderService: AddOrderService,
		public hs: HelpersService) { }

	ngOnInit(): void {
		this.initForm();

		this.loadingState$ = this.store.select(s => s.loadingState);

		this.setFormFromStore();

		this.initFormSaver();

		this.initAutocomplete();

		this.initResetListener();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	/**
	 * Устанавливает поля формы {@link addCustomerForm} из переданного события
	 *
	 * @param event событие клика по опции автокомплита
	 */
	setCustomerFromAutocomplete(event: MatAutocompleteSelectedEvent): void {
		const customer: Person = event.option.value;
		console.log(customer);
		this.addCustomerForm.setValue(customer);
	}

	/**
	 * Сбрасывает форму {@link addCustomerForm}
	 */
	resetForm(): void {
		this.addCustomerForm.reset();
	}

	/**
	 * Инициирует форму {@link addCustomerForm}
	 */
	private initForm(): void {
		// инициируем форму
		this.addCustomerForm = this.fb.group({
			id: NaN,
			name: ['', Validators.required],
			contacts: this.fb.group({
				email: ['', Validators.email],
				inst: '',
				phone: ['', this.hs.phoneValidator],
			}, {validators: [this.oneRequiredValidator]}),
			address: this.fb.group({
				city: [''],
				address: ['', Validators.required]
			}),
			reminders: 'this.fb.array([])'
		});
	}

	/**
	 * Устанавливает данные формы из сохраненных в {@link AddOrderStoreService}
	 */
	private setFormFromStore(): void {
		this.store.select(s => s.customer)
		.pipe(
			take(1),
			tap((customer: AddOrderFormCustomer) => {
				this.addCustomerForm.setValue(customer.customer);
			})
		)
		.subscribe();
	}

	/**
	 * Инициирует сохранение введенных в форму данных в {@link AddOrderStoreService}
	 */
	private initFormSaver(): void {
		this.addCustomerForm.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500),
			)
			.subscribe((customer: Person) => {
				console.log(customer);
				this.store.saveForm({ customer: {customer, isValid: this.addCustomerForm.valid} });
			});
	}

	/**
	 * Инициирует автозаполнение формы при вводе имени клиента
	 */
	private initAutocomplete(): void {
		this.addCustomerForm.get('name')?.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(300),
				switchMap((name: string) => {
					return this.addOrderService.getPersonsByName(name);
				})
			)
			.subscribe((v) => {
				this.autocompleteOptions = v;
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
						this.resetForm();
					}
				})
			)
			.subscribe();
	}

	/**
	 * валидирует группу контролов, возвращая ошибку если ни одному контролу не присвоено значение.
	 *
	 * @param control группа контролов {@link FormGroup} к которой применяется валидатор
	 */
	private oneRequiredValidator(control: AbstractControl): ValidationErrors | null {

		if (Object.values(control.value).every(v => !!v === false)) {
			return { oneRequired: 'необходимо указать хотя бы один контакт' };
		}

		return null;
	}

}

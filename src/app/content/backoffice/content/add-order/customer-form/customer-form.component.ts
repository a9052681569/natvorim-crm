import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Person } from 'src/app/models/people';
import { AddOrderStoreService } from '../add-order-store.service';
import { AddOrderService } from '../add-order.service';

@Component({
  selector: 'ntv-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit, OnDestroy {

	addCustomerForm: FormGroup;

	destroyer$$ = new Subject();

	loadingStates = LOADING_STATES;

	loadingState$: Observable<LOADING_STATES | null>;

	autocompleteOptions: Person[] = [];

	constructor(
		private fb: FormBuilder,
		private store: AddOrderStoreService,
		private addOrderService: AddOrderService) { }

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

	setCustomerFromAutocomplete(event: MatAutocompleteSelectedEvent): void {
		this.addCustomerForm.setValue(event.option.value);
	}

	resetForm(): void {
		this.addCustomerForm.reset();
	}

	private initForm(): void {
		// инициируем форму
		this.addCustomerForm = this.fb.group({
			id: NaN,
			name: '',
			contacts: this.fb.group({
				email: '',
				inst: '',
				phone: '',
			}),
			address: this.fb.group({
				city: '',
				address: ''
			})

		});
	}

	private setFormFromStore(): void {
		this.store.select(s => s.customer)
		.pipe(
			take(1),
			tap((customer: Person) => {
				this.addCustomerForm.setValue(customer);
			})
		)
		.subscribe();
	}

	private initFormSaver(): void {
		this.addCustomerForm.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(500),
			)
			.subscribe(customer => {
				this.store.saveForm({ customer });
			});
	}

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

}

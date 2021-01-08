import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { Person } from 'src/app/models/people';
import { RootState } from 'src/app/store';
import { CustomersActions } from 'src/app/store/actions/costomers.actions';
import { CustomersState } from 'src/app/store/reducers/costomers.reducer';
import { AddOrderService } from '../add-order/add-order.service';

@Component({
  selector: 'ntv-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, OnDestroy {

	name: FormControl;

	prevName: string;

	autocompleteOptions: Person[] = [];

	/**
	 * поток содержащий состояние покупателей (массив покупателей, состояние загрузки и т.п)
	 */
	state: Observable<CustomersState>;

	/**
	 * маркер уничтожения компонента
	 */
	destroyer$$ = new Subject();

	constructor(
		private store: Store<RootState>,
		private fb: FormBuilder,
		private addOrderService: AddOrderService) { }

	ngOnInit(): void {
		this.state = this.store.select('customers');

		this.store.dispatch(CustomersActions.searchPending({ name: '' }));

		this.initSearch();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	setCustomer(e: MatAutocompleteSelectedEvent): void {
		this.store.dispatch(CustomersActions.searchSuccess({ customers: [e.option.value] }));

		this.name.setValue(e.option.value.name);
	}

	private initSearch(): void {
		this.name = this.fb.control('');

		this.initAutocomplete();
	}

	private initAutocomplete(): void {
		this.name.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(300),
				switchMap((name: string) => {
					if (this.prevName && this.prevName === name) {
						return of(this.autocompleteOptions);
					}

					this.prevName = name;

					return this.addOrderService.getPersonsByName(name);
				})
			)
			.subscribe((v) => {
				this.autocompleteOptions = v;
			});
	}

}

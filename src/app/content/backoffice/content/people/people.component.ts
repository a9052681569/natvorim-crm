import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Person } from 'src/app/models/people';
import { RootState } from 'src/app/store';
import { CustomersActions } from 'src/app/store/actions/costomers.actions';
import { CustomersState } from 'src/app/store/reducers/costomers.reducer';
import { PeopleService } from './people.service';

@Component({
  selector: 'ntv-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, OnDestroy {

	search: FormControl;

	prevQuerry: string;

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
		private peopleService: PeopleService) { }

	ngOnInit(): void {
		this.state = this.store.select('customers');

		this.store.dispatch(CustomersActions.searchPending({ query: '' }));

		this.initSearch();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	setCustomer(e: MatAutocompleteSelectedEvent): void {
		this.store.dispatch(CustomersActions.searchSuccess({ customers: [e.option.value] }));

		this.search.setValue(e.option.value.name);
	}

	private initSearch(): void {
		this.search = this.fb.control('');

		this.search.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(300),
			)
			.subscribe((query: string) => {
				this.store.dispatch(CustomersActions.searchPending({ query }));
			});
	}

	/**
	 * не понятно будет ли удобно пользоваться. Но пока не удаляем.
	 * TODO: определится оставляем или убираем
	 */
	private initAutocomplete(): void {
		this.search.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				debounceTime(300),
				switchMap((querry: string) => {
					if (this.prevQuerry && this.prevQuerry === querry) {
						return of(this.autocompleteOptions);
					}

					this.prevQuerry = querry;

					return this.peopleService.searchCustomers(querry);
				})
			)
			.subscribe((v: Person[]) => {
				this.autocompleteOptions = v;
			});
	}

}

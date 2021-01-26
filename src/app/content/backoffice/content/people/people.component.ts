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

	/**
	 * поле поика клиентов
	 */
	search: FormControl;

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
		private fb: FormBuilder) { }

	ngOnInit(): void {
		this.state = this.store.select('customers');

		this.store.dispatch(CustomersActions.searchPending({ query: '' }));

		this.initSearchHandler();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	/**
	 * инициирует контрол {@link search} и обработку обработку изменения его значений для поиска людей и заказов
	 */
	private initSearchHandler(): void {
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

}

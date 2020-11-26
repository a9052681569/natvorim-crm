import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from 'src/app/models/people';
import { RootState } from 'src/app/store';
import { CustomersActions } from 'src/app/store/actions/costomers.actions';
import { CustomersState } from 'src/app/store/reducers/costomers.reducer';

@Component({
  selector: 'ntv-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

	state: Observable<CustomersState>;

	length: number;

	constructor(private store: Store<RootState>) { }

	ngOnInit(): void {
		this.state = this.store.select('customers');

		this.store.select('customers').subscribe(state => {
			this.length = state.customers.length;
		});

		this.store.dispatch(CustomersActions.setPending({_start: 0, _end: 30}));
	}
	// TODO: некорректно отрабатывает пагинация (длина устанавливается один раз, не изменяется.)
	onScroll(): void {
		this.store.dispatch(CustomersActions.setPending({_start: this.length, _end: this.length + 10}));
		console.log('scrolled');
	}

}

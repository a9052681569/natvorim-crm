import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ntv-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
	public searchText: string;

	public search(e: KeyboardEvent): void {
		const inputElement: HTMLInputElement = e.target as HTMLInputElement;
		this.searchText = inputElement.value;
	}
	constructor() { }

	ngOnInit(): void {
	}

}

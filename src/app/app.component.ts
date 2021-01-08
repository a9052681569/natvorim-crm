import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { initMonths } from './enums/months/months';


@Component({
  selector: 'ntv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private http: HttpClient) {}
	ngOnInit(): void {
		initMonths();
	}

	show(): void {
		this.http.get('http://localhost:3000/').subscribe(e => console.log(e));
	}
}

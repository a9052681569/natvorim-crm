import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { initMonths } from './enums/months/months';


@Component({
  selector: 'ntv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	ngOnInit(): void {
		initMonths();
	}
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ntv-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	cards: string[] = ['', '', '', ''];
	constructor() { }

	ngOnInit(): void {
	}

}

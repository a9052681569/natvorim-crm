import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkBook, writeFile } from 'xlsx';

@Component({
  selector: 'ntv-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {
	}

}

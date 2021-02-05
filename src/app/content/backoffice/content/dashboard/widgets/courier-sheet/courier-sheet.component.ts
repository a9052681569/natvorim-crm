import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { writeFile } from 'xlsx';
import { environment } from 'src/environments/environment';
import { WorkBook } from 'xlsx/types';
import { MONTHS } from 'src/app/enums/months/months';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'ntv-courier-sheet',
	templateUrl: './courier-sheet.component.html',
	styleUrls: ['./courier-sheet.component.scss']
})
export class CourierSheetComponent implements OnInit {

	form: FormGroup;

	months = MONTHS;

	constructor(
		private http: HttpClient,
		private fb: FormBuilder) { }

	ngOnInit(): void {
		this.form = this.fb.group({
			date: MONTHS[0].date,
			notSendedYet: false
		});
	}

	saveCourierSheet(): void {

		this.http.post<WorkBook>(environment.apiEndpoints.getCourierSheet, this.form.value)
			.subscribe((workbook: WorkBook) => {
				writeFile(workbook, workbook.SheetNames[0]);
			});
	}

}

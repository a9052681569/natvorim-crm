import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month, MONTHS } from 'src/app/enums/months/months';
import { ConversionData } from 'src/app/models/people';
import { ConversionService } from './conversion.service';
import { RemindersDialogComponent } from './reminders-dialog/reminders-dialog.component';

@Component({
  selector: 'ntv-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss']
})
export class ConversionComponent implements OnInit {

	selectedMonth: Month = MONTHS[0];

	loadingState: LOADING_STATES;

	loadingStates = LOADING_STATES;

	conversion$: Observable<ConversionData[]>;

	constructor(
		private cs: ConversionService,
		private dialog: MatDialog) { }

	ngOnInit(): void {
		this.setActiveMonth(this.selectedMonth);
	}

	setActiveMonth(month: Month): void {
		console.log(month);

		this.loadingState = LOADING_STATES.loading;

		this.conversion$ = this.cs.getConversion(month.date)
			.pipe(
				tap(() => {
					this.loadingState = LOADING_STATES.default;

					this.selectedMonth = month;
				}),
				catchError(err => {
					this.loadingState = LOADING_STATES.err;
					return throwError(err);
				})
			);
	}

	getPersentString(total: number, current: number): string {
		return `${Math.round(100 / total * current)}%`;
	}

	toReminderList(): void {
		const data = this.selectedMonth;

		this.dialog.open(RemindersDialogComponent, { width: '100%', height: '100%', maxWidth: '100%', data })
			.afterClosed()
			.subscribe(() => {
				this.setActiveMonth(this.selectedMonth);
			});

	}

}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month } from 'src/app/enums/months/months';
import { Reminder } from 'src/app/models/people';
import { ConversionService } from '../conversion.service';

@Component({
	selector: 'ntv-reminders-dialog',
	templateUrl: './reminders-dialog.component.html',
	styleUrls: ['./reminders-dialog.component.scss']
})
export class RemindersDialogComponent implements OnInit {

	selectedMonth: Month;

	reminders$: Observable<ReminderView[]>;

	loadingState: LOADING_STATES;

	loadingStates = LOADING_STATES;

	constructor(
		private dialogRef: MatDialogRef<RemindersDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public month: Month,
		private cs: ConversionService) { }

	ngOnInit(): void {
		this.selectedMonth = this.month;

		this.getReminders(this.selectedMonth);
	}

	getReminders(month: Month): void {

		this.loadingState = this.loadingStates.loading;

		this.reminders$ = this.cs.getReminders(month.date)
			.pipe(
				tap(() => {
					this.loadingState = this.loadingStates.default;
					this.selectedMonth = month;
				}),
				catchError(err => {
					this.loadingState = this.loadingStates.err;

					return throwError(err);
				})
			);
	}

	close(): void {
		this.dialogRef.close();
	}

}

export interface ReminderView {
	personId: string;
	phone?: string;
	inst?: string;
	sended: boolean;
}

import { Component, Input, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month } from 'src/app/enums/months/months';
import { Reminder } from 'src/app/models/people';
import { ConversionService } from '../../conversion.service';
import { ReminderView } from '../reminders-dialog.component';

@Component({
	selector: 'ntv-reminder',
	templateUrl: './reminder.component.html',
	styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

	@Input() reminder: ReminderView;

	@Input() selectedMonth: Month;

	loadingState: LOADING_STATES;

	loadingStates = LOADING_STATES;

	phone: string;

	constructor(private cs: ConversionService) { }

	ngOnInit(): void {
		this.phone = `+7${this.reminder.phone}`;
	}

	change(sended: boolean): void {

		this.loadingState = this.loadingStates.loading;

		const data: MarkReminderSendedData = {
			id: this.reminder.personId,
			date: this.selectedMonth.date,
			sended
		};

		this.cs.markReminderSended(data)
			.pipe(
				tap(() => {
					this.loadingState = this.loadingStates.default;

					this.reminder.sended = sended;
				}),
				catchError(err => {
					this.loadingState = this.loadingStates.err;

					return throwError(err);
				})
			)
			.subscribe();
	}

}

export interface MarkReminderSendedData {
	id: string;
	date: string;
	sended: boolean;
}

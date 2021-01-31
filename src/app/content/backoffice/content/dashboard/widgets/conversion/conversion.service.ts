import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConversionData, Reminder } from 'src/app/models/people';
import { environment } from 'src/environments/environment';
import { MarkReminderSendedData } from './reminders-dialog/reminder/reminder.component';
import { ReminderView } from './reminders-dialog/reminders-dialog.component';

@Injectable({
	providedIn: 'root'
})
export class ConversionService {

	constructor(private http: HttpClient) { }

	getConversion(date: string): Observable<ConversionData[]> {
		return this.http.post<ConversionData[]>(environment.apiEndpoints.getConversion, { date });
	}

	getReminders(date: string): Observable<ReminderView[]> {
		return this.http.post<ReminderView[]>(environment.apiEndpoints.getReminders, { date });
	}

	markReminderSended(data: MarkReminderSendedData): Observable<MarkReminderSendedData> {
		return this.http.post<MarkReminderSendedData>(environment.apiEndpoints.markReminderSended, data);
	}
}

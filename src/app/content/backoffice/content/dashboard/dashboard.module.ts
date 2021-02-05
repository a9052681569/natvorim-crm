import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ConversionComponent } from './widgets/conversion/conversion.component';
import { RemindersDialogComponent } from './widgets/conversion/reminders-dialog/reminders-dialog.component';
import { TimeRangeSelectorComponent } from './widgets/conversion/time-range-selector/time-range-selector.component';
import { ReminderComponent } from './widgets/conversion/reminders-dialog/reminder/reminder.component';
import { CourierSheetComponent } from './widgets/courier-sheet/courier-sheet.component';

@NgModule({
	declarations: [
		DashboardComponent,
		ConversionComponent,
		RemindersDialogComponent,
		TimeRangeSelectorComponent,
		ReminderComponent,
		CourierSheetComponent
	],
	imports: [
		DashboardRoutingModule,
		SharedModule,
		MaterialModule
	]
})
export class DashboardModule { }

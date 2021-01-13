import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MaterialModule } from './material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OverlinedComponent } from './components/overlined/overlined.component';
import { NumberToStringPipe } from './pipes/number-to-string.pipe';
import { SendedCheckboxComponent } from './components/sended-checkbox/sended-checkbox.component';
import { TrackFieldComponent } from './components/track-field/track-field.component';
import { OrderStructureComponent } from './components/order-structure/order-structure.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

export const modules = [
	CommonModule,
	FormsModule,
	HttpClientModule,
	ReactiveFormsModule,
	NgScrollbarModule,
	InfiniteScrollModule,
	MaterialModule,
	ClipboardModule
];
export const components = [
	OverlinedComponent,
	SpinnerComponent,
	SendedCheckboxComponent,
	TrackFieldComponent,
	OrderStructureComponent,
	ConfirmationDialogComponent
];

export const pipes = [
	NumberToStringPipe
];

@NgModule({
	imports: [
		...modules,
	],
	exports: [
		...modules,
		...components,
		...pipes
	],
	declarations: [
		...components,
		...pipes
	],
	providers: [
	]
})
export class SharedModule { }

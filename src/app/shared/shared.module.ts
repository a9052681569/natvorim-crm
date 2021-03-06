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
import { OrderStructureFormComponent } from './components/order-structure-form/order-structure-form.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { OrderStructureComponent } from './components/order-structure/order-structure.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { KitComponent } from './components/kit/kit.component';

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
	OrderStructureFormComponent,
	OrderStructureComponent,
	ConfirmationDialogComponent,
	KitComponent
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

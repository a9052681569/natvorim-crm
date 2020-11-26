import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MaterialModule } from './material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FilterByIdPipe } from '../content/backoffice/content/people/person/person-orders/filter-by-id.pipe';

export const modules = [
	CommonModule,
	FormsModule,
	HttpClientModule,
	ReactiveFormsModule,
	NgScrollbarModule,
	InfiniteScrollModule
];

@NgModule({
	imports: [
		modules,
		MaterialModule
	],
	exports: [
		...modules,
		SpinnerComponent,
		MaterialModule,
		FilterByIdPipe
	],
	declarations: [
		SpinnerComponent,
		FilterByIdPipe
	],
	providers: [
	]
})
export class SharedModule { }

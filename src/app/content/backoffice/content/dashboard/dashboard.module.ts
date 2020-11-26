import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { SearchComponent } from './search/search.component';
import { MaterialModule } from 'src/app/shared/material.module';



@NgModule({
	declarations: [DashboardComponent, SearchComponent],
	imports: [
		DashboardRoutingModule,
		SharedModule,
		MaterialModule
	]
})
export class DashboardModule { }

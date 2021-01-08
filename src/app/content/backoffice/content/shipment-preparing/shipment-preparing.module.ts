import { NgModule } from '@angular/core';
import { ShipmentPreparingComponent } from './shipment-preparing.component';
import { ShipmentPreparingRoutingModule } from './shipment-preparing-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { PreparingOrderComponent } from './preparing-order/preparing-order.component';



@NgModule({
	declarations: [
		ShipmentPreparingComponent,
		FilterFormComponent,
		PreparingOrderComponent
	],
	imports: [
		ShipmentPreparingRoutingModule,
		SharedModule
	]
})
export class ShipmentPreparingModule { }

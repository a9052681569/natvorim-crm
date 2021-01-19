import { NgModule } from '@angular/core';
import { ActualShipmentRoutingModule } from './actual-shipment-routing.module';
import { ActualShipmentComponent } from './actual-shipment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ASFilterFormComponent } from './as-filter-form/as-filter-form.component';
import { ActualShipmentTypeComponent } from './actual-shipment-type/actual-shipment-type.component';
import { ActualOrderTypeComponent } from './actual-shipment-type/actual-order-type/actual-order-type.component';
import { ActualShipmentOrderComponent } from './actual-shipment-type/actual-shipment-order/actual-shipment-order.component';



@NgModule({
	declarations: [
		ActualShipmentComponent,
		ASFilterFormComponent,
		ActualShipmentTypeComponent,
		ActualOrderTypeComponent,
		ActualShipmentOrderComponent,
	],
	imports: [
		ActualShipmentRoutingModule,
		SharedModule
	]
})
export class ActualShipmentModule { }

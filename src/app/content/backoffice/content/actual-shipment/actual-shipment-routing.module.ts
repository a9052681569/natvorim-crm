import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActualShipmentComponent } from './actual-shipment.component';

const routes: Routes = [
	{ path: '', component: ActualShipmentComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
  	exports: [RouterModule]
})
export class ActualShipmentRoutingModule { }

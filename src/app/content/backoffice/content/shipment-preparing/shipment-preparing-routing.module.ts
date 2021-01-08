import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipmentPreparingComponent } from './shipment-preparing.component';

const routes: Routes = [
	{ path: '', component: ShipmentPreparingComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
  	exports: [RouterModule]
})
export class ShipmentPreparingRoutingModule { }

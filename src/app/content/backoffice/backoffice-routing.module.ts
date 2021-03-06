import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';

const routes: Routes = [
	{
		path: '',
		component: BackofficeComponent,
		children: [
			{ path: 'dashboard', loadChildren: () => import('./content/dashboard/dashboard.module').then(m => m.DashboardModule)},
			{ path: 'people', loadChildren: () => import('./content/people/people.module').then(m => m.PeopleModule)},
			{ path: 'add-order', loadChildren: () => import('./content/add-order/add-order.module').then(m => m.AddOrderModule) },
			{
				path: 'shipment-preparing',
				loadChildren: () => import('./content/shipment-preparing/shipment-preparing.module').then(m => m.ShipmentPreparingModule)
			},
			{
				path: 'actual-shipment',
				loadChildren: () => import('./content/actual-shipment/actual-shipment.module').then(m => m.ActualShipmentModule)
			},
			{ path: '**', redirectTo: 'dashboard' },
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }

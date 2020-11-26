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
			{ path: 'events', loadChildren: () => import('./content/events/events.module').then(m => m.EventsModule) },
			{ path: '**', redirectTo: 'dashboard' },
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }

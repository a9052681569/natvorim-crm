import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { CustomPreloadService } from './custom-preload.service';


const routes: Routes = [
	{ path: 'login', loadChildren: () => import('./content/login/login.module').then(m => m.LoginModule) },
	{
		path: 'backoffice',
		loadChildren: () => import('./content/backoffice/backoffice.module').then(m => m.BackofficeModule),
		canActivate: [AuthGuard]
	},
	{ path: '**', redirectTo: 'backoffice' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: CustomPreloadService})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

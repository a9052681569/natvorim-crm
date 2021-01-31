import { NgModule } from '@angular/core';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { BackofficeComponent } from './backoffice.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { MenuComponent } from './menu/menu.component';

@NgModule({
	declarations: [
		BackofficeComponent,
		HeaderComponent,
		MenuComponent,
	],
	imports: [
		BackofficeRoutingModule,
		SharedModule,
		MaterialModule
	]
})
export class BackofficeModule { }

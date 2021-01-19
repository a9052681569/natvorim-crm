import { NgModule } from '@angular/core';
import { PeopleComponent } from './people.component';
import { PeopleRoutingModule } from './people-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PersonComponent } from './person/person.component';
import { PersonOrderComponent } from './person/person-orders/person-order/person-order.component';
import { PersonOrdersComponent } from './person/person-orders/person-orders.component';
import { OrderStructureDialogComponent } from './person/person-orders/person-order/order-structure-dialog/order-structure-dialog.component';
import { EditPersonDialogComponent } from './person/edit-person-dialog/edit-person-dialog.component';
import { EditOrderDialogComponent } from './person/person-orders/person-order/edit-order-dialog/edit-order-dialog.component';

@NgModule({
	declarations: [
		PeopleComponent,
		PersonComponent,
		PersonOrderComponent,
		PersonOrdersComponent,
		OrderStructureDialogComponent,
		EditPersonDialogComponent,
		EditOrderDialogComponent,
	],
	imports: [
		PeopleRoutingModule,
		SharedModule
	]
})
export class PeopleModule { }

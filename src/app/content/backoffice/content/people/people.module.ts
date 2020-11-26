import { NgModule } from '@angular/core';
import { PeopleComponent } from './people.component';
import { PeopleRoutingModule } from './people-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { PersonComponent } from './person/person.component';
import { PersonOrderComponent } from './person/person-orders/person-order/person-order.component';
import { PersonOrdersComponent } from './person/person-orders/person-orders.component';
import { FilterByIdPipe } from './person/person-orders/filter-by-id.pipe';



@NgModule({
	declarations: [PeopleComponent, PersonComponent, PersonOrderComponent, PersonOrdersComponent],
	imports: [
		PeopleRoutingModule,
		SharedModule
	]
})
export class PeopleModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';

import { EventCardComponent } from './event-card/event-card.component';
import { MaterialModule } from 'src/app/shared/material.module';



@NgModule({
	declarations: [
		EventsComponent,
		EventCardComponent
	],
	imports: [
		SharedModule,
		EventsRoutingModule,
		MaterialModule
	]
})
export class EventsModule { }

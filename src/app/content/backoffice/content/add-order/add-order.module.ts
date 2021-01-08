import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { OrderFormComponent } from './order-form/order-form.component';
import { AddOrderRoutingModule } from './add-order-routing.module';
import { AddOrderComponent } from './add-order.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { OnceFormComponent } from './order-form/once-form/once-form.component';
import { SubscriptionFormComponent } from './order-form/subscription-form/subscription-form.component';
import {
	SubscriptionOrdersFormComponent
} from './order-form/subscription-form/subscription-orders-form/subscription-orders-form.component';
import { AddOrderStructureDialogComponent } from './order-form/subscription-form/add-order-structure-dialog/add-order-structure-dialog.component';



@NgModule({
	declarations: [
		AddOrderComponent,
		OrderFormComponent,
		CustomerFormComponent,
		OnceFormComponent,
		SubscriptionFormComponent,
		SubscriptionOrdersFormComponent,
		AddOrderStructureDialogComponent
	],
	imports: [
		AddOrderRoutingModule,
		SharedModule
	]
})
export class AddOrderModule { }

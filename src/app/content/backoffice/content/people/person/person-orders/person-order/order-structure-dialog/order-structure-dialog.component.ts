import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderStructure } from 'src/app/models/order';

@Component({
	selector: 'ntv-order-structure-dialog',
	templateUrl: './order-structure-dialog.component.html',
	styleUrls: ['./order-structure-dialog.component.scss']
})
export class OrderStructureDialogComponent {

	constructor(@Inject(MAT_DIALOG_DATA) public data: {orderStructure: OrderStructure}) { }

}

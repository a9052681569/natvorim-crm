import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';

@Component({
	selector: 'ntv-person-order',
	templateUrl: './person-order.component.html',
	styleUrls: ['./person-order.component.scss']
})
export class PersonOrderComponent implements OnInit {

	@Input() order: Order;

	constructor() { }

	ngOnInit(): void {
	}

}

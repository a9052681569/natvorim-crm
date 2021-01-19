import { Component, Input, OnInit } from '@angular/core';
import { OrderStructure } from 'src/app/models/order';

@Component({
	selector: 'ntv-order-structure',
	templateUrl: './order-structure.component.html',
	styleUrls: ['./order-structure.component.scss']
})
export class OrderStructureComponent implements OnInit {

	@Input() orderStructure: OrderStructure;

	constructor() { }

	ngOnInit(): void {
	}

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'ntv-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

	@Input() diameter = 64;

	@Input() color = 'primary';

	constructor() { }

	ngOnInit(): void {
	}

}

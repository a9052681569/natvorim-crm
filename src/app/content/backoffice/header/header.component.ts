import { Component } from '@angular/core';

import { opacityChangeAnimation } from 'src/app/shared/animations';

@Component({
	selector: 'ntv-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	animations: [opacityChangeAnimation]
})
export class HeaderComponent {

	constructor() { }

}

import { Component, Input } from '@angular/core';
import { ClipService } from '../../services/clip.service';

@Component({
	selector: 'ntv-overlined',
	templateUrl: './overlined.component.html',
	styleUrls: ['./overlined.component.scss']
})
export class OverlinedComponent {

	@Input() overline: string;

	@Input() value: string;

	@Input() clip?: string | undefined;

	constructor(public clipService: ClipService) { }

}

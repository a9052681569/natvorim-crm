import { Component, Input } from '@angular/core';
import { Kit } from 'src/app/models/order';

@Component({
  selector: 'ntv-kit',
  templateUrl: './kit.component.html',
  styleUrls: ['./kit.component.scss']
})
export class KitComponent {

	/**
	 * набор для отправки
	 */
	@Input() kit: Kit;

}

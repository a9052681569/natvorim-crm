import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ntv-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {

	@Input() public event: any;

}

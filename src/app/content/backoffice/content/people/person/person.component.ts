import { Component, Input, OnInit } from '@angular/core';
import { ClipService } from 'src/app/shared/services/clip.service';
import { Person } from 'src/app/models/people';
import { ContactItem } from './person-models';

@Component({
	selector: 'ntv-person',
	templateUrl: './person.component.html',
	styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
	@Input() person: Person;

	contactItems: ContactItem[];

	constructor(public clipService: ClipService) { }

	ngOnInit(): void {
		this.contactItems = [
			{
				name: 'Почта',
				value: this.person.contacts.email || 'Не указан'
			},
			{
				name: 'Телефон',
				value: this.person.contacts.phone || 'Не указан'
			},
			{
				name: 'Инстаграм',
				value: this.person.contacts.inst || 'Не указан'
			},
		];
	}

}

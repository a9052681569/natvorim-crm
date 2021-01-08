import { Component, Input, OnInit } from '@angular/core';
import { ClipService } from 'src/app/shared/services/clip.service';
import { Person } from 'src/app/models/people';
import { ContactItem } from './person-models';
import { MatDialog } from '@angular/material/dialog';
import { EditPersonDialogComponent } from './edit-person-dialog/edit-person-dialog.component';

@Component({
	selector: 'ntv-person',
	templateUrl: './person.component.html',
	styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

	/**
	 * объект содержащий данные о клиенте
	 */
	@Input() person: Person;

	/**
	 * массив контактов клиента
	 */
	contactItems: ContactItem[];

	constructor(
		public clipService: ClipService,
		private dialog: MatDialog) { }

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

	/**
	 * вызывает диалог с редактором данных пользователя {@link EditPersonDialogComponent}
	 */
	showEditor(): void {
		const data: { person: Person } = {
			person: this.person
		};

		this.dialog.open(EditPersonDialogComponent, { data });
	}

}

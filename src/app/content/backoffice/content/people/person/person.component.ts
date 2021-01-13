import { Component, Input, OnInit } from '@angular/core';
import { ClipService } from 'src/app/shared/services/clip.service';
import { Person } from 'src/app/models/people';
import { ContactItem } from './person-models';
import { MatDialog } from '@angular/material/dialog';
import { EditPersonDialogComponent } from './edit-person-dialog/edit-person-dialog.component';
import { ConfirmationDialogData } from 'src/app/models/confirmation-dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store';
import { CustomersActions } from 'src/app/store/actions/costomers.actions';

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
		private dialog: MatDialog,
		private store: Store<RootState>) { }

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

	removeCustomer(): void {
		const data: ConfirmationDialogData = {
			text: 'Удаляем этого типа?',
			confirmText: 'да',
			declineText: 'не, погодь',
			action: () => {
				this.store.dispatch(CustomersActions.removePending({ customerId: this.person.id }));
			}
		};

		this.dialog.open(ConfirmationDialogComponent, { data });
	}

}

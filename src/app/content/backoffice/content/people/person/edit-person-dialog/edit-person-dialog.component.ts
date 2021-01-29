import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Person } from 'src/app/models/people';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { RootState } from 'src/app/store';
import { CustomersActions } from 'src/app/store/actions/costomers.actions';

@Component({
	selector: 'ntv-edit-person-dialog',
	templateUrl: './edit-person-dialog.component.html',
	styleUrls: ['./edit-person-dialog.component.scss']
})
export class EditPersonDialogComponent implements OnInit {

	/**
	 * форма редактирования информации о клиенте
	 */
	editPersonForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { person: Person },
		private fb: FormBuilder,
		public store: Store<RootState>,
		private hs: HelpersService) { }

	ngOnInit(): void {
		// инициируем форму
		this.editPersonForm = this.fb.group({
			name: this.data.person.name,
			email: this.data.person.contacts.email || '',
			inst: this.data.person.contacts.inst || '',
			phone: [this.data.person.contacts.phone || '', this.hs.phoneValidator],
			city: this.data.person.address.city,
			address: this.data.person.address.address
		});
	}

	/**
	 * отправляет запрос на обновление информации о клиенте на бек
	 */
	patchPerson(): void {
		const patchedPerson: Person = {
			id: this.data.person.id,
			name: this.editPersonForm.get('name')?.value,
			contacts: {
				email: this.editPersonForm.get('email')?.value,
				inst: this.editPersonForm.get('inst')?.value,
				phone: this.editPersonForm.get('phone')?.value
			},
			address: {
				city: this.editPersonForm.get('city')?.value,
				address: this.editPersonForm.get('address')?.value,
			},
			reminders: this.data.person.reminders
		};

		this.store.dispatch(CustomersActions.patchPending({ customer: patchedPerson }));
	}

}

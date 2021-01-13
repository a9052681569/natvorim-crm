import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from 'src/app/models/confirmation-dialog';

@Component({
	selector: 'ntv-confirmation-dialog',
	templateUrl: './confirmation-dialog.component.html',
	styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

	constructor(
		private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }

	ngOnInit(): void {
	}

	confirm(): void {
		this.data.action();
		this.dialogRef.close();
	}

	dicline(): void {
		this.dialogRef.close();
	}

}

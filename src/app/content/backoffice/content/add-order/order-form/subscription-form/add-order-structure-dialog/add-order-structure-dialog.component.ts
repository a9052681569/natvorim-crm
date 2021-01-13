import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, tap } from 'rxjs/operators';
import { OrderAges, ShipmentTypes, OrderTypes } from 'src/app/enums/order/order-enums';
import { Kit, Order, OrderStructure } from 'src/app/models/order';

@Component({
	selector: 'ntv-add-order-structure-dialog',
	templateUrl: './add-order-structure-dialog.component.html',
	styleUrls: ['./add-order-structure-dialog.component.scss']
})
export class AddOrderStructureDialogComponent implements OnInit {

	orderStructureForm: FormGroup;

	constructor(
		private dialogRef: MatDialogRef<AddOrderStructureDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public orderStructure: OrderStructure,
		private fb: FormBuilder) { }

	ngOnInit(): void {
		// инициируем форму
		this.orderStructureForm = this.fb.group({
			kits: this.fb.array([]),
			theatres: this.fb.array([])
		});
	}

	setStructure(): void {
		this.dialogRef.close(this.orderStructureForm.value);
	}

}
